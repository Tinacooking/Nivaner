const SIGNS = {
  Ari: { name: "Aries", glyph: "♈", element: "Fire", modality: "Cardinal", trait: "initiative, courage, and a taste for direct action" },
  Tau: { name: "Taurus", glyph: "♉", element: "Earth", modality: "Fixed", trait: "steadiness, pleasure, and respect for what lasts" },
  Gem: { name: "Gemini", glyph: "♊", element: "Air", modality: "Mutable", trait: "curiosity, language, and quick exchange" },
  Can: { name: "Cancer", glyph: "♋", element: "Water", modality: "Cardinal", trait: "care, memory, and the need for a safe base" },
  Leo: { name: "Leo", glyph: "♌", element: "Fire", modality: "Fixed", trait: "warmth, creativity, and a wish to be seen" },
  Vir: { name: "Virgo", glyph: "♍", element: "Earth", modality: "Mutable", trait: "craft, analysis, and service to what works" },
  Lib: { name: "Libra", glyph: "♎", element: "Air", modality: "Cardinal", trait: "balance, relationship, and a felt sense of fairness" },
  Sco: { name: "Scorpio", glyph: "♏", element: "Water", modality: "Fixed", trait: "depth, intensity, and transformation" },
  Sag: { name: "Sagittarius", glyph: "♐", element: "Fire", modality: "Mutable", trait: "meaning, movement, and the big picture" },
  Cap: { name: "Capricorn", glyph: "♑", element: "Earth", modality: "Cardinal", trait: "structure, patience, and long-range ambition" },
  Aqu: { name: "Aquarius", glyph: "♒", element: "Air", modality: "Fixed", trait: "independence, systems, and the future" },
  Pis: { name: "Pisces", glyph: "♓", element: "Water", modality: "Mutable", trait: "imagination, empathy, and porous boundaries" },
};

const PLANET_GLYPHS = {
  Sun: "☉",
  Moon: "☽",
  Mercury: "☿",
  Venus: "♀",
  Mars: "♂",
  Jupiter: "♃",
  Saturn: "♄",
  Uranus: "♅",
  Neptune: "♆",
  Pluto: "♇",
  Ascendant: "AC",
  Midheaven: "MC",
};

const ASPECT_NOTES = {
  conjunction: "fusion — both functions act as one",
  sextile: "ease — a gentle, available exchange",
  square: "friction — growth through tension",
  trine: "flow — natural, unforced support",
  opposition: "polarity — balance between two poles",
  quincunx: "adjustment — an awkward but useful angle",
};

const HOUSE_THEMES = [
  "identity and body",
  "money and resources",
  "communication and learning",
  "home and roots",
  "creativity and pleasure",
  "work and routines",
  "partnership and exchange",
  "shared resources and depth",
  "meaning, travel, and belief",
  "career and public role",
  "community and future",
  "inner life and release",
];

const POINT_LABELS = {
  Medium_Coeli: "Midheaven",
  True_North_Lunar_Node: "North Node",
  Mean_North_Lunar_Node: "North Node",
  Mean_Lilith: "Lilith",
  True_Lilith: "Lilith",
  Chiron: "Chiron",
};

export const CITY_PRESETS = [
  { city: "Hanoi", lat: 21.0278, lng: 105.8342, tz: "Asia/Ho_Chi_Minh" },
  { city: "Ho Chi Minh City", lat: 10.8231, lng: 106.6297, tz: "Asia/Ho_Chi_Minh" },
  { city: "Da Nang", lat: 16.0544, lng: 108.2022, tz: "Asia/Ho_Chi_Minh" },
  { city: "Hue", lat: 16.4637, lng: 107.5909, tz: "Asia/Ho_Chi_Minh" },
  { city: "Hai Phong", lat: 20.8449, lng: 106.6881, tz: "Asia/Ho_Chi_Minh" },
  { city: "Can Tho", lat: 10.0452, lng: 105.7469, tz: "Asia/Ho_Chi_Minh" },
  { city: "Nha Trang", lat: 12.2388, lng: 109.1967, tz: "Asia/Ho_Chi_Minh" },
  { city: "Da Lat", lat: 11.9404, lng: 108.4583, tz: "Asia/Ho_Chi_Minh" },
  { city: "Vung Tau", lat: 10.346, lng: 107.0843, tz: "Asia/Ho_Chi_Minh" },
];

