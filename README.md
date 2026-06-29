# Playwright + Cucumber + TypeScript + Serenity/JS Framework

Un framework de automatización de pruebas End-to-End (E2E) moderno, escalable y robusto. Está diseñado siguiendo las mejores prácticas de la industria, utilizando el patrón **Page Object Model (POM)** centralizado, TypeScript para un tipado seguro y **Serenity/JS** para generar reportes vivos de calidad empresarial con capturas de pantalla integradas ante fallos.

---

## 🚀 Características Clave

*   **Playwright**: Automatización de navegadores ultra rápida, estable y con auto-esperas inteligentes.
*   **Cucumber (BDD)**: Escenarios de prueba definidos en lenguaje Gherkin natural para alineación de negocio/desarrollo.
*   **Page Object Model (POM)**: Clases de páginas desacopladas y gestionadas dinámicamente mediante un `POMManager` centralizado.
*   **Serenity/JS Reporting**: Genera reportes interactivos completos, estructurando las evidencias y capturas de pantalla exactamente en el paso fallido de la prueba.
*   **Sincronización de Timeouts**: Prevención de terminaciones bruscas de Cucumber mediante la alineación del timeout del paso con el del navegador.

---

## 🛠️ Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:
*   [Node.js](https://nodejs.org/) (versión v16 o superior).
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

La arquitectura sigue una clara separación de responsabilidades para facilitar el mantenimiento y la escalabilidad:

```text
playwright-cucumber-ts-framework/
├── features/             # Escenarios de negocio Gherkin (.feature)
│   └── login.feature     
├── src/
│   ├── pages/            # Patrón Page Object Model (POM)
│   │   ├── BasePage.ts   # Clase base con utilidades comunes de navegación/UI
│   │   ├── LoginPage.ts  # Selectores e interacciones de la página de Login
│   │   └── POMManager.ts # Centralizador y factory perezoso de Page Objects
│   ├── step-definitions/ # Vinculación entre sentencias Gherkin y POM
│   │   └── login-steps.ts
│   └── support/          # Configuración y ciclo de vida de los tests
│       ├── config.ts     # Carga de variables de entorno y opciones de navegación
│       ├── custom-world.ts # Configuración del contexto compartido de Cucumber
│       ├── hooks.ts      # Configuración de Setup/Teardown y screenshots en fallos
│       └── serenity.config.ts # Configuración de reportes de Serenity BDD
├── target/site/serenity/ # Directorio autogenerado con los reportes HTML
├── package.json          # Gestión de scripts y dependencias
└── tsconfig.json         # Configuración del compilador de TypeScript
```

---

## 💻 Comandos de Ejecución

Todos los comandos se corren desde la terminal en la raíz del proyecto:

| Comando | Descripción |
| :--- | :--- |
| `npm test` | Ejecuta todos los escenarios de Cucumber en la suite. |
| `npx cucumber-js --tags "@test"` | Corre únicamente los escenarios marcados con la etiqueta `@test`. |
| `npm run report` | Genera y actualiza el reporte HTML de Serenity BDD con las últimas evidencias. |
| `npx tsc --noEmit` | Valida estáticamente el código TypeScript sin compilar archivos físicos para detectar errores de tipos. |

### Visualizar el reporte de pruebas:
Una vez que ejecutes tus pruebas y compiles el reporte con `npm run report`, abre el siguiente archivo en tu navegador web:
📁 `target/site/serenity/index.html`

---

## 📸 Gestión de Capturas de Pantalla (Evidencias)

El framework utiliza un sistema coordinado en caso de fallos:
1.  **Custom Tracker**: En `serenity.config.ts` se implementa un Stage Observer que captura el identificador exacto (`activityId`) del paso que falló.
2.  **Captura dinámica**: Al finalizar el escenario en `hooks.ts` (`After`), si el test falló, Playwright toma un screenshot.
3.  **Vinculación**: Se anuncia a Serenity/JS mediante el evento `ActivityRelatedArtifactGenerated`, logrando que la captura aparezca incrustada exactamente debajo del paso fallido en el reporte visual.

---

## 💡 Guía para Escribir una Nueva Prueba

1.  **Define el Escenario**: Crea o añade pasos en un archivo `.feature` dentro de `features/`.
2.  **Modelado de Páginas (POM)**: Si interactúas con una nueva página, crea su clase en `src/pages/` heredando de `BasePage` y regístrala en `src/pages/POMManager.ts`.
3.  **Lógica del Paso**: Crea la definición de los pasos en `src/step-definitions/` y realiza las aserciones con `expect(locator).toBe...` de Playwright.
