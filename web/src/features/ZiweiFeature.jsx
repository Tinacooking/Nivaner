import { useState } from "react";
import { astro } from "iztro";
import {
  BOARD_AREAS,
  BRANCH_GRID,
  buildZiweiReading,
  gridAreaFor,
  PALACE_LABELS,
  toTimeIndex,
} from "../ziwei";

const DEFAULT_FORM = {
  name: "",
  date: "1995-02-23",
  time: "17:00",
  gender: "male",
  calendar: "solar",
  leap: false,
};

function computeChart(form) {
  const timeIndex = toTimeIndex(form.time);
  if (form.calendar === "lunar") {
    return astro.byLunar(
      form.date,
      timeIndex,
      form.gender,
      form.leap,
      true,
      "vi-VN",
    );
  }
  return astro.bySolar(form.date, timeIndex, form.gender, true, "vi-VN");
}

function initialChart() {
  try {
    return computeChart(DEFAULT_FORM);
  } catch {
    return null;
  }
}

function PalaceCell({ palace, branch }) {
  if (!palace) {
    return (
      <div
        className="ziwei-palace is-empty"
        style={{ gridArea: gridAreaFor(branch) }}
      />
    );
  }

  const majors = palace.majorStars ?? [];
  const minors = palace.minorStars ?? [];
  const adjectives = palace.adjectiveStars ?? [];
  const isLife = palace.name === "Mệnh";

  return (
    <article
      className={`ziwei-palace ${isLife ? "is-life" : ""} ${
        palace.isBodyPalace ? "is-body" : ""
      }`}
      style={{ gridArea: gridAreaFor(branch) }}
    >
      <header>
        <span className="palace-branch">{branch}</span>
        <span className="palace-name" title={PALACE_LABELS[palace.name] || palace.name}>
          {palace.name}
        </span>
      </header>

      <div className="palace-stars">
        {majors.length ? (
          majors.map((star) => (
            <span
              key={star.name}
              className={`major-star ${star.mutagen ? `mutagen-${star.mutagen}` : ""}`}
            >
              <b>{star.name}</b>
              {star.brightness ? <small>{star.brightness}</small> : null}
              {star.mutagen ? <i>{star.mutagen}</i> : null}
            </span>
          ))
        ) : (
          <span className="no-star">no major star</span>
        )}
      </div>

      <div className="palace-minor">
        {minors.map((star) => (
          <span key={star.name}>{star.name}</span>
        ))}
      </div>

      <div className="palace-adjective">
        {adjectives.slice(0, 4).map((star) => (
          <span key={star.name}>{star.name}</span>
        ))}
        {adjectives.length > 4 ? <span>+{adjectives.length - 4}</span> : null}
      </div>

      <footer>
        <span>
          {palace.decadal?.range?.[0]}–{palace.decadal?.range?.[1]}
        </span>
        {palace.isBodyPalace ? <span className="body-flag">Thân</span> : null}
      </footer>
    </article>
  );
}

