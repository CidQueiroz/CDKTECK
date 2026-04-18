/** @type {import('vitest/config').defineConfig} */

import path from "path";

// Configuração de testes com Vitest
// Instale com: npm install --save-dev vitest @testing-library/react jsdom
export default {
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: [],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/command-center/**/*.{ts,tsx}"],
      exclude: [
        "node_modules/",
        "src/command-center/**/*.test.{ts,tsx}",
        "src/command-center/**/*.spec.{ts,tsx}",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
};
