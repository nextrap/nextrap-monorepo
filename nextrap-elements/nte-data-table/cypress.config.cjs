const { defineConfig } = require('cypress');

module.exports = defineConfig({
  component: {
    supportFile: 'cypress/support/component.ts',
    devServer: {
      bundler: 'vite',
    },
    indexHtmlFile: 'cypress/support/component-index.html',
  },
  e2e: {
    baseUrl: 'http://localhost:4000',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    video: false,
    screenshotOnRunFailure: true,
    viewportWidth: 1280,
    viewportHeight: 720,
  },
  experimentalWebKitSupport: true,
});
