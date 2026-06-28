import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ICustomWorld } from '../support/custom-world';

Given('navego a la página de login de SauceDemo', async function (this: ICustomWorld) {
  await this.pomManager!.getSauceLoginPage().load();
});

Given('inicio sesión con credenciales válidas', async function (this: ICustomWorld) {
  await this.pomManager!.getSauceLoginPage().login();
});

When('agrego {string} y {string} al carrito', async function (this: ICustomWorld, item1: string, item2: string) {
  const productsPage = this.pomManager!.getProductsPage();
  await productsPage.addItemToCart(item1);
  await productsPage.addItemToCart(item2);
});

Then('el carrito de compras debería mostrar {int} artículos', async function (this: ICustomWorld, expectedCount: number) {
  const productsPage = this.pomManager!.getProductsPage();
  if (expectedCount === 0) {
    await expect(productsPage.shoppingCartBadge).toBeHidden();
  } else {
    await expect(productsPage.shoppingCartBadge).toHaveText(expectedCount.toString());
  }
});

When('hago clic en el carrito de compras', async function (this: ICustomWorld) {
  await this.pomManager!.getProductsPage().clickShoppingCart();
});

Then('debería ver {string} y {string} en el carrito', async function (this: ICustomWorld, item1: string, item2: string) {
  const cartPage = this.pomManager!.getCartPage();
  await expect(cartPage.cartItemNames).toContainText([item1, item2]);
});

When('hago clic en checkout', async function (this: ICustomWorld) {
  await this.pomManager!.getCartPage().clickCheckout();
});

When('ingreso los datos de envío {string} {string} {string}', async function (this: ICustomWorld, first: string, last: string, zip: string) {
  await this.pomManager!.getCheckoutPage().fillInformation(first, last, zip);
});

When('completo la compra', async function (this: ICustomWorld) {
  await this.pomManager!.getCheckoutPage().clickFinish();
});

Then('debería ver el mensaje de éxito de la compra {string}', async function (this: ICustomWorld, expectedMessage: string) {
  const checkoutPage = this.pomManager!.getCheckoutPage();
  await expect(checkoutPage.completeHeader).toHaveText(expectedMessage);
});

When('selecciono la opción de ordenamiento {string}', async function (this: ICustomWorld, option: string) {
  await this.pomManager!.getProductsPage().selectSortOption(option);
});

Then('los productos deberían estar ordenados por precio de forma ascendente', async function (this: ICustomWorld) {
  const prices = await this.pomManager!.getProductsPage().getProductPrices();
  for (let i = 0; i < prices.length - 1; i++) {
    expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
  }
});
