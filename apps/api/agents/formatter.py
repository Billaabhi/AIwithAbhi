from config import load_prompt
from services import grok


_SYSTEM = load_prompt("formatter")


def run(markdown: str) -> str:
    """Apply final formatting pass. Returns clean, vault-ready Skills.md."""
    return grok.chat(_SYSTEM, markdown)
