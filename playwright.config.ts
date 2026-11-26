import { defineConfig, devices } from "@playwright/test";

const isCI = !!process.env.CI;
export const STORAGE_STATE = "playwright/.auth/standard-user.json";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: isCI,
  // Retries hide flakiness, so we keep them low and let the report show any test that needed one.
  retries: isCI ? 1 : 0,
  // CI runs one browser per job. Locally all three run at once, so keep the count low
  // or a laptop's CPU becomes the bottleneck and tests time out for no real reason.
  workers: isCI ? 2 : 3,
  reporter: isCI
    ? [["github"], ["blob"]]
    : [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "https://www.saucedemo.com",
    // The demo store marks its elements with data-test="...".
    testIdAttribute: "data-test",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    // Video is recorded for every test and thrown away if it passes, which is heavy on a laptop.
    // CI keeps it; locally the trace already shows each step.
    video: isCI ? "retain-on-failure" : "off",
  },
  projects: [
    // Logs in once and saves the session so other tests start already signed in.
    { name: "setup", testMatch: /auth\.setup\.ts/ },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE },
      dependencies: ["setup"],
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"], storageState: STORAGE_STATE },
      dependencies: ["setup"],
      // Firefox on a Windows laptop can hang opening tabs when it shares the CPU with other
      // browsers. One Firefox test at a time locally; CI (Linux, own job) is unaffected.
      workers: isCI ? undefined : 1,
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"], storageState: STORAGE_STATE },
      dependencies: ["setup"],
    },
  ],
});
