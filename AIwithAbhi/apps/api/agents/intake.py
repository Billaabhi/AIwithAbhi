from config import load_prompt
from services import grok


_SYSTEM = load_prompt("intake")


def run(user_input: str) -> dict:
    """Parse raw user intent into a structured intent object."""
    result = grok.chat_json(_SYSTEM, user_input)
    assert isinstance(result, dict)
    return result
