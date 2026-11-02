// Display order, palette and decorative SVG symbols are application-owned.
export const EVENT_CATEGORIES = [
  {
    id: "training",
    label: "Training",
    short: "Trn",
    symbol: "Book",
    color: "#214867",
    background: "#EAF1F7",
    paths: ["M12 6c-3-2-6-2-9-1v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1v14"],
  },
  {
    id: "marksmanship",
    label: "Marksmanship",
    short: "Tgt",
    symbol: "Target",
    color: "#A12232",
    background: "#FCEEF0",
    paths: [
      "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
      "M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z",
      "M13 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z",
    ],
  },
  {
    id: "band",
    label: "Band",
    short: "Bnd",
    symbol: "Music",
    color: "#6B3994",
    background: "#F3EDF9",
    paths: [
      "M9 18V5l12-2v13",
      "M9 5v5l12-2",
      "M9 18c0 3-6 4-6 1s6-4 6-1Z",
      "M21 16c0 3-6 4-6 1s6-4 6-1Z",
    ],
  },
  {
    id: "choir",
    label: "Choir",
    short: "Chr",
    symbol: "Microphone",
    color: "#9E2265",
    background: "#FBEAF3",
    paths: [
      "M9 5a3 3 0 0 1 6 0v7a3 3 0 0 1-6 0V5Z",
      "M5 10v2a7 7 0 0 0 14 0v-2",
      "M12 19v3m-4 0h8",
    ],
  },
  {
    id: "ground-school",
    label: "Ground School",
    short: "Gnd",
    symbol: "Aircraft",
    color: "#005F91",
    background: "#E7F4FA",
    paths: ["M12 2v20m0-16L3 13v3l9-3 9 3v-3l-9-7m0 12-4 3v1l4-1 4 1v-1l-4-3"],
  },
  {
    id: "ceremony",
    label: "Ceremony",
    short: "Cer",
    symbol: "Award",
    color: "#795300",
    background: "#FFF5D9",
    paths: ["M17 8a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z", "M8 12 6 22l6-3 6 3-2-10"],
  },
  {
    id: "parade",
    label: "Parade",
    short: "Par",
    symbol: "Flag",
    color: "#515A19",
    background: "#F2F4DE",
    paths: ["M4 22V3m0 1c5-4 10 4 16 0v11c-6 4-11-4-16 0"],
  },
  {
    id: "field-training-exercise",
    label: "Field Training Exercise",
    short: "FTX",
    symbol: "Trees",
    color: "#236131",
    background: "#EAF5E8",
    paths: [
      "M8 3 2 12h4l-5 6h14l-5-6h4L8 3Zm0 15v4",
      "M17 2l5 8h-3l4 6h-7m1 0v6",
    ],
  },
  {
    id: "special-event",
    label: "Special Event",
    short: "Evt",
    symbol: "Star",
    color: "#9A420D",
    background: "#FFF0E3",
    paths: ["m12 2 3 6 7 1-5 5 1 8-6-4-6 4 1-8-5-5 7-1 3-6Z"],
  },
  {
    id: "biathlon",
    label: "Biathlon",
    short: "Bia",
    symbol: "Medal",
    color: "#00695E",
    background: "#E4F5F0",
    paths: [
      "m4 2 5 9m11-9-5 9M8 2l4 7 4-7",
      "M18 15a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z",
      "m12 12 1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Z",
    ],
  },
];
export const CATEGORY_BY_ID = Object.fromEntries(
  EVENT_CATEGORIES.map((c) => [c.id, c]),
);
export function compareCategories(a, b) {
  return (
    EVENT_CATEGORIES.findIndex((c) => c.id === a.category) -
      EVENT_CATEGORIES.findIndex((c) => c.id === b.category) ||
    a.id.localeCompare(b.id)
  );
}
export function calendarEntries(entries, limit = Infinity) {
  const ordered = [...entries].sort(compareCategories);
  return {
    visible: ordered.slice(0, limit),
    more: Math.max(0, ordered.length - limit),
  };
}
