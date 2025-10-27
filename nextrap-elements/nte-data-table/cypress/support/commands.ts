/// <reference types="cypress" />

// Custom commands for nte-data-table testing

declare global {
  namespace Cypress {
    interface Chainable {
      mountDataTable(tableHtml: string, props?: Record<string, any>): Chainable<void>;
      clearDataTableStorage(): Chainable<void>;
      resizeColumn(columnIndex: number, deltaX: number): Chainable<void>;
      getColumnWidth(columnIndex: number): Chainable<number>;
      scrollDataTable(deltaY: number): Chainable<void>;
      getDataTableStorage(key: string): Chainable<any>;
      measureResizePerformance(): Chainable<number>;
    }
  }
}

// Implement commands
Cypress.Commands.add('mountDataTable', (tableHtml: string, props: Record<string, any> = {}) => {
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

  const html = `<nte-data-table ${propStrings}>${tableHtml}</nte-data-table>`;

  cy.get('[data-cy-root]').then(($root) => {
    $root.html(html);
  });

  // Wait for the component to be defined and initialized
  cy.get('nte-data-table').should('exist');

  // Force the component to set up its DOM structure
  cy.get('nte-data-table').then(($element) => {
    const element = $element[0] as any;
    // Force DOM structure setup
    if (element.setupDOMStructure) {
      element.setupDOMStructure();
    }
  });

  // Wait for the component to be fully initialized
  cy.get('nte-data-table table').should('exist');

  // Force column initialization after a short delay
  cy.wait(100).then(() => {
    cy.get('nte-data-table').then(($element) => {
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

Cypress.Commands.add('clearDataTableStorage', () => {
  cy.window().then((win) => {
    const keys = Object.keys(win.localStorage);
    keys.forEach((key) => {
      if (key.includes('nte-data-table')) {
        win.localStorage.removeItem(key);
      }
    });
  });
});

Cypress.Commands.add('resizeColumn', (columnIndex: number, deltaX: number) => {
  // First ensure the component is fully initialized
  cy.get('nte-data-table').then(($el) => {
    const element = $el[0] as any;
    if (element.forceInitialization) {
      element.forceInitialization();
    }
  });

  // Use a more robust approach that doesn't cause DOM detachment
  cy.get('nte-data-table .data-table-table thead th')
    .eq(columnIndex)
    .should('exist')
    .within(() => {
      cy.get('.resize-handle').should('exist');
    });

  // Get the handle element separately to avoid chaining issues
  cy.get('nte-data-table .data-table-table thead th')
    .eq(columnIndex)
    .find('.resize-handle')
    .then(($handle) => {
      const handle = $handle[0];
      const rect = handle.getBoundingClientRect();
      const startX = rect.left + rect.width / 2;
      const startY = rect.top + rect.height / 2;

      // Trigger events on document to avoid DOM detachment
      cy.document().then((doc) => {
        // Create and dispatch events manually
        const mouseDownEvent = new MouseEvent('mousedown', {
          clientX: startX,
          clientY: startY,
          button: 0,
          bubbles: true,
          cancelable: true,
        });

        const mouseMoveEvent = new MouseEvent('mousemove', {
          clientX: startX + deltaX,
          clientY: startY,
          button: 0,
          bubbles: true,
          cancelable: true,
        });

        const mouseUpEvent = new MouseEvent('mouseup', {
          clientX: startX + deltaX,
          clientY: startY,
          button: 0,
          bubbles: true,
          cancelable: true,
        });

        handle.dispatchEvent(mouseDownEvent);
        cy.wait(10);
        doc.dispatchEvent(mouseMoveEvent);
        cy.wait(10);
        doc.dispatchEvent(mouseUpEvent);
      });
    });

  // Wait for the resize to complete and be saved
  cy.wait(100);
});

Cypress.Commands.add('getColumnWidth', (columnIndex: number) => {
  cy.get('nte-data-table .data-table-table thead th')
    .eq(columnIndex)
    .then(($el) => {
      return cy.wrap(parseInt($el.css('width')));
    });
});

Cypress.Commands.add('scrollDataTable', (deltaY: number) => {
  // First ensure the wrapper exists (if DOM structure is created)
  cy.get('nte-data-table').then(($element) => {
    const wrapper = $element.find('.data-table-table-wrapper');
    if (wrapper.length > 0) {
      cy.wrap(wrapper).trigger('wheel', { deltaY, force: true });
    } else {
      // Fallback to the table itself if wrapper doesn't exist
      cy.get('nte-data-table table').trigger('wheel', { deltaY, force: true });
    }
  });
});

Cypress.Commands.add('getDataTableStorage', (key: string) => {
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
