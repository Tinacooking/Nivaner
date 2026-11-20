const JSON_HEADERS = { "Content-Type": "application/json" };

export function formatError(error, hint) {
  const message = error?.message || "Something went wrong.";
  const offline = /failed to fetch|networkerror|load failed|fetch failed/i.test(message);
  return offline ? `${message} ${hint}` : message;
}

async function readJson(response) {
  return response.json().catch(() => ({}));
}

export async function fetchSpreads() {
  const response = await fetch("/api/spreads");
  const data = await readJson(response);
  if (!response.ok) {
    throw new Error(data.error || `Could not load spreads (${response.status}).`);
  }
  return data.spreads ?? [];
}

export async function drawTarot({ spread, question, timeFactor, seed = null }) {
  const response = await fetch("/api/draw", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({
      spread,
      question,
      time_factor: timeFactor || "auto",
      seed,
    }),
  });
  const data = await readJson(response);
  if (!response.ok) {
    throw new Error(data.error || `The draw failed (${response.status}).`);
  }
  return data;
}

export async function castHexagram({ question, seed = null }) {
  const response = await fetch("/api/iching/cast", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ question, seed }),
  });
  const data = await readJson(response);
  if (!response.ok) {
    throw new Error(data.error || `The cast failed (${response.status}).`);
  }
  return data;
}

export async function fetchNatalChart(payload) {
  const response = await fetch("/api/astro/chart", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });
  const data = await readJson(response);
  if (!response.ok) {
    throw new Error(data.error || `Chart calculation failed (${response.status}).`);
  }
  return data;
}
