import { createBdd } from 'playwright-bdd';
import { test } from '../support/fixtures';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd(test);

Given('navego a la página de login', async ({ pomManager }) => {
  const loginPage = pomManager.getLoginPage();
  await loginPage.load();
});

When('envío el usuario {string} y la contraseña {string}', async ({ pomManager }, username: string, password: string) => {
  const loginPage = pomManager.getLoginPage();
  await loginPage.login(username, password);
});

Then('debería ver el mensaje de éxito que contiene {string}', async ({ pomManager }, expectedMessage: string) => {
  const loginPage = pomManager.getLoginPage();
  await expect(
    loginPage.flashMessage,
    `Error de Login: Se esperaba encontrar el mensaje de éxito "${expectedMessage}" en el contenedor, pero no apareció.`
  ).toContainText(expectedMessage);
});

Then('debería ver el mensaje de error que contiene {string}', async ({ pomManager }, expectedMessage: string) => {
  const loginPage = pomManager.getLoginPage();
  await expect(
    loginPage.flashMessage,
    `Error de Login: Se esperaba encontrar el mensaje de error "${expectedMessage}" en el contenedor, pero no apareció.`
  ).toContainText(expectedMessage);
});
