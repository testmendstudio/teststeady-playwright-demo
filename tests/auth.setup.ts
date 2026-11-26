import { test as setup, expect } from "@playwright/test";
import { STORAGE_STATE } from "../playwright.config";
import { PASSWORD, users } from "../fixtures/data";
import { LoginPage } from "../pages/LoginPage";

// Runs once before the browser projects. Saves the signed-in session to a file
// so the other tests skip the login screen and stay fast.
setup("sign in as standard user", async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(users.standard, PASSWORD);
  await expect(page).toHaveURL(/inventory\.html/);
  await page.context().storageState({ path: STORAGE_STATE });
});
