from config import load_prompt
from services import grok


_SYSTEM = load_prompt("critic")


def run(draft_markdown: str) -> tuple[list[dict], str]:
    """
    Review the draft skill.
    Returns (issues, revised_markdown).
    """
    result = grok.chat_json(_SYSTEM, draft_markdown)
    assert isinstance(result, dict)
    issues = result.get("issues", [])
    revised = result.get("revisedMarkdown", draft_markdown)
    return issues, revised
