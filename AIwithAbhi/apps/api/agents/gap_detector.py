import json
from config import load_prompt
from services import grok


_SYSTEM = load_prompt("gap")


def run(intent: dict) -> list[dict]:
    """Return a list of clarifying questions (max 5), or [] if intent is clear enough."""
    result = grok.chat_json(_SYSTEM, json.dumps(intent, indent=2))
    assert isinstance(result, list)
    return result
