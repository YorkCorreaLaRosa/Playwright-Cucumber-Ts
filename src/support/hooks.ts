import { BeforeAll, AfterAll, Before, After, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, firefox, Browser, selectors } from '@playwright/test';
import { ICustomWorld } from './custom-world';
import { config } from './config';
import { POMManager } from '../pages/POMManager';
import { serenity } from '@serenity-js/core';
import { ArtifactGenerated, ActivityRelatedArtifactGenerated } from '@serenity-js/core/lib/events';
import { Photo, Name } from '@serenity-js/core/lib/model';
import { failureTracker } from './serenity.config';

setDefaultTimeout(config.defaultTimeout);

let browser: Browser;

BeforeAll(async function () {
  // Configurar Playwright para reconocer data-test como atributo de test id por defecto
  selectors.setTestIdAttribute('data-test');

  // Elegir el motor de navegación según la configuración del archivo config (leído del .env)
  const browserName = config.browserName.toLowerCase();
  if (browserName === 'firefox') {
    browser = await firefox.launch(config.browserOptions);
  } else {
    // Por defecto se ejecuta en chromium (Chrome)
    browser = await chromium.launch(config.browserOptions);
  }
});

Before(async function (this: ICustomWorld) {
  this.browser = browser;

  // Si se ejecuta sin interfaz (headless) se fija un viewport estándar (1280x720) para estabilidad de capturas de pantalla.
  // Si es con interfaz (headed), se configura viewport: null para que se adapte al tamaño maximizado de la pantalla física.
  const isHeadless = config.browserOptions.headless;
  this.context = await browser.newContext({
    viewport: isHeadless ? { width: 1280, height: 720 } : null,
  });

  this.page = await this.context.newPage();
  this.page.setDefaultTimeout(config.defaultTimeout);
  this.pomManager = new POMManager(this.page);
});

After(async function (this: ICustomWorld, scenario) {
  if (scenario.result?.status === Status.FAILED) {
    if (this.page) {
      try {
        const image = await this.page.screenshot();
        
        // Adjuntar en reporte estándar de Cucumber
        await this.attach(image, 'image/png');
        
        // Anunciar a Serenity/JS para que lo archive y enlace al reporte
        if (failureTracker.lastFailedActivityId) {
          serenity.announce(new ActivityRelatedArtifactGenerated(
            failureTracker.lastSceneId,
            failureTracker.lastFailedActivityId,
            new Name('Screenshot on failure'),
            Photo.fromBuffer(image),
            serenity.currentTime()
          ));
        } else {
          // Fallback a nivel de escena si no hay actividad específica registrada
          serenity.announce(new ArtifactGenerated(
            serenity.currentSceneId(),
            new Name('Screenshot on failure'),
            Photo.fromBuffer(image),
            serenity.currentTime()
          ));
        }
      } catch (err) {
        console.error('Error al tomar o adjuntar captura de pantalla:', err);
      }
    }
  }
  if (this.page) {
    await this.page.close();
  }
  if (this.context) {
    await this.context.close();
  }
});

AfterAll(async function () {
  if (browser) {
    await browser.close();
  }
});
