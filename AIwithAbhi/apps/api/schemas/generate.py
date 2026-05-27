import uuid
from pydantic import BaseModel, Field
from schemas.skill import SkillOut


class GenerateRequest(BaseModel):
    intent: str = Field(..., min_length=10, max_length=2000)


class QuestionOut(BaseModel):
    id: str
    text: str
    required: bool


class GenerateResponse(BaseModel):
    session_id: uuid.UUID
    status: str
    questions: list[QuestionOut] | None = None
    skill: SkillOut | None = None


class AnswerRequest(BaseModel):
    answers: dict[str, str] = Field(..., description="question_id → answer text")
