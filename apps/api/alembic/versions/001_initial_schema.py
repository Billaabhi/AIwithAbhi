"""initial schema

Revision ID: 001
Revises:
Create Date: 2026-05-27

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    op.execute("CREATE EXTENSION IF NOT EXISTS pg_trgm")

    op.create_table(
        "skills",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("uuid_generate_v4()")),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("slug", sa.String(255), nullable=False, unique=True),
        sa.Column("description", sa.Text, nullable=False),
        sa.Column("markdown", sa.Text, nullable=False),
        sa.Column("tags", postgresql.ARRAY(sa.String), nullable=False, server_default="{}"),
        sa.Column("views", sa.Integer, nullable=False, server_default="0"),
        sa.Column("likes", sa.Integer, nullable=False, server_default="0"),
        sa.Column("downloads", sa.Integer, nullable=False, server_default="0"),
        sa.Column("published", sa.Boolean, nullable=False, server_default="false"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
    )
    op.create_index("ix_skills_slug", "skills", ["slug"], unique=True)
    op.create_index("ix_skills_published", "skills", ["published"])

    # Full-text search index on title + description
    op.execute(
        "CREATE INDEX ix_skills_fts ON skills USING gin(to_tsvector('english', title || ' ' || description))"
    )
    # Trigram index for LIKE-based search
    op.execute("CREATE INDEX ix_skills_title_trgm ON skills USING gin(title gin_trgm_ops)")

    op.create_table(
        "skill_sessions",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("uuid_generate_v4()")),
        sa.Column("intent", sa.Text, nullable=False),
        sa.Column("questions", postgresql.JSONB, nullable=False, server_default="[]"),
        sa.Column("answers", postgresql.JSONB, nullable=False, server_default="{}"),
        sa.Column("draft", sa.Text, nullable=True),
        sa.Column("status", sa.String(50), nullable=False, server_default="'intake'"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
    )


def downgrade() -> None:
    op.drop_table("skill_sessions")
    op.drop_table("skills")
