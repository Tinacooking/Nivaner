import { useEffect, useMemo, useState } from "react";
import { drawTarot, fetchSpreads, formatError } from "../api";
import CardView from "../components/CardView";
import { ratioNote, TIME_FACTORS } from "../tarot";

const FALLBACK_SPREADS = [
  {
    key: "single",
    name: "Single Card",
    positions: ["Current Guidance"],
  },
  {
    key: "three",
    name: "Three-Card Spread",
    positions: ["Past", "Present", "Future"],
  },
  {
    key: "diamond",
    name: "Five-Card Spread",
    positions: ["Core", "Root", "Resistance", "Potential", "Advice"],
  },
  {
    key: "moon",
    name: "Moon Spread",
    positions: ["New Moon", "First Quarter", "Full Moon", "Last Quarter"],
  },
  {
    key: "horseshoe",
    name: "Horseshoe",
    positions: [
      "Distant Past",
      "Recent Past",
      "Present",
      "Near Future",
      "External Influences",
      "Advice",
      "Outcome",
    ],
  },
  {
    key: "celtic",
    name: "Celtic Cross",
    positions: [
      "Core",
      "Crossing",
      "Conscious Goal",
      "Foundation (Past)",
      "Recent Past",
      "Near Future",
      "Self",
      "Environment",
      "Hopes and Fears",
      "Outcome",
    ],
  },
];

const LENSES = [
  { name: "Mirror", text: "current state" },
  { name: "Window", text: "blind spot" },
  { name: "Door", text: "action" },
  { name: "Anchor", text: "fixed belief" },
];

const API_HINT = "Start the API with: python3 web/server.py — then draw again.";

function computeStats(result) {
  if (!result) {
    return null;
  }

  const suits = {};
  let major = 0;
  let reversed = 0;

  for (const card of result.cards) {
    if (card.is_major) {
      major += 1;
    }
    if (card.orientation === "Reversed") {
      reversed += 1;
    }
    const suit = card.card.split(" of ")[1];
    if (suit) {
      suits[suit] = (suits[suit] ?? 0) + 1;
    }
  }

  return { suits, major, reversed, total: result.cards.length };
}

