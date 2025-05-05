from fastapi import FastAPI
from app.routers import chat, plan_generator
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Medical Chat API")

# Inclure les routeurs séparément
app.include_router(chat.router, prefix="/api")
app.include_router(plan_generator.router, prefix="/api")

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change to specific origin(s) if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "MedChat API is running 🚀"}
