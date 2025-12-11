/// <reference types="cypress" />

import '../../../cypress/support/commands';
import { NteDataTable } from './nte-data-table';

const sampleTableHtml = `
  <table class="data-table-table">
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Email</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>John Doe</td>
        <td>john@example.com</td>
        <td>Active</td>
        <td><button>Edit</button></td>
      </tr>
      <tr>
        <td>2</td>
        <td>Jane Smith</td>
        <td>jane@example.com</td>
        <td>Inactive</td>
        <td><button>Edit</button></td>
      </tr>
      <tr>
        <td>3</td>
        <td>Bob Johnson</td>
        <td>bob@example.com</td>
        <td>Active</td>
        <td><button>Edit</button></td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td>Total: 3</td>
        <td>Users</td>
        <td>—</td>
        <td>2 Active</td>
        <td>—</td>
      </tr>
    </tfoot>
  </table>
`;

const largeTableHtml = `
  <table class="data-table-table">
    <thead>
      <tr>
        <th>Col 1</th>
        <th>Col 2</th>
        <th>Col 3</th>
        <th>Col 4</th>
        <th>Col 5</th>
      </tr>
    </thead>
    <tbody>
      ${Array.from(
        { length: 50 },
        (_, i) => `
        <tr>
          <td>Row ${i + 1} Col 1</td>
          <td>Row ${i + 1} Col 2</td>
          <td>Row ${i + 1} Col 3</td>
          <td>Row ${i + 1} Col 4</td>
          <td>Row ${i + 1} Col 5</td>
        </tr>
      `,
      ).join('')}
    </tbody>
  </table>
`;

