export const PALACE_LABELS = {
  "Mệnh": "Life · identity",
  "Huynh Đệ": "Siblings · peers",
  "Phu Thê": "Spouse · partnership",
  "Tử Nữ": "Children · creation",
  "Tài Bạch": "Wealth · resources",
  "Tật Ách": "Health · body",
  "Thiên Di": "Travel · outer world",
  "Nô Bộc": "Friends · support",
  "Quan Lộc": "Career · vocation",
  "Điền Trạch": "Property · home",
  "Phúc Đức": "Fortune · inner life",
  "Phụ Mẫu": "Parents · elders",
};

export const STAR_TRAITS = {
  "Tử Vi": "dignity, command, and a need for worthy allies",
  "Thiên Cơ": "strategy, analysis, and constant movement of the mind",
  "Thái Dương": "visibility, generosity, and a public-facing role",
  "Vũ Khúc": "execution, money sense, and decisiveness",
  "Thiên Đồng": "ease, connection, and a preference for harmony",
  "Liêm Trinh": "principle, intensity, and hard boundaries",
  "Thiên Phủ": "stability, reserves, and careful stewardship",
  "Thái Âm": "intuition, care, and a rich inner life",
  "Tham Lang": "desire, sociability, and versatility",
  "Cự Môn": "speech, debate, and penetrating insight",
  "Thiên Tướng": "support, mediation, and quiet service",
  "Thiên Lương": "wisdom, protection, and ethical judgment",
  "Thất Sát": "drive, risk, and fierce independence",
  "Phá Quân": "reinvention, disruption, and breakthrough",
};

const MINOR_NOTES = {
  "Văn Xương": "literacy and exams",
  "Văn Khúc": "expression and charm",
  "Tả Phụ": "reliable support",
  "Hữu Bật": "helpful allies",
  "Thiên Khôi": "mentors",
  "Thiên Việt": "opportunity",
  "Lộc Tồn": "savings and continuity",
  "Thiên Mã": "movement and travel",
  "Kình Dương": "pressure and blunt force",
  "Đà La": "delay and persistence",
  "Hỏa Tinh": "urgency and bursts",
  "Linh Tinh": "sensitivity and timing",
  "Địa Không": "emptiness and letting go",
  "Địa Kiếp": "upheaval and risk",
  "Đào Hoa": "romance and attraction",
  "Hồng Loan": "partnership luck",
  "Thiên Hỷ": "joy and celebration",
  "Thiên Hình": "discipline and law",
  "Cô Thần": "solitude",
  "Quả Tú": "independence",
};

const BRIGHTNESS_NOTES = {
  "Miếu": "at its strongest",
  "Vượng": "strong",
  "Đắc": "well placed",
  "Lợi": "favourable",
  "Bình": "neutral",
  "Hãm": "under pressure",
};

export const MUTAGEN_NOTES = {
  "Lộc": "ease, opportunity, and flow",
  "Quyền": "authority, drive, and control",
  "Khoa": "reputation, learning, and clarity",
  "Kỵ": "attachment, friction, and shadow",
};

export const BRANCH_GRID = [
  ["Tỵ", "Ngọ", "Mùi", "Thân"],
  ["Thìn", null, null, "Dậu"],
  ["Mão", null, null, "Tuất"],
  ["Dần", "Sửu", "Tý", "Hợi"],
];

const GRID_AREAS = {
  "Tỵ": "ty",
  "Ngọ": "ngo",
  "Mùi": "mui",
  "Thân": "than",
  "Thìn": "thin",
  "Dậu": "dau",
  "Mão": "mao",
  "Tuất": "tuat",
  "Dần": "dan",
  "Sửu": "suu",
  "Tý": "ty2",
  "Hợi": "hoi",
};

export const BOARD_AREAS = [
  '"ty ngo mui than"',
  '"thin center center dau"',
  '"mao center center tuat"',
  '"dan suu ty2 hoi"',
].join(" ");

