// Generates docs/symbols.<locale>[.dark].svg: the ASHA 1990 table of
// audiometric symbols (response), as vectors, extended with the local
// extension and the no-response rule. Run with `pnpm doc` (builds
// dist/otocon.js first).
import { writeFileSync } from "node:fs";
import {
  SIDE_COLORS,
  THEME_BACKGROUNDS,
  noResponseArrow,
  sideColor,
  symbolSvg,
} from "../dist/otocon.js";

/** Light and dark themes: text and frames, secondary lines, section bands. */
const THEMES = [
  { name: "light", suffix: "", ink: "#1f2328", rule: "#9aa0a6", band: "#eef0f2" },
  { name: "dark", suffix: ".dark", ink: "#e6e6e6", rule: "#5f6368", band: "#1f2328" },
].map((theme) => ({ ...theme, bg: THEME_BACKGROUNDS[theme.name] }));

const LIC = "© 2026 Benoit Delemps — CC BY 4.0, https://creativecommons.org/licenses/by/4.0/";

const FR = {
  file: "symbols.fr.svg",
  title: "Symboles audiométriques",
  modality: "MODALITÉ",
  headers: { left: "Gauche", unspecified: "Non spécifié", right: "Droite" },
  locale: "fr",
  features: {
    title: "Propriétés du kit",
    items: [
      "Conforme ASHA 1990",
      "Symboles appareillés, MCL, UCL",
      "Côté appareillé visible",
      "CROS / BiCROS",
      "Couleur = côté stimulé",
      "Contraste constant 5:1",
      "Thèmes clair et sombre",
      "6 langues",
      "SVG et PNG",
      "Centré, fond transparent",
      "Licence ouverte (CC BY 4.0)",
    ],
  },
  ashaSection: "ASHA 1990 — réponse",
  groups: {
    acEarphones: "Conduction aérienne — écouteurs",
    bcMastoid: "Conduction osseuse — mastoïde",
    bcForehead: "Conduction osseuse — front",
    acSoundField: "Conduction aérienne — champ libre",
    reflex: "Seuil du réflexe stapédien",
  },
  unmasked: "Non masqué",
  masked: "Masqué",
  unaided: "Sans appareil",
  contralateral: "Controlatéral",
  ipsilateral: "Ipsilatéral",
  extensionSection: "Extension du système ASHA 1990",
  extensionNote:
    "Colonne = côté stimulé. Indice : D/G appareil droit/gauche seul ou côté récepteur ; M émetteur CROS controlatéral",
  local: {
    B: "Écouteurs, présentation diotique",
    M: "Niveau le plus confortable (MCL)",
    MA: "MCL avec appareil(s)",
    U: "Seuil d'inconfort (UCL)",
    UA: "UCL avec appareil(s)",
  },
  aided: {
    both: "Seuil en champ libre, les deux appareils",
    right: "Seuil en champ libre, appareil droit seul",
    left: "Seuil en champ libre, appareil gauche seul",
    right_cros: "Seuil en champ libre, CROS/BiCROS, récepteur droit",
    left_cros: "Seuil en champ libre, CROS/BiCROS, récepteur gauche",
  },
  noResponseSection: "Absence de réponse — exemples",
  noResponseNote: "Flèche à 45° vers l’extérieur ; verticale si non latéralisé",
  noResponseEarphones: "Écouteurs ; osseuse mastoïde non spécifiée",
  noResponseSoundField: "Champ libre sans appareil",
  notes: [
    "Formes : ASHA, « Guidelines for Audiometric Symbols » (1990), tableau 1.",
    "ASHA demande, pour les conditions appareillées, des symboles déterminés localement, distincts",
    "des autres et légendés sur l’audiogramme : c’est le rôle de l’extension ci-dessus.",
    "Couleurs : convention répandue, hors norme (rouge droite, bleu gauche, vert non latéralisé).",
    "Nuances ajustées pour un contraste constant de 5:1 avec le fond (WCAG).",
    "Document non approuvé par l’ASHA. La licence couvre ce tableau et l’extension, pas la norme ASHA.",
    LIC,
  ],
};

