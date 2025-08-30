/// <reference types="cypress" />

// Import commands.js using ES2015 syntax:
import './commands';

import { mount } from 'cypress-lit';

// Import component styles
import '../../src/components/nte-gridview/nte-gridview.scss';

// Import the component
import { NteGridview } from '../../src/components/nte-gridview/nte-gridview';

// Register the component
if (!customElements.get('nte-gridview')) {
  customElements.define('nte-gridview', NteGridview);
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
