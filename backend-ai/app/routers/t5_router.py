from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from app.services.t5_service import generate_plan_from_profile

router = APIRouter()


class UserProfile(BaseModel):
    sex: str
    age: int
    height: float
    weight: float
    level: str
    goal: str
    target_weight: Optional[float] = None
    days_per_week: Optional[int] = 7


@router.post("/generate-workout")
def generate_workout(profile: UserProfile):
    # Convertir en dict et générer le plan
    return generate_plan_from_profile(profile.dict())
