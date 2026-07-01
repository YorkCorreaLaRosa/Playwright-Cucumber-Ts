# Playwright + Cucumber + TypeScript + Serenity/JS Framework

Un framework de automatización de pruebas End-to-End (E2E) moderno, escalable y ultra rápido. Está diseñado siguiendo las mejores prácticas de la industria, utilizando el patrón **Page Object Model (POM)** centralizado, TypeScript para un tipado seguro, **Playwright Test Runner** (a través de **`playwright-bdd`**) para una paralelización nativa y robusta, y **Serenity/JS** para generar reportes vivos de calidad empresarial con evidencias integradas ante fallos.

---

## 🚀 Características Clave

*   **Playwright Test Runner**: Ejecución nativa en paralelo extremadamente rápida y con aislamiento total de hilos.
*   **Playwright BDD (`playwright-bdd`)**: Traducción y mapeo automático de escenarios de prueba Gherkin (`.feature`) a pruebas nativas de Playwright (`.spec.ts`).
*   **Page Object Model (POM)**: Clases de páginas desacopladas y gestionadas dinámicamente mediante fixtures de Playwright y un `POMManager` centralizado.
*   **Serenity/JS Reporting**: Generación de reportes vivos y detallados mediante `@serenity-js/playwright-test`, enlazando capturas de pantalla de fallos de forma automática al reporte.
*   **Aislamiento de Navegadores**: Gestión automática y thread-safe del ciclo de vida del navegador, contextos y páginas gracias a las fixtures de Playwright.

---

## 🛠️ Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:
*   [Node.js](https://nodejs.org/) (versión v20 o v22 LTS recomendada).
*   [Java Runtime Environment (JRE) / JDK 11+](https://www.oracle.com/java/technologies/downloads/) (Requerido únicamente por la CLI de Serenity BDD para compilar los reportes HTML).

---

## 📦 Instalación y Configuración

1.  **Clonar el repositorio**:
    ```bash
    git clone https://github.com/YorkCorreaLaRosa/Playwright-Cucumber-Ts.git
    cd Playwright-Cucumber-Ts
    ```
2.  **Instalar dependencias**:
    ```bash
    npm install
    ```
3.  **Configurar variables de entorno**:
    Crea un archivo `.env` en la raíz del proyecto (este archivo está excluido en el `.gitignore` por seguridad). Puedes usar los siguientes valores por defecto:
    ```env
    BROWSER=chromium
    HEADLESS=true
    BASE_URL=https://www.saucedemo.com
    SAUCE_USERNAME=standard_user
    SAUCE_PASSWORD=secret_sauce
    ```

---

## 📂 Estructura del Proyecto

La arquitectura sigue una separación estricta de responsabilidades para facilitar el mantenimiento:

```text
playwright-cucumber-ts-framework/
├── features/             # Escenarios de negocio Gherkin (.feature)
│   ├── login.feature     
│   └── saucedemo.feature
├── src/
│   ├── pages/            # Patrón Page Object Model (POM)
│   │   ├── BasePage.ts   # Clase base con utilidades comunes de navegación/UI
│   │   ├── LoginPage.ts  # Selectores e interacciones de la página de Login
│   │   └── POMManager.ts # Centralizador y factory perezoso de Page Objects
│   ├── step-definitions/ # Vinculación entre sentencias Gherkin y POM (usando createBdd)
│   │   ├── login-steps.ts
│   │   └── saucedemo-steps.ts
│   └── support/          # Configuración de soporte y fixtures de Playwright
│       ├── config.ts     # Carga de variables de entorno y opciones de navegación
│       └── fixtures.ts   # Fixtures de Playwright para inyectar pomManager automáticamente
├── target/site/serenity/ # Directorio autogenerado con los reportes HTML
├── playwright.config.ts  # Configuración del motor de Playwright, BDD y Serenity/JS
├── package.json          # Gestión de scripts y dependencias
└── tsconfig.json         # Configuración del compilador de TypeScript
```

---

## 💻 Comandos de Ejecución

Todos los comandos se corren desde la terminal en la raíz del proyecto:

| Comando | Descripción |
| :--- | :--- |
| `npm test` | Genera las pruebas y ejecuta todos los escenarios de la suite en paralelo. |
| `npx bddgen && npx playwright test --grep "@test"` | Corre únicamente los escenarios marcados con la etiqueta `@test`. |
| `npm run report` | Genera y actualiza el reporte HTML de Serenity BDD con las últimas evidencias. |
| `npx playwright show-report` | Muestra el reporte nativo HTML de Playwright. |
| `npx tsc --noEmit` | Valida estáticamente el código TypeScript sin compilar archivos físicos para detectar errores de tipos. |

### Visualizar el reporte de Serenity BDD:
Una vez que ejecutes tus pruebas y compiles el reporte con `npm run report`, abre el siguiente archivo en tu navegador web:
📁 `target/site/serenity/index.html`

---

## ⚡ Ejecución en Paralelo

El framework corre en paralelo **de forma nativa** gracias al motor de ejecución de Playwright Test.

* **Comportamiento por defecto:** En `playwright.config.ts` se define `fullyParallel: true`. Playwright distribuirá las pruebas en múltiples workers de forma inteligente basándose en la cantidad de núcleos de CPU de tu máquina.
* **Limitar o forzar hilos:** Puedes usar el parámetro `--workers` directamente en tu consola si deseas limitar la ejecución (ideal para entornos de Integración Continua como GitHub Actions):

```bash
# Ejecutar toda la suite utilizando exactamente 4 navegadores en paralelo
npx playwright test --workers=4

# Ejecutar escenarios específicos en paralelo
npx bddgen && npx playwright test --grep "@smoke" --workers=3
```

---

## 📸 Gestión de Evidencias (Capturas de Pantalla)

La gestión de capturas de pantalla ante fallos se simplifica delegando la responsabilidad a Playwright:
1. En `playwright.config.ts`, la opción `screenshot: 'only-on-failure'` está habilitada.
2. Si una prueba falla, Playwright toma automáticamente la captura de pantalla del navegador.
3. El reportero `@serenity-js/playwright-test` intercepta esta evidencia y la incrusta de forma organizada debajo del paso exacto que falló dentro del reporte de Serenity.

---

## 💡 Guía para Escribir una Nueva Prueba

1. **Define el Escenario**: Crea o añade pasos en un archivo `.feature` dentro de `features/`.
2. **Modelado de Páginas (POM)**: Si interactúas con una nueva página, crea su clase en `src/pages/` heredando de `BasePage` y regístrala en `src/pages/POMManager.ts`.
3. **Lógica del Paso**: Crea la definición de los pasos en `src/step-definitions/` utilizando `createBdd(test)` de `playwright-bdd` e interactúa con tus páginas usando el objeto `pomManager` inyectado por las fixtures.

```typescript
import { createBdd } from 'playwright-bdd';
import { test } from '../support/fixtures';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd(test);

Given('mi nuevo paso gherkin', async ({ pomManager }) => {
  const miPagina = pomManager.getMiNuevaPagina();
  await miPagina.hacerAccion();
});
```
