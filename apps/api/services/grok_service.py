import json
import re
from openai import OpenAI  # xAI SDK is OpenAI-compatible
from config import settings


class GrokService:
    """Single entrypoint for all xAI Grok calls. Agents must use this — no direct SDK calls elsewhere."""

    def __init__(self) -> None:
        self._client = OpenAI(
            api_key=settings.xai_api_key,
            base_url="https://api.groq.com/openai/v1",
        )

    def chat(self, system: str, user: str, model: str | None = None) -> str:
        """Returns the assistant message text only."""
        response = self._client.chat.completions.create(
            model=model or settings.grok_model,
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
        )
        return response.choices[0].message.content or ""

    def chat_json(self, system: str, user: str, model: str | None = None) -> dict | list:
        """Returns parsed JSON from the response. Strips markdown fences if present."""
        raw = self.chat(system, user, model)
        cleaned = re.sub(r"^```(?:json)?\s*", "", raw.strip(), flags=re.MULTILINE)
        cleaned = re.sub(r"\s*```$", "", cleaned.strip(), flags=re.MULTILINE)
        return json.loads(cleaned)


grok = GrokService()
