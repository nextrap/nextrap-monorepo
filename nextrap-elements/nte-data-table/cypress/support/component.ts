/// <reference types="cypress" />

// Import commands.js using ES2015 syntax:
import './commands';

import { mount } from 'cypress-lit';

// Import component styles
import '../../src/components/nte-data-table/nte-data-table.scss';

// Import the component
import { NteDataTable } from '../../src/components/nte-data-table/nte-data-table';

// Register the component
if (!customElements.get('nte-data-table')) {
  customElements.define('nte-data-table', NteDataTable);
}

// Mount command for Lit components
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

Cypress.Commands.add('mount', mount);
