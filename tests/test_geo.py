import pytest

from app.services.geo import haversine_meters


def test_same_point_is_zero():
    assert haversine_meters(9.0227, 38.7469, 9.0227, 38.7469) == pytest.approx(0, abs=0.01)


def test_known_short_distance():
    # Roughly 1km apart (about 0.009 degrees latitude ~ 1km)
    distance = haversine_meters(9.0227, 38.7469, 9.0317, 38.7469)
    assert distance == pytest.approx(1000, rel=0.05)


def test_known_longer_distance():
    # Addis Ababa to Adama, roughly 80km apart
    distance = haversine_meters(9.0227, 38.7469, 8.5400, 39.2700)
    assert distance == pytest.approx(80000, rel=0.1)


def test_within_radius():
    center_lat, center_lng, radius = 9.0227, 38.7469, 150
    nearby_lat, nearby_lng = 9.02275, 38.74695  # a few meters away
    distance = haversine_meters(center_lat, center_lng, nearby_lat, nearby_lng)
    assert distance <= radius


def test_outside_radius():
    center_lat, center_lng, radius = 9.0227, 38.7469, 150
    far_lat, far_lng = 9.0317, 38.7469  # ~1km away
    distance = haversine_meters(center_lat, center_lng, far_lat, far_lng)
    assert distance > radius
