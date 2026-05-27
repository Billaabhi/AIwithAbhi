# AIwithAbhi — Product Requirements Document

## Product Name
AIwithAbhi

## Mission
Generate deeply engineered Claude Skills.md files through interview + critique workflows.

## Core Features (V1)
1. Skill generation via AI-guided interview flow
2. Gap detection — AI asks clarifying questions before building
3. Skill critique and revision pass
4. Skill export (copy markdown)
5. Public skill vault
6. Full-text search
7. Clone / remix existing skills
8. Publish workflow with moderation gate
9. Community discovery (trending, recent, top rated)

## V1 Users
- AI builders
- Product managers
- Developers
- Prompt engineers
- Students
- Founders

## Success Metric
User creates a production-quality skill in under 3 minutes.
Skill quality must exceed generic prompt templates.

## V1 Constraints
- No auth — anonymous create & publish
- No subscriptions, teams, or analytics dashboards
- No vector search (Postgres full-text only)
- Moderation required before any skill appears in vault

## Out of Scope (V1)
- User accounts / profiles
- Versioning history UI
- API access / developer keys
- Comments or social features beyond likes
