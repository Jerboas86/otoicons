// A speech audiogram (ISO 8253-3:2022, clause 14): score versus speech level,
// 20 % on the score axis for 10 dB on the level axis, one curve per
// condition, with the table C.3 symbols. Writes
// examples/out/speech-audiogram.svg. Run with `node examples/speech.ts`.
import { mkdirSync, writeFileSync } from "node:fs";
import { SIDE_COLORS, THEME_BACKGROUNDS, speechSymbol, symbolSvg, type SpeechAxes } from "otoicons";

const unaided = { right: null, left: null };
const aids = { right: "hearing_aid", left: "hearing_aid" } as const;

/** One curve: the condition, then (level dB, score %) points. */
const curves: { label: string; axes: SpeechAxes; points: [number, number][] }[] = [
  {
    label: "Right ear, earphones",
    axes: {
      transducer: "earphones",
      ear: "right",
      masked: false,
      competing_noise: false,
      aided: unaided,
    },
    points: [
      [40, 10],
      [50, 40],
      [60, 75],
      [70, 90],
      [80, 90],
    ],
  },
  {
    label: "Left ear, earphones, contralateral masking",
    axes: {
      transducer: "earphones",
      ear: "left",
      masked: true,
      competing_noise: false,
      aided: unaided,
    },
    points: [
      [50, 0],
      [60, 20],
      [70, 50],
      [80, 70],
      [90, 65],
    ],
  },
  {
    label: "Sound field, binaural, device 2 (new fitting)",
    axes: {
      transducer: "sound_field",
      ear: null,
      masked: false,
      competing_noise: false,
      aided: aids,
      device: 2,
    },
    points: [
      [30, 20],
      [40, 60],
      [50, 85],
      [60, 95],
    ],
  },
];

const theme = "light";
const X0 = 60;
const Y0 = 30;
const DB = 4; // px per dB: 10 dB = 40 px
const PCT = 2; // px per %: 20 % = 40 px, as clause 14 requires
const x = (db: number) => X0 + db * DB;
const y = (pct: number) => Y0 + (100 - pct) * PCT;

const grid: string[] = [];
for (let db = 0; db <= 110; db += 10)
  grid.push(
    `<line x1="${x(db)}" x2="${x(db)}" y1="${y(100)}" y2="${y(0)}" stroke="#d0d4d8"/>`,
    `<text x="${x(db)}" y="${y(0) + 16}" text-anchor="middle">${db}</text>`,
  );
for (let pct = 0; pct <= 100; pct += 20)
  grid.push(
    `<line x1="${x(0)}" x2="${x(110)}" y1="${y(pct)}" y2="${y(pct)}" stroke="#d0d4d8"/>`,
    `<text x="${x(0) - 8}" y="${y(pct) + 4}" text-anchor="end">${pct}</text>`,
  );

const plots = curves.map(({ axes, points }) => {
  const symbol = speechSymbol(axes);
  if (!symbol) throw new Error("condition not covered by ISO 8253-3");
  const line = points.map(([db, pct]) => `${x(db)},${y(pct)}`).join(" ");
  const marks = points.map(
    ([db, pct]) =>
      `<g transform="translate(${x(db)} ${y(pct)})">${symbolSvg(symbol, { theme })}</g>`,
  );
  return `<polyline points="${line}" fill="none" stroke="${SIDE_COLORS[theme][symbol.color]}"/>${marks.join("")}`;
});

// Device numbers and material letters must be defined on the audiogram.
const legend = curves.map(({ label, axes }, i) => {
  const ly = y(0) + 50 + i * 30;
  return `<g transform="translate(${X0 + 10} ${ly})">${symbolSvg(speechSymbol(axes)!, { theme })}</g><text x="${X0 + 34}" y="${ly + 4}">${label}</text>`;
});

const W = x(110) + 30;
const H = y(0) + 50 + curves.length * 30;
const svg = [
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">`,
  `<rect width="100%" height="100%" fill="${THEME_BACKGROUNDS[theme]}"/>`,
  `<g font-family="Helvetica, Arial, sans-serif" font-size="11" fill="#1f2328">${grid.join("")}`,
  `<text x="${x(55)}" y="${y(0) + 34}" text-anchor="middle">Speech level (dB)</text>`,
  `<text transform="translate(18 ${y(50)}) rotate(-90)" text-anchor="middle">Score (%)</text>`,
  `${plots.join("")}${legend.join("")}</g>`,
  `</svg>`,
].join("\n");

const dir = new URL("out/", import.meta.url);
mkdirSync(dir, { recursive: true });
const file = new URL("speech-audiogram.svg", dir);
writeFileSync(file, svg);
console.log(`Written ${file.pathname}`);
