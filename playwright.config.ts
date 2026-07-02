import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import * as dotenv from 'dotenv';

// Cargar variables de entorno del archivo .env
dotenv.config();

const testDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps: ['src/step-definitions/**/*.ts', 'src/support/fixtures.ts'],
});

// Definir todos los proyectos disponibles
const allProjects = [
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
  },
  {
    name: 'firefox',
    use: { ...devices['Desktop Firefox'] },
  },
  {
    name: 'webkit',
    use: { ...devices['Desktop Safari'] },
  },
];

// Leer variable BROWSER del archivo .env
const selectedBrowser = process.env.BROWSER;

// Filtrar proyectos si la variable BROWSER está definida en el .env y no es 'all'
const projects = selectedBrowser && selectedBrowser !== 'all'
  ? allProjects.filter(project => project.name === selectedBrowser)
  : allProjects;

export default defineConfig({
  testDir,
  /* Timeout por cada prueba */
  timeout: 30000,
  expect: {
    /* Timeout máximo para aserciones (como toContainText) */
    timeout: 5000,
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['junit', { outputFile: 'results/junit-results.xml' }],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Ejecutar en modo headless basándose en la variable del .env */
    headless: process.env.HEADLESS !== 'false',
    /* Opciones de lanzamiento del navegador */
    launchOptions: {
      slowMo: 0,
      args: [
        '--start-maximized',
        '--use-fake-ui-for-media-stream',
        '--use-fake-device-for-media-stream',
      ],
    },
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    testIdAttribute: 'data-test',
  },

  /* Configure projects dynamically based on .env */
  projects,
});
