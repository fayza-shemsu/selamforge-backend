from datetime import date
from decimal import Decimal
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr


class EmployeeCreate(BaseModel):
    org_unit_id: Optional[UUID] = None
    first_name: str
    last_name: str
    email: EmailStr
    hire_date: date
    base_salary_etb: Decimal
    is_ethiopian_national: bool = True


class EmployeeUpdate(BaseModel):
    org_unit_id: Optional[UUID] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    hire_date: Optional[date] = None
    base_salary_etb: Optional[Decimal] = None
    is_ethiopian_national: Optional[bool] = None
    status: Optional[str] = None


class EmployeeOut(BaseModel):
    id: UUID
    org_unit_id: Optional[UUID] = None
    first_name: str
    last_name: str
    email: str
    hire_date: date
    base_salary_etb: Decimal
    is_ethiopian_national: bool
    status: str

    class Config:
        from_attributes = True
