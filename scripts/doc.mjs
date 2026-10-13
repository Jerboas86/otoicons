// Generates docs/symbols.<locale>[.dark].svg: the ASHA 1990 table of
// audiometric symbols (response), as vectors, extended with the local
// extension and the no-response rule, followed by the speech audiogram
// symbols of ISO 8253-3:2022. Run with `pnpm doc` (builds
// dist/otoicons.js first).
import { writeFileSync } from "node:fs";
import {
  SIDE_COLORS,
  THEME_BACKGROUNDS,
  noResponseArrow,
  sideColor,
  speechSymbol,
  symbolSvg,
} from "../dist/otoicons.js";

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
      "Conforme ASHA 1990 (tonale)",
      "Conforme ISO 8253-3:2022 (vocale)",
      "Symboles appareillés, MCL, UCL",
      "Appareillé : losange ISO 8253-3",
      "Couleur = côté stimulé",
      "Contraste constant 5:1",
      "Thèmes clair et sombre",
      "Tableaux en 6 langues",
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
  extensionNote: "Colonne = côté stimulé",
  local: {
    B: "Écouteurs, présentation diotique",
    M: "Niveau le plus confortable (MCL)",
    U: "Seuil d'inconfort (UCL)",
  },
  aided: {
    section: "Appareillé — losange ISO 8253-3",
    note: "Losange = appareillé ; chiffre = appareil ou réglage, à partir du 2e, défini sur l’audiogramme",
    threshold: "Seuil en champ libre, appareil 1",
    threshold2: "Seuil en champ libre, appareil 2",
    M: "MCL avec appareil",
    U: "UCL avec appareil",
  },
  noResponseSection: "Absence de réponse — exemples",
  noResponseNote: "Flèche à 45° vers l’extérieur ; verticale si non latéralisé",
  noResponseEarphones: "Écouteurs ; osseuse mastoïde non spécifiée",
  noResponseSoundField: "Champ libre sans appareil",
  notes: [
    "Formes : ASHA, « Guidelines for Audiometric Symbols » (1990), tableau 1.",
    "ASHA demande, pour les conditions appareillées, des symboles déterminés localement, distincts",
    "des autres et légendés sur l’audiogramme : le losange de l’ISO 8253-3, comme en vocale.",
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
      "ASHA 1990 compliant (pure tone)",
      "ISO 8253-3:2022 compliant (speech)",
      "Aided, MCL, UCL symbols",
      "Aided: ISO 8253-3 diamond",
      "Colour = stimulated side",
      "Constant 5:1 contrast",
      "Light and dark themes",
      "Tables in 6 languages",
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
  extensionNote: "Column = stimulated side",
  local: {
    B: "Earphones, diotic presentation",
    M: "Most comfortable level (MCL)",
    U: "Uncomfortable loudness level (UCL)",
  },
  aided: {
    section: "Aided — ISO 8253-3 diamond",
    note: "Diamond = aided; number = device or fitting, from the 2nd on, defined on the audiogram",
    threshold: "Aided sound field threshold, device 1",
    threshold2: "Aided sound field threshold, device 2",
    M: "Aided MCL",
    U: "Aided UCL",
  },
  noResponseSection: "No response — examples",
  noResponseNote: "Arrow at 45° pointing outward; straight down when not lateralised",
  noResponseEarphones: "Earphones; unspecified mastoid bone conduction",
  noResponseSoundField: "Unaided sound field",
  notes: [
    "Shapes: ASHA, “Guidelines for Audiometric Symbols” (1990), table 1.",
    "For aided conditions, ASHA asks for locally determined symbols, exclusive of any other",
    "symbols and defined on the audiogram: the ISO 8253-3 diamond, as for speech.",
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
      "ASHA-1990-konform (Tonaudiometrie)",
      "ISO-8253-3:2022-konform (Sprachaudiometrie)",
      "Symbole für versorgt, MCL, UCL",
      "Versorgt: Raute nach ISO 8253-3",
      "Farbe = stimulierte Seite",
      "Konstanter Kontrast 5:1",
      "Helles und dunkles Design",
      "Tabellen in 6 Sprachen",
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
  extensionNote: "Spalte = stimulierte Seite",
  local: {
    B: "Kopfhörer, diotische Darbietung",
    M: "Angenehmster Pegel (MCL)",
    U: "Unbehaglichkeitsschwelle (UCL)",
  },
  aided: {
    section: "Versorgt — Raute nach ISO 8253-3",
    note: "Raute = versorgt; Ziffer = Gerät oder Einstellung ab dem 2., auf dem Audiogramm erklärt",
    threshold: "Freifeldschwelle, Gerät 1",
    threshold2: "Freifeldschwelle, Gerät 2",
    M: "MCL mit Hörgerät",
    U: "UCL mit Hörgerät",
  },
  noResponseSection: "Keine Reaktion — Beispiele",
  noResponseNote: "Pfeil im 45°-Winkel nach außen; senkrecht, wenn nicht lateralisiert",
  noResponseEarphones: "Kopfhörer; Knochenleitung Mastoid, nicht spezifiziert",
  noResponseSoundField: "Freifeld ohne Hörgerät",
  notes: [
    "Formen: ASHA, „Guidelines for Audiometric Symbols“ (1990), Tabelle 1.",
    "Für versorgte Bedingungen verlangt die ASHA lokal festgelegte Symbole, die sich von allen",
    "anderen unterscheiden und auf dem Audiogramm erklärt werden: die Raute nach ISO 8253-3, wie in der Sprachaudiometrie.",
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
      "Conforme a ASHA 1990 (tonal)",
      "Conforme a ISO 8253-3:2022 (logoaudiometría)",
      "Símbolos con audífono, MCL, UCL",
      "Con audífono: rombo ISO 8253-3",
      "Color = lado estimulado",
      "Contraste constante 5:1",
      "Temas claro y oscuro",
      "Tablas en 6 idiomas",
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
  extensionNote: "Columna = lado estimulado",
  local: {
    B: "Auriculares, presentación diótica",
    M: "Nivel más confortable (MCL)",
    U: "Umbral de incomodidad (UCL)",
  },
  aided: {
    section: "Con audífono — rombo ISO 8253-3",
    note: "Rombo = con audífono; número = dispositivo o ajuste, a partir del 2.º, definido en el audiograma",
    threshold: "Umbral en campo libre, dispositivo 1",
    threshold2: "Umbral en campo libre, dispositivo 2",
    M: "MCL con audífono",
    U: "UCL con audífono",
  },
  noResponseSection: "Sin respuesta — ejemplos",
  noResponseNote: "Flecha a 45° hacia fuera; vertical si no está lateralizado",
  noResponseEarphones: "Auriculares; vía ósea mastoidea no especificada",
  noResponseSoundField: "Campo libre sin audífono",
  notes: [
    "Formas: ASHA, «Guidelines for Audiometric Symbols» (1990), tabla 1.",
    "Para las condiciones con audífono, ASHA pide símbolos determinados localmente, distintos",
    "de los demás y explicados en el audiograma: el rombo de ISO 8253-3, como en logoaudiometría.",
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
      "Conforme ASHA 1990 (tonale)",
      "Conforme ISO 8253-3:2022 (vocale)",
      "Simboli protesizzati, MCL, UCL",
      "Protesizzato: rombo ISO 8253-3",
      "Colore = lato stimolato",
      "Contrasto costante 5:1",
      "Temi chiaro e scuro",
      "Tabelle in 6 lingue",
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
  extensionNote: "Colonna = lato stimolato",
  local: {
    B: "Cuffie, presentazione diotica",
    M: "Livello più confortevole (MCL)",
    U: "Soglia di fastidio (UCL)",
  },
  aided: {
    section: "Protesizzato — rombo ISO 8253-3",
    note: "Rombo = protesizzato; numero = dispositivo o regolazione, dal 2° in poi, definito sull’audiogramma",
    threshold: "Soglia in campo libero, dispositivo 1",
    threshold2: "Soglia in campo libero, dispositivo 2",
    M: "MCL con apparecchio",
    U: "UCL con apparecchio",
  },
  noResponseSection: "Nessuna risposta — esempi",
  noResponseNote: "Freccia a 45° verso l’esterno; verticale se non lateralizzato",
  noResponseEarphones: "Cuffie; via ossea mastoidea non specificata",
  noResponseSoundField: "Campo libero senza apparecchio",
  notes: [
    "Forme: ASHA, «Guidelines for Audiometric Symbols» (1990), tabella 1.",
    "Per le condizioni protesizzate, ASHA chiede simboli definiti localmente, distinti",
    "dagli altri e spiegati sull’audiogramma: il rombo della ISO 8253-3, come in audiometria vocale.",
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
      "Conforme ASHA 1990 (tonal)",
      "Conforme ISO 8253-3:2022 (vocal)",
      "Símbolos com aparelho, MCL, UCL",
      "Com aparelho: losango ISO 8253-3",
      "Cor = lado estimulado",
      "Contraste constante 5:1",
      "Temas claro e escuro",
      "Tabelas em 6 idiomas",
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
  extensionNote: "Coluna = lado estimulado",
  local: {
    B: "Auscultadores, apresentação diótica",
    M: "Nível mais confortável (MCL)",
    U: "Limiar de desconforto (UCL)",
  },
  aided: {
    section: "Com aparelho — losango ISO 8253-3",
    note: "Losango = com aparelho; número = dispositivo ou ajuste, a partir do 2.º, definido no audiograma",
    threshold: "Limiar em campo livre, dispositivo 1",
    threshold2: "Limiar em campo livre, dispositivo 2",
    M: "MCL com aparelho",
    U: "UCL com aparelho",
  },
  noResponseSection: "Sem resposta — exemplos",
  noResponseNote: "Seta a 45° para fora; vertical se não lateralizado",
  noResponseEarphones: "Auscultadores; via óssea mastoide não especificada",
  noResponseSoundField: "Campo livre sem aparelho",
  notes: [
    "Formas: ASHA, «Guidelines for Audiometric Symbols» (1990), tabela 1.",
    "Para as condições com aparelho, a ASHA pede símbolos definidos localmente, distintos",
    "dos outros e explicados no audiograma: o losango da ISO 8253-3, como na audiometria vocal.",
    "Cores: convenção difundida, não normalizada (vermelho direito, azul esquerdo, verde não lateralizado).",
    "Tons ajustados para um contraste constante de 5:1 com o fundo (WCAG).",
    "Não aprovado pela ASHA. A licença abrange esta tabela e a extensão, não a norma ASHA.",
    LIC,
  ],
};

/** Speech audiogram table, ISO 8253-3:2022 table C.3, per locale. */
const SPEECH = {
  fr: {
    section: "ISO 8253-3:2022 — audiogramme vocal",
    note: "Colonne = oreille testée ; Non spécifié = B, écoute binaurale au casque (diotique ou dichotique)",
    earphones: "Écouteurs",
    soundField: "Champ libre",
    quiet: "Sans bruit concurrent",
    masked: "Masquage controlatéral",
    noise: "Bruit concurrent",
    noiseMasked: "Bruit concurrent et masquage controlatéral",
    sfQuiet: "Sans appareil",
    sfNoise: "Sans appareil, bruit concurrent",
    aided1: "Appareil 1, bruit concurrent",
    aided2: "Appareil 2, bruit concurrent",
    material: "Appareil 2, bruit concurrent, matériel vocal a, b, c",
    notes: [
      "Symboles : ISO 8253-3:2022, tableau C.3 (d’après l’ISO 8253-2).",
      "Triangle plein : masquage controlatéral ; trait dessous : bruit concurrent ; trait dessus : champ libre.",
      "Losange : appareil auditif ; à droite, numéro de l’appareil à partir du 2e ; à gauche, lettre du matériel vocal.",
      "Numéros et lettres sont définis sur l’audiogramme.",
      "Document non approuvé par l’ISO. La licence couvre ce tableau, pas la norme ISO.",
    ],
  },
  en: {
    section: "ISO 8253-3:2022 — speech audiogram",
    note: "Column = test ear; Unspecified = B, binaural listening under earphones (diotic or dichotic)",
    earphones: "Earphones",
    soundField: "Sound field",
    quiet: "Without competing noise",
    masked: "Contralateral masking",
    noise: "Competing noise",
    noiseMasked: "Competing noise and contralateral masking",
    sfQuiet: "Unaided",
    sfNoise: "Unaided, competing noise",
    aided1: "Device 1, competing noise",
    aided2: "Device 2, competing noise",
    material: "Device 2, competing noise, speech material a, b, c",
    notes: [
      "Symbols: ISO 8253-3:2022, table C.3 (after ISO 8253-2).",
      "Filled triangle: contralateral masking; line below: competing noise; line above: sound field.",
      "Diamond: hearing aid; at the right, the device number from the 2nd on; at the left, the speech material letter.",
      "Numbers and letters are defined on the audiogram.",
      "Not endorsed by ISO. The license covers this table, not the ISO standard.",
    ],
  },
  de: {
    section: "ISO 8253-3:2022 — Sprachaudiogramm",
    note: "Spalte = Prüfohr; Nicht spezifiziert = B, binaurales Hören über Kopfhörer (diotisch oder dichotisch)",
    earphones: "Kopfhörer",
    soundField: "Freifeld",
    quiet: "Ohne Störgeräusch",
    masked: "Kontralaterale Vertäubung",
    noise: "Störgeräusch",
    noiseMasked: "Störgeräusch und kontralaterale Vertäubung",
    sfQuiet: "Ohne Hörgerät",
    sfNoise: "Ohne Hörgerät, Störgeräusch",
    aided1: "Gerät 1, Störgeräusch",
    aided2: "Gerät 2, Störgeräusch",
    material: "Gerät 2, Störgeräusch, Sprachmaterial a, b, c",
    notes: [
      "Symbole: ISO 8253-3:2022, Tabelle C.3 (nach ISO 8253-2).",
      "Gefülltes Dreieck: kontralaterale Vertäubung; Strich unten: Störgeräusch; Strich oben: Freifeld.",
      "Raute: Hörgerät; rechts die Gerätenummer ab dem 2. Gerät; links der Buchstabe des Sprachmaterials.",
      "Nummern und Buchstaben werden auf dem Audiogramm erklärt.",
      "Nicht von der ISO genehmigt. Die Lizenz deckt diese Tabelle, nicht die ISO-Norm.",
    ],
  },
  es: {
    section: "ISO 8253-3:2022 — logoaudiograma",
    note: "Columna = oído de prueba; No especificado = B, escucha binaural con auriculares (diótica o dicótica)",
    earphones: "Auriculares",
    soundField: "Campo libre",
    quiet: "Sin ruido competitivo",
    masked: "Enmascaramiento contralateral",
    noise: "Ruido competitivo",
    noiseMasked: "Ruido competitivo y enmascaramiento contralateral",
    sfQuiet: "Sin audífono",
    sfNoise: "Sin audífono, ruido competitivo",
    aided1: "Dispositivo 1, ruido competitivo",
    aided2: "Dispositivo 2, ruido competitivo",
    material: "Dispositivo 2, ruido competitivo, material verbal a, b, c",
    notes: [
      "Símbolos: ISO 8253-3:2022, tabla C.3 (según ISO 8253-2).",
      "Triángulo relleno: enmascaramiento contralateral; línea debajo: ruido competitivo; línea encima: campo libre.",
      "Rombo: audífono; a la derecha, número del dispositivo a partir del 2.º; a la izquierda, letra del material verbal.",
      "Números y letras se definen en el audiograma.",
      "No aprobado por ISO. La licencia cubre esta tabla, no la norma ISO.",
    ],
  },
  it: {
    section: "ISO 8253-3:2022 — audiogramma vocale",
    note: "Colonna = orecchio in esame; Non specificato = B, ascolto binaurale in cuffia (diotico o dicotico)",
    earphones: "Cuffie",
    soundField: "Campo libero",
    quiet: "Senza rumore competitivo",
    masked: "Mascheramento controlaterale",
    noise: "Rumore competitivo",
    noiseMasked: "Rumore competitivo e mascheramento controlaterale",
    sfQuiet: "Senza apparecchio",
    sfNoise: "Senza apparecchio, rumore competitivo",
    aided1: "Dispositivo 1, rumore competitivo",
    aided2: "Dispositivo 2, rumore competitivo",
    material: "Dispositivo 2, rumore competitivo, materiale vocale a, b, c",
    notes: [
      "Simboli: ISO 8253-3:2022, tabella C.3 (secondo la ISO 8253-2).",
      "Triangolo pieno: mascheramento controlaterale; linea sotto: rumore competitivo; linea sopra: campo libero.",
      "Rombo: apparecchio acustico; a destra, numero del dispositivo dal 2° in poi; a sinistra, lettera del materiale vocale.",
      "Numeri e lettere sono definiti sull’audiogramma.",
      "Non approvato dall’ISO. La licenza copre questa tabella, non la norma ISO.",
    ],
  },
  pt: {
    section: "ISO 8253-3:2022 — audiograma vocal",
    note: "Coluna = ouvido testado; Não especificado = B, escuta binaural com auscultadores (diótica ou dicótica)",
    earphones: "Auscultadores",
    soundField: "Campo livre",
    quiet: "Sem ruído competitivo",
    masked: "Mascaramento contralateral",
    noise: "Ruído competitivo",
    noiseMasked: "Ruído competitivo e mascaramento contralateral",
    sfQuiet: "Sem aparelho",
    sfNoise: "Sem aparelho, ruído competitivo",
    aided1: "Dispositivo 1, ruído competitivo",
    aided2: "Dispositivo 2, ruído competitivo",
    material: "Dispositivo 2, ruído competitivo, material vocal a, b, c",
    notes: [
      "Símbolos: ISO 8253-3:2022, tabela C.3 (segundo a ISO 8253-2).",
      "Triângulo cheio: mascaramento contralateral; linha por baixo: ruído competitivo; linha por cima: campo livre.",
      "Losango: aparelho auditivo; à direita, número do dispositivo a partir do 2.º; à esquerda, letra do material vocal.",
      "Números e letras são definidos no audiograma.",
      "Não aprovado pela ISO. A licença cobre esta tabela, não a norma ISO.",
    ],
  },
};

const asha = (left, unspecified, right) =>
  [left, unspecified, right].map((shape) => (shape ? { shape } : null));
const all = (letter) => [0, 1, 2].map(() => ({ letter }));
/** Aided cells: the same symbols in the ISO 8253-3 diamond, with a device number. */
const aided = (cells, device = 1) =>
  cells.map((cell) => cell && { ...cell, aided: true, device: device > 1 ? device : null });
const SOUND_FIELD_SHAPES = asha("sf_left", "sf_unspecified", "sf_right");

const rows = (t) => [...pureToneRows(t), ...speechRows(SPEECH[t.locale])];

/** Closing notes: pure tones, then speech, then the licence. */
const tableNotes = (t) => [...t.notes.slice(0, -1), ...SPEECH[t.locale].notes, LIC];

const pureToneRows = (t) => [
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
  ...["M", "U"].map((l) => ({ kind: "symbols", label: t.local[l], cells: all(l) })),
  { kind: "section", label: t.aided.section, note: t.aided.note },
  { kind: "symbols", label: t.aided.threshold, cells: aided(SOUND_FIELD_SHAPES), tall: true },
  { kind: "symbols", label: t.aided.threshold2, cells: aided(SOUND_FIELD_SHAPES, 2), tall: true },
  ...["M", "U"].map((l) => ({
    kind: "symbols",
    label: t.aided[l],
    cells: aided(all(l)),
    tall: true,
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
    cells: SOUND_FIELD_SHAPES,
    noResponse: true,
  },
  {
    kind: "symbols",
    label: t.aided.threshold,
    cells: aided(SOUND_FIELD_SHAPES),
    noResponse: true,
    tall: true,
  },
];

/** Speech cells: the ISO 8253-3 conditions of one row, in every column it defines. */
const QUIET = {
  transducer: "earphones",
  masked: false,
  competing_noise: false,
  aided: { right: null, left: null },
};
const speech = (fields, binaural = true) =>
  [true, binaural, true].map((defined) => (defined ? { speech: { ...QUIET, ...fields } } : null));
const NOISE = { competing_noise: true };
const SOUND_FIELD = { transducer: "sound_field" };
const AIDED = { ...SOUND_FIELD, ...NOISE, aided: { right: "hearing_aid", left: "hearing_aid" } };

/** ISO 8253-3:2022, table C.3, in its order; the aided rows need a taller row for the diamond. */
const speechRows = (s) => [
  { kind: "section", label: s.section, note: s.note },
  { kind: "group", label: s.earphones },
  { kind: "symbols", label: s.quiet, cells: speech({}) },
  { kind: "symbols", label: s.masked, cells: speech({ masked: true }, false) },
  { kind: "symbols", label: s.noise, cells: speech(NOISE) },
  { kind: "symbols", label: s.noiseMasked, cells: speech({ ...NOISE, masked: true }, false) },
  { kind: "group", label: s.soundField },
  { kind: "symbols", label: s.sfQuiet, cells: speech(SOUND_FIELD) },
  { kind: "symbols", label: s.sfNoise, cells: speech({ ...SOUND_FIELD, ...NOISE }) },
  { kind: "symbols", label: s.aided1, cells: speech(AIDED), tall: true },
  { kind: "symbols", label: s.aided2, cells: speech({ ...AIDED, device: 2 }), tall: true },
  {
    kind: "symbols",
    label: s.material,
    // As in table C.3: a right, b binaural, c left.
    cells: ["c", "b", "a"].map((material) => ({
      speech: { ...QUIET, ...AIDED, device: 2, material },
    })),
    tall: true,
  },
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
const HEIGHTS = { section: 40, group: 30, symbols: 44 };
/** Rows holding an aided symbol, whose diamond spans ±17 units, and its arrow down to 26. */
const TALL_H = 56;
const TALL_ARROW_H = 68;
const HEADER_H = 34;
const NOTE_H = 16;
const SCALE = 1.15;

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Pure-tone symbol of a cell: the column sets the stimulated side, hence colour and arrow. */
const toneSymbol = (cell, column, noResponse) => {
  const ear = SIDES[column];
  const common = {
    ear,
    color: sideColor(ear),
    no_response_arrow: noResponse ? noResponseArrow(ear) : null,
    aided: !!cell.aided,
    device: cell.device ?? null,
  };
  return "shape" in cell
    ? { kind: "asha", shape: cell.shape, ...common }
    : { kind: "extension", letter: cell.letter, ...common };
};

/** Symbol of a cell; for speech, the column sets the test ear. */
const symbolOf = (cell, column, noResponse) =>
  "speech" in cell
    ? speechSymbol({ ...cell.speech, ear: SIDES[column] })
    : toneSymbol(cell, column, noResponse);

const mark = (theme, cell, x, y, column, noResponse) =>
  `<g transform="translate(${x} ${y}) scale(${SCALE})">${symbolSvg(symbolOf(cell, column, noResponse), { theme: theme.name })}</g>`;

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

/** Width of the label column and of the three side columns. */
const layout = (t, rows, extended) => {
  const colW = Math.ceil(
    Math.max(70, max(Object.values(t.headers).map((h) => textWidth(h, 12, "bold"))) + 24),
  );
  const labelWidth = max(
    rows.map((row) =>
      row.kind === "group"
        ? 8 + textWidth(row.label, 11.5, "caps")
        : row.kind === "symbols"
          ? 22 + textWidth(row.label, 12, "regular")
          : 0,
    ),
  );
  // Section titles and notes, like the closing notes, span the full width.
  const spanWidth = max([
    ...rows.flatMap((row) =>
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
  const labelW = Math.ceil(Math.max(labelWidth + PAD, spanWidth + PAD - colW * 3));
  return { colW, labelW, W: M * 2 + labelW + colW * 3 };
};

/** Drawing context of a table: language, theme and column positions. */
const context = (t, theme, { colW, labelW, W }) => ({
  t,
  theme,
  W,
  colX: (i) => M + labelW + colW * i + colW / 2,
  divider: (i, y1, y2) => {
    const x = M + labelW + colW * i;
    return `<line x1="${x}" x2="${x}" y1="${y1}" y2="${y2}" stroke="${theme.ink}" stroke-width="0.8"/>`;
  },
});

/** Column headers: modality, then the three sides in their colour. */
const header = (body, { t, theme, W, colX, divider }, y) => {
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
  return y + HEADER_H;
};

/** One function per row kind, drawing the row at `y`, `h` high. */
const ROW_RENDERERS = {
  section: (body, { theme, W }, row, y, h) => {
    body.push(`<rect x="${M}" y="${y}" width="${W - 2 * M}" height="${h}" fill="${theme.band}"/>`);
    body.push(
      `<text x="${M + 8}" y="${y + 25}" font-size="13" font-weight="700" fill="${theme.ink}">${esc(row.label)}</text>`,
    );
    if (row.note)
      body.push(
        `<text x="${M + 8}" y="${y + 25 + NOTE_H}" font-size="10.5" font-style="italic" fill="${theme.ink}">${esc(row.note)}</text>`,
      );
  },
  group: (body, { theme }, row, y) => {
    body.push(
      `<text x="${M + 8}" y="${y + 18}" font-size="11.5" font-weight="700" fill="${theme.ink}">${esc(row.label.toUpperCase())}</text>`,
    );
  },
  symbols: (body, { theme, colX, divider }, row, y, h) => {
    body.push(
      `<text x="${M + 22}" y="${y + h / 2 + 4}" font-size="12" fill="${theme.ink}">${esc(row.label)}</text>`,
    );
    COLUMNS.forEach((_, i) => body.push(divider(i, y, y + h)));
    row.cells.forEach((cell, i) => {
      const x = colX(i);
      body.push(
        `<line x1="${x}" x2="${x}" y1="${y}" y2="${y + h}" stroke="${theme.rule}" stroke-width="0.8"/>`,
      );
      // Arrows hang below the symbol: raise it a little to centre the pair.
      const cy = y + h / 2 - (row.tall ? (row.noResponse ? 6 : 0) : 2);
      if (cell) body.push(mark(theme, cell, x, cy, COLUMNS[i], !!row.noResponse));
    });
  },
};

const symbolsHeight = (row) =>
  row.tall ? (row.noResponse ? TALL_ARROW_H : TALL_H) : HEIGHTS.symbols;

const rowHeight = (row) =>
  row.kind === "symbols"
    ? symbolsHeight(row)
    : HEIGHTS[row.kind] + (row.kind === "section" && row.note ? NOTE_H : 0);

/** Table rows, each followed by a rule, inside a frame from `top`. */
const table = (body, ctx, rows, top, y) => {
  const { theme, W } = ctx;
  for (const row of rows) {
    const h = rowHeight(row);
    ROW_RENDERERS[row.kind](body, ctx, row, y, h);
    y += h;
    body.push(
      `<line x1="${M}" x2="${W - M}" y1="${y}" y2="${y}" stroke="${theme.rule}" stroke-width="0.6"/>`,
    );
  }
  body.push(
    `<rect x="${M}" y="${top}" width="${W - 2 * M}" height="${y - top}" fill="none" stroke="${theme.ink}"/>`,
  );
  return y;
};

/** Closing notes, one per line below the table. */
const notes = (body, { t, theme }, y) => {
  y += 10;
  for (const note of t.notes) {
    y += 15;
    body.push(`<text x="${M}" y="${y}" font-size="10.5" fill="${theme.ink}">${esc(note)}</text>`);
  }
  return y;
};

/** SVG document: title, licence metadata and background around the body. */
const svgDocument = (t, theme, W, H, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Helvetica, Arial, sans-serif" stroke-linecap="round" stroke-linejoin="round">
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

const render = (t, theme, extended) => {
  const ROWS = rows(t);
  const size = layout(t, ROWS, extended);
  const ctx = context(t, theme, size);
  const body = [];
  let y = M;
  body.push(
    `<text x="${M}" y="${y + 18}" font-size="17" font-weight="700" fill="${theme.ink}">${esc(t.title)}</text>`,
  );
  y += 30;
  if (extended) y = features(body, t, theme, y, size.W);
  const top = y;
  y = header(body, ctx, y);
  y = table(body, ctx, ROWS, top, y);
  y = notes(body, ctx, y);
  return svgDocument(t, theme, size.W, y + M, body);
};

const LANGUAGES = [FR, EN, DE, ES, IT, PT];

for (const t of LANGUAGES)
  for (const extended of [false, true])
    for (const theme of THEMES) {
      const name = t.file.replace(/\.svg$/, `${extended ? ".extended" : ""}${theme.suffix}.svg`);
      const out = new URL(`../docs/${name}`, import.meta.url);
      writeFileSync(out, render({ ...t, notes: tableNotes(t) }, theme, extended));
      console.log(`wrote ${out.pathname}`);
    }
