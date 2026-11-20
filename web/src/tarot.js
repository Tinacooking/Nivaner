export const MAJORS = [
  "The Fool",
  "The Magician",
  "The High Priestess",
  "The Empress",
  "The Emperor",
  "The Hierophant",
  "The Lovers",
  "The Chariot",
  "Strength",
  "The Hermit",
  "Wheel of Fortune",
  "Justice",
  "The Hanged Man",
  "Death",
  "Temperance",
  "The Devil",
  "The Tower",
  "The Star",
  "The Moon",
  "The Sun",
  "Judgement",
  "The World",
];

export const ROMAN = [
  "0",
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
  "XII",
  "XIII",
  "XIV",
  "XV",
  "XVI",
  "XVII",
  "XVIII",
  "XIX",
  "XX",
  "XXI",
];

export const SUIT_ELEMENT = {
  Wands: "Fire",
  Cups: "Water",
  Swords: "Air",
  Pentacles: "Earth",
};

export const TIME_FACTORS = [
  { value: "auto", label: "Auto (local time)" },
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "night", label: "Night" },
];

export function cardParts(name) {
  const majorIndex = MAJORS.indexOf(name);
  if (majorIndex >= 0) {
    return {
      kind: "major",
      mark: ROMAN[majorIndex],
      title: name,
      label: "Major Arcana",
    };
  }

  const [rank, suit] = name.split(" of ");
  return {
    kind: "minor",
    mark: suit ? suit[0] : "?",
    title: rank,
    label: suit ? `${suit} · ${SUIT_ELEMENT[suit]}` : "Minor Arcana",
  };
}

export function ratioNote({ total, major }) {
  if (total === 1) {
    return "A single card sets the lens for this moment.";
  }
  const share = major / total;
  if (share > 0.5) {
    return "Major-dominant: this spread points to a turning point.";
  }
  if (share >= 0.3) {
    return "Fate and choice coexist in this spread.";
  }
  return "Everyday choices dominate — your agency leads the reading.";
}