const EN = {
  file: "symbols.en.svg",
  title: "Audiometric symbols",
  modality: "MODALITY",
  headers: { left: "Left", unspecified: "Unspecified", right: "Right" },
  locale: "en",
  features: {
    title: "Kit features",
    items: [
      "ASHA 1990 compliant",
      "Aided, MCL, UCL symbols",
      "Aided side shown",
      "CROS / BiCROS",
      "Colour = stimulated side",
      "Constant 5:1 contrast",
      "Light and dark themes",
      "6 languages",
      "SVG and PNG",
      "Centred, transparent background",
      "Open license (CC BY 4.0)",
    ],
  },
  ashaSection: "ASHA 1990 — response",
  groups: {
    acEarphones: "Air conduction — earphones",
    bcMastoid: "Bone conduction — mastoid",
    bcForehead: "Bone conduction — forehead",
    acSoundField: "Air conduction — sound field",
    reflex: "Acoustic reflex threshold",
  },
  unmasked: "Unmasked",
  masked: "Masked",
  unaided: "Unaided",
  contralateral: "Contralateral",
  ipsilateral: "Ipsilateral",
  extensionSection: "Extension of the ASHA 1990 system",
  extensionNote:
    "Column = stimulated side. Subscript: R/L right/left aid only or receiver side; M contralateral CROS transmitter",
  local: {
    B: "Earphones, diotic presentation",
    M: "Most comfortable level (MCL)",
    MA: "Aided MCL",
    U: "Uncomfortable loudness level (UCL)",
    UA: "Aided UCL",
  },
  aided: {
    both: "Aided sound field threshold, both aids",
    right: "Aided sound field threshold, right aid only",
    left: "Aided sound field threshold, left aid only",
    right_cros: "Aided sound field threshold, CROS/BiCROS, right receiver",
    left_cros: "Aided sound field threshold, CROS/BiCROS, left receiver",
  },
  noResponseSection: "No response — examples",
  noResponseNote: "Arrow at 45° pointing outward; straight down when not lateralised",
  noResponseEarphones: "Earphones; unspecified mastoid bone conduction",
  noResponseSoundField: "Unaided sound field",
  notes: [
    "Shapes: ASHA, “Guidelines for Audiometric Symbols” (1990), table 1.",
    "For aided conditions, ASHA asks for locally determined symbols, exclusive of any other",
    "symbols and defined on the audiogram: this is the role of the extension above.",
    "Colors: widespread convention, not part of the standard (red right, blue left, green not lateralised).",
    "Shades adjusted for a constant 5:1 contrast against the background (WCAG).",
    "Not endorsed by ASHA. The license covers this table and the extension, not the ASHA standard.",
    LIC,
  ],
};

