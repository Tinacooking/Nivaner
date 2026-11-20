"""Natal chart calculation and SVG via Kerykeion (g-battaglia/kerykeion)."""

import re
from datetime import datetime
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from kerykeion import AstrologicalSubjectFactory, ChartDataFactory, ChartDrawer

HOUSE_ATTRS = [
    "first_house",
    "second_house",
    "third_house",
    "fourth_house",
    "fifth_house",
    "sixth_house",
    "seventh_house",
    "eighth_house",
    "ninth_house",
    "tenth_house",
    "eleventh_house",
    "twelfth_house",
]

HOUSE_NUMBERS = {
    "First_House": 1,
    "Second_House": 2,
    "Third_House": 3,
    "Fourth_House": 4,
    "Fifth_House": 5,
    "Sixth_House": 6,
    "Seventh_House": 7,
    "Eighth_House": 8,
    "Ninth_House": 9,
    "Tenth_House": 10,
    "Eleventh_House": 11,
    "Twelfth_House": 12,
}

POINTS = [
    "sun",
    "moon",
    "mercury",
    "venus",
    "mars",
    "jupiter",
    "saturn",
    "uranus",
    "neptune",
    "pluto",
    "ascendant",
    "medium_coeli",
]

PRETTY_NAMES = {
    "sun": "Sun",
    "moon": "Moon",
    "mercury": "Mercury",
    "venus": "Venus",
    "mars": "Mars",
    "jupiter": "Jupiter",
    "saturn": "Saturn",
    "uranus": "Uranus",
    "neptune": "Neptune",
    "pluto": "Pluto",
    "ascendant": "Ascendant",
    "medium_coeli": "Midheaven",
}


def _point(point, key):
    data = point.model_dump()
    return {
        "name": PRETTY_NAMES.get(key, data.get("name")),
        "sign": data.get("sign"),
        "degree": round(float(data.get("position") or 0), 2),
        "house": HOUSE_NUMBERS.get(data.get("house")),
        "retrograde": bool(data.get("retrograde")),
        "element": data.get("element"),
        "quality": data.get("quality"),
    }


def build_chart(payload):
    name = str(payload.get("name") or "Seeker").strip()[:80] or "Seeker"
    date_text = str(payload.get("date") or "").strip()
    time_text = str(payload.get("time") or "").strip()
    tz_str = str(payload.get("tz") or "Asia/Ho_Chi_Minh").strip()

    try:
        birth = datetime.strptime(f"{date_text} {time_text}", "%Y-%m-%d %H:%M")
    except ValueError as exc:
        raise ValueError("Birth date must be YYYY-MM-DD and time HH:MM.") from exc

    if not 1900 <= birth.year <= 2100:
        raise ValueError("Birth year must be between 1900 and 2100.")

    try:
        ZoneInfo(tz_str)
    except (ZoneInfoNotFoundError, ValueError) as exc:
        raise ValueError("Unknown timezone. Use an IANA name like Asia/Ho_Chi_Minh.") from exc

    try:
        lat = float(payload.get("lat"))
        lng = float(payload.get("lng"))
    except (TypeError, ValueError) as exc:
        raise ValueError("Latitude and longitude must be numbers.") from exc

    if not -90 <= lat <= 90:
        raise ValueError("Latitude must be between -90 and 90.")
    if not -180 <= lng <= 180:
        raise ValueError("Longitude must be between -180 and 180.")

    city = str(payload.get("city") or "Custom").strip()[:60] or "Custom"

    subject = AstrologicalSubjectFactory.from_birth_data(
        name=name,
        year=birth.year,
        month=birth.month,
        day=birth.day,
        hour=birth.hour,
        minute=birth.minute,
        lng=lng,
        lat=lat,
        tz_str=tz_str,
        city=city,
        nation="",
        online=False,
    )

    chart_data = ChartDataFactory.create_natal_chart_data(subject)
    drawer = ChartDrawer(
        chart_data=chart_data,
        theme="black-and-white",
        transparent_background=True,
        show_house_position_comparison=False,
    )
    svg = drawer.generate_wheel_only_svg_string(
        minify=True,
        remove_css_variables=True,
    )
    viewbox = re.search(r'viewBox="([^"]+)"', svg)
    if viewbox:
        parts = viewbox.group(1).replace(",", " ").split()
        if len(parts) == 4:
            svg = svg.replace("<svg ", f'<svg width="{parts[2]}" height="{parts[3]}" ', 1)

    houses = []
    for index, attr in enumerate(HOUSE_ATTRS, start=1):
        cusp = getattr(subject, attr).model_dump()
        houses.append(
            {
                "house": index,
                "sign": cusp.get("sign"),
                "degree": round(float(cusp.get("position") or 0), 2),
            }
        )

    aspects = []
    for aspect in chart_data.aspects:
        data = aspect.model_dump()
        aspects.append(
            {
                "from": data.get("p1_name"),
                "to": data.get("p2_name"),
                "aspect": data.get("aspect"),
                "degrees": data.get("aspect_degrees"),
                "orb": round(float(data.get("orbit") or 0), 2),
                "movement": data.get("aspect_movement"),
            }
        )
    aspects.sort(key=lambda item: item["orb"])

    lunar_phase = None
    if getattr(subject, "lunar_phase", None):
        lunar_phase = subject.lunar_phase.model_dump()

    return {
        "name": name,
        "city": city,
        "tz": tz_str,
        "local_datetime": subject.iso_formatted_local_datetime,
        "utc_datetime": subject.iso_formatted_utc_datetime,
        "houses_system": subject.houses_system_name,
        "points": [_point(getattr(subject, key), key) for key in POINTS],
        "houses": houses,
        "aspects": aspects[:24],
        "elements": chart_data.element_distribution.model_dump(),
        "qualities": chart_data.quality_distribution.model_dump(),
        "lunar_phase": lunar_phase,
        "svg": svg,
    }
