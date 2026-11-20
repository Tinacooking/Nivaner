import { cardParts } from "../tarot";

export default function CardView({ card, index, placeholder = false }) {
  const reversed = card?.orientation === "Reversed";
  const parts = card?.card ? cardParts(card.card) : null;

  const label = placeholder
    ? `${card?.position ?? "Card"} — face down`
    : `${card.position}: ${card.card}, ${card.orientation}`;

  return (
    <div
      className="card-slot"
      style={{ "--delay": `${index * 80}ms` }}
      role="group"
      aria-label={label}
    >
      <div className="slot-head">
        <span className="slot-index">{String(index + 1).padStart(2, "0")}</span>
        <span className="slot-position">{card?.position}</span>
      </div>

      <div
        className={[
          "tarot-card",
          placeholder ? "is-back" : "",
          reversed ? "is-reversed" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {placeholder ? (
          <div className="card-back" aria-hidden="true">
            <span>☾</span>
          </div>
        ) : (
          <div className="card-face">
            <span className="card-mark">{parts.mark}</span>
            <span className="card-title">{parts.title}</span>
            <span className="card-sub">{parts.label}</span>
          </div>
        )}
      </div>

      <div className="slot-foot">
        {placeholder ? (
          <span className="orientation is-muted">Face down</span>
        ) : (
          <span className={`orientation ${reversed ? "is-reversed" : ""}`}>
            {card.orientation}
          </span>
        )}
      </div>
    </div>
  );
}
