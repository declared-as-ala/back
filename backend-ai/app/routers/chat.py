from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.deepseek_client import get_response
from app.core.logger import logger

router = APIRouter()


class ChatRequest(BaseModel):
    session_id: str
    prompt: str
    chat_type: str  # "symptom", "qa", "food"


@router.post("/chat")  # 🔁 remove async
def chat_handler(payload: ChatRequest):
    try:
        logger.info(f"[{payload.session_id}] {payload.chat_type} -> {payload.prompt}")
        response = get_response(payload.session_id, payload.prompt, payload.chat_type)
        return {"response": response}
    except Exception as e:
        logger.error(f"Error in chat_handler: {e}")
        raise HTTPException(status_code=500, detail="Something went wrong")