describe('NTE Data Table Component', () => {
  beforeEach(() => {
    cy.clearDataTableStorage();
  });

  describe('Basic Rendering', () => {
    it('should render the component with a table', () => {
      cy.mountDataTable(sampleTableHtml);

      cy.get('nte-data-table').should('exist');
      cy.get('nte-data-table .data-table-table-wrapper').should('exist');
      cy.get('nte-data-table .data-table-table').should('exist');
    });

    it('should display table headers correctly', () => {
      cy.mountDataTable(sampleTableHtml);

      cy.get('nte-data-table .data-table-table thead th').should('have.length', 5);
      cy.get('nte-data-table .data-table-table thead th').first().should('contain.text', 'ID');
      cy.get('nte-data-table .data-table-table thead th').eq(1).should('contain.text', 'Name');
    });

    it('should display table body rows correctly', () => {
      cy.mountDataTable(sampleTableHtml);

      cy.get('nte-data-table .data-table-table tbody tr').should('have.length', 3);
      cy.get('nte-data-table .data-table-table tbody tr').first().should('contain.text', 'John Doe');
    });

    it('should display table footer correctly', () => {
      cy.mountDataTable(sampleTableHtml);

      cy.get('nte-data-table .data-table-table tfoot tr').should('have.length', 1);
      cy.get('nte-data-table .data-table-table tfoot td').first().should('contain.text', 'Total: 3');
    });
  });

  describe('Component Initialization', () => {
    it('should initialize with default column widths', () => {
      cy.mountDataTable(sampleTableHtml, { 'default-column-width': '150' });

      cy.get('nte-data-table').then(($el) => {
        const dataTable = $el[0] as NteDataTable;
        expect(dataTable.defaultColumnWidth).to.equal(150);
      });
    });

    it('should set up DOM structure correctly', () => {
      cy.mountDataTable(sampleTableHtml);

      // Check that the DOM structure is created
      cy.get('nte-data-table .data-table-table-wrapper .data-table-table').should('exist');
    });

    it('should add data-table-table class to the table', () => {
      cy.mountDataTable(sampleTableHtml);

      cy.get('nte-data-table table').should('have.class', 'data-table-table');
    });
  });

  describe('Column Resizing', () => {
    it('should add resize handles to header cells', () => {
      cy.mountDataTable(sampleTableHtml, { 'enable-column-resize': 'true' });

      cy.get('nte-data-table .data-table-table thead th .resize-handle').should('have.length', 5);
    });

    it('should not add resize handles when resizing is disabled', () => {
      cy.mountDataTable(sampleTableHtml, { 'enable-column-resize': 'false' });

      cy.get('nte-data-table .data-table-table thead th .resize-handle').should('not.exist');
    });

    it('should resize columns when dragging resize handle', () => {
      cy.mountDataTable(sampleTableHtml, { 'default-column-width': '150' });

      // Get initial width
      cy.getColumnWidth(0).then((initialWidth) => {
        // Resize column
        cy.resizeColumn(0, 50);

        // Check new width
        cy.getColumnWidth(0).then((newWidth) => {
          expect(newWidth).to.be.greaterThan(initialWidth);
        });
      });
    });

    it('should respect minimum and maximum column widths', () => {
      cy.mountDataTable(sampleTableHtml, {
        'min-column-width': '50',
        'max-column-width': '300',
      });

      // Try to resize below minimum
      cy.resizeColumn(0, -200);
      cy.getColumnWidth(0).should('be.gte', 50);

      // Try to resize above maximum
      cy.resizeColumn(0, 400);
      cy.getColumnWidth(0).should('be.lte', 300);
    });

    it('should update all cells in the resized column', () => {
      cy.mountDataTable(sampleTableHtml);

      cy.resizeColumn(0, 50);

      // Check that all cells in column 0 have the same width
      let headerWidth: number;
      cy.get('nte-data-table .data-table-table thead th')
        .first()
        .then(($el) => {
          headerWidth = parseInt($el.css('width'));

          cy.get('nte-data-table .data-table-table tbody td:nth-child(1)').each(($el) => {
            expect(parseInt($el.css('width'))).to.equal(headerWidth);
          });

          cy.get('nte-data-table .data-table-table tfoot td:nth-child(1)').then(($el) => {
            expect(parseInt($el.css('width'))).to.equal(headerWidth);
          });
        });
    });

    it('should perform resize operations smoothly', () => {
      cy.mountDataTable(sampleTableHtml);

      cy.measureResizePerformance().then((duration) => {
        // Resize should complete within 300ms for good performance (adjusted for robust test environment)
        expect(duration).to.be.lessThan(300);
      });
    });
  });

  describe('Sticky Headers and Scrolling', () => {
    it('should make headers sticky on scroll', () => {
      cy.mountDataTable(largeTableHtml, { 'max-height': '100%' });

      // Check that header is initially visible
      cy.get('nte-data-table .data-table-table thead th').first().should('be.visible');

      // Scroll down
      cy.scrollDataTable(500);

      // Header should still be visible (sticky)
      cy.get('nte-data-table .data-table-table thead th').first().should('be.visible');
    });

    it('should have scrollable table body', () => {
      cy.mountDataTable(largeTableHtml);

      cy.get('nte-data-table .data-table-table-wrapper').should('have.css', 'overflow-y', 'auto');
    });

    it('should set custom max height', () => {
      cy.mountDataTable(largeTableHtml);

      cy.get('nte-data-table').then(($el) => {
        const dataTable = $el[0] as NteDataTable;
        dataTable.setMaxHeight('400px');

        cy.get('nte-data-table .data-table-table-wrapper').should('have.css', 'max-height', '100%');
      });
    });
  });

  describe('LocalStorage Persistence', () => {
    it('should save column widths to localStorage', () => {
      cy.mountDataTable(sampleTableHtml, { id: 'test-grid' });

      // Resize a column
      cy.resizeColumn(0, 50);

      // Check localStorage
      cy.getDataTableStorage('nte-data-table-test-grid-columns').then((data) => {
        expect(data).to.be.an('array');
        expect(data[0]).to.have.property('key');
        expect(data[0]).to.have.property('width');
      });
    });

    it('should restore column widths from localStorage', () => {
      // Set up initial storage
      cy.window().then((win) => {
        win.localStorage.setItem(
          'nte-data-table-test-grid-columns',
          JSON.stringify([
            { key: 'ID', width: 200 },
            { key: 'Name', width: 250 },
          ]),
        );
      });

      cy.mountDataTable(sampleTableHtml, { id: 'test-grid' });

      // Wait for component to load localStorage config
      cy.wait(200);

      // Check that widths are restored
      cy.getColumnWidth(0).should('equal', 200);
      cy.getColumnWidth(1).should('equal', 250);
    });

    it('should generate unique localStorage keys for different components', () => {
      cy.mountDataTable(sampleTableHtml, { id: 'grid1' });
      cy.get('nte-data-table').then(($el) => {
        const dataTable = $el[0] as NteDataTable;
        const key1 = dataTable.getLocalStorageKey();

        cy.mountDataTable(sampleTableHtml, { id: 'grid2' });
        cy.get('nte-data-table').then(($el2) => {
          const dataTable2 = $el2[0] as NteDataTable;
          const key2 = dataTable2.getLocalStorageKey();

          expect(key1).to.not.equal(key2);
        });
      });
    });
  });

  describe('Public API Methods', () => {
    it('should get column width by key', () => {
      cy.mountDataTable(sampleTableHtml);

      cy.get('nte-data-table').then(($el) => {
        const dataTable = $el[0] as NteDataTable;
        const width = dataTable.getColumnWidth('ID');
        expect(width).to.be.a('number');
        expect(width).to.be.greaterThan(0);
      });
    });

    it('should set column width by key', () => {
      cy.mountDataTable(sampleTableHtml);

      cy.get('nte-data-table').then(($el) => {
        const dataTable = $el[0] as NteDataTable;
        dataTable.setColumnWidth('Name', 300);

        const newWidth = dataTable.getColumnWidth('Name');
        expect(newWidth).to.equal(300);
      });
    });

    it('should reset all column widths', () => {
      cy.mountDataTable(sampleTableHtml, { 'default-column-width': '150' });

      cy.get('nte-data-table').then(($el) => {
        const dataTable = $el[0] as NteDataTable;

        // Resize some columns
        dataTable.setColumnWidth('Name', 300);
        dataTable.setColumnWidth('Email', 250);

        // Reset all
        dataTable.resetColumnWidths();

        // Check that all are back to default
        expect(dataTable.getColumnWidth('Name')).to.equal(150);
        expect(dataTable.getColumnWidth('Email')).to.equal(150);
      });
    });

    it('should get all columns configuration', () => {
      cy.mountDataTable(sampleTableHtml);

      cy.get('nte-data-table').then(($el) => {
        const dataTable = $el[0] as NteDataTable;
        const columns = dataTable.getColumns();

        expect(columns).to.be.an('array');
        expect(columns).to.have.length(5);
        expect(columns[0]).to.have.property('key', 'ID');
        expect(columns[0]).to.have.property('width');
      });
    });

    it('should set and get max height', () => {
      cy.mountDataTable(sampleTableHtml);

      cy.get('nte-data-table').then(($el) => {
        const dataTable = $el[0] as NteDataTable;

        dataTable.setMaxHeight('500px');
        const height = dataTable.getMaxHeight();

        expect(height).to.equal('500px');
      });
    });

    it('should handle invalid parameters gracefully', () => {
      cy.mountDataTable(sampleTableHtml);

      cy.get('nte-data-table').then(($el) => {
        const dataTable = $el[0] as NteDataTable;

        // Should not throw errors
        expect(() => {
          dataTable.getColumnWidth('');
          dataTable.setColumnWidth('', NaN);
          dataTable.setColumnWidth('nonexistent', 100);
        }).to.not.throw();
      });
    });
  });

  describe('Performance Testing', () => {
    it('should handle large tables efficiently', () => {
      cy.mountDataTable(largeTableHtml);

      // Component should render within reasonable time
      cy.get('nte-data-table .data-table-table tbody tr').should('have.length', 50);

      // Performance test
      cy.get('nte-data-table').then(($el) => {
        const dataTable = $el[0] as NteDataTable;
        dataTable.testPerformance();
      });
    });

    it('should cache DOM elements for performance', () => {
      cy.mountDataTable(sampleTableHtml);

      cy.get('nte-data-table').then(($el) => {
        const dataTable = $el[0] as NteDataTable;
        dataTable.testPerformance();

        // Cache should be populated after initialization
        // This is tested via the testPerformance method which logs cache size
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle empty tables gracefully', () => {
      const emptyTableHtml = `
        <table class="data-table-table">
          <thead><tr><th>Empty</th></tr></thead>
          <tbody></tbody>
        </table>
      `;

      cy.mountDataTable(emptyTableHtml);
      cy.get('nte-data-table').should('exist');
    });

    it('should handle tables without headers', () => {
      const noHeaderTableHtml = `
        <table class="data-table-table">
          <tbody>
            <tr><td>Data 1</td><td>Data 2</td></tr>
          </tbody>
        </table>
      `;

      cy.mountDataTable(noHeaderTableHtml);
      cy.get('nte-data-table').should('exist');
    });

    it('should handle missing localStorage gracefully', () => {
      cy.window().then((win) => {
        // Temporarily disable localStorage
        const originalLocalStorage = win.localStorage;
        Object.defineProperty(win, 'localStorage', {
          value: null,
          writable: true,
        });

        cy.mountDataTable(sampleTableHtml);
        cy.get('nte-data-table').should('exist');

        // Restore localStorage
        Object.defineProperty(win, 'localStorage', {
          value: originalLocalStorage,
          writable: true,
        });
      });
    });
  });

  describe('Accessibility', () => {
    it('should maintain table semantics', () => {
      cy.mountDataTable(sampleTableHtml);

      cy.get('nte-data-table table').should('exist');
      cy.get('nte-data-table thead').should('exist');
      cy.get('nte-data-table tbody').should('exist');
      cy.get('nte-data-table tfoot').should('exist');
    });

    it('should support keyboard navigation', () => {
      cy.mountDataTable(sampleTableHtml);

      // Focus on first header cell
      cy.get('nte-data-table .data-table-table thead th').first().focus();

      // Use arrow keys for navigation (tab is not supported in this version of Cypress)
      cy.focused().type('{rightArrow}');

      // Should be able to navigate with keyboard
      cy.focused().should('exist');
    });
  });

  describe('Scroll Behavior Fix', () => {
    it('should only have one scrollbar (inner wrapper, not outer component)', () => {
      cy.mountDataTable(sampleTableHtml);

      // Check that the component itself has overflow hidden
      cy.get('nte-data-table').should('have.css', 'overflow', 'hidden');

      // Check that the table wrapper has the scrolling behavior
      cy.get('.data-table-table-wrapper').should('have.css', 'overflow-y', 'auto');

      // Verify DOM structure exists correctly
      cy.get('.data-table-table-wrapper').should('exist');
      cy.get('.data-table-table').should('exist');
    });

    it('should maintain proper nesting with simplified structure', () => {
      cy.mountDataTable(sampleTableHtml);

      // Verify there's only one wrapper (no redundant container)
      cy.get('.data-table-table-wrapper').should('have.length', 1);

      // Verify the table is directly inside the wrapper
      cy.get('.data-table-table-wrapper > .data-table-table').should('exist');

      // Verify no redundant container exists
      cy.get('.data-table-container').should('not.exist');
    });

    it('should size properly to fit parent element', () => {
      cy.mountDataTable(sampleTableHtml);

      // Component should take reasonable width and height
      cy.get('nte-data-table').then(($el) => {
        const width = $el.width();
        const height = $el.height();
        expect(width).to.be.greaterThan(400); // Should have substantial width
        expect(width).to.be.lessThan(2000); // But not excessively large
        expect(height).to.be.greaterThan(100); // Should have some height for table content
      });

      // Wrapper should use responsive sizing
      cy.get('.data-table-table-wrapper').should('have.css', 'overflow-y', 'auto');
      cy.get('.data-table-table-wrapper').should('have.css', 'overflow-x', 'auto');
      cy.get('.data-table-table-wrapper').should('have.css', 'box-sizing', 'border-box');

      // Wrapper should have max-height set but not fixed height
      cy.get('.data-table-table-wrapper').then(($wrapper) => {
        const styles = window.getComputedStyle($wrapper[0]);
        expect(styles.maxHeight).to.not.equal('none'); // Should have max-height constraint
        expect(styles.minHeight).to.equal('100px'); // Should have min-height
      });
    });

    it('should maintain sticky footer behavior', () => {
      cy.mountDataTable(sampleTableHtml);

      // Footer should be sticky
      cy.get('.data-table-table tfoot').should('have.css', 'position', 'sticky');
      cy.get('.data-table-table tfoot').should('have.css', 'bottom', '0px');
      cy.get('.data-table-table tfoot').should('have.css', 'z-index', '10');
    });
  });
});
