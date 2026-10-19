import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // localhost, not 127.0.0.1: next dev's HMR websocket rejects the 127.0.0.1 host header, and Turbopack's dev
  // client holds hydration until that connection settles. The static server answers on both.
  use: { baseURL: "http://localhost:3100" },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: {
    command: process.env.CI ? "npm run build && node scripts/serve-static.mjs out 3100" : "npx next dev -p 3100",
    url: "http://localhost:3100",
    reuseExistingServer: !process.env.CI,
    timeout: process.env.CI ? 300_000 : 120_000,
  },
});