export function gridAreaFor(branch) {
  return GRID_AREAS[branch] || "center";
}

export function toTimeIndex(time) {
  const [hour] = String(time || "0:00").split(":").map(Number);
  if (hour === 0) {
    return 0;
  }
  if (hour === 23) {
    return 12;
  }
  return Math.floor((hour + 1) / 2);
}

function starLabel(star) {
  const brightness = star.brightness ? ` (${star.brightness})` : "";
  const mutagen = star.mutagen ? ` ${star.mutagen}` : "";
  return `${star.name}${brightness}${mutagen}`;
}

function traitFor(stars) {
  return stars
    .map((star) => STAR_TRAITS[star.name])
    .filter(Boolean)
    .slice(0, 2)
    .join("; ");
}

function palaceLine(palace, label) {
  const majors = palace.majorStars ?? [];
  const minors = palace.minorStars ?? [];
  const stars = majors.length
    ? majors.map(starLabel).join(", ")
    : "no major star";

  let line = `${label} sits in ${palace.earthlyBranch} with ${stars}.`;

  const trait = traitFor(majors);
  if (trait) {
    line += ` Its tone: ${trait}.`;
  } else if (minors.length) {
    const notes = minors
      .map((star) => MINOR_NOTES[star.name])
      .filter(Boolean)
      .slice(0, 2);
    line += notes.length
      ? ` Without a major star, read the minor signals: ${notes.join(" and ")}.`
      : " Without a major star, borrow meaning from the opposite palace and the minor stars.";
  }

  return line;
}

export function buildZiweiReading(astrolabe) {
  const byName = Object.fromEntries(
    (astrolabe.palaces ?? []).map((palace) => [palace.name, palace]),
  );
  const life = byName["Mệnh"];
  const career = byName["Quan Lộc"];
  const wealth = byName["Tài Bạch"];
  const spouse = byName["Phu Thê"];
  const health = byName["Tật Ách"];

  const allStars = (astrolabe.palaces ?? []).flatMap((palace) => [
    ...(palace.majorStars ?? []),
    ...(palace.minorStars ?? []),
  ]);
  const transformations = allStars.filter((star) => star.mutagen);

  const paragraphs = [];
  if (life) {
    paragraphs.push(palaceLine(life, "The Life palace"));
  }
  if (career) {
    paragraphs.push(palaceLine(career, "Career"));
  }
  if (wealth) {
    paragraphs.push(palaceLine(wealth, "Wealth"));
  }
  if (spouse) {
    paragraphs.push(palaceLine(spouse, "Partnership"));
  }

  if (transformations.length) {
    const list = transformations
      .map((star) => `${star.name} carries ${star.mutagen}`)
      .join(", ");
    const notes = [...new Set(transformations.map((star) => MUTAGEN_NOTES[star.mutagen]))]
      .filter(Boolean)
      .join("; ");
    paragraphs.push(
      `The Four Transformations mark this chart: ${list}. The emphasis falls on ${notes}.`,
    );
  }

  paragraphs.push(
    `The five-element class is ${astrolabe.fiveElementsClass}; soul star ${astrolabe.soul} and body star ${astrolabe.body} set the chart's inner rhythm.`,
  );

  const keyPalaces = [life, career, wealth, spouse, health]
    .filter(Boolean)
    .map((palace) => ({
      name: palace.name,
      label: PALACE_LABELS[palace.name] || palace.name,
      branch: palace.earthlyBranch,
      stars: (palace.majorStars ?? []).map(starLabel).join(", ") || "No major star",
      note:
        traitFor(palace.majorStars ?? []) ||
        "Read through the minor stars and the opposite palace.",
    }));

  return {
    paragraphs,
    keyPalaces,
    transformations: transformations.map((star) => ({
      star: star.name,
      mutagen: star.mutagen,
      note: MUTAGEN_NOTES[star.mutagen] || "",
    })),
    brightness: BRIGHTNESS_NOTES,
  };
}
