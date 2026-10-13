# otoicons

Symbols for pure-tone measurements on an audiogram: the ASHA symbols (1990),
completed by an extension for the measurements the standard does not cover.
No dependencies.

The table is available in English, French, German, Spanish, Italian and
Portuguese, on a light and on a black background:
`docs/symbols.<locale>[.dark].svg`.

![Audiometric symbols](docs/symbols.en.svg)

## Features

1. **ASHA compliant.** Every symbol of the ASHA "Guidelines for Audiometric
   Symbols" (1990): air and bone conduction, masked and unmasked, sound field,
   acoustic reflexes, with their offset from the frequency line and the
   no-response arrow.
2. **Completes ASHA the way ASHA asks.** The standard leaves aided conditions
   to "locally determined symbols", distinct from all others and defined on
   the audiogram. The extension provides them, together with MCL, UCL and
   diotic presentation, and documents them in every table.
3. **Aided side at a glance.** A subscript tells whether the right aid, the
   left aid or both were worn.
4. **CROS and BiCROS.** The subscript names the receiver side and marks the
   contralateral transmitter's microphone.
5. **One colour, one rule.** Colour always means the stimulated side — red
   right, blue left, green not lateralised — aided or not, so it reads the
   same everywhere on the audiogram.
6. **Constant contrast.** Each colour is tuned to the same 5:1 WCAG contrast
   against its background: no side outweighs another, and legibility does
   not depend on the theme. A test guards the ratio.
7. **Light and dark themes.** Identical shapes, a palette for each background.
8. **Multilingual.** English, French, German, Spanish, Italian and Portuguese.
   Symbols and letters are shared; only the subscript initials follow the
   language, and every locale has its own illustrative table.
9. **Vector and raster.** SVG for any size, PNG for tools that need images;
   symbols and tables alike.
10. **Ready to place.** Each file is centred on the measurement point, on a
    transparent background; `manifest.json` describes every file for
    automated use. At runtime, `symbolSvg` draws the same symbols from the
    measurement itself.
11. **Open.** Code under Apache 2.0, symbol files and tables under CC BY 4.0.

## Installation

```sh
npm install otoicons
```

The symbol files (SVG and PNG, six locales, light and dark themes) and the
illustrative tables are attached to every
[GitHub release](https://github.com/Jerboas86/otoicons/releases) as
`otoicons-bundle-<version>.zip`.

## Usage

```ts
import { audiogramSymbol } from "otoicons";

audiogramSymbol({
  measure: "threshold",
  transducer: "sound_field",
  ear: null,
  masked: false,
  no_response: true,
  aided: { right: "hearing_aid", left: null },
});
// → { kind: "extension", letter: "A", aid_index: "right", ear: null,
//     color: "green", no_response_arrow: "down" }
```

The function only reads the axes that determine the symbol (`SymbolAxes`); a
measurement carrying other data can be passed as is.

- `ashaSymbol`: the ASHA symbol alone, `null` when the standard defines none.
- `ASHA_SHAPES`, `ASHA_ARROW_ANCHORS`, `noResponseArrowPath`: SVG paths of
  the shapes and of the no-response arrows.
- `AID_INDEX_LETTERS`: subscript letters per locale, the initial of the side:
  R/L (`en`, `de`), D/G (`fr`), D/I (`es`), D/S (`it`), D/E (`pt`); `M` (the
  CROS transmitter's microphone) is shared by all.
- `symbolSvg`: SVG element of a symbol, centred on the measurement point, in
  the `light` or `dark` theme.

## Principles

- **ASHA symbols.** Shapes from table 1 of "Guidelines for Audiometric
  Symbols" (ASHA, 1990), including their offset from the frequency line.
- **Extension.** ASHA defines no symbol for aided measurements and asks for
  "locally determined symbols", exclusive of any other symbols and defined on
  the audiogram. It does not cover MCL, UCL nor diotic presentation under
  earphones either. The extension uses letters: `A` (aided threshold),
  `M`/`MA` (unaided/aided MCL), `U`/`UA` (unaided/aided UCL), `B` (diotic
  presentation).
- **Aid subscript.** A capital subscript: right or left aid only; for a CROS
  or BiCROS, the receiver side followed by `M` for the contralateral
  transmitter. No subscript with two hearing aids.
- **Colour.** Widespread convention, not part of the standard: red right,
  blue left, green when not lateralised. It always represents the stimulated
  side, aided or not. Contrast is constant, not colour: each hue is adjusted
  in lightness for a 5:1 WCAG contrast against the background, in the light
  and dark themes alike (`SIDE_COLORS`).
- **No response.** Arrow attached to the bottom of the symbol, 45° outward;
  straight down when not lateralised.

## Limitations

- The shapes were traced from a low-resolution reproduction of the ASHA
  table.
- Speech audiometry has no symbols yet: those of ISO 8253-3:2022 (clause 14)
  have not been consulted.
- The table translations have not been reviewed by native-speaking
  audiologists.

## Development

```sh
pnpm install
pnpm test        # unit tests
pnpm build       # dist/: JavaScript and type declarations
pnpm bundle      # docs/ tables and bundle/
```

Pushing a `v<version>` tag publishes the package to npm and attaches the
bundle to a GitHub release (`.github/workflows/release.yml`).

## Documentation and bundle

- `pnpm doc` regenerates the tables `docs/symbols.<locale>.svg`, their
  extended versions with the kit features (`.extended.svg`) and the
  black-background versions of both (`.dark.svg`), in the six locales.
- `pnpm bundle` regenerates the tables, then builds `bundle/`, organised by
  locale: one file per symbol, with and without the no-response arrow, in the
  `light` and `dark` themes, as SVG and PNG. At the root: a README describing
  how to use the bundle, the illustrative tables and `manifest.json`.
  - `bundle/README.md`, `bundle/manifest.json`
  - `bundle/symbols.<locale>[.extended][.dark].{svg,png}`
  - `bundle/<locale>/<theme>/<name>.{svg,png}`

`symbolSvg` produces the same rendering at runtime, to draw an audiogram.

## Sources

- ASHA, [Guidelines for Audiometric Symbols](https://www.asha.org/policy/gl1990-00006/), 1990.
- ISO 8253-3:2022, Acoustics — Audiometric test methods — Part 3: Speech audiometry.

## License

The source code, including the SVG paths in `lib/` and the scripts in
`scripts/`, is released under the [Apache 2.0 license](LICENSE).

The tables in `docs/` and the files of the bundle (SVG and PNG) are released
under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Every SVG file
names its author and license.

These licenses cover the presentation of the tables and the extension
(letters, subscripts, conventions). They do not cover the symbols nor the
text of the ASHA guidelines, cited as the source. This work is neither
published nor endorsed by ASHA, and the license grants no right to use its
name to present software as approved or certified by it.