const DE = {
  file: "symbols.de.svg",
  title: "Audiometrische Symbole",
  modality: "MODALITÄT",
  headers: { left: "Links", unspecified: "Nicht spezifiziert", right: "Rechts" },
  locale: "de",
  features: {
    title: "Merkmale des Kits",
    items: [
      "ASHA-1990-konform",
      "Symbole für versorgt, MCL, UCL",
      "Versorgte Seite erkennbar",
      "CROS / BiCROS",
      "Farbe = stimulierte Seite",
      "Konstanter Kontrast 5:1",
      "Helles und dunkles Design",
      "6 Sprachen",
      "SVG und PNG",
      "Zentriert, transparenter Hintergrund",
      "Offene Lizenz (CC BY 4.0)",
    ],
  },
  ashaSection: "ASHA 1990 — Reaktion",
  groups: {
    acEarphones: "Luftleitung — Kopfhörer",
    bcMastoid: "Knochenleitung — Mastoid",
    bcForehead: "Knochenleitung — Stirn",
    acSoundField: "Luftleitung — Freifeld",
    reflex: "Stapediusreflexschwelle",
  },
  unmasked: "Unvertäubt",
  masked: "Vertäubt",
  unaided: "Ohne Hörgerät",
  contralateral: "Kontralateral",
  ipsilateral: "Ipsilateral",
  extensionSection: "Erweiterung des Systems ASHA 1990",
  extensionNote:
    "Spalte = stimulierte Seite. Index: R/L nur rechtes/linkes Gerät oder Empfängerseite; M kontralateraler CROS-Sender",
  local: {
    B: "Kopfhörer, diotische Darbietung",
    M: "Angenehmster Pegel (MCL)",
    MA: "MCL mit Hörgerät(en)",
    U: "Unbehaglichkeitsschwelle (UCL)",
    UA: "UCL mit Hörgerät(en)",
  },
  aided: {
    both: "Freifeldschwelle, beide Hörgeräte",
    right: "Freifeldschwelle, nur rechtes Hörgerät",
    left: "Freifeldschwelle, nur linkes Hörgerät",
    right_cros: "Freifeldschwelle, CROS/BiCROS, Empfänger rechts",
    left_cros: "Freifeldschwelle, CROS/BiCROS, Empfänger links",
  },
  noResponseSection: "Keine Reaktion — Beispiele",
  noResponseNote: "Pfeil im 45°-Winkel nach außen; senkrecht, wenn nicht lateralisiert",
  noResponseEarphones: "Kopfhörer; Knochenleitung Mastoid, nicht spezifiziert",
  noResponseSoundField: "Freifeld ohne Hörgerät",
  notes: [
    "Formen: ASHA, „Guidelines for Audiometric Symbols“ (1990), Tabelle 1.",
    "Für versorgte Bedingungen verlangt die ASHA lokal festgelegte Symbole, die sich von allen",
    "anderen unterscheiden und auf dem Audiogramm erklärt werden: Das leistet die obige Erweiterung.",
    "Farben: verbreitete Konvention, nicht genormt (rot rechts, blau links, grün nicht lateralisiert).",
    "Farbtöne für einen konstanten Kontrast von 5:1 zum Hintergrund angepasst (WCAG).",
    "Nicht von der ASHA gebilligt. Die Lizenz umfasst diese Tabelle und die Erweiterung, nicht die ASHA-Norm.",
    LIC,
  ],
};

const ES = {
  file: "symbols.es.svg",
  title: "Símbolos audiométricos",
  modality: "MODALIDAD",
  headers: { left: "Izquierdo", unspecified: "No especificado", right: "Derecho" },
  locale: "es",
  features: {
    title: "Características del kit",
    items: [
      "Conforme a ASHA 1990",
      "Símbolos con audífono, MCL, UCL",
      "Lado con audífono visible",
      "CROS / BiCROS",
      "Color = lado estimulado",
      "Contraste constante 5:1",
      "Temas claro y oscuro",
      "6 idiomas",
      "SVG y PNG",
      "Centrado, fondo transparente",
      "Licencia abierta (CC BY 4.0)",
    ],
  },
  ashaSection: "ASHA 1990 — respuesta",
  groups: {
    acEarphones: "Vía aérea — auriculares",
    bcMastoid: "Vía ósea — mastoides",
    bcForehead: "Vía ósea — frente",
    acSoundField: "Vía aérea — campo libre",
    reflex: "Umbral del reflejo estapedial",
  },
  unmasked: "Sin enmascaramiento",
  masked: "Con enmascaramiento",
  unaided: "Sin audífono",
  contralateral: "Contralateral",
  ipsilateral: "Ipsilateral",
  extensionSection: "Extensión del sistema ASHA 1990",
  extensionNote:
    "Columna = lado estimulado. Subíndice: D/I solo audífono derecho/izquierdo o lado receptor; M transmisor CROS contralateral",
  local: {
    B: "Auriculares, presentación diótica",
    M: "Nivel más confortable (MCL)",
    MA: "MCL con audífono(s)",
    U: "Umbral de incomodidad (UCL)",
    UA: "UCL con audífono(s)",
  },
  aided: {
    both: "Umbral en campo libre, ambos audífonos",
    right: "Umbral en campo libre, solo audífono derecho",
    left: "Umbral en campo libre, solo audífono izquierdo",
    right_cros: "Umbral en campo libre, CROS/BiCROS, receptor derecho",
    left_cros: "Umbral en campo libre, CROS/BiCROS, receptor izquierdo",
  },
  noResponseSection: "Sin respuesta — ejemplos",
  noResponseNote: "Flecha a 45° hacia fuera; vertical si no está lateralizado",
  noResponseEarphones: "Auriculares; vía ósea mastoidea no especificada",
  noResponseSoundField: "Campo libre sin audífono",
  notes: [
    "Formas: ASHA, «Guidelines for Audiometric Symbols» (1990), tabla 1.",
    "Para las condiciones con audífono, ASHA pide símbolos determinados localmente, distintos",
    "de los demás y explicados en el audiograma: ese es el papel de la extensión anterior.",
    "Colores: convención extendida, no normalizada (rojo derecho, azul izquierdo, verde no lateralizado).",
    "Tonos ajustados para un contraste constante de 5:1 con el fondo (WCAG).",
    "No aprobado por ASHA. La licencia cubre esta tabla y la extensión, no la norma ASHA.",
    LIC,
  ],
};

