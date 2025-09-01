/// <reference types="cypress" />

// Custom commands for nte-gridview testing

declare global {
  namespace Cypress {
    interface Chainable {
      mountGridview(tableHtml: string, props?: Record<string, any>): Chainable<void>;
      clearGridviewStorage(): Chainable<void>;
      resizeColumn(columnIndex: number, deltaX: number): Chainable<void>;
      getColumnWidth(columnIndex: number): Chainable<number>;
      scrollGridview(deltaY: number): Chainable<void>;
      getGridviewStorage(key: string): Chainable<any>;
      measureResizePerformance(): Chainable<number>;
    }
  }
}

// Implement commands
Cypress.Commands.add('mountGridview', (tableHtml: string, props: Record<string, any> = {}) => {
  const propStrings = Object.entries(props)
    .map(([key, value]) => {
      if (typeof value === 'boolean') {
        return value ? key : '';
      }
      // Handle string "false" as boolean false for boolean attributes
      if (value === 'false' && (key.includes('enable') || key.includes('disabled'))) {
        return '';
      }
      // Handle string "true" as boolean true for boolean attributes
      if (value === 'true' && (key.includes('enable') || key.includes('disabled'))) {
        return key;
      }
      return `${key}="${value}"`;
    })
    .filter(Boolean)
    .join(' ');

  const html = `<nte-gridview ${propStrings}>${tableHtml}</nte-gridview>`;

  cy.get('[data-cy-root]').then(($root) => {
    $root.html(html);
  });

  // Wait for the component to be defined and initialized
  cy.get('nte-gridview').should('exist');

  // Force the component to set up its DOM structure
  cy.get('nte-gridview').then(($element) => {
    const element = $element[0] as any;
    // Force DOM structure setup
    if (element.setupDOMStructure) {
      element.setupDOMStructure();
    }
  });

  // Wait for the component to be fully initialized
  cy.get('nte-gridview table').should('exist');

  // Force column initialization after a short delay
  cy.wait(100).then(() => {
    cy.get('nte-gridview').then(($element) => {
      const element = $element[0] as any;

      // Set boolean properties directly on the element if they were passed as strings
      Object.entries(props).forEach(([key, value]) => {
        if (key === 'enable-column-resize' && value === 'false') {
          element.enableColumnResize = false;
        }
      });

      if (element.forceInitialization) {
        element.forceInitialization();
      }
    });
  });

  // Final wait to ensure everything is ready
  cy.wait(100);
});

Cypress.Commands.add('clearGridviewStorage', () => {
  cy.window().then((win) => {
    const keys = Object.keys(win.localStorage);
    keys.forEach((key) => {
      if (key.includes('nte-gridview')) {
        win.localStorage.removeItem(key);
      }
    });
  });
});

Cypress.Commands.add('resizeColumn', (columnIndex: number, deltaX: number) => {
  cy.get('nte-gridview .gridview-table thead th')
    .eq(columnIndex)
    .within(() => {
      cy.get('.resize-handle').then(($handle) => {
        const handle = $handle[0];
        const rect = handle.getBoundingClientRect();
        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;

        cy.wrap(handle)
          .trigger('mousedown', { clientX: startX, clientY: startY, which: 1, force: true })
          .trigger('mousemove', { clientX: startX + deltaX, clientY: startY, force: true })
          .trigger('mouseup', { force: true });
      });
    });

  // Wait a bit for the resize to complete and be saved
  cy.wait(100);
});

Cypress.Commands.add('getColumnWidth', (columnIndex: number) => {
  cy.get('nte-gridview .gridview-table thead th')
    .eq(columnIndex)
    .then(($el) => {
      return cy.wrap(parseInt($el.css('width')));
    });
});

Cypress.Commands.add('scrollGridview', (deltaY: number) => {
  // First ensure the wrapper exists (if DOM structure is created)
  cy.get('nte-gridview').then(($element) => {
    const wrapper = $element.find('.gridview-table-wrapper');
    if (wrapper.length > 0) {
      cy.wrap(wrapper).trigger('wheel', { deltaY, force: true });
    } else {
      // Fallback to the table itself if wrapper doesn't exist
      cy.get('nte-gridview table').trigger('wheel', { deltaY, force: true });
    }
  });
});

Cypress.Commands.add('getGridviewStorage', (key: string) => {
  cy.window().then((win) => {
    const value = win.localStorage.getItem(key);
    return cy.wrap(value ? JSON.parse(value) : null);
  });
});

Cypress.Commands.add('measureResizePerformance', () => {
  cy.window().then((win) => {
    const startTime = performance.now();
    cy.resizeColumn(0, 50).then(() => {
      const endTime = performance.now();
      return cy.wrap(endTime - startTime);
    });
  });
});

export {};
