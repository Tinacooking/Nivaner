const INK = "#16191E";
const SKY = "#93C6E4";
const BLUE = "#5A9BC7";
const DEEP = "#4B8BB8";
const CLOUD = "#EBF4FA";
const CLOUD_SOFT = "#E4EEF5";
const CREAM = "#F8FAFC";
const MAGENTA = "#D6497A";
const PINK = "#E87A9F";
const HALO = "#EAB8CE";
const GOLD = "#E8C547";
const TEAL = "#12A8B8";
const SKIN = "#D99666";

function StarMark({ x, y, size = 6, fill = GOLD, stroke = INK, width = 1 }) {
  return (
    <path
      d={`M${x} ${y - size}L${x + size * 0.3} ${y - size * 0.3}L${x + size} ${y}L${x + size * 0.3} ${y + size * 0.3}L${x} ${y + size}L${x - size * 0.3} ${y + size * 0.3}L${x - size} ${y}L${x - size * 0.3} ${y - size * 0.3}Z`}
      fill={fill}
      stroke={stroke}
      strokeWidth={width}
      strokeLinejoin="round"
    />
  );
}

export function CelestialEmblem({ size = 30 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className="emblem-art"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="20" cy="20" r="18" fill={CLOUD} stroke={INK} strokeWidth="1.4" />
      <circle
        cx="20"
        cy="20"
        r="14"
        stroke={TEAL}
        strokeWidth="0.9"
        strokeDasharray="2 3"
        className="emblem-orbit"
      />
      <g className="emblem-rays">
        <path
          d="M25 9V12M25 25V28M17 18.5H14M36 18.5H33M30.7 12.2L28.6 14.3M21.4 21.5L19.3 23.6M30.7 24.8L28.6 22.7M21.4 15.5L19.3 13.4"
          stroke={INK}
          strokeWidth="0.9"
          strokeLinecap="round"
        />
      </g>
      <circle cx="25" cy="18.5" r="6.2" fill={GOLD} stroke={INK} strokeWidth="1.2" />
      <path
        d="M19 13.8C13.8 15 10.7 20 11.6 25.2C12.4 29.7 16 33 20.5 33.4C16.9 35 12.5 33.5 10.2 30C7.8 26.3 8.8 21.1 12.4 18.5C14.2 17.2 16.5 16.7 19 16.8V13.8Z"
        fill={MAGENTA}
        stroke={INK}
        strokeWidth="1.15"
        strokeLinejoin="round"
      />
      <path
        d="M20 36C22.4 33.4 25.3 33.4 28 36C25.3 38.1 22.4 38.1 20 36Z"
        fill={PINK}
        stroke={INK}
        strokeWidth="0.9"
      />
      <circle cx="27.7" cy="16.8" r="1.1" fill={CREAM} />
    </svg>
  );
}

export function CelestialDivider({ label }) {
  return (
    <div className="cg-divider" role="separator">
      <span className="cg-divider-line" />
      <span className="divider-seal">
        <CelestialEmblem size={25} />
      </span>
      {label ? <span className="cg-roman">{label}</span> : null}
      <span className="cg-divider-line" />
    </div>
  );
}

