import { expect, type Locator, type Page } from "@playwright/test";

export type SortOption = "az" | "za" | "lohi" | "hilo";

export class InventoryPage {
  readonly title: Locator;
  readonly items: Locator;
  readonly sort: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(readonly page: Page) {
    this.title = page.getByTestId("title");
    this.items = page.getByTestId("inventory-item");
    this.sort = page.getByTestId("product-sort-container");
    this.cartBadge = page.getByTestId("shopping-cart-badge");
    this.cartLink = page.getByTestId("shopping-cart-link");
  }

  async goto() {
    await this.page.goto("/inventory.html");
    await expect(this.title).toHaveText("Products");
  }

  item(name: string) {
    return this.items.filter({ hasText: name });
  }

  async add(...names: string[]) {
    for (const name of names) {
      await this.item(name).getByRole("button", { name: "Add to cart" }).click();
    }
  }

  async remove(name: string) {
    await this.item(name).getByRole("button", { name: "Remove" }).click();
  }

  async sortBy(option: SortOption) {
    await this.sort.selectOption(option);
  }

  async names() {
    return this.page.getByTestId("inventory-item-name").allTextContents();
  }

  async prices() {
    const text = await this.page.getByTestId("inventory-item-price").allTextContents();
    return text.map((t) => Number(t.replace("$", "")));
  }

  async priceOf(name: string) {
    const text = await this.item(name).getByTestId("inventory-item-price").textContent();
    return Number(text!.replace("$", ""));
  }

  async openCart() {
    await this.cartLink.click();
  }
}
