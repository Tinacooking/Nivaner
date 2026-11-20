"""Tarot draw + AE Waite meanings (card data from ekelen/tarot-api)."""

import importlib.util
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CARD_DATA = ROOT / "vendor" / "tarot-api" / "static" / "card_data.json"

_spec = importlib.util.spec_from_file_location("tarot_draw", ROOT / "scripts" / "draw.py")
draw = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(draw)

ALIASES = {
    "Strength": "Fortitude",
    "Wheel of Fortune": "Wheel Of Fortune",
    "Judgement": "The Last Judgment",
}

_raw = json.loads(CARD_DATA.read_text(encoding="utf-8"))["cards"]
BY_NAME = {card["name"]: card for card in _raw}


def spreads_payload():
    spreads = []
    for key, (name, raw) in draw.SPREADS.items():
        positions = [item.split(",")[0] for item in raw.split("|")]
        spreads.append({"key": key, "name": name, "positions": positions})
    return spreads


def card_meta(name):
    return BY_NAME.get(ALIASES.get(name, name))


def draw_tarot(spread, question="", seed=None, time_factor=None):
    result = draw.draw_cards(spread, question, seed, time_factor)
    result["seed"] = str(result["seed"])
    for card in result["cards"]:
        meta = card_meta(card["card"])
        if meta:
            card["meaning"] = meta["meaning_up" if card["orientation"] == "Upright" else "meaning_rev"]
        else:
            card["meaning"] = None
    return result
