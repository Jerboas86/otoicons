// Builds examples/out/browser.html: examples/browser.html with the library
// inlined, a single file that opens from the disk (file://), without a
// server. Run with `pnpm examples:standalone` (builds dist/otoicons.js first).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

const page = read("browser.html");
const lib = read("../dist/otoicons.js");

// `export { a as X, … }` → an object holding the exports, in the same module.
const EXPORT = /^export \{([^}]*)\};?\s*$/m;
const exports = lib.match(EXPORT);
if (!exports) throw new Error("dist/otoicons.js: export statement not found");
const members = exports[1]
  .split(",")
  .map((s) => s.trim().split(/\s+as\s+/))
  .map(([local, name = local]) => `${name}: ${local}`);
const inlined = lib.replace(EXPORT, `const otoicons = { ${members.join(", ")} };`);

// Keeps the example script only: the import map and the checks for a
// missing build or an opening over file:// have no purpose once inlined.
const IMPORT = /import (\{[^}]*\}) from "otoicons";/;
const SCRIPT = /\n?[ \t]*<script\b[^>]*>[\s\S]*?<\/script>/g;
let found = false;
const html = page.replace(SCRIPT, (script) => {
  if (!IMPORT.test(script)) return "";
  found = true;
  return script.replace(IMPORT, (_, names) => `${inlined}\nconst ${names} = otoicons;`);
});
if (!found) throw new Error('browser.html: no script importing "otoicons"');

const out = new URL("out/", import.meta.url);
mkdirSync(out, { recursive: true });
const file = new URL("browser.html", out);
writeFileSync(file, html);
console.log(`Written ${file.pathname}`);
