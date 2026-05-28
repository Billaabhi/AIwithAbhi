import uuid
from sqlalchemy.orm import Session
from agents import intake, gap_detector, architect, critic, formatter, moderator
from models import SkillSession, Skill
from schemas import GenerateResponse, QuestionOut


def start(intent_text: str, db: Session) -> GenerateResponse:
    """
    Step 1: Parse intent and detect gaps.
    Returns questions if gaps found, or kicks straight into drafting if intent is clear.
    """
    intent = intake.run(intent_text)
    questions = gap_detector.run(intent)

    session = SkillSession(
        intent=intent_text,
        questions=questions,
        answers={},
        status="questioning" if questions else "drafting",
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    if questions:
        return GenerateResponse(
            session_id=session.id,
            status="questioning",
            questions=[QuestionOut(**q) for q in questions],
        )

    # No gaps — proceed directly to drafting
    return _build_skill(session, intent, {}, db)


def answer(session_id: uuid.UUID, answers: dict[str, str], db: Session) -> GenerateResponse:
    """
    Step 2: Receive answers to gap questions and continue the pipeline.
    """
    session = db.get(SkillSession, session_id)
    if session is None:
        raise ValueError(f"Session {session_id} not found")

    session.answers = answers
    session.status = "drafting"
    db.commit()

    intent = intake.run(session.intent)
    return _build_skill(session, intent, answers, db)


def _build_skill(
    session: SkillSession,
    intent: dict,
    answers: dict[str, str],
    db: Session,
) -> GenerateResponse:
    """Run architect → critic → formatter → save (unpublished)."""
    session.status = "drafting"
    db.commit()

    draft = architect.run(intent, answers)
    _, revised = critic.run(draft)
    final_markdown = formatter.run(revised)

    session.draft = final_markdown
    session.status = "done"
    db.commit()

    # Extract title from frontmatter if present, else fall back to intent
    title = _extract_frontmatter_name(final_markdown) or intent.get("corePurpose", "Untitled Skill")
    slug = _make_slug(title, db)

    skill = Skill(
        title=title,
        slug=slug,
        description=intent.get("corePurpose", ""),
        markdown=final_markdown,
        tags=intent.get("keyBehaviors", [])[:5],
        published=False,
    )
    db.add(skill)
    db.commit()
    db.refresh(skill)

    from schemas import SkillOut
    return GenerateResponse(
        session_id=session.id,
        status="done",
        skill=SkillOut.model_validate(skill),
    )


def publish(skill_id: uuid.UUID, title: str, description: str, tags: list[str], db: Session) -> Skill:
    """Moderation → duplicate check → publish."""
    skill = db.get(Skill, skill_id)
    if skill is None:
        raise ValueError(f"Skill {skill_id} not found")

    safe, reason = moderator.run(skill.markdown)
    if not safe:
        raise ValueError(f"Moderation failed: {reason}")

    if _is_duplicate(skill.markdown, skill_id, db):
        raise ValueError("A very similar skill already exists in the vault.")

    skill.title = title
    skill.description = description
    skill.tags = tags
    skill.slug = _make_slug(title, db, exclude_id=skill_id)
    skill.published = True
    db.commit()
    db.refresh(skill)
    return skill


def _extract_frontmatter_name(markdown: str) -> str | None:
    import re
    match = re.search(r"^---\s*\nname:\s*(.+?)\s*\n", markdown, re.MULTILINE)
    return match.group(1).replace("-", " ").title() if match else None


def _make_slug(title: str, db: Session, exclude_id: uuid.UUID | None = None) -> str:
    from slugify import slugify
    from sqlalchemy import select
    base = slugify(title)
    slug = base
    n = 1
    while True:
        q = select(Skill).where(Skill.slug == slug)
        if exclude_id is not None:
            q = q.where(Skill.id != exclude_id)
        exists = db.execute(q).scalar_one_or_none()
        if not exists:
            return slug
        slug = f"{base}-{n}"
        n += 1


def _is_duplicate(markdown: str, skill_id: uuid.UUID, db: Session) -> bool:
    """Simple similarity check using pg_trgm word_similarity."""
    from sqlalchemy import text
    result = db.execute(
        text(
            "SELECT EXISTS("
            "  SELECT 1 FROM skills"
            "  WHERE id != :sid AND published = true"
            "  AND word_similarity(markdown, :md) > 0.85"
            ")"
        ),
        {"sid": str(skill_id), "md": markdown},
    ).scalar()
    return bool(result)