export default function ZiweiFeature() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [astrolabe, setAstrolabe] = useState(initialChart);
  const [isSample, setIsSample] = useState(true);
  const [error, setError] = useState("");

  const reading = astrolabe ? buildZiweiReading(astrolabe) : null;

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      const chart = computeChart(form);
      setAstrolabe(chart);
      setIsSample(false);
    } catch (chartError) {
      setError(chartError?.message || "Could not calculate this chart.");
    }
  }

  return (
    <div className="feature layout">
      <section className="panel" aria-label="Zi Wei chart settings">
        <p className="panel-eyebrow">Zi Wei Dou Shu</p>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="ziwei-name">Name (optional)</label>
            <input
              id="ziwei-name"
              type="text"
              maxLength={80}
              value={form.name}
              onChange={(event) => update("name", event.target.value)}
              placeholder="Whose chart is this?"
            />
          </div>

          <fieldset className="field">
            <legend>Calendar</legend>
            <div className="segmented">
              <label className={form.calendar === "solar" ? "is-active" : ""}>
                <input
                  type="radio"
                  name="ziwei-calendar"
                  value="solar"
                  checked={form.calendar === "solar"}
                  onChange={() => update("calendar", "solar")}
                />
                Solar
              </label>
              <label className={form.calendar === "lunar" ? "is-active" : ""}>
                <input
                  type="radio"
                  name="ziwei-calendar"
                  value="lunar"
                  checked={form.calendar === "lunar"}
                  onChange={() => update("calendar", "lunar")}
                />
                Lunar
              </label>
            </div>
          </fieldset>

          <div className="field">
            <label htmlFor="ziwei-date">
              {form.calendar === "lunar" ? "Lunar birth date" : "Birth date"}
            </label>
            <input
              id="ziwei-date"
              type="date"
              required
              min="1900-01-01"
              max="2100-12-31"
              value={form.date}
              onChange={(event) => update("date", event.target.value)}
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="ziwei-time">Birth time</label>
              <input
                id="ziwei-time"
                type="time"
                required
                value={form.time}
                onChange={(event) => update("time", event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="ziwei-gender">Gender</label>
              <select
                id="ziwei-gender"
                value={form.gender}
                onChange={(event) => update("gender", event.target.value)}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          {form.calendar === "lunar" ? (
            <label className="check-line">
              <input
                type="checkbox"
                checked={form.leap}
                onChange={(event) => update("leap", event.target.checked)}
              />
              Leap month
            </label>
          ) : null}

          <button type="submit" className="btn btn-primary">
            Cast the chart
          </button>
          <p className="hint">
            Birth time sets the hour pillar. If unsure, use the nearest two-hour
            period.
          </p>
        </form>
      </section>

      <section className="stage ziwei-stage" aria-live="polite">
        {error ? (
          <div className="error" role="alert">
            <strong>Something went wrong.</strong> {error}
          </div>
        ) : null}

        <div className="stage-head">
          <div>
            <p className="eyebrow">Twelve Palaces</p>
            <h2>{form.name ? `${form.name}'s chart` : "Zi Wei chart"}</h2>
          </div>
          {isSample ? <span className="chip">Sample chart</span> : null}
        </div>

        {astrolabe ? (
          <>
            <div className="ziwei-board-wrap">
              <div
                className="ziwei-board"
                style={{ gridTemplateAreas: BOARD_AREAS }}
              >
                {BRANCH_GRID.flat().map((branch) =>
                  branch ? (
                    <PalaceCell
                      key={branch}
                      branch={branch}
                      palace={astrolabe.palaces.find(
                        (palace) => palace.earthlyBranch === branch,
                      )}
                    />
                  ) : null,
                )}

                <div className="ziwei-center" style={{ gridArea: "center" }}>
                  <p className="eyebrow">Five Elements</p>
                  <h3>{astrolabe.fiveElementsClass}</h3>
                  <dl className="center-meta">
                    <div>
                      <dt>Solar</dt>
                      <dd>{astrolabe.solarDate}</dd>
                    </div>
                    <div>
                      <dt>Lunar</dt>
                      <dd>{astrolabe.lunarDate}</dd>
                    </div>
                    <div>
                      <dt>Pillars</dt>
                      <dd>{astrolabe.chineseDate}</dd>
                    </div>
                    <div>
                      <dt>Hour</dt>
                      <dd>
                        {astrolabe.time} · {astrolabe.timeRange}
                      </dd>
                    </div>
                    <div>
                      <dt>Zodiac</dt>
                      <dd>
                        {astrolabe.zodiac} · {astrolabe.sign}
                      </dd>
                    </div>
                    <div>
                      <dt>Soul / Body</dt>
                      <dd>
                        {astrolabe.soul} / {astrolabe.body}
                      </dd>
                    </div>
                  </dl>
                  {isSample ? (
                    <p className="center-note">
                      Sample birth data — enter your own details to replace it.
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
            <p className="scroll-hint">Scroll sideways to see all twelve palaces.</p>

            {reading ? (
              <div className="reading-notes ziwei-reading">
                <h3>Reading</h3>
                {reading.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}

                <div className="key-palaces">
                  {reading.keyPalaces.map((palace) => (
                    <article key={palace.name} className="key-palace">
                      <header>
                        <strong>{palace.name}</strong>
                        <span>{palace.branch}</span>
                      </header>
                      <p className="key-label">{palace.label}</p>
                      <p className="key-stars">{palace.stars}</p>
                      <p className="key-note">{palace.note}</p>
                    </article>
                  ))}
                </div>

                {reading.transformations.length ? (
                  <div className="transformation-list">
                    <h4>Four Transformations</h4>
                    <div className="chips">
                      {reading.transformations.map((item) => (
                        <span className="chip" key={`${item.star}-${item.mutagen}`}>
                          {item.star} · {item.mutagen}
                        </span>
                      ))}
                    </div>
                    <p>
                      {reading.transformations
                        .map((item) => `${item.mutagen} = ${item.note}`)
                        .join(" · ")}
                    </p>
                  </div>
                ) : null}

                <p className="fine">
                  Zi Wei Dou Shu is a traditional lens for reflection. Read
                  strong palaces as resources and challenged ones as practices,
                  not verdicts.
                </p>
              </div>
            ) : null}
          </>
        ) : (
          <div className="empty-state">
            <p>Enter birth details to draw the twelve palaces.</p>
          </div>
        )}
      </section>
    </div>
  );
}
