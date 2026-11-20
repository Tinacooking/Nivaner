#!/usr/bin/env python3
"""Local API and static server for the NIRVANER web UI.

The draw engines use:
  - scripts/draw.py + ekelen/tarot-api (tarot)
  - kentang2017/ichingshifa, cloned into vendor/ (I Ching)
  - the pip-installed Kerykeion package (natal chart)
Zi Wei charts are generated client-side with SylarLong/iztro.
"""

import argparse
import json
import mimetypes
import sys
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse

WEB_DIR = Path(__file__).resolve().parent
ROOT = WEB_DIR.parent
DIST = WEB_DIR / "dist"
MAX_BODY = 20_000

sys.path.insert(0, str(WEB_DIR))
from services import astro, iching, tarot  # noqa: E402

API_HINT = "Run `npm run dev` in web/ or `npm run build` first."


class TarotHandler(BaseHTTPRequestHandler):
    server_version = "Nirvaner/1.0"

    def do_GET(self):
        path = urlparse(self.path).path
        if path == "/api/spreads":
            return self.send_json({"spreads": tarot.spreads_payload()})
        if path == "/api/health":
            return self.send_json({"ok": True})
        if path.startswith("/api/"):
            return self.send_json({"error": "Not found."}, HTTPStatus.NOT_FOUND)
        return self.serve_static(path)

    def do_POST(self):
        path = urlparse(self.path).path
        payload = self.read_json()
        if payload is None:
            return

        try:
            if path == "/api/draw":
                return self.handle_tarot(payload)
            if path == "/api/iching/cast":
                return self.handle_iching(payload)
            if path == "/api/astro/chart":
                return self.handle_astro(payload)
        except ValueError as exc:
            return self.send_json({"error": str(exc)}, HTTPStatus.BAD_REQUEST)
        except Exception as exc:  # pragma: no cover - defensive
            return self.send_json({"error": f"Calculation failed: {exc}"}, HTTPStatus.INTERNAL_SERVER_ERROR)

        return self.send_json({"error": "Not found."}, HTTPStatus.NOT_FOUND)

    def handle_tarot(self, payload):
        spread = payload.get("spread", "three")
        if spread not in tarot.draw.SPREADS:
            raise ValueError(f"Unknown spread: {spread!r}.")

        question = str(payload.get("question") or "").strip()[:500]
        time_factor = payload.get("time_factor") or None
        if time_factor == "auto":
            time_factor = None
        if time_factor is not None and time_factor not in tarot.draw.TIME:
            raise ValueError(f"Unknown time factor: {time_factor!r}.")

        seed = parse_seed(payload.get("seed"), 2**64)
        result = tarot.draw_tarot(spread, question, seed, time_factor)
        return self.send_json(result)

    def handle_iching(self, payload):
        question = str(payload.get("question") or "").strip()[:300]
        seed = parse_seed(payload.get("seed"), 2**63)
        return self.send_json(iching.cast(question, seed))

    def handle_astro(self, payload):
        return self.send_json(astro.build_chart(payload))

    def read_json(self):
        try:
            length = int(self.headers.get("Content-Length") or 0)
        except ValueError:
            self.send_json({"error": "Invalid Content-Length."}, HTTPStatus.BAD_REQUEST)
            return None
        if length <= 0 or length > MAX_BODY:
            self.send_json({"error": "Missing or oversized request body."}, HTTPStatus.BAD_REQUEST)
            return None
        try:
            payload = json.loads(self.rfile.read(length))
        except (json.JSONDecodeError, UnicodeDecodeError):
            self.send_json({"error": "Request body must be valid JSON."}, HTTPStatus.BAD_REQUEST)
            return None
        if not isinstance(payload, dict):
            self.send_json({"error": "Request body must be a JSON object."}, HTTPStatus.BAD_REQUEST)
            return None
        return payload

    def serve_static(self, path):
        relative = unquote(path).lstrip("/")
        target = (DIST / relative).resolve() if relative else DIST / "index.html"

        if not target.is_relative_to(DIST.resolve()):
            return self.send_json({"error": "Forbidden."}, HTTPStatus.FORBIDDEN)

        if target.is_dir():
            target = target / "index.html"

        if not target.is_file():
            if not target.suffix and (DIST / "index.html").is_file():
                target = DIST / "index.html"
            else:
                return self.send_text(f"UI not built. {API_HINT}", HTTPStatus.NOT_FOUND)

        ctype = mimetypes.guess_type(target.name)[0] or "application/octet-stream"
        body = target.read_bytes()
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", ctype + ("; charset=utf-8" if ctype.startswith("text/") else ""))
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def send_json(self, payload, status=HTTPStatus.OK):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def send_text(self, message, status=HTTPStatus.OK):
        body = message.encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def parse_seed(value, maximum):
    if value in (None, ""):
        return None
    try:
        seed = int(str(value))
    except ValueError as exc:
        raise ValueError("Seed must be an integer.") from exc
    if not 0 <= seed < maximum:
        raise ValueError(f"Seed must be between 0 and {maximum - 1}.")
    return seed


def main():
    parser = argparse.ArgumentParser(description="Serve the NIRVANER UI and divination APIs.")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8000)
    args = parser.parse_args()

    server = ThreadingHTTPServer((args.host, args.port), TarotHandler)
    print(f"NIRVANER API listening on http://{args.host}:{args.port}")
    if DIST.is_dir():
        print(f"Serving built UI from {DIST}")
    else:
        print(f"No build found at {DIST} — run `npm run dev` in web/ for development.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
