import { createBdd } from 'playwright-bdd';
import { test } from '../support/fixtures';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd(test);

Given('navego a la página de login de SauceDemo', async ({ pomManager }) => {
  await pomManager.getSauceLoginPage().load();
});

Given('inicio sesión con credenciales válidas', async ({ pomManager }) => {
  await pomManager.getSauceLoginPage().login();
});

When('agrego {string} y {string} al carrito', async ({ pomManager }, item1: string, item2: string) => {
  const productsPage = pomManager.getProductsPage();
  await productsPage.addItemToCart(item1);
  await productsPage.addItemToCart(item2);
});

Then('el carrito de compras debería mostrar {int} artículos', async ({ pomManager }, expectedCount: number) => {
  const productsPage = pomManager.getProductsPage();
  if (expectedCount === 0) {
    await expect(productsPage.shoppingCartBadge).toBeHidden();
  } else {
    await expect(productsPage.shoppingCartBadge).toHaveText(expectedCount.toString());
  }
});

When('hago clic en el carrito de compras', async ({ pomManager }) => {
  await pomManager.getProductsPage().clickShoppingCart();
});

Then('debería ver {string} y {string} en el carrito', async ({ pomManager }, item1: string, item2: string) => {
  const cartPage = pomManager.getCartPage();
  await expect(cartPage.cartItemNames).toContainText([item1, item2]);
});

When('hago clic en checkout', async ({ pomManager }) => {
  await pomManager.getCartPage().clickCheckout();
});

When('ingreso los datos de envío {string} {string} {string}', async ({ pomManager }, first: string, last: string, zip: string) => {
  await pomManager.getCheckoutPage().fillInformation(first, last, zip);
});

When('completo la compra', async ({ pomManager }) => {
  await pomManager.getCheckoutPage().clickFinish();
});

Then('debería ver el mensaje de éxito de la compra {string}', async ({ pomManager }, expectedMessage: string) => {
  const checkoutPage = pomManager.getCheckoutPage();
  await expect(checkoutPage.completeHeader).toHaveText(expectedMessage);
});

When('selecciono la opción de ordenamiento {string}', async ({ pomManager }, option: string) => {
  await pomManager.getProductsPage().selectSortOption(option);
});

Then('los productos deberían estar ordenados por precio de forma ascendente', async ({ pomManager }) => {
  const prices = await pomManager.getProductsPage().getProductPrices();
  for (let i = 0; i < prices.length - 1; i++) {
    expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
  }
});