const IT = {
  file: "symbols.it.svg",
  title: "Simboli audiometrici",
  modality: "MODALITÀ",
  headers: { left: "Sinistro", unspecified: "Non specificato", right: "Destro" },
  locale: "it",
  features: {
    title: "Caratteristiche del kit",
    items: [
      "Conforme ASHA 1990",
      "Simboli protesizzati, MCL, UCL",
      "Lato protesizzato visibile",
      "CROS / BiCROS",
      "Colore = lato stimolato",
      "Contrasto costante 5:1",
      "Temi chiaro e scuro",
      "6 lingue",
      "SVG e PNG",
      "Centrato, sfondo trasparente",
      "Licenza aperta (CC BY 4.0)",
    ],
  },
  ashaSection: "ASHA 1990 — risposta",
  groups: {
    acEarphones: "Via aerea — cuffie",
    bcMastoid: "Via ossea — mastoide",
    bcForehead: "Via ossea — fronte",
    acSoundField: "Via aerea — campo libero",
    reflex: "Soglia del riflesso stapediale",
  },
  unmasked: "Senza mascheramento",
  masked: "Con mascheramento",
  unaided: "Senza apparecchio",
  contralateral: "Controlaterale",
  ipsilateral: "Ipsilaterale",
  extensionSection: "Estensione del sistema ASHA 1990",
  extensionNote:
    "Colonna = lato stimolato. Pedice: D/S solo apparecchio destro/sinistro o lato ricevitore; M trasmettitore CROS controlaterale",
  local: {
    B: "Cuffie, presentazione diotica",
    M: "Livello più confortevole (MCL)",
    MA: "MCL con apparecchio/i",
    U: "Soglia di fastidio (UCL)",
    UA: "UCL con apparecchio/i",
  },
  aided: {
    both: "Soglia in campo libero, entrambi gli apparecchi",
    right: "Soglia in campo libero, solo apparecchio destro",
    left: "Soglia in campo libero, solo apparecchio sinistro",
    right_cros: "Soglia in campo libero, CROS/BiCROS, ricevitore destro",
    left_cros: "Soglia in campo libero, CROS/BiCROS, ricevitore sinistro",
  },
  noResponseSection: "Nessuna risposta — esempi",
  noResponseNote: "Freccia a 45° verso l’esterno; verticale se non lateralizzato",
  noResponseEarphones: "Cuffie; via ossea mastoidea non specificata",
  noResponseSoundField: "Campo libero senza apparecchio",
  notes: [
    "Forme: ASHA, «Guidelines for Audiometric Symbols» (1990), tabella 1.",
    "Per le condizioni protesizzate, ASHA chiede simboli definiti localmente, distinti",
    "dagli altri e spiegati sull’audiogramma: è il ruolo dell’estensione qui sopra.",
    "Colori: convenzione diffusa, non normata (rosso destro, blu sinistro, verde non lateralizzato).",
    "Tonalità regolate per un contrasto costante di 5:1 con lo sfondo (WCAG).",
    "Non approvato dall’ASHA. La licenza copre questa tabella e l’estensione, non la norma ASHA.",
    LIC,
  ],
};

