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

# Initialize JSONs
if not os.path.exists(JSON_FILE):
    with open(JSON_FILE, "w") as f: json.dump({"complaints": []}, f)

if not os.path.exists(POSTS_FILE):
    with open(POSTS_FILE, "w") as f: json.dump({"posts": []}, f)

USERS_FILE = "users.json"
if not os.path.exists(USERS_FILE) or os.stat(USERS_FILE).st_size == 0:
    with open(USERS_FILE, "w") as f:
        admin_data = {
            "users": {
                "admin": {
                    "password": "admin", # Reset to simplest possible
                    "role": "admin",
                    "points": 1000,
                    "badges": ["Founding Officer"]
                }
            }
        }
        json.dump(admin_data, f, indent=4)

def award_points(user_id: str, points: int):
    if not user_id: return
    with open(USERS_FILE, "r") as f:
        data = json.load(f)
    if user_id not in data["users"]:
        data["users"][user_id] = {"points": 0, "badges": []}
    
    data["users"][user_id]["points"] += points
    
    # Milestone badges
    pts = data["users"][user_id]["points"]
    badges = data["users"][user_id]["badges"]
    if pts >= 50 and "Civic Hero" not in badges: badges.append("Civic Hero")
    if pts >= 200 and "City Guardian" not in badges: badges.append("City Guardian")
    
    with open(USERS_FILE, "w") as f:
        json.dump(data, f, indent=4)

# (Simplified Auth removed: pwd_context, verify_password, create_access_token)

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
        prompt = """Analyze this image for civic infrastructure issues. 
        CRITICAL SECURITY CHECK FIRST: If the image contains any NSFW, sexually explicit, highly offensive, extremely dangerous, or wildly inappropriate content, you MUST respond EXACTLY with this JSON: {"issue": "NSFW/Blocked Content", "confidence": 0.00} and nothing else.
        If it's safe, honestly identify the primary civic infrastructure or public issue present (e.g., pothole, garbage, open drain, broken streetlight, graffiti, fallen tree, structural damage, water leakage, etc.). 
        If there is no apparent civic issue but the image is safe, identify the primary subject of the photo (e.g., "Clean road", "Person", "Building", "Empty field").
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
    
    # Save the file & Strip EXIF for Citizen Privacy
    ext = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4().hex}.{ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    # 100% EXIF removal by cloning pixel data
    with Image.open(file.file) as img:
        # Convert to RGB if necessary (e.g. RGBA for JPG)
        if img.mode in ("RGBA", "P"): img = img.convert("RGB")
        data = list(img.getdata())
        image_without_exif = Image.new(img.mode, img.size)
        image_without_exif.putdata(data)
        image_without_exif.save(file_path)
        
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
    status: Optional[str] = "Pending"

class UserRegister(BaseModel):
    username: str
    password: str
    role: Optional[str] = "user"

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

@app.post("/register")
async def register(user: UserRegister):
    try:
        with open(USERS_FILE, "r") as f: data = json.load(f)
    except: data = {"users": {}}

    if user.username in data["users"]:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    data["users"][user.username] = {
        "password": user.password, # PLAIN TEXT AS REQUESTED
        "role": user.role or "user",
        "points": 0, "badges": []
    }
    with open(USERS_FILE, "w") as f: json.dump(data, f, indent=4)
    return {"status": "User created"}

@app.post("/login")
async def login(user: UserLogin):
    try:
        with open(USERS_FILE, "r") as f: data = json.load(f)
    except: raise HTTPException(status_code=500, detail="User database missing")

    db_user = data["users"].get(user.username)
    print(f"Login attempt: {user.username}, match found: {db_user is not None}")
    if db_user:
        print(f"Password match: {db_user['password'] == user.password}")

    if not db_user or db_user["password"] != user.password:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    # Return simple token (just the username for simplicity)
    return {"access_token": user.username, "token_type": "bearer"}

@app.get("/me")
async def get_me(token: str):
    try:
        with open(USERS_FILE, "r") as f: data = json.load(f)
        # In this simple version, token IS the username
        user = data["users"].get(token)
        if not user: raise HTTPException(status_code=404, detail="Session invalid")
        return { "username": token, **user }
    except:
        raise HTTPException(status_code=401, detail="Unauthorized")

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
    status: Optional[str] = "Pending"

@app.post("/complaint")
async def save_complaint(complaint: ComplaintInput):
    with open(JSON_FILE, "r") as f:
        data = json.load(f)
        
    new_complaint = complaint.dict()
    new_complaint["id"] = len(data["complaints"]) + 1
    new_complaint["timestamp"] = datetime.utcnow().isoformat()
    if "status" not in new_complaint or not new_complaint["status"]:
        new_complaint["status"] = "Pending"
    
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

class StatusUpdate(BaseModel):
    status: str

@app.put("/complaint/{complaint_id}/status")
async def update_complaint_status(complaint_id: int, payload: StatusUpdate):
    with open(JSON_FILE, "r") as f:
        data = json.load(f)
        
    for c in data["complaints"]:
        if c.get("id") == complaint_id:
            old_status = c.get("status", "Pending")
            c["status"] = payload.status
            
            # Gamification: Award 50 points when report is resolved
            if payload.status == "Resolved" and old_status != "Resolved":
                award_points(c.get("user_id"), 50)
                
            break
            
    with open(JSON_FILE, "w") as f:
        json.dump(data, f, indent=4)
        
    return {"status": "success", "new_status": payload.status}

@app.put("/post/{post_id}/status")
async def update_post_status(post_id: str, payload: StatusUpdate):
    with open(POSTS_FILE, "r") as f:
        data = json.load(f)
        
    for p in data["posts"]:
        if p.get("post_id") == post_id:
            old_status = p.get("status", "Pending")
            p["status"] = payload.status
            
            # Gamification: Award 50 points
            if payload.status == "Resolved" and old_status != "Resolved":
                award_points(p.get("user_id"), 50)
                
            break
            
    with open(POSTS_FILE, "w") as f:
        json.dump(data, f, indent=4)
        
    return {"status": "success", "new_status": payload.status}

@app.get("/user/{user_id}/stats")
async def get_user_stats(user_id: str):
    with open(USERS_FILE, "r") as f:
        data = json.load(f)
    return data["users"].get(user_id, {"points": 0, "badges": []})

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
