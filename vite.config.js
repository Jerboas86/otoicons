/// <reference types="vitest" />
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    outDir: "dist",
    lib: {
      entry: resolve(__dirname, "lib/index.ts"),
      name: "otoicons",
      fileName: "otoicons",
      formats: ["es"],
    },
  },
});
