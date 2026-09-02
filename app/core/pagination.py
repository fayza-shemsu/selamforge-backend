from typing import Generic, TypeVar, List

from pydantic import BaseModel
from sqlalchemy.orm import Query

T = TypeVar("T")


class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    page_size: int


def paginate(query: Query, page: int = 1, page_size: int = 20) -> dict:
    page = max(page, 1)
    page_size = max(min(page_size, 100), 1)  # cap page_size so nobody requests 100000 rows at once

    total = query.count()
    items = query.offset((page - 1) * page_size).limit(page_size).all()

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
    }