export function signInfo(code) {
  return SIGNS[code] || { name: code, glyph: "", element: "", modality: "", trait: "" };
}

export function planetGlyph(name) {
  return PLANET_GLYPHS[name] || "•";
}

export function formatPoint(name) {
  return POINT_LABELS[name] || String(name || "").replaceAll("_", " ");
}

export function ordinal(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return "";
  }
  const mod100 = number % 100;
  if (mod100 >= 11 && mod100 <= 13) {
    return "th";
  }
  return ["th", "st", "nd", "rd"][number % 10] || "th";
}

function houseTheme(house) {
  return HOUSE_THEMES[Number(house) - 1] || "an unnumbered house";
}

function pointByName(data, name) {
  return (data.points ?? []).find((point) => point.name === name);
}

function sentenceJoin(items) {
  if (items.length <= 1) {
    return items.join("");
  }
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

export function buildAstroReading(data) {
  const sun = pointByName(data, "Sun");
  const moon = pointByName(data, "Moon");
  const rising = pointByName(data, "Ascendant");
  const paragraphs = [];

  if (sun) {
    const sign = signInfo(sun.sign);
    paragraphs.push(
      `Sun in ${sign.name} gives the chart its core tone: ${sign.trait}. It sits in the ${sun.house}${ordinal(
        sun.house,
      )} house of ${houseTheme(sun.house)}.`,
    );
  }
  if (moon) {
    const sign = signInfo(moon.sign);
    paragraphs.push(
      `Moon in ${sign.name} colors the emotional weather: ${sign.trait}. In the ${moon.house}${ordinal(
        moon.house,
      )} house, feelings are processed through ${houseTheme(moon.house)}.`,
    );
  }
  if (rising) {
    const sign = signInfo(rising.sign);
    paragraphs.push(
      `${sign.name} rises, so first impressions carry ${sign.trait}. The Ascendant describes the doorway, not the whole house.`,
    );
  }

  const elements = Object.entries({
    Fire: data.elements.fire_percentage,
    Earth: data.elements.earth_percentage,
    Air: data.elements.air_percentage,
    Water: data.elements.water_percentage,
  }).sort((a, b) => b[1] - a[1]);

  const [topElement, topValue] = elements[0];
  const [lowElement, lowValue] = elements[elements.length - 1];
  if (topValue - lowValue <= 10) {
    paragraphs.push(
      "The four elements are fairly balanced, so no single style dominates the chart.",
    );
  } else {
    paragraphs.push(
      `${topElement} leads at ${topValue}% while ${lowElement} is quietest at ${lowValue}%. Lean on the strong element, and practice the quiet one deliberately.`,
    );
  }

  const qualities = Object.entries({
    Cardinal: data.qualities.cardinal_percentage,
    Fixed: data.qualities.fixed_percentage,
    Mutable: data.qualities.mutable_percentage,
  }).sort((a, b) => b[1] - a[1]);

  const [topQuality] = qualities;
  paragraphs.push(
    `${topQuality[0]} is the dominant mode of action. Cardinal starts, Fixed sustains, Mutable adapts — this chart leans ${topQuality[0].toLowerCase()}.`,
  );

  const tightAspects = (data.aspects ?? []).slice(0, 3).map((aspect) => ({
    ...aspect,
    fromLabel: formatPoint(aspect.from),
    toLabel: formatPoint(aspect.to),
    note: ASPECT_NOTES[aspect.aspect] || "an angle worth noticing",
  }));

  if (tightAspects.length) {
    paragraphs.push(
      `The closest aspects are ${sentenceJoin(
        tightAspects.map(
          (aspect) =>
            `${aspect.fromLabel} ${aspect.aspect} ${aspect.toLabel} (${aspect.note})`,
        ),
      )}.`,
    );
  }

  const bigThree = [
    { label: "Sun", point: sun, role: "core identity" },
    { label: "Moon", point: moon, role: "emotional style" },
    { label: "Rising", point: rising, role: "outer manner" },
  ]
    .filter((item) => item.point)
    .map((item) => {
      const sign = signInfo(item.point.sign);
      return {
        ...item,
        sign: sign.name,
        glyph: sign.glyph,
        degree: item.point.degree,
        house: item.point.house,
        trait: sign.trait,
      };
    });

  return {
    paragraphs,
    bigThree,
    tightAspects,
    elementBars: elements.map(([label, value]) => ({ label, value })),
    qualityBars: qualities.map(([label, value]) => ({ label, value })),
  };
}
