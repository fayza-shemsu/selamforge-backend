import logging

from openai import AzureOpenAI
from groq import Groq

from app.core.config import settings

logger = logging.getLogger(__name__)


def build_azure_openai_client() -> AzureOpenAI | None:
    if not (settings.azure_openai_endpoint and settings.azure_openai_api_key and settings.azure_openai_deployment):
        logger.warning("Azure OpenAI not configured; skipping client build")
        return None
    return AzureOpenAI(
        azure_endpoint=settings.azure_openai_endpoint,
        api_key=settings.azure_openai_api_key,
        api_version=settings.azure_openai_api_version,
    )


def build_groq_client() -> Groq | None:
    if not settings.groq_api_key:
        logger.warning("Groq not configured; skipping client build")
        return None
    return Groq(api_key=settings.groq_api_key)


azure_openai_client = build_azure_openai_client()
groq_client = build_groq_client()
