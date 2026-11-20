import { useMemo, useState } from "react";
import { fetchNatalChart, formatError } from "../api";
import {
  buildAstroReading,
  CITY_PRESETS,
  formatPoint,
  ordinal,
  planetGlyph,
  signInfo,
} from "../astrology";

const DEFAULT_FORM = {
  name: "",
  date: "1995-02-23",
  time: "17:00",
  city: "Hanoi",
  lat: "21.0278",
  lng: "105.8342",
  tz: "Asia/Ho_Chi_Minh",
};

const API_HINT = "Start the API with: python3 web/server.py";

export default function AstroFeature() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const reading = useMemo(
    () => (result ? buildAstroReading(result) : null),
    [result],
  );

  const chartSrc = useMemo(
    () =>
      result?.svg
        ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(result.svg)}`
        : "",
    [result],
  );

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleCity(city) {
    const preset = CITY_PRESETS.find((item) => item.city === city);
    if (!preset) {
      setForm((current) => ({ ...current, city: "Custom" }));
      return;
    }
    setForm((current) => ({
      ...current,
      city: preset.city,
      lat: String(preset.lat),
      lng: String(preset.lng),
      tz: preset.tz,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await fetchNatalChart({
        ...form,
        lat: Number(form.lat),
        lng: Number(form.lng),
      });
      setResult(data);
    } catch (chartError) {
      setError(formatError(chartError, API_HINT));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="feature layout">
      <section className="panel" aria-label="Natal chart settings">
        <p className="panel-eyebrow">Natal Chart</p>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="astro-name">Name (optional)</label>
            <input
              id="astro-name"
              type="text"
              maxLength={80}
              value={form.name}
              onChange={(event) => update("name", event.target.value)}
              placeholder="Whose chart is this?"
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="astro-date">Birth date</label>
              <input
                id="astro-date"
                type="date"
                required
                min="1900-01-01"
                max="2100-12-31"
                value={form.date}
                onChange={(event) => update("date", event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="astro-time">Birth time</label>
              <input
                id="astro-time"
                type="time"
                required
                value={form.time}
                onChange={(event) => update("time", event.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="astro-city">Birthplace</label>
            <select
              id="astro-city"
              value={form.city}
              onChange={(event) => handleCity(event.target.value)}
            >
              {CITY_PRESETS.map((preset) => (
                <option key={preset.city} value={preset.city}>
                  {preset.city}
                </option>
              ))}
              <option value="Custom">Custom location</option>
            </select>
          </div>

          {form.city === "Custom" ? (
            <>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="astro-lat">Latitude</label>
                  <input
                    id="astro-lat"
                    type="number"
                    step="0.0001"
                    min="-90"
                    max="90"
                    required
                    value={form.lat}
                    onChange={(event) => update("lat", event.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="astro-lng">Longitude</label>
                  <input
                    id="astro-lng"
                    type="number"
                    step="0.0001"
                    min="-180"
                    max="180"
                    required
                    value={form.lng}
                    onChange={(event) => update("lng", event.target.value)}
                  />
                </div>
              </div>
              <div className="field">
                <label htmlFor="astro-tz">Timezone</label>
                <input
                  id="astro-tz"
                  type="text"
                  required
                  value={form.tz}
                  onChange={(event) => update("tz", event.target.value)}
                  placeholder="Asia/Ho_Chi_Minh"
                />
              </div>
            </>
          ) : (
            <p className="hint">
              {form.lat}, {form.lng} · {form.tz}
            </p>
          )}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Calculating…" : "Calculate the chart"}
          </button>
          <p className="hint">
            An exact birth time matters most for the Ascendant and the houses.
          </p>
        </form>
      </section>

      <section className="stage astro-stage" aria-live="polite">
        {error ? (
          <div className="error" role="alert">
            <strong>Something went wrong.</strong> {error}
          </div>
        ) : null}

        <div className="stage-head">
          <div>
            <p className="eyebrow">
              {loading ? "Calculating" : result ? "Your wheel" : "Ready"}
            </p>
            <h2>{form.name ? `${form.name}'s chart` : "Natal chart"}</h2>
          </div>
          {reading?.bigThree.length ? (
            <div className="chips">
              {reading.bigThree.map((item) => (
                <span className="chip" key={item.label}>
                  {item.label} · {item.sign}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {result && reading ? (
          <>
            <div className="astro-top">
              <figure className="chart-figure">
                <img src={chartSrc} alt={`Natal chart wheel for ${result.name}`} />
                <figcaption>
                  {result.local_datetime} · {result.city} ·{" "}
                  {result.houses_system}
                </figcaption>
              </figure>

              <div className="astro-reading">
                <h3>Reading</h3>
                {reading.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}

                <div className="balance-grid">
                  <div>
                    <h4>Elements</h4>
                    {reading.elementBars.map((bar) => (
                      <div className="balance-row" key={bar.label}>
                        <span>{bar.label}</span>
                        <div className="balance-track">
                          <span
                            className={`balance-fill element-${bar.label.toLowerCase()}`}
                            style={{ width: `${bar.value}%` }}
                          />
                        </div>
                        <b>{bar.value}%</b>
                      </div>
                    ))}
                  </div>
                  <div>
                    <h4>Modes</h4>
                    {reading.qualityBars.map((bar) => (
                      <div className="balance-row" key={bar.label}>
                        <span>{bar.label}</span>
                        <div className="balance-track">
                          <span
                            className="balance-fill"
                            style={{ width: `${bar.value}%` }}
                          />
                        </div>
                        <b>{bar.value}%</b>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="big-three">
              {reading.bigThree.map((item) => (
                <article className="big-card" key={item.label}>
                  <p className="big-label">
                    {item.label} <span>{item.role}</span>
                  </p>
                  <p className="big-sign">
                    <span className="glyph">{item.glyph}</span>
                    {item.sign}
                  </p>
                  <p className="big-meta">
                    {item.degree}° · house {item.house}
                  </p>
                  <p className="big-trait">{item.trait}</p>
                </article>
              ))}
            </div>

            <div className="table-block">
              <h3>Planet positions</h3>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Point</th>
                      <th>Sign</th>
                      <th>Degree</th>
                      <th>House</th>
                      <th>Motion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.points.map((point) => {
                      const sign = signInfo(point.sign);
                      return (
                        <tr key={point.name}>
                          <th>
                            <span className="glyph">
                              {planetGlyph(point.name)}
                            </span>
                            {point.name}
                          </th>
                          <td>
                            <span className="glyph">{sign.glyph}</span>
                            {sign.name}
                          </td>
                          <td>{point.degree}°</td>
                          <td>{point.house ? `${point.house}${ordinal(point.house)}` : "—"}</td>
                          <td>{point.retrograde ? "Retrograde" : "Direct"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="astro-details">
              <details>
                <summary>House cusps</summary>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>House</th>
                        <th>Sign</th>
                        <th>Degree</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.houses.map((house) => (
                        <tr key={house.house}>
                          <th>
                            {house.house}
                            {ordinal(house.house)} house
                          </th>
                          <td>
                            {signInfo(house.sign).glyph} {signInfo(house.sign).name}
                          </td>
                          <td>{house.degree}°</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>

              <details>
                <summary>Aspects ({result.aspects.length})</summary>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Between</th>
                        <th>Aspect</th>
                        <th>Orb</th>
                        <th>Phase</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.aspects.map((aspect) => (
                        <tr key={`${aspect.from}-${aspect.to}-${aspect.aspect}`}>
                          <td>
                            {formatPoint(aspect.from)} — {formatPoint(aspect.to)}
                          </td>
                          <td>{aspect.aspect}</td>
                          <td>{aspect.orb}°</td>
                          <td>{aspect.movement}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            </div>

            <p className="fine">
              A natal chart is a symbolic map, not a forecast. It describes
              tendencies to work with, not events that must happen.
            </p>
          </>
        ) : (
          <div className="empty-state">
            <p>
              Enter birth date, time, and place. The chart wheel, planets,
              houses, and aspects appear here.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
