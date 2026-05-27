import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from orchestrator import generate_skill
from schemas import GenerateRequest, GenerateResponse, AnswerRequest

router = APIRouter(prefix="/generate", tags=["generate"])


@router.post("", response_model=GenerateResponse)
def start_generation(body: GenerateRequest, db: Session = Depends(get_db)):
    try:
        return generate_skill.start(body.intent, db)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/{session_id}/answer", response_model=GenerateResponse)
def submit_answers(session_id: uuid.UUID, body: AnswerRequest, db: Session = Depends(get_db)):
    try:
        return generate_skill.answer(session_id, body.answers, db)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
