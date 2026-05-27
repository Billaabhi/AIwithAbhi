import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from database import get_db
from models import Skill
from schemas import SkillOut

router = APIRouter(tags=["interact"])


@router.post("/like/{skill_id}", response_model=SkillOut)
def like_skill(skill_id: uuid.UUID, db: Session = Depends(get_db)):
    skill = db.get(Skill, skill_id)
    if skill is None or not skill.published:
        raise HTTPException(status_code=404, detail="Skill not found")
    skill.likes += 1
    db.commit()
    db.refresh(skill)
    return SkillOut.model_validate(skill)


@router.post("/clone/{skill_id}", response_model=SkillOut)
def clone_skill(skill_id: uuid.UUID, db: Session = Depends(get_db)):
    original = db.execute(
        select(Skill).where(Skill.id == skill_id, Skill.published == True)  # noqa: E712
    ).scalar_one_or_none()
    if original is None:
        raise HTTPException(status_code=404, detail="Skill not found")

    original.downloads += 1
    db.commit()

    from slugify import slugify
    base_slug = slugify(f"{original.title}-remix")
    slug = base_slug
    n = 1
    while db.execute(select(Skill).where(Skill.slug == slug)).scalar_one_or_none():
        slug = f"{base_slug}-{n}"
        n += 1

    clone = Skill(
        title=f"{original.title} (Remix)",
        slug=slug,
        description=original.description,
        markdown=original.markdown,
        tags=original.tags,
        published=False,
    )
    db.add(clone)
    db.commit()
    db.refresh(clone)
    return SkillOut.model_validate(clone)
