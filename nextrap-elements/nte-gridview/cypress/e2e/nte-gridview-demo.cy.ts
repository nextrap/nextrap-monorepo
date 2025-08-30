/// <reference types="cypress" />

describe('NTE GridView Demo Page', () => {
  beforeEach(() => {
    // Visit the local demo page
    cy.visit('/index.html');
    cy.clearGridviewStorage();
  });

  it('should load the demo page successfully', () => {
    cy.get('h1').should('contain.text', 'NTE GridView Demo');
    cy.get('nte-gridview').should('exist');
  });

  it('should display the demo table with correct data', () => {
    cy.get('nte-gridview .gridview-table thead th').should('have.length.greaterThan', 5);
    cy.get('nte-gridview .gridview-table tbody tr').should('have.length.greaterThan', 5);
  });

  it('should have working control buttons', () => {
    // Test Reset Column Widths button
    cy.contains('button', 'Reset Column Widths').click();

    // Test Set Custom Widths button
    cy.contains('button', 'Set Custom Widths').click();

    // Test Toggle Column Resize button
    cy.contains('button', 'Toggle Column Resize').click();
    cy.get('#resize-status').should('contain.text', 'Disabled');

    cy.contains('button', 'Toggle Column Resize').click();
    cy.get('#resize-status').should('contain.text', 'Enabled');
  });

  it('should demonstrate column resizing functionality', () => {
    // Get initial width of first column
    cy.get('nte-gridview .gridview-table thead th')
      .first()
      .then(($el) => {
        const initialWidth = parseInt($el.css('width'));

        // Resize the column
        cy.resizeColumn(0, 50);

        // Check that width changed
        cy.get('nte-gridview .gridview-table thead th')
          .first()
          .then(($newEl) => {
            const newWidth = parseInt($newEl.css('width'));
            expect(newWidth).to.be.greaterThan(initialWidth);
          });
      });
  });

  it('should demonstrate scrolling with sticky headers', () => {
    // Check that header is visible
    cy.get('nte-gridview .gridview-table thead th').first().should('be.visible');

    // Scroll down
    cy.scrollGridview(1000);

    // Header should still be visible due to sticky positioning
    cy.get('nte-gridview .gridview-table thead th').first().should('be.visible');
  });

  it('should demonstrate localStorage persistence', () => {
    // Resize a column
    cy.resizeColumn(1, 100);

    // Check that storage key is shown correctly
    cy.contains('button', 'Show Storage Key').click();

    // Reload the page
    cy.reload();

    // Column width should be preserved
    cy.get('nte-gridview .gridview-table thead th')
      .eq(1)
      .then(($el) => {
        const width = parseInt($el.css('width'));
        expect(width).to.be.greaterThan(100); // Should be larger than default
      });
  });

  it('should demonstrate custom storage key functionality', () => {
    cy.contains('button', 'Set Custom Storage Key').click();
    cy.contains('button', 'Show Storage Key').click();

    // Should work without errors
    cy.get('nte-gridview').should('exist');
  });

  it('should show all storage keys', () => {
    // Resize some columns to create storage
    cy.resizeColumn(0, 50);
    cy.resizeColumn(1, 30);

    cy.contains('button', 'Show All Storage Keys').click();

    // Should work without errors
    cy.get('nte-gridview').should('exist');
  });

  it('should handle performance testing', () => {
    // The demo should handle performance testing smoothly
    cy.get('nte-gridview').then(($el) => {
      const gridview = $el[0] as any;
      if (gridview.testPerformance) {
        gridview.testPerformance();
      }
    });
  });

  it('should be responsive', () => {
    // Test on different viewport sizes
    cy.viewport(1280, 720);
    cy.get('nte-gridview').should('be.visible');

    cy.viewport(768, 1024);
    cy.get('nte-gridview').should('be.visible');

    cy.viewport(375, 667);
    cy.get('nte-gridview').should('be.visible');
  });

  it('should maintain functionality across browser refreshes', () => {
    // Perform some actions
    cy.resizeColumn(0, 75);
    cy.contains('button', 'Set Custom Widths').click();

    // Refresh the page
    cy.reload();

    // Component should still work
    cy.get('nte-gridview').should('exist');
    cy.get('nte-gridview .gridview-table thead th').should('have.length.greaterThan', 5);
  });
});
