import { test, expect } from "../fixtures";
import { PASSWORD, users } from "../fixtures/data";

// These tests are about the login screen itself, so they start signed out.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Login", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test("standard user lands on the products page", async ({ loginPage, inventoryPage, page }) => {
    await loginPage.login(users.standard, PASSWORD);
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.title).toHaveText("Products");
    await expect(inventoryPage.items).toHaveCount(6);
  });

  test("locked-out user sees a clear error", async ({ loginPage }) => {
    await loginPage.login(users.lockedOut, PASSWORD);
    await loginPage.expectError("Sorry, this user has been locked out.");
  });

  test("wrong password is rejected", async ({ loginPage, page }) => {
    await loginPage.login(users.standard, "not-the-password");
    await loginPage.expectError("Username and password do not match");
    await expect(page).not.toHaveURL(/inventory/);
  });

  const missing = [
    { case: "username", user: "", pass: PASSWORD, message: "Username is required" },
    { case: "password", user: users.standard, pass: "", message: "Password is required" },
  ];
  for (const { case: field, user, pass, message } of missing) {
    test(`missing ${field} is required`, async ({ loginPage }) => {
      await loginPage.login(user, pass);
      await loginPage.expectError(message);
    });
  }

  test("signed-out visitors cannot open the products page", async ({ page, loginPage }) => {
    await page.goto("/inventory.html");
    await loginPage.expectError("You can only access '/inventory.html' when you are logged in.");
  });
});
