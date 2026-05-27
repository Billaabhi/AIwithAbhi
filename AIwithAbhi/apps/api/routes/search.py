from fastapi import APIRouter, Depends, Query
from sqlalchemy import select, text
from sqlalchemy.orm import Session
from database import get_db
from models import Skill
from schemas import SkillSummary, VaultListResponse

router = APIRouter(prefix="/search", tags=["search"])


@router.get("", response_model=VaultListResponse)
def search_skills(
    q: str = Query(..., min_length=2, max_length=200),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    # Postgres full-text search with trigram fallback
    results = db.execute(
        text(
            """
            SELECT *, ts_rank(to_tsvector('english', title || ' ' || description), plainto_tsquery('english', :q)) AS rank
            FROM skills
            WHERE published = true
              AND (
                to_tsvector('english', title || ' ' || description) @@ plainto_tsquery('english', :q)
                OR title ILIKE :like_q
              )
            ORDER BY rank DESC, created_at DESC
            LIMIT :limit OFFSET :offset
            """
        ),
        {"q": q, "like_q": f"%{q}%", "limit": page_size, "offset": (page - 1) * page_size},
    ).mappings().all()

    count_result = db.execute(
        text(
            """
            SELECT COUNT(*) FROM skills
            WHERE published = true
              AND (
                to_tsvector('english', title || ' ' || description) @@ plainto_tsquery('english', :q)
                OR title ILIKE :like_q
              )
            """
        ),
        {"q": q, "like_q": f"%{q}%"},
    ).scalar_one()

    skill_ids = [r["id"] for r in results]
    skills = db.execute(select(Skill).where(Skill.id.in_(skill_ids))).scalars().all()
    skills_by_id = {str(s.id): s for s in skills}
    ordered = [skills_by_id[str(r["id"])] for r in results if str(r["id"]) in skills_by_id]

    return VaultListResponse(
        skills=[SkillSummary.model_validate(s) for s in ordered],
        total=count_result,
        page=page,
        page_size=page_size,
    )