const PT = {
  file: "symbols.pt.svg",
  title: "Símbolos audiométricos",
  modality: "MODALIDADE",
  headers: { left: "Esquerdo", unspecified: "Não especificado", right: "Direito" },
  locale: "pt",
  features: {
    title: "Características do kit",
    items: [
      "Conforme ASHA 1990",
      "Símbolos com aparelho, MCL, UCL",
      "Lado com aparelho visível",
      "CROS / BiCROS",
      "Cor = lado estimulado",
      "Contraste constante 5:1",
      "Temas claro e escuro",
      "6 idiomas",
      "SVG e PNG",
      "Centrado, fundo transparente",
      "Licença aberta (CC BY 4.0)",
    ],
  },
  ashaSection: "ASHA 1990 — resposta",
  groups: {
    acEarphones: "Via aérea — auscultadores",
    bcMastoid: "Via óssea — mastoide",
    bcForehead: "Via óssea — fronte",
    acSoundField: "Via aérea — campo livre",
    reflex: "Limiar do reflexo estapédico",
  },
  unmasked: "Sem mascaramento",
  masked: "Com mascaramento",
  unaided: "Sem aparelho",
  contralateral: "Contralateral",
  ipsilateral: "Ipsilateral",
  extensionSection: "Extensão do sistema ASHA 1990",
  extensionNote:
    "Coluna = lado estimulado. Índice: D/E só aparelho direito/esquerdo ou lado do recetor; M transmissor CROS contralateral",
  local: {
    B: "Auscultadores, apresentação diótica",
    M: "Nível mais confortável (MCL)",
    MA: "MCL com aparelho(s)",
    U: "Limiar de desconforto (UCL)",
    UA: "UCL com aparelho(s)",
  },
  aided: {
    both: "Limiar em campo livre, ambos os aparelhos",
    right: "Limiar em campo livre, só aparelho direito",
    left: "Limiar em campo livre, só aparelho esquerdo",
    right_cros: "Limiar em campo livre, CROS/BiCROS, recetor direito",
    left_cros: "Limiar em campo livre, CROS/BiCROS, recetor esquerdo",
  },
  noResponseSection: "Sem resposta — exemplos",
  noResponseNote: "Seta a 45° para fora; vertical se não lateralizado",
  noResponseEarphones: "Auscultadores; via óssea mastoide não especificada",
  noResponseSoundField: "Campo livre sem aparelho",
  notes: [
    "Formas: ASHA, «Guidelines for Audiometric Symbols» (1990), tabela 1.",
    "Para as condições com aparelho, a ASHA pede símbolos definidos localmente, distintos",
    "dos outros e explicados no audiograma: é esse o papel da extensão acima.",
    "Cores: convenção difundida, não normalizada (vermelho direito, azul esquerdo, verde não lateralizado).",
    "Tons ajustados para um contraste constante de 5:1 com o fundo (WCAG).",
    "Não aprovado pela ASHA. A licença abrange esta tabela e a extensão, não a norma ASHA.",
    LIC,
  ],
};

const asha = (left, unspecified, right) =>
  [left, unspecified, right].map((shape) => (shape ? { shape } : null));
const all = (letter, index) => [0, 1, 2].map(() => ({ letter, index }));

const AID_INDEXES = ["right", "left", "right_cros", "left_cros"];