export function SystemIcon({ name, size = 54 }) {
  const accent =
    name === "cards"
      ? MAGENTA
      : name === "palaces"
        ? GOLD
        : name === "lines"
          ? TEAL
          : DEEP;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="32" cy="32" r="31" fill={CLOUD} stroke={INK} strokeWidth="1.5" />
      <circle
        cx="32"
        cy="32"
        r="26"
        stroke={accent}
        strokeWidth="0.9"
        strokeDasharray="2 3.4"
      />
      {name === "cards" ? (
        <>
          <rect
            x="25"
            y="15"
            width="22"
            height="32"
            rx="1.5"
            transform="rotate(7 25 15)"
            fill={CLOUD_SOFT}
            stroke={INK}
            strokeWidth="1.4"
          />
          <rect
            x="18"
            y="17"
            width="22"
            height="32"
            rx="1.5"
            transform="rotate(-7 18 17)"
            fill={MAGENTA}
            stroke={INK}
            strokeWidth="1.4"
          />
          <path
            d="M29 24L30.8 30.2L37 32L30.8 33.8L29 40L27.2 33.8L21 32L27.2 30.2L29 24Z"
            fill={GOLD}
            stroke={INK}
            strokeWidth="1"
            strokeLinejoin="round"
          />
          <circle cx="40" cy="20" r="2.4" fill={PINK} stroke={INK} strokeWidth="1" />
        </>
      ) : null}
      {name === "palaces" ? (
        <>
          <rect x="15" y="15" width="34" height="34" fill={CLOUD_SOFT} stroke={INK} strokeWidth="1.4" />
          <path d="M26.3 15V49M37.7 15V49M15 26.3H49M15 37.7H49" stroke={INK} strokeWidth="1" />
          <rect x="26.3" y="26.3" width="11.4" height="11.4" fill={GOLD} fillOpacity="0.85" />
          <path
            d="M32 28.5C34.5 30.5 34.5 33 32 34.5C29.5 33 29.5 30.5 32 28.5Z"
            fill={MAGENTA}
            stroke={INK}
            strokeWidth="0.8"
          />
          <circle cx="20.6" cy="20.6" r="2" fill={PINK} stroke={INK} strokeWidth="0.9" />
          <circle cx="43.4" cy="43.4" r="2" fill={TEAL} stroke={INK} strokeWidth="0.9" />
        </>
      ) : null}
      {name === "lines" ? (
        <>
          <path d="M17 19H47" stroke={INK} strokeWidth="3.4" strokeLinecap="square" />
          <path d="M17 25H29M35 25H47" stroke={INK} strokeWidth="3.4" />
          <path d="M17 31H47" stroke={INK} strokeWidth="3.4" />
          <path d="M17 37H29M35 37H47" stroke={TEAL} strokeWidth="3.4" />
          <path d="M17 43H47" stroke={INK} strokeWidth="3.4" />
          <circle cx="50.5" cy="37" r="2.2" fill={GOLD} stroke={INK} strokeWidth="0.9" />
        </>
      ) : null}
      {name === "wheel" ? (
        <>
          <circle cx="32" cy="32" r="18" stroke={INK} strokeWidth="1.4" />
          <circle cx="32" cy="32" r="13" stroke={TEAL} strokeWidth="1" strokeDasharray="2 3" />
          <circle cx="32" cy="32" r="3.4" fill={GOLD} stroke={INK} strokeWidth="1" />
          <path
            d="M32 14V19M32 45V50M14 32H19M45 32H50M19.3 19.3L22.8 22.8M41.2 41.2L44.7 44.7M44.7 19.3L41.2 22.8M22.8 41.2L19.3 44.7"
            stroke={INK}
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <StarMark x={46} y={18} size={5} fill={MAGENTA} width={0.8} />
        </>
      ) : null}
    </svg>
  );
}

