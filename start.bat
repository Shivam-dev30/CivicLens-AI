@echo off
echo ===========================================
echo AI Civic Issue Reporting Platform
echo ===========================================

echo Starting Backend...
start cmd /k "cd backend && pip install -r requirements.txt && uvicorn main:app --reload --host 127.0.0.1 --port 8000"

echo Starting Frontend...
start cmd /k "cd frontend && npm install && npm run dev"

echo Both servers are starting!
echo The frontend will be available at http://localhost:5173
echo The backend API will be available at http://localhost:8000
