import { test as base } from 'playwright-bdd';
import { POMManager } from '../pages/POMManager';

export const test = base.extend<{ pomManager: POMManager }>({
  pomManager: async ({ page }, use) => {
    const pomManager = new POMManager(page);
    await use(pomManager);
  },
});
