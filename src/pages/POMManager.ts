import { Page } from '@playwright/test';
import { LoginPage } from './LoginPage';
import { SauceLoginPage } from './SauceLoginPage';
import { ProductsPage } from './ProductsPage';
import { CartPage } from './CartPage';
import { CheckoutPage } from './CheckoutPage';

export class POMManager {
  private readonly page: Page;
  private loginPage?: LoginPage;
  private sauceLoginPage?: SauceLoginPage;
  private productsPage?: ProductsPage;
  private cartPage?: CartPage;
  private checkoutPage?: CheckoutPage;

  constructor(page: Page) {
    this.page = page;
  }

  getLoginPage(): LoginPage {
    if (!this.loginPage) {
      this.loginPage = new LoginPage(this.page);
    }
    return this.loginPage;
  }

  getSauceLoginPage(): SauceLoginPage {
    if (!this.sauceLoginPage) {
      this.sauceLoginPage = new SauceLoginPage(this.page);
    }
    return this.sauceLoginPage;
  }

  getProductsPage(): ProductsPage {
    if (!this.productsPage) {
      this.productsPage = new ProductsPage(this.page);
    }
    return this.productsPage;
  }

  getCartPage(): CartPage {
    if (!this.cartPage) {
      this.cartPage = new CartPage(this.page);
    }
    return this.cartPage;
  }

  getCheckoutPage(): CheckoutPage {
    if (!this.checkoutPage) {
      this.checkoutPage = new CheckoutPage(this.page);
    }
    return this.checkoutPage;
  }
}
