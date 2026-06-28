import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { config } from '../support/config';

export class SauceLoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    // Usar getByTestId nativo de Playwright (apoyado por setTestIdAttribute('data-test') en los hooks)
    this.usernameInput = page.getByTestId('username');
    this.passwordInput = page.getByTestId('password');
    this.loginButton = page.getByTestId('login-button');
  }

  async load(): Promise<void> {
    await this.navigateTo(config.baseURL);
  }

  async login(username?: string, password?: string): Promise<void> {
    const user = username || config.sauceUsername;
    const pass = password || config.saucePassword;
    await this.usernameInput.fill(user);
    await this.passwordInput.fill(pass);
    await this.loginButton.click();
  }
}