const rows = (t) => [
  { kind: "section", label: t.ashaSection },
  { kind: "group", label: t.groups.acEarphones },
  { kind: "symbols", label: t.unmasked, cells: asha("ac_left", null, "ac_right") },
  { kind: "symbols", label: t.masked, cells: asha("ac_left_masked", null, "ac_right_masked") },
  { kind: "group", label: t.groups.bcMastoid },
  {
    kind: "symbols",
    label: t.unmasked,
    cells: asha("bc_mastoid_left", "bc_mastoid_unspecified", "bc_mastoid_right"),
  },
  {
    kind: "symbols",
    label: t.masked,
    cells: asha("bc_mastoid_left_masked", null, "bc_mastoid_right_masked"),
  },
  { kind: "group", label: t.groups.bcForehead },
  { kind: "symbols", label: t.unmasked, cells: asha(null, "bc_forehead_unspecified", null) },
  {
    kind: "symbols",
    label: t.masked,
    cells: asha("bc_forehead_left_masked", null, "bc_forehead_right_masked"),
  },
  { kind: "group", label: t.groups.acSoundField },
  { kind: "symbols", label: t.unaided, cells: asha("sf_left", "sf_unspecified", "sf_right") },
  { kind: "group", label: t.groups.reflex },
  {
    kind: "symbols",
    label: t.contralateral,
    cells: asha("reflex_contra_left", null, "reflex_contra_right"),
  },
  {
    kind: "symbols",
    label: t.ipsilateral,
    cells: asha("reflex_ipsi_left", null, "reflex_ipsi_right"),
  },
  { kind: "section", label: t.extensionSection, note: t.extensionNote },
  { kind: "symbols", label: t.local.B, cells: [null, { letter: "B" }, null] },
  { kind: "symbols", label: t.aided.both, cells: all("A") },
  ...AID_INDEXES.map((i) => ({ kind: "symbols", label: t.aided[i], cells: all("A", i) })),
  ...["M", "MA", "U", "UA"].map((l) => ({
    kind: "symbols",
    label: t.local[l],
    cells: all(l),
  })),
  { kind: "section", label: t.noResponseSection, note: t.noResponseNote },
  {
    kind: "symbols",
    label: t.noResponseEarphones,
    cells: asha("ac_left", "bc_mastoid_unspecified", "ac_right"),
    noResponse: true,
  },
  {
    kind: "symbols",
    label: t.noResponseSoundField,
    cells: asha("sf_left", "sf_unspecified", "sf_right"),
    noResponse: true,
  },
  { kind: "symbols", label: t.aided.both, cells: all("A"), noResponse: true },
  ...AID_INDEXES.map((i) => ({
    kind: "symbols",
    label: t.aided[i],
    cells: all("A", i),
    noResponse: true,
  })),
];

const COLUMNS = ["left", "unspecified", "right"];
const SIDES = { left: "left", unspecified: null, right: "right" };

const M = 20;
/**
 * Approximate width of Helvetica text: average advance as a fraction of the
 * font size (lowercase ≈ 0.52; bold ≈ 0.58; bold capitals ≈ 0.70).
 */
const textWidth = (text, size, weight) =>
  text.length * size * { regular: 0.52, bold: 0.58, caps: 0.7 }[weight];
const PAD = 16;
const max = (values) => Math.max(...values);
const HEIGHTS = { section: 40, group: 26, symbols: 36 };
const HEADER_H = 34;
const NOTE_H = 16;
const SCALE = 1.15;

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Symbol of a cell: the column sets the stimulated side, hence colour and arrow. */
const symbolOf = (cell, column, noResponse) => {
  const ear = SIDES[column];
  const common = {
    ear,
    color: sideColor(ear),
    no_response_arrow: noResponse ? noResponseArrow(ear) : null,
  };
  return "shape" in cell
    ? { kind: "asha", shape: cell.shape, ...common }
    : { kind: "extension", letter: cell.letter, aid_index: cell.index ?? null, ...common };
};

