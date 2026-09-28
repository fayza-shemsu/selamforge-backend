def calculate_annual_leave_entitlement(years_of_service: int) -> int:
    """Annual leave days: 16 base days, plus 1 extra day per 2 full years of service."""
    if years_of_service < 0:
        raise ValueError("years_of_service cannot be negative")
    return 16 + years_of_service // 2
