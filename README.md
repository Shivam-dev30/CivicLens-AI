# CivicLens AI: Autonomous Urban Intelligence Platform

[![React](https://img.shields.io/badge/Frontend-React-61dafb?style=flat-square&logo=react)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Gemini AI](https://img.shields.io/badge/AI-Gemini_Vision-blue?style=flat-square&logo=google-gemini)](https://ai.google.dev/)
[![Leaflet](https://img.shields.io/badge/Maps-Leaflet-199900?style=flat-square&logo=leaflet)](https://leafletjs.com/)

**CivicLens AI** is a cutting-edge urban reporting platform that empowers citizens to identify and track civic infrastructure issues using Artificial Intelligence and real-time geospatial intelligence. Designed with a premium "Command Center" aesthetic, it bridges the gap between community complaints and administrative action.

---

## ✨ Key Features

### 🧠 Autonomous AI Detection
* **Visual Intelligence:** Uses **Google Gemini Vision AI** to automatically identify civic issues (potholes, garbage, open drains, broken streetlights) from live captures.
* **Confidence Scoring:** Real-time analysis of image integrity with precision confidence metrics.

### 📍 Verified Geotagging
* **Sensor-Based Location:** Mandatory GPS acquisition for every report.
* **Geotag Watermarking:** Automatically applies a permanent "Tactical Watermark" to images containing coordinates, address, and timestamp to ensure evidence authenticity.

### 🎥 Civic Reels (Community Feed)
* **Social Engagement:** An Instagram-style public feed where citizens can interact with reports.
* **Anonymity First:** A built-in anonymous user system (random ID generation) ensures reporter privacy while maintaining accountability.
* **Engagement Tools:** Like (confirm) and comment on infrastructure issues in your neighborhood.

### 🗺️ Geo-Spatial Intelligence Map
* **Heatmapping:** Interactive Leaflet-based city map showing the geographical spread of active incidents.
* **Dynamic Markers:** Click markers to view forensic data, real photos, and AI analysis of the reported location.

### 📊 Tactical Dashboard
* **Real-time Analytics:** Trend analysis using AreaCharts to monitor resolution versus reported incident rates.
* **Command Center UI:** Premium glassmorphic interface designed for laptops, tablets, and phones.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React, Vite, Lucide Icons, Recharts, Leaflet.js, Axios |
| **Backend** | Python, FastAPI, Uvicorn |
| **AI/ML** | Google Gemini 1.5 Pro/Flash (Generative AI) |
| **Imaging** | Pillow (PIL) for forensic watermarking |
| **Storage** | Local JSON File Storage (No external DB required) |

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v18 or higher)
* **Python** (v3.9 or higher)
* **Gemini API Key** (Get it from [Google AI Studio](https://aistudio.google.com/))

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```
*Create a `.env` file in the `backend` folder:*
```env
GEMINI_API_KEY=your_actual_api_key_here
```
*Run the server:*
```bash
uvicorn main:app --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 📱 User Flow
1. **Report:** Open the "High-Tech HUD" camera and capture a live photo.
2. **Detection:** AI automatically categorizes the issue and locks onto your GPS coordinates.
3. **Describe:** Provide tactical context for the city maintenance teams.
4. **Deploy:** Submit your report to the **Civic Reels** and the **City Map**.
5. **Engage:** Browse neighbor reports, confirm issues by "Liking," and join the discussion.

---

## 🎨 Design Philosophy
CivicLens AI utilizes a **Premium Glassmorphic Design System**:
* **Aesthetics:** HSL-tailored color palettes, vibrant gradients, and micro-animations.
* **Heads Up Display (HUD):** A specialized camera interface that mimics pro-grade sensor tools.
* **Responsive Flux:** Seamless adaptation between Desktop (Sidebar mode) and Mobile (Bottom-nav mode).

---

## ⚖️ License
This project is open-source and intended for civic empowerment. 

*Developed with ❤️ for a smarter, cleaner city.*
