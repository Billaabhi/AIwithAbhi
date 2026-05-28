import json
from config import load_prompt
from services import grok


_SYSTEM = load_prompt("architect")


def run(intent: dict, answers: dict[str, str]) -> str:
    """Generate the full Skills.md draft from structured intent and Q&A answers."""
    user_content = json.dumps({"intent": intent, "answers": answers}, indent=2)
    return grok.chat(_SYSTEM, user_content)
