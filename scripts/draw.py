#!/usr/bin/env python3
"""Tarot draw: weighted, no duplicates, reproducible JSON."""

import argparse
import hashlib
import json
import os
import random
import time
from datetime import datetime

MAJORS = (
    "The Fool",
    "The Magician",
    "The High Priestess",
    "The Empress",
    "The Emperor",
    "The Hierophant",
    "The Lovers",
    "The Chariot",
    "Strength",
    "The Hermit",
    "Wheel of Fortune",
    "Justice",
    "The Hanged Man",
    "Death",
    "Temperance",
    "The Devil",
    "The Tower",
    "The Star",
    "The Moon",
    "The Sun",
    "Judgement",
    "The World",
)
SUITS = {"Wands": "Fire", "Cups": "Water", "Swords": "Air", "Pentacles": "Earth"}
RANKS = "Ace Two Three Four Five Six Seven Eight Nine Ten Page Knight Queen King".split()
MINORS = [f"{r} of {s}" for s in SUITS for r in RANKS]
MAJOR_ELEMENTS = "Air Air Water Earth Fire Earth Air Water Fire Earth Fire Air Water Water Fire Earth Fire Air Water Fire Fire Earth".split()
ELEMENTS = dict(zip(MAJORS, MAJOR_ELEMENTS))
ELEMENTS.update(
    {
        card: element
        for suit, element in SUITS.items()
        for card in MINORS
        if card.endswith(f" of {suit}")
    }
)
CARDS = list(MAJORS) + MINORS

SPREADS = {
    "single": ("Single Card", "Current Guidance,1,0"),
    "three": ("Three-Card Spread", "Past,0,0|Present,1,0|Future,0,1"),
    "diamond": ("Five-Card Spread", "Core,1,0|Root,0,0|Resistance,0,0|Potential,0,0|Advice,1,1"),
    "moon": ("Moon Spread", "New Moon,1,0|First Quarter,0,0|Full Moon,1,0|Last Quarter,0,0"),
    "horseshoe": (
        "Horseshoe",
        "Distant Past,0,0|Recent Past,0,0|Present,1,0|Near Future,0,0|External Influences,1,0|Advice,0,1|Outcome,1,1",
    ),
    "celtic": (
        "Celtic Cross",
        "Core,1,0|Crossing,0,0|Conscious Goal,0,0|Foundation (Past),0,0|Recent Past,1,0|Near Future,0,0|"
        "Self,0,0|Environment,0,0|Hopes and Fears,0,0|Outcome,1,1",
    ),
}
TIME = {"morning": ("Fire", "Air"), "afternoon": ("Water", "Earth"), "night": ("major",)}


def make_seed(question=""):
    data = os.urandom(32) + str(time.time_ns()).encode() + question.encode()
    return int(hashlib.sha256(data).hexdigest()[:16], 16)


def get_time_factor(hour=None):
    h = datetime.now().hour if hour is None else hour
    return "morning" if 6 <= h < 12 else "afternoon" if h < 18 else "night"


def weight(card, key, boosted):
    major = card in MAJORS
    base = (60 / 28) if int(key) * major else 1.0
    hit = ("major" in boosted) * major + (ELEMENTS[card] in boosted)
    return base * (1.08 if hit else 1.0)


def draw_cards(spread_key, question="", seed=None, time_factor=None):
    spread_name, raw = SPREADS[spread_key]
    final_seed = make_seed(question) if seed is None else seed
    final_factor = get_time_factor() if time_factor is None else time_factor
    rng, pool, boosted, cards = random.Random(final_seed), list(CARDS), TIME[final_factor], []
    for item in raw.split("|"):
        name, key, upright = item.split(",")
        picked = rng.choices(pool, weights=[weight(c, key, boosted) for c in pool], k=1)[0]
        pool.remove(picked)
        card = {
            "position": name,
            "card": picked,
            "orientation": "Upright" if rng.random() < (0.7 if int(upright) else 0.6) else "Reversed",
            "is_major": picked in MAJORS,
        }
        cards.append(card)
    return {
        "seed": final_seed,
        "spread": spread_key,
        "spread_name": spread_name,
        "question": question,
        "time_factor": final_factor,
        "cards": cards,
    }


def main():
    parser = argparse.ArgumentParser(description="Tarot card draw script")
    parser.add_argument("--spread", required=True, choices=SPREADS)
    parser.add_argument("--question", default="")
    parser.add_argument("--seed", type=int)
    parser.add_argument("--time-factor", choices=TIME)
    args = parser.parse_args()
    print(json.dumps(draw_cards(args.spread, args.question, args.seed, args.time_factor), ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
