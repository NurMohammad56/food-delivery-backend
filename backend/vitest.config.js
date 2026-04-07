import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["./tests/setup/vitest.setup.js"],
    globals: true,
    minThreads: 1,
    maxThreads: 1,
    restoreMocks: true,
    clearMocks: true,
  },
});
