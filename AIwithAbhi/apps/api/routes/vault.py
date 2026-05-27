import uuid
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, func
from sqlalchemy.orm import Session
from database import get_db
from models import Skill
from orchestrator import generate_skill
from schemas import SkillOut, SkillSummary, PublishRequest, VaultListResponse

router = APIRouter(prefix="/vault", tags=["vault"])


@router.get("", response_model=VaultListResponse)
def list_vault(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    sort: str = Query("recent", pattern="^(recent|trending|top)$"),
    db: Session = Depends(get_db),
):
    base_q = select(Skill).where(Skill.published == True)  # noqa: E712

    if sort == "trending":
        base_q = base_q.order_by(Skill.views.desc())
    elif sort == "top":
        base_q = base_q.order_by(Skill.likes.desc())
    else:
        base_q = base_q.order_by(Skill.created_at.desc())

    total = db.execute(select(func.count()).select_from(base_q.subquery())).scalar_one()
    skills = db.execute(base_q.offset((page - 1) * page_size).limit(page_size)).scalars().all()

    return VaultListResponse(
        skills=[SkillSummary.model_validate(s) for s in skills],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/{slug}", response_model=SkillOut)
def get_skill(slug: str, db: Session = Depends(get_db)):
    skill = db.execute(
        select(Skill).where(Skill.slug == slug, Skill.published == True)  # noqa: E712
    ).scalar_one_or_none()
    if skill is None:
        raise HTTPException(status_code=404, detail="Skill not found")

    skill.views += 1
    db.commit()
    db.refresh(skill)
    return SkillOut.model_validate(skill)


@router.post("/publish/{skill_id}", response_model=SkillOut)
def publish_skill(skill_id: uuid.UUID, body: PublishRequest, db: Session = Depends(get_db)):
    try:
        skill = generate_skill.publish(skill_id, body.title, body.description, body.tags, db)
        return SkillOut.model_validate(skill)
    except ValueError as exc:
        msg = str(exc)
        status = 409 if "duplicate" in msg.lower() or "similar" in msg.lower() else 400
        raise HTTPException(status_code=status, detail=msg) from exc
