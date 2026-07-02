import * as dotenv from 'dotenv';

// Cargar variables de entorno del archivo .env al inicio
dotenv.config();

export const config = {
  baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
  sauceUsername: process.env.SAUCE_USERNAME || 'standard_user',
  saucePassword: process.env.SAUCE_PASSWORD || 'secret_sauce'
};