export default function TarotFeature() {
  const [spreads, setSpreads] = useState(FALLBACK_SPREADS);
  const [spreadKey, setSpreadKey] = useState("three");
  const [question, setQuestion] = useState("");
  const [timeFactor, setTimeFactor] = useState("auto");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [dealId, setDealId] = useState(0);

  useEffect(() => {
    let alive = true;

    fetchSpreads()
      .then((list) => {
        if (alive && list.length) {
          setSpreads(list);
        }
      })
      .catch(() => {
        if (alive) {
          setError(API_HINT);
        }
      });

    return () => {
      alive = false;
    };
  }, []);

  const activeSpread = spreads.find((spread) => spread.key === spreadKey);
  const stats = useMemo(() => computeStats(result), [result]);

  const slots = useMemo(() => {
    if (result) {
      return result.cards;
    }
    return (activeSpread?.positions ?? []).map((position) => ({
      position,
      placeholder: true,
    }));
  }, [result, activeSpread]);

  async function requestDraw(params, seed = null) {
    setLoading(true);
    setError("");
    setCopied(false);

    try {
      const data = await drawTarot({ ...params, seed });
      setResult(data);
      setDealId((value) => value + 1);
    } catch (drawError) {
      setError(formatError(drawError, API_HINT));
    } finally {
      setLoading(false);
    }
  }

  function handleDraw() {
    requestDraw({ spread: spreadKey, question, timeFactor });
  }

  function handleReplay() {
    if (!result) {
      return;
    }
    requestDraw(
      {
        spread: result.spread,
        question: result.question,
        timeFactor: result.time_factor,
      },
      result.seed,
    );
  }

  async function handleCopy() {
    if (!result) {
      return;
    }

    try {
      await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setError("Clipboard access was blocked by the browser.");
    }
  }

  return (
    <div className="feature layout">
      <section className="panel" aria-label="Tarot draw settings">
        <p className="panel-eyebrow">Tarot</p>
        <div className="field">
          <label htmlFor="tarot-question">Your question</label>
          <textarea
            id="tarot-question"
            rows={3}
            maxLength={500}
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="What would you like to look at?"
          />
          <p className="hint">
            Vague questions get vague cards. Anchor it in something concrete.
          </p>
        </div>

        <fieldset className="field">
          <legend>Spread</legend>
          <div className="spread-list">
            {spreads.map((spread) => (
              <label
                key={spread.key}
                className={`spread-option ${
                  spreadKey === spread.key ? "is-active" : ""
                }`}
              >
                <input
                  type="radio"
                  name="tarot-spread"
                  value={spread.key}
                  checked={spreadKey === spread.key}
                  onChange={() => setSpreadKey(spread.key)}
                />
                <span className="spread-name">{spread.name}</span>
                <span className="spread-positions">
                  {spread.positions.join(" · ")}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="field">
          <label htmlFor="tarot-time-factor">Time factor</label>
          <select
            id="tarot-time-factor"
            value={timeFactor}
            onChange={(event) => setTimeFactor(event.target.value)}
          >
            {TIME_FACTORS.map((factor) => (
              <option key={factor.value} value={factor.value}>
                {factor.label}
              </option>
            ))}
          </select>
          <p className="hint">Biases the draw by element, matching the CLI.</p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleDraw}
          disabled={loading}
        >
          {loading ? "Shuffling…" : "Draw the cards"}
        </button>

        <div className="button-row">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={handleReplay}
            disabled={!result || loading}
          >
            Replay this draw
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={handleCopy}
            disabled={!result}
          >
            {copied ? "Copied" : "Copy JSON"}
          </button>
        </div>

        {result && (
          <p className="seed-line">
            seed <code>{result.seed}</code> · {result.time_factor}
          </p>
        )}
      </section>

      <section className="stage" aria-live="polite">
        {error && (
          <div className="error" role="alert">
            <strong>Something went wrong.</strong> {error}
          </div>
        )}

        <div className="stage-head">
          <div>
            <p className="eyebrow">
              {loading ? "Shuffling" : result ? "Your spread" : "Ready"}
            </p>
            <h2>
              {result?.spread_name || activeSpread?.name || "Choose a spread"}
            </h2>
          </div>

          {stats && (
            <div className="chips">
              <span className="chip">
                {stats.major}/{stats.total} Major
              </span>
              <span className="chip">{stats.reversed} Reversed</span>
              {Object.entries(stats.suits).map(([suit, count]) => (
                <span key={suit} className="chip">
                  {suit} ×{count}
                </span>
              ))}
            </div>
          )}
        </div>

        {result?.question ? (
          <blockquote className="question-echo">“{result.question}”</blockquote>
        ) : null}

        <div className={`card-grid ${loading ? "is-loading" : ""}`}>
          {slots.map((card, index) => (
            <CardView
              key={`${dealId}-${index}`}
              card={card}
              index={index}
              placeholder={!result}
            />
          ))}
        </div>

        <div className="reading-notes">
          {result ? (
            <>
              <p className="ratio-line">{ratioNote(stats)}</p>
              <div className="lens-list">
                {LENSES.map((lens) => (
                  <span key={lens.name}>
                    <strong>{lens.name}</strong> = {lens.text}
                  </span>
                ))}
              </div>

              <div className="meaning-block">
                <h3>Card meanings</h3>
                <div className="meaning-grid">
                  {result.cards.map((card, index) => (
                    <article className="meaning-item" key={`${index}-${card.card}`}>
                      <header>
                        <span>{card.position}</span>
                        <strong>{card.card}</strong>
                        <em>{card.orientation}</em>
                      </header>
                      <p>{card.meaning || "No classical meaning available."}</p>
                    </article>
                  ))}
                </div>
              </div>

              <details className="draw-data">
                <summary>Draw data</summary>
                <pre>{JSON.stringify(result, null, 2)}</pre>
              </details>
            </>
          ) : (
            <p className="ratio-line">
              Face-down cards wait for a question. Pick a spread and draw when
              you are ready.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
