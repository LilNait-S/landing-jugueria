import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: "http://localhost:3000",
    browserName: "chromium",
    channel: "msedge",
  },
  reporter: "list",
  outputDir: "artifacts/test-results",
});
