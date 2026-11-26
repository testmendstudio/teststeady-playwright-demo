import type { Locator, Page } from "@playwright/test";

export class CartPage {
  readonly items: Locator;
  readonly checkoutButton: Locator;
  readonly continueShopping: Locator;

  constructor(readonly page: Page) {
    this.items = page.getByTestId("inventory-item");
    this.checkoutButton = page.getByTestId("checkout");
    this.continueShopping = page.getByTestId("continue-shopping");
  }

  async names() {
    return this.page.getByTestId("inventory-item-name").allTextContents();
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
