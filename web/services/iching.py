"""I Ching yarrow-stalk casting via ichingshifa (kentang2017/ichingshifa)."""

import random
import secrets
import sys
import threading
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "vendor" / "ichingshifa" / "src"))

from ichingshifa import ichingshifa as _iching  # noqa: E402

_engine = _iching.Iching()
_lock = threading.Lock()

HEXAGRAMS = {
    "乾": (1, "Qian", "The Creative"),
    "坤": (2, "Kun", "The Receptive"),
    "屯": (3, "Zhun", "Difficulty at the Beginning"),
    "蒙": (4, "Meng", "Youthful Folly"),
    "需": (5, "Xu", "Waiting"),
    "訟": (6, "Song", "Conflict"),
    "師": (7, "Shi", "The Army"),
    "比": (8, "Bi", "Holding Together"),
    "小畜": (9, "Xiao Chu", "The Taming Power of the Small"),
    "履": (10, "Lu", "Treading"),
    "泰": (11, "Tai", "Peace"),
    "否": (12, "Pi", "Standstill"),
    "同人": (13, "Tong Ren", "Fellowship with People"),
    "大有": (14, "Da You", "Possession in Great Measure"),
    "謙": (15, "Qian", "Modesty"),
    "豫": (16, "Yu", "Enthusiasm"),
    "隨": (17, "Sui", "Following"),
    "蠱": (18, "Gu", "Work on What Has Been Spoiled"),
    "臨": (19, "Lin", "Approach"),
    "觀": (20, "Guan", "Contemplation"),
    "噬嗑": (21, "Shi He", "Biting Through"),
    "賁": (22, "Bi", "Grace"),
    "剝": (23, "Bo", "Splitting Apart"),
    "復": (24, "Fu", "Return"),
    "無妄": (25, "Wu Wang", "Innocence"),
    "大畜": (26, "Da Chu", "The Taming Power of the Great"),
    "頤": (27, "Yi", "Nourishment"),
    "大過": (28, "Da Guo", "Preponderance of the Great"),
    "坎": (29, "Kan", "The Abysmal Water"),
    "離": (30, "Li", "The Clinging Fire"),
    "咸": (31, "Xian", "Influence"),
    "恆": (32, "Heng", "Duration"),
    "遯": (33, "Dun", "Retreat"),
    "大壯": (34, "Da Zhuang", "The Power of the Great"),
    "晉": (35, "Jin", "Progress"),
    "明夷": (36, "Ming Yi", "Darkening of the Light"),
    "家人": (37, "Jia Ren", "The Family"),
    "睽": (38, "Kui", "Opposition"),
    "蹇": (39, "Jian", "Obstruction"),
    "解": (40, "Jie", "Deliverance"),
    "損": (41, "Sun", "Decrease"),
    "益": (42, "Yi", "Increase"),
    "夬": (43, "Guai", "Breakthrough"),
    "姤": (44, "Gou", "Coming to Meet"),
    "萃": (45, "Cui", "Gathering Together"),
    "升": (46, "Sheng", "Pushing Upward"),
    "困": (47, "Kun", "Oppression"),
    "井": (48, "Jing", "The Well"),
    "革": (49, "Ge", "Revolution"),
    "鼎": (50, "Ding", "The Cauldron"),
    "震": (51, "Zhen", "The Arousing Thunder"),
    "艮": (52, "Gen", "Keeping Still Mountain"),
    "漸": (53, "Jian", "Development"),
    "歸妹": (54, "Gui Mei", "The Marrying Maiden"),
    "豐": (55, "Feng", "Abundance"),
    "旅": (56, "Lu", "The Wanderer"),
    "巽": (57, "Xun", "The Gentle Wind"),
    "兌": (58, "Dui", "The Joyous Lake"),
    "渙": (59, "Huan", "Dispersion"),
    "節": (60, "Jie", "Limitation"),
    "中孚": (61, "Zhong Fu", "Inner Truth"),
    "小過": (62, "Xiao Guo", "Preponderance of the Small"),
    "既濟": (63, "Ji Ji", "After Completion"),
    "未濟": (64, "Wei Ji", "Before Completion"),
}

def _text(texts, key):
    if not isinstance(texts, dict):
        return None
    if key in texts:
        return texts[key]
    return texts.get(str(key))


LINE_TYPES = {
    6: ("Old Yin", "changing"),
    7: ("Young Yang", "stable"),
    8: ("Young Yin", "stable"),
    9: ("Old Yang", "changing"),
}


def hexagram_info(name):
    number, pinyin, english = HEXAGRAMS.get(name, (None, name, name))
    return {"name": name, "number": number, "pinyin": pinyin, "english": english}


def cast(question="", seed=None):
    if seed is None:
        seed = secrets.randbelow(2**63)
    seed = int(seed)

    with _lock:
        random.seed(seed)
        code, primary, transformed, texts, analysis = _engine.bookgua_details()

    values = [int(char) for char in code]
    changing = [index + 1 for index, value in enumerate(values) if value in (6, 9)]

    lines = []
    for index, value in enumerate(values):
        label, state = LINE_TYPES[value]
        lines.append(
            {
                "position": index + 1,
                "value": value,
                "yang": value in (7, 9),
                "changing": state == "changing",
                "label": label,
                "text": _text(texts, index + 1),
            }
        )

    if isinstance(analysis, (list, tuple)):
        analysis_list = [str(item) for item in analysis if item]
    elif analysis:
        analysis_list = [str(analysis)]
    else:
        analysis_list = []

    return {
        "seed": str(seed),
        "cast_at": datetime.now().astimezone().isoformat(timespec="seconds"),
        "question": question,
        "code": code,
        "lines": lines,
        "changing_lines": changing,
        "primary": {
            **hexagram_info(primary),
            "judgment": _text(texts, 0),
            "tuan": _text(texts, 7),
        },
        "transformed": hexagram_info(transformed),
        "analysis": analysis_list,
    }
