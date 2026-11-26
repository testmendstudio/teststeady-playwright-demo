import { test, expect } from "../fixtures";
import { products } from "../fixtures/data";

test.describe("Products page", () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test("sorts by price, low to high", async ({ inventoryPage }) => {
    await inventoryPage.sortBy("lohi");
    const prices = await inventoryPage.prices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test("sorts by price, high to low", async ({ inventoryPage }) => {
    await inventoryPage.sortBy("hilo");
    const prices = await inventoryPage.prices();
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  test("sorts by name, Z to A", async ({ inventoryPage }) => {
    await inventoryPage.sortBy("za");
    const names = await inventoryPage.names();
    expect(names).toEqual([...names].sort().reverse());
  });

  test("cart badge counts items as they are added and removed", async ({ inventoryPage }) => {
    await expect(inventoryPage.cartBadge).toBeHidden();

    await inventoryPage.add(products.backpack, products.bikeLight);
    await expect(inventoryPage.cartBadge).toHaveText("2");

    await inventoryPage.remove(products.backpack);
    await expect(inventoryPage.cartBadge).toHaveText("1");
  });

  test("cart keeps its items after a page reload", async ({ inventoryPage, page }) => {
    await inventoryPage.add(products.onesie);
    await page.reload();
    await expect(inventoryPage.cartBadge).toHaveText("1");
    await expect(inventoryPage.item(products.onesie).getByRole("button", { name: "Remove" })).toBeVisible();
  });
});
