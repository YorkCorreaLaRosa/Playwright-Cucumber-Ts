import * as dotenv from 'dotenv';
import { LaunchOptions } from '@playwright/test';

// Cargar variables de entorno del archivo .env al inicio
dotenv.config();

const browserOptions: LaunchOptions = {
  headless: process.env.HEADLESS !== 'false', // Lee del .env, por defecto es true
  slowMo: 0,
  args: [
    '--start-maximized', // Abre la ventana del navegador maximizada en modo headed
    '--use-fake-ui-for-media-stream', 
    '--use-fake-device-for-media-stream'
  ]
};

export const config = {
  browserName: process.env.BROWSER || 'chromium', // 'chromium' o 'firefox'
  browserOptions,
  baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
  defaultTimeout: 30000, // 30 segundos
  sauceUsername: process.env.SAUCE_USERNAME || 'standard_user',
  saucePassword: process.env.SAUCE_PASSWORD || 'secret_sauce'
};