export function TarotPlate({ variant = "moon", width = 210 }) {
  const height = Math.round((width * 290) / 200);
  const archFill =
    variant === "sun" || variant === "empress"
      ? GOLD
      : variant === "star"
        ? DEEP
        : variant === "priestess"
          ? SKY
          : BLUE;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 290"
      fill="none"
      className="tarot-plate"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="4" y="4" width="192" height="282" fill={CREAM} stroke={INK} strokeWidth="2" />
      <rect x="11" y="11" width="178" height="268" fill={CLOUD} stroke={INK} strokeWidth="0.9" />
      <path
        d="M23 276V105C23 61 57 29 100 29C143 29 177 61 177 105V276H23Z"
        fill={archFill}
        stroke={INK}
        strokeWidth="1.5"
      />
      <path
        d="M31 276V107C31 67 62 37 100 37C138 37 169 67 169 107V276"
        stroke={CREAM}
        strokeWidth="0.8"
        strokeDasharray="2 3"
        opacity="0.9"
      />

      {variant === "priestess" ? (
        <>
          <circle cx="100" cy="111" r="48" fill={HALO} fillOpacity="0.75" />
          <circle cx="100" cy="111" r="41" fill={GOLD} stroke={INK} strokeWidth="1.2" />
          <circle cx="100" cy="111" r="32" fill={CLOUD} stroke={INK} strokeWidth="1" />
          {Array.from({ length: 16 }).map((_, index) => {
            const angle = (index * 22.5 * Math.PI) / 180;
            return (
              <line
                key={index}
                x1={100 + Math.cos(angle) * 43}
                y1={111 + Math.sin(angle) * 43}
                x2={100 + Math.cos(angle) * 52}
                y2={111 + Math.sin(angle) * 52}
                stroke={INK}
                strokeWidth="0.8"
              />
            );
          })}
          <rect x="36" y="130" width="14" height="112" fill={CLOUD_SOFT} stroke={INK} strokeWidth="1.1" />
          <rect x="150" y="130" width="14" height="112" fill={CLOUD_SOFT} stroke={INK} strokeWidth="1.1" />
          <path d="M39 136H47M153 136H161M36 238H50M150 238H164" stroke={TEAL} strokeWidth="1.4" />
          <text x="43" y="193" textAnchor="middle" fill={INK} fontFamily="Cinzel, serif" fontSize="8">B</text>
          <text x="157" y="193" textAnchor="middle" fill={INK} fontFamily="Cinzel, serif" fontSize="8">J</text>

          <path
            d="M75 238C78 207 84 182 100 176C116 182 122 207 125 238H75Z"
            fill={MAGENTA}
            stroke={INK}
            strokeWidth="1.2"
          />
          <path d="M86 177C89 190 111 190 114 177" stroke={CREAM} strokeWidth="1.2" />
          <ellipse cx="100" cy="159" rx="11" ry="13" fill={SKIN} stroke={INK} strokeWidth="1.2" />
          <path
            d="M89 157C90 146 94 141 100 141C106 141 110 146 111 157C107 151 103 149 100 149C97 149 93 151 89 157Z"
            fill={INK}
          />
          <path d="M92 162C94 163 96 163 98 162M102 162C104 163 106 163 108 162" stroke={INK} strokeWidth="0.7" />
          <path d="M91 150L96 143L100 148L104 143L109 150" stroke={GOLD} strokeWidth="2" />
          <path
            d="M89 193C92 188 108 188 111 193V205C106 209 94 209 89 205V193Z"
            fill={CREAM}
            stroke={INK}
            strokeWidth="1"
          />
          <path d="M100 190V207" stroke={INK} strokeWidth="0.7" />
          <path d="M84 214C93 220 107 220 116 214" stroke={GOLD} strokeWidth="3" strokeLinecap="round" />
          <path
            d="M76 237C82 230 91 228 100 234C109 228 118 230 124 237C114 244 86 244 76 237Z"
            fill={HALO}
            stroke={INK}
            strokeWidth="1"
          />
          <path d="M92 252C95 246 105 246 108 252C105 257 95 257 92 252Z" fill={GOLD} stroke={INK} strokeWidth="0.9" />
          <path d="M55 255C67 250 80 256 92 252C104 256 117 250 129 255C145 260 160 252 169 258" stroke={CREAM} strokeWidth="1" />
        </>
      ) : null}

      {variant === "moon" ? (
        <>
          <circle cx="100" cy="102" r="48" fill={CLOUD} stroke={INK} strokeWidth="1.2" />
          <circle cx="100" cy="102" r="37" fill={SKY} stroke={INK} strokeWidth="1" strokeDasharray="2 3" />
          <path
            d="M112 63C90 68 75 88 78 111C81 131 97 146 118 147C98 153 76 144 67 124C57 104 65 79 85 67C93 62 103 61 112 63Z"
            fill={GOLD}
            stroke={INK}
            strokeWidth="1.2"
          />
          <StarMark x={133} y={77} size={5} fill={PINK} width={0.8} />
          <StarMark x={52} y={118} size={4} fill={GOLD} width={0.7} />
          <path d="M31 224L61 174L89 216L113 184L139 224L169 194V276H31V224Z" fill={DEEP} stroke={INK} strokeWidth="1.1" />
          <path d="M85 183L89 216L97 201L98 214L113 184" stroke={CREAM} strokeWidth="0.9" />
          <path d="M31 237C51 230 69 240 88 234C108 228 128 240 147 234C156 231 164 232 169 235V276H31V237Z" fill={BLUE} stroke={INK} strokeWidth="1.1" />
          <path d="M45 250C64 244 80 252 98 247M108 253C126 247 143 254 160 248M57 263C73 259 88 265 105 261" stroke={CREAM} strokeWidth="1" strokeLinecap="round" />
        </>
      ) : null}

      {variant === "star" ? (
        <>
          <circle cx="100" cy="100" r="48" stroke={CREAM} strokeWidth="1" strokeDasharray="2 3" />
          <StarMark x={100} y={100} size={38} fill={GOLD} width={1.3} />
          <StarMark x={56} y={67} size={8} fill={PINK} width={0.8} />
          <StarMark x={145} y={72} size={6} fill={CREAM} width={0.8} />
          <StarMark x={138} y={137} size={4} fill={HALO} width={0.7} />
          <path d="M43 231C70 219 130 219 157 231V276H43V231Z" fill={BLUE} stroke={INK} strokeWidth="1.1" />
          <path d="M72 230C84 203 100 198 100 198C100 198 116 203 128 230H72Z" fill={PINK} stroke={INK} strokeWidth="1" />
          <path d="M53 247C77 240 123 240 147 247M64 259C84 253 116 253 136 259" stroke={CREAM} strokeWidth="1" strokeLinecap="round" />
        </>
      ) : null}

      {variant === "sun" ? (
        <>
          <circle cx="100" cy="110" r="42" fill={GOLD} stroke={INK} strokeWidth="1.5" />
          {Array.from({ length: 20 }).map((_, index) => {
            const angle = (index * 18 * Math.PI) / 180;
            return (
              <line
                key={index}
                x1={100 + Math.cos(angle) * 47}
                y1={110 + Math.sin(angle) * 47}
                x2={100 + Math.cos(angle) * 64}
                y2={110 + Math.sin(angle) * 64}
                stroke={INK}
                strokeWidth={index % 2 === 0 ? "1.2" : "0.8"}
                strokeLinecap="round"
              />
            );
          })}
          <path d="M40 235C66 212 79 202 100 202C121 202 134 212 160 235V276H40V235Z" fill={BLUE} stroke={INK} strokeWidth="1" />
          <path d="M57 253C74 242 86 240 100 245C114 240 126 242 143 253" stroke={CREAM} strokeWidth="1.1" />
        </>
      ) : null}

      {variant === "empress" ? (
        <>
          <circle cx="100" cy="84" r="50" stroke={CREAM} strokeWidth="1" strokeDasharray="3 4" />
          <circle cx="100" cy="104" r="30" fill={HALO} stroke={INK} strokeWidth="1.2" />
          <path d="M100 76C106 84 106 92 100 99C94 92 94 84 100 76Z" fill={MAGENTA} stroke={INK} strokeWidth="0.9" />
          <path d="M88 88C94 94 96 101 96 106C88 105 82 98 82 91C82 89 84 88 88 88Z" fill={PINK} stroke={INK} strokeWidth="0.8" />
          <path d="M112 88C106 94 104 101 104 106C112 105 118 98 118 91C118 89 116 88 112 88Z" fill={PINK} stroke={INK} strokeWidth="0.8" />
          <path d="M100 116V139M89 128H111" stroke={INK} strokeWidth="1.2" />
          <path d="M53 246C68 198 83 184 100 184C117 184 132 198 147 246H53Z" fill={CREAM} stroke={INK} strokeWidth="1.2" />
          <path d="M58 225C50 218 44 216 38 218V230C55 233 70 242 78 253" stroke={TEAL} strokeWidth="2" fill="none" />
          <circle cx="76" cy="214" r="10" fill={PINK} stroke={INK} strokeWidth="1" />
          <circle cx="124" cy="214" r="10" fill={PINK} stroke={INK} strokeWidth="1" />
          <circle cx="100" cy="237" r="11" fill={GOLD} stroke={INK} strokeWidth="1" />
        </>
      ) : null}

      {variant === "hermit" ? (
        <>
          <path d="M27 234L73 161L116 217L148 177L173 234V276H27V234Z" fill={DEEP} stroke={INK} strokeWidth="1.2" />
          <path d="M64 194L73 161L88 193" stroke={CREAM} strokeWidth="1" />
          <path d="M138 201L148 177L159 202" stroke={CREAM} strokeWidth="1" />
          <line x1="100" y1="46" x2="100" y2="78" stroke={INK} strokeWidth="1.2" />
          <path d="M81 92L100 73L119 92V137L100 149L81 137V92Z" fill={CLOUD} stroke={INK} strokeWidth="1.3" />
          <path d="M100 83L114 118H86L100 83Z" fill={GOLD} stroke={INK} strokeWidth="1" />
          <path d="M100 107L113 134H87L100 107Z" fill={TEAL} stroke={INK} strokeWidth="1" />
          <circle cx="100" cy="151" r="8" fill={GOLD} stroke={INK} strokeWidth="1" />
        </>
      ) : null}

      <path
        d="M18 276C38 259 44 249 38 239M182 276C162 259 156 249 162 239"
        stroke={INK}
        strokeWidth="1.1"
        fill={CLOUD_SOFT}
      />
    </svg>
  );
}
