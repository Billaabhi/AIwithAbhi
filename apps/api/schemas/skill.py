import uuid
from datetime import datetime
from pydantic import BaseModel, Field


class SkillOut(BaseModel):
    id: uuid.UUID
    title: str
    slug: str
    description: str
    markdown: str
    tags: list[str]
    views: int
    likes: int
    downloads: int
    published: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class SkillSummary(BaseModel):
    id: uuid.UUID
    title: str
    slug: str
    description: str
    tags: list[str]
    views: int
    likes: int
    downloads: int
    created_at: datetime

    model_config = {"from_attributes": True}


class PublishRequest(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    description: str = Field(..., min_length=10, max_length=500)
    tags: list[str] = Field(default_factory=list, max_length=10)


class VaultListResponse(BaseModel):
    skills: list[SkillSummary]
    total: int
    page: int
    page_size: int
