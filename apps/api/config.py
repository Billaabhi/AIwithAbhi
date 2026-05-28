import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


# Try multiple paths to find prompts directory (handles different deployment contexts)
def _get_prompts_dir() -> Path:
    candidates = [
        Path(__file__).parent / "prompts",  # If prompts copied to api/prompts (Render deployment)
        Path(__file__).parent.parent.parent / "packages" / "prompts",  # Local dev
    ]
    for candidate in candidates:
        if candidate.exists():
            return candidate
    # Return first candidate (local dev path) - will error with clear message if missing
    return Path(__file__).parent / "prompts"

PROMPTS_DIR = _get_prompts_dir()


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    xai_api_key: str
    database_url: str
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    cors_origins: str = "http://localhost:3000"
    grok_model: str = "grok-4"

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",")]


settings = Settings()


def load_prompt(name: str) -> str:
    path = PROMPTS_DIR / f"{name}.md"
    if not path.exists():
        raise FileNotFoundError(f"Prompt file not found: {path}")
    return path.read_text(encoding="utf-8")
