import math

import pytest

from app.services.embeddings import generate_embedding, _truncate_to_word_limit


def cosine_similarity(a: list[float], b: list[float]) -> float:
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(y * y for y in b))
    return dot / (norm_a * norm_b)


def test_truncate_under_limit_unchanged():
    text = "one two three"
    assert _truncate_to_word_limit(text, max_words=500) == text


def test_truncate_over_limit():
    text = " ".join(f"word{i}" for i in range(600))
    result = _truncate_to_word_limit(text, max_words=500)
    assert len(result.split()) == 500


@pytest.mark.skip(reason="requires a real Azure OpenAI key; run manually once configured")
def test_similar_sentences_score_higher_than_dissimilar():
    vec_a = generate_embedding("The cat sat on the mat.")
    vec_b = generate_embedding("A feline rested on the rug.")
    vec_c = generate_embedding("The stock market crashed today.")

    sim_similar = cosine_similarity(vec_a, vec_b)
    sim_dissimilar = cosine_similarity(vec_a, vec_c)

    assert sim_similar > sim_dissimilar
