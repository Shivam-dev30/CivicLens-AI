import json
import os
import shutil
import random
import uuid
import re
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from PIL import Image
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Civic Issue Reporting API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directories
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Mount static files to serve images
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

JSON_FILE = "complaints.json"
POSTS_FILE = "posts.json"

# Initialize JSONs if not exists
if not os.path.exists(JSON_FILE):
    with open(JSON_FILE, "w") as f:
        json.dump({"complaints": []}, f)

if not os.path.exists(POSTS_FILE):
    with open(POSTS_FILE, "w") as f:
        json.dump({"posts": []}, f)

# --- GEMINI API KEY FROM ENVIRONMENT ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

def analyze_image_with_yolo(image_path: str):
    # If API key is not set, we still fallback to mock so the app doesn't crash
    if GEMINI_API_KEY == "PUT_YOUR_API_KEY_HERE" or not GEMINI_API_KEY:
        issues = ["pothole", "garbage", "open drain", "broken streetlight"]
        return {
            "issue": random.choice(issues),
            "confidence": round(random.uniform(0.70, 0.98), 2)
        }
        
    try:
        # Use Google's extremely fast Vision model
        model = genai.GenerativeModel("gemini-2.5-flash")
        img = Image.open(image_path)
        prompt = """Analyze this image and honestly identify the primary civic infrastructure or public issue present (e.g., pothole, garbage, open drain, broken streetlight, graffiti, fallen tree, structural damage, water leakage, etc.). 
        If there is no apparent civic issue, identify the primary subject of the photo (e.g., "Clean road", "Person", "Building", "Empty field").
        Describe the primary issue or subject briefly in 1 to 3 words. 
        Respond exactly in this JSON format: {"issue": "issue name", "confidence": 0.95}. Give a confidence score between 0.00 and 1.00."""
        
        response = model.generate_content([prompt, img])
        
        # Robust JSON extraction
        result_text = response.text
        # Find json block or {}
        json_match = re.search(r'\{.*\}', result_text, re.DOTALL)
        if json_match:
            result_json = json.loads(json_match.group(0))
        else:
            result_json = {"issue": "Unparseable AI Response", "confidence": 0.0}
            
        return {
            "issue": result_json.get("issue", "Unknown Issue"),
            "confidence": float(result_json.get("confidence", 0.90))
        }
    except Exception as e:
        print(f"\n--- GEMINI AI ERROR LOG ---\n{str(e)}\n---------------------------\n")
        
        # Check if the error is related to API auth
        if "403" in str(e) or "API key" in str(e) or "400" in str(e):
            err_msg = "Invalid/Restricted API Key"
        else:
            err_msg = "AI Error (See Backend Terminal)"
            
        return {
            "issue": err_msg,
            "confidence": 0.0
        }

