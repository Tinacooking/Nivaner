import { useState } from "react";
import { castHexagram, formatError } from "../api";

const API_HINT = "Start the API with: python3 web/server.py";

function HexagramFigure({ lines, changed = false }) {
  const ordered = [...lines].reverse();

  return (
    <div className={`hexagram-figure ${changed ? "is-changed" : ""}`}>
      {ordered.map((line) => (
        <div
          key={line.position}
          className={`hex-line ${line.yang ? "is-yang" : "is-yin"} ${
            !changed && line.changing ? "is-changing" : ""
          }`}
        >
          {line.yang ? (
            <span className="bar" />
          ) : (
            <>
              <span className="bar half" />
              <span className="bar half" />
            </>
          )}
          <span className="line-number">{line.position}</span>
          {!changed && line.changing ? (
            <span className="change-dot" aria-label="changing line" />
          ) : null}
        </div>
      ))}
    </div>
  );
}

function transformedLines(result) {
  if (!result.changing_lines.length) {
    return null;
  }
  return result.lines.map((line) => ({
    ...line,
    yang: line.changing ? !line.yang : line.yang,
    changing: false,
  }));
}

export default function IChingFeature() {
  const [question, setQuestion] = useState("");
  const [seed, setSeed] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const changed = result ? transformedLines(result) : null;

  async function requestCast(nextSeed = null) {
    setLoading(true);
    setError("");
    try {
      const data = await castHexagram({ question, seed: nextSeed });
      setResult(data);
    } catch (castError) {
      setError(formatError(castError, API_HINT));
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    requestCast(seed.trim() || null);
  }

  function handleReplay() {
    if (result) {
      setQuestion(result.question ?? question);
      requestCast(result.seed);
    }
  }

  return (
    <div className="feature layout">
      <section className="panel" aria-label="I Ching casting">
        <p className="panel-eyebrow">I Ching</p>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="iching-question">Your question</label>
            <textarea
              id="iching-question"
              rows={3}
              maxLength={300}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="What situation asks for a wider view?"
            />
            <p className="hint">
              Ask about a situation, not a fixed outcome. The hexagram describes
              the pattern you are inside.
            </p>
          </div>

          <div className="field">
            <label htmlFor="iching-seed">Seed (optional)</label>
            <input
              id="iching-seed"
              type="text"
              inputMode="numeric"
              value={seed}
              onChange={(event) => setSeed(event.target.value)}
              placeholder="Random each cast"
            />
            <p className="hint">A saved seed replays the exact same cast.</p>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Casting…" : "Cast the hexagram"}
          </button>

          <div className="button-row">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={handleReplay}
              disabled={!result || loading}
            >
              Replay this cast
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setSeed("");
                setResult(null);
                setError("");
              }}
              disabled={loading}
            >
              Clear
            </button>
          </div>

          {result ? (
            <p className="seed-line">
              seed <code>{result.seed}</code> · {result.code}
            </p>
          ) : null}
        </form>
      </section>

      <section className="stage iching-stage" aria-live="polite">
        {error ? (
          <div className="error" role="alert">
            <strong>Something went wrong.</strong> {error}
          </div>
        ) : null}

        <div className="stage-head">
          <div>
            <p className="eyebrow">
              {loading ? "Casting" : result ? "Your hexagram" : "Ready"}
            </p>
            <h2>
              {result
                ? `No. ${result.primary.number} · ${result.primary.pinyin}`
                : "Ask, then cast"}
            </h2>
          </div>
          {result ? (
            <span className="chip">
              {result.changing_lines.length
                ? `${result.changing_lines.length} moving line${
                    result.changing_lines.length === 1 ? "" : "s"
                  }`
                : "No moving lines"}
            </span>
          ) : null}
        </div>

        {result?.question ? (
          <blockquote className="question-echo">“{result.question}”</blockquote>
        ) : null}

        {result ? (
          <>
            <div className="hex-pair">
              <article className="hex-card">
                <header>
                  <span className="hex-no">No. {result.primary.number}</span>
                  <span className="hex-pinyin">{result.primary.pinyin}</span>
                </header>
                <p className="hex-name" lang="zh-Hant">
                  {result.primary.name}
                </p>
                <p className="hex-english">{result.primary.english}</p>
                <HexagramFigure lines={result.lines} />
                <p className="hex-caption">Primary hexagram</p>
              </article>

              {changed ? (
                <article className="hex-card is-next">
                  <header>
                    <span className="hex-no">No. {result.transformed.number}</span>
                    <span className="hex-pinyin">{result.transformed.pinyin}</span>
                  </header>
                  <p className="hex-name" lang="zh-Hant">
                    {result.transformed.name}
                  </p>
                  <p className="hex-english">{result.transformed.english}</p>
                  <HexagramFigure lines={changed} changed />
                  <p className="hex-caption">Transformed hexagram</p>
                </article>
              ) : (
                <article className="hex-card is-still">
                  <div className="still-mark" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                  <p className="hex-caption">No moving lines</p>
                  <p className="still-note">
                    The hexagram stands as one image. Read it whole rather than
                    looking for a next step.
                  </p>
                </article>
              )}
            </div>

            <div className="reading-notes">
              <div className="classical-text">
                <h3>Judgment</h3>
                <p lang="zh-Hant">{result.primary.judgment}</p>
                {result.changing_lines.length ? (
                  <>
                    <h4>Moving lines</h4>
                    {result.lines
                      .filter((line) => line.changing)
                      .map((line) => (
                        <p key={line.position} lang="zh-Hant">
                          {line.text}
                        </p>
                      ))}
                  </>
                ) : null}
                {result.primary.tuan ? (
                  <details>
                    <summary>Commentary on the Judgment</summary>
                    <p lang="zh-Hant">{result.primary.tuan}</p>
                  </details>
                ) : null}
              </div>

              <div className="reading-prompt">
                <h3>How to read it</h3>
                <p>
                  {result.changing_lines.length
                    ? "The marked lines are the hinge. Read the Judgment first, then the moving line texts, and name the situation they describe in your own words."
                    : "With no moving lines, stay with the whole image. Notice which phrase stays with you and what it asks you to do differently this week."}
                </p>
                <p className="fine">
                  Cast at {new Date(result.cast_at).toLocaleString()}. The text is
                  the classical Zhouyi in Chinese; the English name is a
                  translation of the hexagram, not of the full commentary.
                </p>
              </div>

              {result.analysis.length ? (
                <details className="draw-data">
                  <summary>Classical commentary</summary>
                  <ul className="analysis-list">
                    {result.analysis.map((item) => (
                      <li key={item} lang="zh-Hant">
                        {item}
                      </li>
                    ))}
                  </ul>
                </details>
              ) : null}
            </div>
          </>
        ) : (
          <div className="empty-state iching-empty">
            <div className="empty-hex" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <p>
              Six lines are cast bottom to top. A question plus a saved seed
              makes any reading reproducible.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
