import pytest

from app.services.leave import calculate_annual_leave_entitlement


@pytest.mark.parametrize(
    "years_of_service, expected",
    [
        (0, 16),   # new hire
        (1, 16),   # under 2 years, no bonus yet
        (2, 17),   # 2 full years -> +1
        (3, 17),   # still +1 until year 4
        (4, 18),
        (10, 21),
        (20, 26),
        (40, 36),  # long-tenure sanity check
    ],
)
def test_calculate_annual_leave_entitlement(years_of_service, expected):
    assert calculate_annual_leave_entitlement(years_of_service) == expected


def test_negative_years_raises():
    with pytest.raises(ValueError):
        calculate_annual_leave_entitlement(-1)