const mark = (t, theme, cell, x, y, column, noResponse) =>
  `<g transform="translate(${x} ${y}) scale(${SCALE})">${symbolSvg(symbolOf(cell, column, noResponse), { locale: t.locale, theme: theme.name })}</g>`;

/** Indent of a feature label after its number. */
const FEATURE_INDENT = 30;
const FEATURE_ROW = 22;

/** Kit features: a framed block of short labels, numbered, in two columns. */
const features = (body, t, theme, y, W) => {
  const { items } = t.features;
  const rowsPerColumn = Math.ceil(items.length / 2);
  const h = 34 + rowsPerColumn * FEATURE_ROW + 8;
  const colW = (W - 2 * M) / 2;
  body.push(
    `<rect x="${M}" y="${y}" width="${W - 2 * M}" height="${h}" fill="${theme.band}" stroke="${theme.ink}"/>`,
  );
  body.push(
    `<text x="${M + 8}" y="${y + 22}" font-size="13" font-weight="700" fill="${theme.ink}">${esc(t.features.title)}</text>`,
  );
  items.forEach((item, i) => {
    const x = M + 8 + Math.floor(i / rowsPerColumn) * colW;
    const cy = y + 34 + (i % rowsPerColumn) * FEATURE_ROW + FEATURE_ROW / 2;
    body.push(
      `<circle cx="${x + 9}" cy="${cy}" r="9" fill="${SIDE_COLORS[theme.name].green}"/>`,
      `<text x="${x + 9}" y="${cy + 3.8}" font-size="10" font-weight="700" fill="${theme.bg}" text-anchor="middle">${i + 1}</text>`,
      `<text x="${x + FEATURE_INDENT}" y="${cy + 4}" font-size="12" fill="${theme.ink}">${esc(item)}</text>`,
    );
  });
  return y + h + 14;
};

