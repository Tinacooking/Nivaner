# NIRVANER

A local, seeded divination atlas for four symbolic systems, plus the original tarot Agent Skill.

- **Tarot** — reproducible draws across six spreads, with upright and reversed Waite meanings.
- **Zi Wei Dou Shu** — a twelve-palace chart with Vietnamese star and palace names, four transformations, and a plain-language reading.
- **I Ching** — seeded yarrow-stalk casting with primary and transformed hexagrams, moving-line highlights, and the classical Zhouyi text.
- **Natal chart** — a Kerykeion wheel with planets, houses, aspects, and element/mode balance.

Every random draw accepts a seed, so a reading can be replayed exactly. Readings are calculated locally: there is no account system, analytics, or remote reading API. The only external request is to Google Fonts for the display/body typefaces.

## Stack

- React 19 + Vite 8 for the interface.
- Python's standard-library HTTP server for the local JSON API and built static files.
- [`iztro`](https://github.com/SylarLong/iztro) in the browser for Zi Wei charts.
- [`kerykeion`](https://github.com/g-battaglia/kerykeion) for natal wheels.
- [`tarot-api`](https://github.com/ekelen/tarot-api) card data and [`ichingshifa`](https://github.com/kentang2017/ichingshifa) casting engine, cloned into `vendor/`.

## Quick Start

Requires Python 3.10+ (tested on 3.14), Node 22+ (tested on 25), and Git.

```bash
git clone https://github.com/Tinacooking/Nivaner.git
cd tarot-skill

# Upstream data and casting engine (vendor/ is not committed)
mkdir -p vendor
git clone --depth 1 https://github.com/ekelen/tarot-api vendor/tarot-api
git clone --depth 1 https://github.com/kentang2017/ichingshifa vendor/ichingshifa

# Python API
python3 -m venv .venv
source .venv/bin/activate
pip install -r web/requirements.txt

# React interface
cd web
npm ci
npm run build
cd ..

python3 web/server.py
# open http://127.0.0.1:8000
```

For development, run the API and Vite separately:

```bash
# Terminal 1
source .venv/bin/activate
python3 web/server.py

# Terminal 2
cd web
npm run dev
# open http://127.0.0.1:5173
```

The API binds to `127.0.0.1` and serves the built interface from `web/dist/`.

## Project Structure

```text
SKILL.md                    # Agent Skill workflow and reading methodology
references/                 # Card meanings, relations, combinations, spreads
scripts/draw.py             # CLI tarot draw engine
tests/test_draw.py          # Draw contract tests
pytest.ini                  # Test discovery configuration
requirements-dev.txt        # Runtime dependencies + pytest
web/
  index.html                # Document shell, fonts, favicon, metadata
  server.py                 # JSON API + static file server
  requirements.txt          # Python API dependencies
  services/
    tarot.py                # Draw + Waite meaning enrichment
    iching.py               # Seeded cast + hexagram metadata
    astro.py                # Kerykeion natal chart + wheel SVG
  src/
    App.jsx                 # Navigation shell and lazy feature mounting
    api.js                  # Fetch wrappers for the JSON API
    assets/                 # Landing-page tarot artwork
    components/             # Home, page intro, celestial SVG, tarot cards
    features/               # Tarot, Zi Wei, I Ching, natal chart views
    systems.js              # System copy and navigation metadata
    tarot.js                # Suit/rank parsing and draw summaries
    astrology.js            # Sign, aspect, and balance helpers
    ziwei.js                # Palace/star labels and reading synthesis
    styles.css              # NIRVANER design system and responsive layout
vendor/                     # Cloned upstream engines (gitignored)
```

Zi Wei is lazy-loaded as a separate production chunk and only mounted after the user opens that system. The other features mount on first visit and stay mounted so their readings survive navigation.

## API

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Local service health check |
| `GET` | `/api/spreads` | List spreads and position labels |
| `POST` | `/api/draw` | Tarot draw (`spread`, `question`, `seed`, `time_factor`) |
| `POST` | `/api/iching/cast` | I Ching cast (`question`, `seed`) |
| `POST` | `/api/astro/chart` | Natal chart (`date`, `time`, `lat`, `lng`, `tz`, `city`, `name`) |

Seeds are accepted as strings so 64-bit tarot seeds survive JSON and JavaScript. The API limits request bodies to 20 KB and validates every user supplied field before calculation.

## Checks

```bash
pip install -r requirements-dev.txt
python3 -m pytest -q
cd web && npm run build
```

The build report also shows the lazy Zi Wei chunk. Browser-level checks used in development cover 320, 768, 1024, 1280, and 1440 px layouts, all four systems, seeded draws, and the mobile menu.

## Agent Skill

The original tarot skill remains usable on its own. Copy the repository into your agent's skills directory:

```bash
cp -r . ~/.cursor/skills/tarot/
cp -r . ~/.claude/skills/tarot/
cp -r . ~/.agents/skills/tarot/
```

Or draw from the command line:

```bash
python3 scripts/draw.py --spread three --question "career direction"
python3 scripts/draw.py --spread celtic --question "relationship" --seed 42
```

## Notes and Licensing

- Readings are reflective prompts, not medical, legal, financial, or major-life advice.
- Zi Wei charts use `vi-VN` star names while the interface is English; translations come from `iztro`.
- Classical I Ching text is Chinese (Traditional characters); English names translate the hexagram titles, not the full commentary.
- `kerykeion` is AGPL-3.0. If you deploy a modified version of this app over a network, review the AGPL obligations. `iztro`, `ichingshifa`, and `tarot-api` retain their upstream licenses.
- The High Priestess artwork in `web/src/assets/` is not covered by the repository's MIT license. Confirm redistribution rights for the artwork before publishing or deploying it.
- The original code and skill text in this repository are MIT licensed.
