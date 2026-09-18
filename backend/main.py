import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes.prediction import router as prediction_router

FRONTEND_URL = os.getenv("FRONTEND_URL")

app = FastAPI(
    title="Age and Gender Detection API",
    description="API for detecting age and gender from images",
    version="1.0.0"
)

allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

if FRONTEND_URL:
    allowed_origins.append(FRONTEND_URL)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Age and Gender Detection API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model": "age_gender_modelv2.keras"
    }


app.include_router(prediction_router)