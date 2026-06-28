import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ICustomWorld } from '../support/custom-world';

Given('navego a la página de login', async function (this: ICustomWorld) {
  const loginPage = this.pomManager!.getLoginPage();
  await loginPage.load();
});

When('envío el usuario {string} y la contraseña {string}', async function (this: ICustomWorld, username: string, password: string) {
  const loginPage = this.pomManager!.getLoginPage();
  await loginPage.login(username, password);
});

Then('debería ver el mensaje de éxito que contiene {string}', async function (this: ICustomWorld, expectedMessage: string) {
  const loginPage = this.pomManager!.getLoginPage();
  await expect(loginPage.flashMessage).toContainText(expectedMessage);
});

Then('debería ver el mensaje de error que contiene {string}', async function (this: ICustomWorld, expectedMessage: string) {
  const loginPage = this.pomManager!.getLoginPage();
  await expect(loginPage.flashMessage).toContainText(expectedMessage);
});
