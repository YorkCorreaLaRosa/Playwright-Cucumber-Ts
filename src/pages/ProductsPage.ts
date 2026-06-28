import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  readonly shoppingCartBadge: Locator;
  readonly shoppingCartLink: Locator;
  readonly sortDropdown: Locator;
  readonly productPrices: Locator;

  constructor(page: Page) {
    super(page);
    this.shoppingCartBadge = page.locator('.shopping_cart_badge');
    this.shoppingCartLink = page.locator('.shopping_cart_link');
    // Usar getByTestId nativo para el dropdown de ordenación
    this.sortDropdown = page.getByTestId('product-sort-container');
    this.productPrices = page.locator('.inventory_item_price');
  }

  async addItemToCart(itemName: string): Promise<void> {
    const itemContainer = this.page.locator('.inventory_item', { hasText: itemName });
    // Localizar el botón usando getByRole e ignorando mayúsculas/minúsculas (best practice)
    const addButton = itemContainer.getByRole('button', { name: /add to cart/i });
    await addButton.click();
  }

  async getShoppingCartCount(): Promise<number> {
    const isVisible = await this.shoppingCartBadge.isVisible();
    if (!isVisible) return 0;
    const text = await this.shoppingCartBadge.textContent();
    return text ? parseInt(text, 10) : 0;
  }

  async clickShoppingCart(): Promise<void> {
    await this.shoppingCartLink.click();
  }

  async selectSortOption(optionValue: string): Promise<void> {
    await this.sortDropdown.selectOption(optionValue);
  }

  async getProductPrices(): Promise<number[]> {
    const priceTexts = await this.productPrices.allTextContents();
    return priceTexts.map(text => parseFloat(text.replace('$', '')));
  }
}
