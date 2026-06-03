from fastapi import FastAPI

from fastapi.middleware.cors import (
    CORSMiddleware
)

from app.routes.registration import router as registration_router
from app.routes.webhook import router as webhook_router

app = FastAPI(
    title="Trade Fair API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-vercel-app.vercel.app", "http://localhost:5173/"], ## input the vercel link
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    registration_router
)

app.include_router(
    webhook_router
)


@app.get("/")
def root():
    return {
        "message":
        "Trade Fair API Running"
    }