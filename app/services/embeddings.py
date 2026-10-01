import logging

from app.core.ai_clients import azure_openai_client

logger = logging.getLogger(__name__)

EMBEDDING_MODEL = "text-embedding-3-small"
MAX_WORDS = 500


def _truncate_to_word_limit(text: str, max_words: int = MAX_WORDS) -> str:
    """Keep only the first max_words words. A simple, predictable length
    guard so we never send an oversized request to the embeddings API.
    """
    words = text.split()
    if len(words) <= max_words:
        return text
    logger.info(f"embeddings: truncating input from {len(words)} to {max_words} words")
    return " ".join(words[:max_words])


def generate_embedding(text: str) -> list[float]:
    """Generate a 1536-dimension embedding vector for the given text,
    using Azure OpenAI's text-embedding-3-small model. Long text is
    truncated to MAX_WORDS first.
    """
    if azure_openai_client is None:
        raise RuntimeError("Azure OpenAI is not configured; cannot generate embeddings")

    safe_text = _truncate_to_word_limit(text)

    response = azure_openai_client.embeddings.create(
        model=EMBEDDING_MODEL,
        input=safe_text,
    )
    return response.data[0].embedding
