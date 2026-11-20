import { SystemIcon } from "./CelestialArt";

export default function PageIntro({ system }) {
  return (
    <header className="page-intro">
      <div className="page-intro-copy">
        <p className="cg-eyebrow">
          <span className="cg-roman">{system.index} ·</span>
          {system.eyebrow}
        </p>
        <h1>{system.label}</h1>
        <p className="cg-lead">{system.lead}</p>
      </div>
      <div className="page-intro-mark" aria-hidden="true">
        <span className="page-intro-halo" />
        <span className="page-intro-icon">
          <SystemIcon name={system.icon} size={82} />
        </span>
        <span className="cg-roman">{system.caption}</span>
      </div>
    </header>
  );
}
