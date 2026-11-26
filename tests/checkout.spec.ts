import { test, expect } from "../fixtures";
import { customer, products, TAX_RATE } from "../fixtures/data";

const round = (n: number) => Math.round(n * 100) / 100;

test.describe("Checkout", () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test("buys two items and the totals add up", async ({ inventoryPage, cartPage, checkoutPage, page }) => {
    // The full purchase is the longest flow here, so it gets 3x the normal time limit.
    test.slow();
    const chosen = [products.backpack, products.boltTShirt];
    const expectedSubtotal = round(
      (await inventoryPage.priceOf(chosen[0])) + (await inventoryPage.priceOf(chosen[1])),
    );

    await inventoryPage.add(...chosen);
    await inventoryPage.openCart();
    expect(await cartPage.names()).toEqual(chosen);

    await cartPage.checkout();
    await checkoutPage.fillDetails(customer);

    const { subtotal, tax, total } = await checkoutPage.summary();
    expect(subtotal).toBe(expectedSubtotal);
    expect(tax).toBe(round(expectedSubtotal * TAX_RATE));
    expect(total).toBe(round(subtotal + tax));

    await checkoutPage.finish();
    await expect(inventoryPage.cartBadge).toBeHidden();
    await expect(page).toHaveURL(/checkout-complete\.html/);
  });

  test("postal code is required", async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.add(products.bikeLight);
    await inventoryPage.openCart();
    await cartPage.checkout();

    await checkoutPage.fillDetails({ firstName: customer.firstName, lastName: customer.lastName });
    await expect(checkoutPage.error).toContainText("Postal Code is required");
  });

  test("cancel on the details step goes back to the cart and keeps it", async ({
    inventoryPage,
    cartPage,
    checkoutPage,
    page,
  }) => {
    await inventoryPage.add(products.onesie);
    await inventoryPage.openCart();
    await cartPage.checkout();

    await checkoutPage.cancelButton.click();
    await expect(page).toHaveURL(/cart\.html/);
    expect(await cartPage.names()).toEqual([products.onesie]);
  });
});
