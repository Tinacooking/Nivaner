import { lazy, Suspense, useEffect, useState } from "react";
import AstroFeature from "./features/AstroFeature";
import IChingFeature from "./features/IChingFeature";
import TarotFeature from "./features/TarotFeature";
import HomePage from "./components/HomePage";
import PageIntro from "./components/PageIntro";
import { CelestialDivider, CelestialEmblem } from "./components/CelestialArt";
import { NAV_ITEMS, SYSTEMS } from "./systems";

const ZiweiFeature = lazy(() => import("./features/ZiweiFeature"));

const FEATURES = {
  tarot: TarotFeature,
  ziwei: ZiweiFeature,
  iching: IChingFeature,
  astro: AstroFeature,
};

const PAGE_TITLES = {
  sanctuary: "NIRVANER — A Himalayan Atlas",
  tarot: "Tarot · NIRVANER",
  ziwei: "Zi Wei · NIRVANER",
  iching: "I Ching · NIRVANER",
  astro: "Natal Chart · NIRVANER",
};

function SiteHeader({ active, menuOpen, onNavigate, onToggleMenu }) {
  return (
    <header className="site-header">
      <div className="cg-container site-header-inner">
        <button
          type="button"
          className="brand"
          aria-label="NIRVANER — return to Sanctuary"
          onClick={() => onNavigate("sanctuary")}
        >
          <span className="brand-emblem">
            <CelestialEmblem size={38} />
          </span>
          <span className="brand-copy">
            <span className="brand-title">NIRVANER</span>
            <span className="brand-sub">A Himalayan Atlas</span>
          </span>
        </button>

        <nav className="site-nav" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              id={`tab-${item.key}`}
              className="nav-link"
              data-system={item.key}
              aria-current={active === item.key ? "page" : undefined}
              aria-controls={
                item.key === "sanctuary" ? undefined : `panel-${item.key}`
              }
              onClick={() => onNavigate(item.key)}
            >
              <span className="nav-dot" aria-hidden="true" />
              {item.label}
            </button>
          ))}
        </nav>

        <button
          type="button"
          className="mobile-toggle"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={onToggleMenu}
        >
          <span>{menuOpen ? "Close" : "Menu"}</span>
          <span className={`menu-glyph ${menuOpen ? "is-open" : ""}`} aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
      </div>

      {menuOpen ? (
        <nav className="mobile-drawer" id="mobile-navigation" aria-label="Mobile">
          {NAV_ITEMS.map((item, index) => (
            <button
              key={item.key}
              type="button"
              className="mobile-nav-link"
              data-system={item.key}
              aria-current={active === item.key ? "page" : undefined}
              onClick={() => onNavigate(item.key)}
            >
              <span className="cg-roman">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{item.label}</span>
              <span className="mobile-nav-arrow" aria-hidden="true">↗</span>
            </button>
          ))}
        </nav>
      ) : null}
    </header>
  );
}

function SiteFooter({ onNavigate }) {
  return (
    <footer className="site-footer">
      <div className="cg-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <span className="footer-emblem">
              <CelestialEmblem size={46} />
            </span>
            <div>
              <p className="footer-title">NIRVANER</p>
              <p className="footer-tagline">
                Four symbolic languages beneath one clear sky. Each reading is a
                lens; your choices still hold the pen.
              </p>
            </div>
          </div>

          <nav className="footer-nav" aria-label="Footer">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                type="button"
                className="footer-link"
                data-system={item.key}
                onClick={() => onNavigate(item.key)}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="footer-credits">
            <p className="footer-heading">Engines</p>
            <p>
              ekelen/tarot-api · SylarLong/iztro · kentang2017/ichingshifa ·
              g-battaglia/kerykeion
            </p>
            <p className="fine">
              For reflection only. Not medical, legal, financial, or major-life
              advice.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="cg-roman">MMXXVI · NIRVANER</span>
          <span>A Himalayan atlas for unhurried questions.</span>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [active, setActive] = useState("sanctuary");
  const [menuOpen, setMenuOpen] = useState(false);
  const [visited, setVisited] = useState({});

  useEffect(() => {
    document.title = PAGE_TITLES[active] ?? PAGE_TITLES.sanctuary;
  }, [active]);

  useEffect(() => {
    function handleKey(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  function navigate(key) {
    setActive(key);
    if (key !== "sanctuary") {
      setVisited((current) =>
        current[key] ? current : { ...current, [key]: true },
      );
    }
    setMenuOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <SiteHeader
        active={active}
        menuOpen={menuOpen}
        onNavigate={navigate}
        onToggleMenu={() => setMenuOpen((open) => !open)}
      />

      <main id="main-content" className="site-main">
        <section
          className={`page page-home ${active === "sanctuary" ? "is-active" : ""}`}
          hidden={active !== "sanctuary"}
        >
          <HomePage onNavigate={navigate} />
        </section>

        {SYSTEMS.map((system) => {
          const Feature = FEATURES[system.key];
          return (
            <section
              key={system.key}
              id={`panel-${system.key}`}
              className={`page feature-page ${
                active === system.key ? "is-active" : ""
              }`}
              aria-labelledby={`tab-${system.key}`}
              hidden={active !== system.key}
            >
              <div className="cg-container">
                <PageIntro system={system} />
                <CelestialDivider label={system.divider} />
                {visited[system.key] ? (
                  <Suspense
                    fallback={
                      <p className="feature-loading">
                        Drawing the palace chart…
                      </p>
                    }
                  >
                    <Feature />
                  </Suspense>
                ) : null}
              </div>
            </section>
          );
        })}
      </main>

      <SiteFooter onNavigate={navigate} />
    </div>
  );
}
