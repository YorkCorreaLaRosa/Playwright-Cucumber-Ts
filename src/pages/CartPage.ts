import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartItemNames: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItemNames = page.locator('.inventory_item_name');
    // Usar getByTestId nativo para el botón de checkout
    this.checkoutButton = page.getByTestId('checkout');
  }

  async getCartItemNames(): Promise<string[]> {
    return this.cartItemNames.allTextContents();
  }

  async clickCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
