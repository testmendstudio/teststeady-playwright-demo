import { expect, type Locator, type Page } from "@playwright/test";

export type Customer = { firstName: string; lastName: string; postalCode: string };

const money = (text: string | null) => Number(text!.replace(/[^0-9.]/g, ""));

export class CheckoutPage {
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly finishButton: Locator;
  readonly error: Locator;
  readonly completeHeader: Locator;

  constructor(readonly page: Page) {
    this.firstName = page.getByTestId("firstName");
    this.lastName = page.getByTestId("lastName");
    this.postalCode = page.getByTestId("postalCode");
    this.continueButton = page.getByTestId("continue");
    this.cancelButton = page.getByTestId("cancel");
    this.finishButton = page.getByTestId("finish");
    this.error = page.getByTestId("error");
    this.completeHeader = page.getByTestId("complete-header");
  }

  async fillDetails(customer: Partial<Customer>) {
    if (customer.firstName) await this.firstName.fill(customer.firstName);
    if (customer.lastName) await this.lastName.fill(customer.lastName);
    if (customer.postalCode) await this.postalCode.fill(customer.postalCode);
    await this.continueButton.click();
  }

  /** Reads the order summary on the overview step. */
  async summary() {
    const [subtotal, tax, total] = await Promise.all([
      this.page.getByTestId("subtotal-label").textContent(),
      this.page.getByTestId("tax-label").textContent(),
      this.page.getByTestId("total-label").textContent(),
    ]);
    return { subtotal: money(subtotal), tax: money(tax), total: money(total) };
  }

  async finish() {
    await this.finishButton.click();
    await expect(this.completeHeader).toHaveText("Thank you for your order!");
  }
}
