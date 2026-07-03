# Framework de Automatización Playwright BDD con TypeScript

Un framework de automatización de pruebas End-to-End (E2E) moderno, escalable y ultra rápido. Está diseñado siguiendo las mejores prácticas de la industria, utilizando el patrón **Page Object Model (POM)** centralizado, TypeScript para un tipado seguro, **Playwright Test Runner** (a través de **`playwright-bdd`**) para una paralelización nativa y robusta, y el **Playwright HTML Reporter** oficial para visualizar los resultados de las pruebas.

---

## 🚀 Características Clave

*   **Playwright Test Runner**: Ejecución nativa en paralelo extremadamente rápida y con aislamiento total de hilos.
*   **Playwright BDD (`playwright-bdd`)**: Traducción y mapeo automático de escenarios de prueba Gherkin (`.feature`) a pruebas nativas de Playwright (`.spec.ts`).
*   **Page Object Model (POM)**: Clases de páginas desacopladas y gestionadas dinámicamente mediante fixtures de Playwright y un `POMManager` centralizado.
*   **Reportería Nativa**: Generación automática de reportes interactivos HTML de Playwright y reportes JUnit en XML para integrarse con herramientas de CI/CD.
*   **Filtrado por Entorno**: Configuración dinámica de navegadores, credenciales y URLs mediante un archivo `.env` local.

---

## 🛠️ Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:
*   [Node.js](https://nodejs.org/) (versión v20 o v22 LTS recomendada).

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
│   ├── step-definitions/ # Vinculación entre sentencias Gherkin y POM
│   │   ├── login-steps.ts
│   │   └── saucedemo-steps.ts
│   └── support/          # Configuración de soporte y fixtures de Playwright
│       ├── config.ts     # Carga de variables de entorno (URL y credenciales)
│       └── fixtures.ts   # Fixtures de Playwright para inyectar pomManager automáticamente
├── playwright-report/    # Carpeta autogenerada con el reporte HTML local
├── results/              # Carpeta autogenerada con reportes JUnit XML
├── playwright.config.ts  # Configuración del motor de Playwright, BDD y reportería
├── package.json          # Gestión de scripts y dependencias
└── tsconfig.json         # Configuración del compilador de TypeScript
```

---

## 💻 Comandos de Ejecución

Todos los comandos se corren desde la terminal en la raíz del proyecto:

| Comando | Descripción |
| :--- | :--- |
| `npm test` | Genera las pruebas y ejecuta los escenarios de la suite en paralelo. |
| `npm test -- --grep "@test"` | Corre únicamente los escenarios marcados con la etiqueta `@test`. |
| `npx playwright show-report` | Abre e inspecciona el reporte interactivo HTML oficial de Playwright. |
| `npx tsc --noEmit` | Valida estáticamente el código TypeScript sin compilar archivos físicos para detectar errores de tipos. |

### Visualizar el reporte de pruebas:
Al finalizar las pruebas, puedes abrir el último reporte generado ejecutando:
```bash
npx playwright show-report
```

---

## ⚡ Ejecución en Paralelo y Navegadores

### Configuración en Local:
El framework lee de forma automática la variable `BROWSER` en tu archivo `.env` local para filtrar los navegadores a ejecutar:
* Si `BROWSER=chromium` (valor por defecto), `npm test` se ejecutará **únicamente en Chromium** (ejecutando 4 pruebas en total).
* Si `BROWSER=all`, las pruebas se distribuirán en paralelo entre **Chromium, Firefox y Webkit** (ejecutando 12 pruebas en total).

### Forzar hilos y workers:
Puedes controlar la cantidad de navegadores simultáneos (workers) desde la consola:
```bash
# Limitar la ejecución a 2 workers paralelos
npx playwright test --workers=2
```

---

## 🛠️ Ejecución en Integración Continua (GitHub Actions y Azure Pipelines)

El framework incluye soporte completo para integraciones de CI/CD:

### GitHub Actions
* **Ejecución Manual:** Puedes disparar las pruebas manualmente desde la interfaz de GitHub Actions seleccionando el navegador deseado (`todos`, `chromium`, o `firefox`) y opcionalmente un filtro de tags.
* **Reportes:** El pipeline sube de forma automática el reporte oficial de Playwright (`playwright-report`) como un artefacto descargable al finalizar el flujo.

### Azure Pipelines (`azure-pipelines.yml`)
* **Parámetros:** Permite seleccionar el navegador (`todos`, `chromium`, `firefox`, `webkit`) y la etiqueta a evaluar desde la UI de Azure DevOps.
* **Integración Nativa:** Genera un archivo JUnit XML en la ruta `results/junit-results.xml` que Azure DevOps procesa de forma nativa para mostrar los gráficos de éxito/error en la pestaña de **"Tests"** del pipeline.

---

## 📸 Gestión de Evidencias (Capturas de Pantalla)

La gestión de capturas de pantalla ante fallos se realiza de manera nativa:
1. En `playwright.config.ts`, la opción `screenshot: 'only-on-failure'` está habilitada.
2. Si una prueba falla, Playwright toma automáticamente la captura de pantalla del navegador y la asocia al reporte HTML interactivo de Playwright.

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
