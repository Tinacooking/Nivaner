import highPriestessJpg from "../assets/high-priestess-card.jpg";
import highPriestessWebp from "../assets/high-priestess-card.webp";
import { SYSTEMS } from "../systems";
import {
  CelestialDivider,
  SystemIcon,
  TarotPlate,
} from "./CelestialArt";

function Reveal({ children }) {
  return <div className="cg-reveal is-visible">{children}</div>;
}

const RITUAL_STEPS = [
  {
    number: "01",
    title: "Enter with one real question.",
    text: "A question with a living edge gives the symbols something to hold. Keep it plain enough to recognize an answer.",
  },
  {
    number: "02",
    title: "Let the image finish forming.",
    text: "The interfaces are quiet by design. Read the whole spread before reaching for the first thing that comforts you.",
  },
  {
    number: "03",
    title: "Take only what is yours.",
    text: "A reading is a lens, not a sentence. Carry the useful image into the week and leave the rest on the table.",
  },
];

export default function HomePage({ onNavigate }) {
  return (
    <div className="home">
      <section className="cg-hero">
        <div className="cg-hero-blue-band">
          <span className="hero-sky-frame" aria-hidden="true" />
          <span className="sky-cloud sky-cloud-a" aria-hidden="true" />
          <span className="sky-cloud sky-cloud-b" aria-hidden="true" />
          <span className="sky-cloud sky-cloud-c" aria-hidden="true" />

          <div className="cg-container">
            <div className="cg-grid-12 hero-grid">
              <div className="cg-col-7">
                <div className="cg-card hero-card">
                  <div className="hero-kicker">
                    <span>NIRVANER</span>
                    <span className="cg-roman">VOL. I · MMXXVI</span>
                  </div>
                  <p className="cg-eyebrow">
                    <span className="cg-roman">ISSUE II ·</span>
                    The Inner Veil
                  </p>
                  <h1 className="cg-hero-title">
                    Cross the clear line into <em>the quiet.</em>
                  </h1>
                  <p className="hero-body">
                    A Himalayan atlas for four old languages of reflection.
                    Draw a tarot spread, map twelve Zi Wei palaces, cast six I
                    Ching lines, or read the sky at your first breath.
                  </p>
                  <div className="hero-actions">
                    <button
                      type="button"
                      className="cg-btn cg-btn-primary"
                      onClick={() => onNavigate("tarot")}
                    >
                      Enter the Tarot Chamber
                    </button>
                    <button
                      type="button"
                      className="cg-btn cg-btn-ghost"
                      onClick={() =>
                        document
                          .getElementById("four-mirrors")
                          ?.scrollIntoView({ behavior: "smooth", block: "start" })
                      }
                    >
                      Explore the Four Gates
                    </button>
                  </div>
                  <div className="hero-note">
                    <span className="cg-roman">FOUR ORACLES</span>
                    <span>No accounts · No verdicts · Your judgment stays yours</span>
                  </div>
                </div>
              </div>

              <div className="cg-col-5 cg-hero-art-wrap">
                <div className="hero-art-stage">
                  <div className="hero-art-index" aria-hidden="true">
                    <span>II</span>
                    <span>THE INNER VEIL</span>
                  </div>
                  <div className="cg-art-float hero-art-wrap">
                    <picture className="hero-art-picture">
                      <source srcSet={highPriestessWebp} type="image/webp" />
                      <img
                        className="hero-art-image"
                        src={highPriestessJpg}
                        alt="The High Priestess seated on a lotus beneath a golden halo"
                        width="467"
                        height="834"
                        decoding="async"
                      />
                    </picture>
                  </div>
                  <p className="hero-art-note">
                    <span className="cg-roman">DRAWN IN LINE</span>
                    A card for the keeper of thresholds
                  </p>
                </div>
              </div>
            </div>

            <nav className="service-ribbon" aria-label="The four oracles">
              <p className="service-ribbon-label">
                Four oracles
                <span>One clear sky</span>
              </p>
              {SYSTEMS.map((system) => (
                <button
                  key={system.key}
                  type="button"
                  className="service-ribbon-link"
                  data-system={system.key}
                  onClick={() => onNavigate(system.key)}
                >
                  <span className="service-ribbon-index">{system.index}</span>
                  <span className="service-ribbon-copy">
                    <strong>{system.label}</strong>
                    <small>{system.caption}</small>
                  </span>
                  <span className="service-ribbon-arrow" aria-hidden="true">
                    ↗
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </section>

      <section className="cg-section home-systems" id="four-mirrors">
        <div className="cg-container">
          <Reveal>
            <div className="section-heading">
              <div>
                <p className="cg-eyebrow">
                  <span className="cg-roman">I ·</span>
                  The Four Gates
                </p>
                <h2 className="cg-h2">Four doors beneath one clear sky.</h2>
              </div>
              <p className="section-heading-note">
                Each system has its own grammar. Enter the one that meets the
                question you are carrying, or move between them and listen for
                the image they share.
              </p>
            </div>

            <div className="home-system-grid">
              {SYSTEMS.map((system) => (
                <button
                  key={system.key}
                  type="button"
                  className="system-card"
                  data-system={system.key}
                  onClick={() => onNavigate(system.key)}
                >
                  <span className="system-card-head">
                    <span className="system-card-index">
                      <span className="cg-roman">{system.index}</span>
                      <span>{system.caption}</span>
                    </span>
                    <span className="system-icon-shell">
                      <SystemIcon name={system.icon} size={58} />
                    </span>
                  </span>
                  <span className="system-title">{system.label}</span>
                  <span className="system-caption">{system.eyebrow}</span>
                  <span className="system-blurb">{system.blurb}</span>
                  <span className="system-link">
                    {system.action}
                    <span aria-hidden="true">→</span>
                  </span>
                </button>
              ))}
            </div>

            <p className="system-footnote">
              Every draw accepts a seed, so a reading can be returned to, shared,
              and studied again.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="cg-section home-ritual">
        <div className="cg-container">
          <Reveal>
            <div className="ritual-shell">
              <div className="ritual-art-wrap">
                <div className="cg-antique-frame ritual-frame">
                  <div className="ritual-plate">
                    <span className="cg-roman">II · THE HIGH PRIESTESS</span>
                    <TarotPlate variant="priestess" width={214} />
                    <p>The veil parts when the question is ready.</p>
                  </div>
                </div>
              </div>

              <div className="ritual-copy">
                <p className="cg-eyebrow">
                  <span className="cg-roman">II ·</span>
                  A Note Before You Draw
                </p>
                <h2 className="cg-h2">The lotus opens without being forced.</h2>
                <p className="cg-lead ritual-lead">
                  The cards, palaces, lines, and planets do not remove your
                  agency. They give shape to what is already stirring, so you can
                  meet it with more attention.
                </p>
                <ol className="ritual-list">
                  {RITUAL_STEPS.map((step) => (
                    <li key={step.number}>
                      <span className="ritual-number">{step.number}</span>
                      <span>
                        <strong>{step.title}</strong>
                        <span>{step.text}</span>
                      </span>
                    </li>
                  ))}
                </ol>
                <button
                  type="button"
                  className="cg-btn cg-btn-light"
                  onClick={() => onNavigate("tarot")}
                >
                  Begin with a Tarot Draw
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="home-coda">
        <span className="coda-orbit coda-orbit-a" aria-hidden="true" />
        <span className="coda-orbit coda-orbit-b" aria-hidden="true" />
        <div className="cg-container">
          <CelestialDivider label="THE INNER VEIL" />
          <p className="coda-line">
            “The symbol does not decide. It clears the air in which you decide.”
          </p>
          <p className="coda-note">NIRVANER · A house note</p>
        </div>
      </section>
    </div>
  );
}
