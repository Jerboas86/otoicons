import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "otocon",
    globals: true,
    environment: "node",
    coverage: {
      enabled: true,
      thresholds: {
        lines: 60,
        statements: 60,
        branches: 35,
      },
      reporter: ["text", "json", "html"],
      include: ["lib/**/*"],
      exclude: ["lib/index.ts", "**/constants.ts", "**/*.test.ts", "**/types.ts", "**/*.d.ts"],
    },
  },
});