@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload an image.")
    
    # Save the file
    ext = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4().hex}.{ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Run AI Detection
    ai_result = analyze_image_with_yolo(file_path)
    
    return JSONResponse(status_code=200, content={
        "message": "Image analyzed successfully",
        "image_url": f"uploads/{filename}",
        **ai_result
    })

# --- REELS / FEED SYSTEM ---

class Comment(BaseModel):
    user_id: str
    text: str
    timestamp: str

class PostInput(BaseModel):
    user_id: str
    issue: str
    confidence: float
    description: str
    latitude: float
    longitude: float
    address: str
    image: str

@app.get("/posts")
async def get_posts():
    if not os.path.exists(POSTS_FILE):
        return {"posts": []}
    with open(POSTS_FILE, "r") as f:
        data = json.load(f)
    # Return latest first
    data["posts"].reverse()
    return data

@app.post("/create-post")
async def create_post(post: PostInput):
    with open(POSTS_FILE, "r") as f:
        data = json.load(f)
    
    new_post = post.dict()
    new_post["post_id"] = str(uuid.uuid4().hex[:8])
    new_post["timestamp"] = datetime.utcnow().isoformat()
    new_post["likes"] = [] # Store user IDs who liked
    new_post["comments"] = []
    
    data["posts"].append(new_post)
    with open(POSTS_FILE, "w") as f:
        json.dump(data, f, indent=4)
        
    return JSONResponse(status_code=201, content={"message": "Post created", "post": new_post})

class LikeToggle(BaseModel):
    user_id: str

@app.post("/like/{post_id}")
async def like_post(post_id: str, payload: LikeToggle):
    with open(POSTS_FILE, "r") as f:
        data = json.load(f)
    
    for post in data["posts"]:
        if post["post_id"] == post_id:
            if payload.user_id in post["likes"]:
                post["likes"].remove(payload.user_id)
            else:
                post["likes"].append(payload.user_id)
            break
            
    with open(POSTS_FILE, "w") as f:
        json.dump(data, f, indent=4)
    return {"status": "success"}

class CommentInput(BaseModel):
    user_id: str
    text: str

@app.post("/comment/{post_id}")
async def comment_post(post_id: str, payload: CommentInput):
    with open(POSTS_FILE, "r") as f:
        data = json.load(f)
    
    new_comment = {
        "user_id": payload.user_id,
        "text": payload.text,
        "timestamp": datetime.utcnow().isoformat()
    }
    
    for post in data["posts"]:
        if post["post_id"] == post_id:
            post["comments"].append(new_comment)
            break
            
    with open(POSTS_FILE, "w") as f:
        json.dump(data, f, indent=4)
    return {"status": "success", "comment": new_comment}

# Legacy endpoint for hackathon requirements consistency
class ComplaintInput(BaseModel):
    issue: str
    confidence: float
    description: str
    latitude: float
    longitude: float
    image: str
    user_id: Optional[str] = None

@app.post("/complaint")
async def save_complaint(complaint: ComplaintInput):
    with open(JSON_FILE, "r") as f:
        data = json.load(f)
        
    new_complaint = complaint.dict()
    new_complaint["id"] = len(data["complaints"]) + 1
    new_complaint["timestamp"] = datetime.utcnow().isoformat()
    
    data["complaints"].append(new_complaint)
    
    with open(JSON_FILE, "w") as f:
        json.dump(data, f, indent=4)
        
    return JSONResponse(status_code=201, content={
        "message": "Complaint recorded successfully",
        "complaint": new_complaint
    })

@app.get("/complaints")
async def get_complaints():
    with open(JSON_FILE, "r") as f:
        data = json.load(f)
    data["complaints"].sort(key=lambda x: x["timestamp"], reverse=True)
    return data

@app.delete("/post/{post_id}")
async def delete_post(post_id: str, user_id: str):
    with open(POSTS_FILE, "r") as f:
        data = json.load(f)
    
    initial_len = len(data["posts"])
    data["posts"] = [p for p in data["posts"] if not (p["post_id"] == post_id and p["user_id"] == user_id)]
    
    if len(data["posts"]) == initial_len:
        raise HTTPException(status_code=404, detail="Post not found or unauthorized")
        
    with open(POSTS_FILE, "w") as f:
        json.dump(data, f, indent=4)
        
    return {"status": "success", "message": "Post deleted"}

@app.delete("/complaint/{complaint_id}")
async def delete_complaint(complaint_id: int, user_id: str):
    with open(JSON_FILE, "r") as f:
        data = json.load(f)
        
    initial_len = len(data["complaints"])
    data["complaints"] = [c for c in data["complaints"] if not (c.get("id") == complaint_id and (c.get("user_id") == user_id or c.get("user_id") is None))]
    
    if len(data["complaints"]) == initial_len:
        raise HTTPException(status_code=404, detail="Complaint not found or unauthorized")
        
    with open(JSON_FILE, "w") as f:
        json.dump(data, f, indent=4)
        
    return {"status": "success", "message": "Complaint deleted"}