const render = (t, theme, extended) => {
  const ROWS = rows(t);
  const COL_W = Math.ceil(
    Math.max(70, max(Object.values(t.headers).map((h) => textWidth(h, 12, "bold"))) + 24),
  );
  const labelWidth = max(
    ROWS.map((row) =>
      row.kind === "group"
        ? 8 + textWidth(row.label, 11.5, "caps")
        : row.kind === "symbols"
          ? 22 + textWidth(row.label, 12, "regular")
          : 0,
    ),
  );
  // Section titles and notes, like the closing notes, span the full width.
  const spanWidth = max([
    ...ROWS.flatMap((row) =>
      row.kind === "section"
        ? [8 + textWidth(row.label, 13, "bold"), 8 + textWidth(row.note ?? "", 10.5, "regular")]
        : [],
    ),
    ...t.notes.map((note) => textWidth(note, 10.5, "regular")),
    // Two columns of features, each item after its number.
    ...(extended
      ? [2 * (FEATURE_INDENT + max(t.features.items.map((i) => textWidth(i, 12, "regular")))) + PAD]
      : []),
  ]);
  const LABEL_W = Math.ceil(Math.max(labelWidth + PAD, spanWidth + PAD - COL_W * 3));
  const W = M * 2 + LABEL_W + COL_W * 3;
  const colX = (i) => M + LABEL_W + COL_W * i + COL_W / 2;
  const divider = (i, y1, y2) => {
    const x = M + LABEL_W + COL_W * i;
    return `<line x1="${x}" x2="${x}" y1="${y1}" y2="${y2}" stroke="${theme.ink}" stroke-width="0.8"/>`;
  };

  const body = [];
  let y = M;
  body.push(
    `<text x="${M}" y="${y + 18}" font-size="17" font-weight="700" fill="${theme.ink}">${esc(t.title)}</text>`,
  );
  y += 30;
  if (extended) y = features(body, t, theme, y, W);
  body.push(
    `<line x1="${M}" x2="${W - M}" y1="${y + HEADER_H}" y2="${y + HEADER_H}" stroke="${theme.ink}"/>`,
  );
  body.push(
    `<text x="${M + 8}" y="${y + 22}" font-size="12" font-weight="700" fill="${theme.ink}">${t.modality}</text>`,
  );
  COLUMNS.forEach((c, i) => {
    body.push(
      `<text x="${colX(i)}" y="${y + 22}" font-size="12" font-weight="700" fill="${SIDE_COLORS[theme.name][sideColor(SIDES[c])]}" text-anchor="middle">${t.headers[c]}</text>`,
    );
    body.push(divider(i, y, y + HEADER_H));
  });
  const tableTop = y;
  y += HEADER_H;

  for (const row of ROWS) {
    const h = HEIGHTS[row.kind] + (row.kind === "section" && row.note ? NOTE_H : 0);
    if (row.kind === "section") {
      body.push(
        `<rect x="${M}" y="${y}" width="${W - 2 * M}" height="${h}" fill="${theme.band}"/>`,
      );
      body.push(
        `<text x="${M + 8}" y="${y + 25}" font-size="13" font-weight="700" fill="${theme.ink}">${esc(row.label)}</text>`,
      );
      if (row.note)
        body.push(
          `<text x="${M + 8}" y="${y + 25 + NOTE_H}" font-size="10.5" font-style="italic" fill="${theme.ink}">${esc(row.note)}</text>`,
        );
    } else if (row.kind === "group") {
      body.push(
        `<text x="${M + 8}" y="${y + 18}" font-size="11.5" font-weight="700" fill="${theme.ink}">${esc(row.label.toUpperCase())}</text>`,
      );
    } else {
      body.push(
        `<text x="${M + 22}" y="${y + h / 2 + 4}" font-size="12" fill="${theme.ink}">${esc(row.label)}</text>`,
      );
      COLUMNS.forEach((_, i) => body.push(divider(i, y, y + h)));
      row.cells.forEach((cell, i) => {
        const x = colX(i);
        body.push(
          `<line x1="${x}" x2="${x}" y1="${y}" y2="${y + h}" stroke="${theme.rule}" stroke-width="0.8"/>`,
        );
        if (cell) body.push(mark(t, theme, cell, x, y + h / 2 - 2, COLUMNS[i], !!row.noResponse));
      });
    }
    y += h;
    body.push(
      `<line x1="${M}" x2="${W - M}" y1="${y}" y2="${y}" stroke="${theme.rule}" stroke-width="0.6"/>`,
    );
  }
  body.push(
    `<rect x="${M}" y="${tableTop}" width="${W - 2 * M}" height="${y - tableTop}" fill="none" stroke="${theme.ink}"/>`,
  );
  y += 10;
  for (const note of t.notes) {
    y += 15;
    body.push(`<text x="${M}" y="${y}" font-size="10.5" fill="${theme.ink}">${esc(note)}</text>`);
  }
  const H = y + M;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Helvetica, Arial, sans-serif" stroke-linecap="round" stroke-linejoin="round">
<title>${esc(t.title)}</title>
<metadata>
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#">
<cc:Work rdf:about=""><dc:title>${esc(t.title)}</dc:title><dc:creator>Benoit Delemps</dc:creator><dc:date>2026</dc:date><cc:license rdf:resource="https://creativecommons.org/licenses/by/4.0/"/></cc:Work>
</rdf:RDF>
</metadata>
<rect width="${W}" height="${H}" fill="${theme.bg}"/>
<g stroke-width="1.4">
${body.join("\n")}
</g>
</svg>
`;
};

const LANGUAGES = [FR, EN, DE, ES, IT, PT];

for (const t of LANGUAGES)
  for (const extended of [false, true])
    for (const theme of THEMES) {
      const name = t.file.replace(/\.svg$/, `${extended ? ".extended" : ""}${theme.suffix}.svg`);
      const out = new URL(`../docs/${name}`, import.meta.url);
      writeFileSync(out, render(t, theme, extended));
      console.log(`wrote ${out.pathname}`);
    }
