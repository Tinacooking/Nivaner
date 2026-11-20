export const SYSTEMS = [
  {
    key: "tarot",
    index: "I",
    label: "Tarot",
    caption: "The mirror of cards",
    eyebrow: "The Painted Arcana",
    lead: "Seventy-eight cards, six spreads, and one honest question. The deck does not fix a future in place; it reflects the pattern you are already living.",
    blurb:
      "Draw from a full 78-card deck, from a single card to the Celtic Cross, with classical meanings for every position.",
    divider: "THE MIRROR OF CARDS",
    action: "Enter the tarot chamber",
    icon: "cards",
  },
  {
    key: "ziwei",
    index: "II",
    label: "Zi Wei",
    caption: "The twelve palaces",
    eyebrow: "The Purple Star Mandala",
    lead: "Twelve palaces mapped from your birth date and hour. A traditional lens on character, work, relationships, and the seasons of a life.",
    blurb:
      "Read the twelve palaces of Zi Wei Dou Shu from your birth hour, with major stars, transformations, and a guided synthesis.",
    divider: "THE TWELVE PALACES",
    action: "Open the twelve palaces",
    icon: "palaces",
  },
  {
    key: "iching",
    index: "III",
    label: "I Ching",
    caption: "The six lines",
    eyebrow: "The Book of Turning",
    lead: "Six lines cast from a question. The Zhouyi describes the shape of a changing situation and the hinge on which it turns.",
    blurb:
      "Cast six lines and sit with the classical Zhouyi text, its moving lines, and the hexagram that follows.",
    divider: "THE SIX LINES",
    action: "Cast the six lines",
    icon: "lines",
  },
  {
    key: "astro",
    index: "IV",
    label: "Natal Chart",
    caption: "The sky at birth",
    eyebrow: "The Wheel of the Sky",
    lead: "The sky at your first breath, drawn as a wheel. Planets, houses, and aspects offer a symbolic map of temperament, rhythm, and timing.",
    blurb:
      "Generate a natal wheel with planets, houses, aspects, and an element balance, calculated from your exact birth data.",
    divider: "THE SKY AT BIRTH",
    action: "Read the natal wheel",
    icon: "wheel",
  },
];

export const NAV_ITEMS = [
  { key: "sanctuary", label: "Sanctuary" },
  ...SYSTEMS.map(({ key, label }) => ({ key, label })),
];
