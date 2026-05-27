import re
from config import load_prompt
from services import grok


_SYSTEM = load_prompt("moderator")

_INJECTION_PATTERNS = [
    r"ignore\s+(all\s+)?previous\s+instructions",
    r"disregard\s+your\s+(guidelines|instructions|rules)",
    r"pretend\s+you\s+are",
    r"you\s+are\s+now\s+a",
    r"jailbreak",
    r"DAN\s+mode",
]
_INJECTION_RE = re.compile("|".join(_INJECTION_PATTERNS), re.IGNORECASE)


def run(markdown: str) -> tuple[bool, str | None]:
    """
    Returns (is_safe, reason_or_none).
    Fast regex pre-check runs first to avoid unnecessary LLM calls.
    """
    if _INJECTION_RE.search(markdown):
        return False, "Skill contains prompt injection patterns."

    result = grok.chat_json(_SYSTEM, markdown)
    assert isinstance(result, dict)
    safe = bool(result.get("safe", False))
    reason = result.get("reason") if not safe else None
    return safe, reason
