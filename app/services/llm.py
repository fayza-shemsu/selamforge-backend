import logging

from app.core.ai_clients import azure_openai_client, groq_client
from app.core.config import settings

logger = logging.getLogger(__name__)


def generate(prompt: str) -> str:
    """Generate a chat completion, trying Azure OpenAI first and falling
    back to Groq on any error. Logs which provider actually served the
    request.
    """
    if azure_openai_client is not None:
        try:
            response = azure_openai_client.chat.completions.create(
                model=settings.azure_openai_deployment,
                messages=[{"role": "user", "content": prompt}],
            )
            logger.info("llm.generate: served by azure_openai")
            return response.choices[0].message.content

        except Exception:
            logger.warning("llm.generate: azure_openai failed, falling back to groq", exc_info=True)

    if groq_client is not None:
        response = groq_client.chat.completions.create(
            model=settings.groq_model,
            messages=[{"role": "user", "content": prompt}],
        )
        logger.info("llm.generate: served by groq")
        return response.choices[0].message.content

    raise RuntimeError("No AI provider is configured (Azure OpenAI and Groq both unavailable)")
