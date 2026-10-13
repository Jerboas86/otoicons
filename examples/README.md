# Examples

Each example imports `otoicons` as an application would; inside this
repository, the import resolves to the local build. Build it first:

```sh
pnpm install
pnpm build
```

The TypeScript examples run directly with Node (≥ 22.18, which strips types
natively). Generated files go to `examples/out/`.

| Example                        | Shows                                                                                                                        |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| [`basic.ts`](basic.ts)         | `audiogramSymbol` on a few measurements: ASHA or extension symbol, colour, no-response arrow; `symbolSvg` output.            |
| [`audiogram.ts`](audiogram.ts) | A full audiogram, light and dark: grid, air and bone conduction of both ears, masking, no response.                          |
| [`aided.ts`](aided.ts)         | Aided measurements: the ISO 8253-3 diamond and device numbers, on pure-tone and speech symbols, with their legend.           |
| [`speech.ts`](speech.ts)       | A speech audiogram (ISO 8253-3): score versus level, with the table C.3 symbols and their legend.                            |
| [`browser.html`](browser.html) | Live symbol picker in the browser: choose the measurement axes, see the symbol and the object returned by `audiogramSymbol`. |

```sh
node examples/basic.ts
node examples/audiogram.ts   # → examples/out/audiogram[.dark].svg
node examples/aided.ts       # → examples/out/aided.svg
node examples/speech.ts      # → examples/out/speech-audiogram.svg
```

`browser.html` loads the library as a module, which browsers refuse over
`file://`. Either build a standalone page, with the library inlined, that
opens straight from the disk:

```sh
pnpm examples:standalone     # → examples/out/browser.html
```

or serve the repository root, then open
<http://localhost:8000/examples/browser.html>:

```sh
python3 -m http.server
```
