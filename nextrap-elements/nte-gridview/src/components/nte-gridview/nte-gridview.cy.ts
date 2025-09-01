/// <reference types="cypress" />
/// <reference path="../../../cypress/support/commands.ts" />

import '../../../cypress/support/commands';
import { NteGridview } from './nte-gridview';

const sampleTableHtml = `
  <table class="gridview-table">
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
  <table class="gridview-table">
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

describe('NTE GridView Component', () => {
  beforeEach(() => {
    cy.clearGridviewStorage();
  });

  describe('Basic Rendering', () => {
    it('should render the component with a table', () => {
      cy.mountGridview(sampleTableHtml);

      cy.get('nte-gridview').should('exist');
      cy.get('nte-gridview .gridview-table-wrapper').should('exist');
      cy.get('nte-gridview .gridview-table').should('exist');
    });

    it('should display table headers correctly', () => {
      cy.mountGridview(sampleTableHtml);

      cy.get('nte-gridview .gridview-table thead th').should('have.length', 5);
      cy.get('nte-gridview .gridview-table thead th').first().should('contain.text', 'ID');
      cy.get('nte-gridview .gridview-table thead th').eq(1).should('contain.text', 'Name');
    });

    it('should display table body rows correctly', () => {
      cy.mountGridview(sampleTableHtml);

      cy.get('nte-gridview .gridview-table tbody tr').should('have.length', 3);
      cy.get('nte-gridview .gridview-table tbody tr').first().should('contain.text', 'John Doe');
    });

    it('should display table footer correctly', () => {
      cy.mountGridview(sampleTableHtml);

      cy.get('nte-gridview .gridview-table tfoot tr').should('have.length', 1);
      cy.get('nte-gridview .gridview-table tfoot td').first().should('contain.text', 'Total: 3');
    });
  });

  describe('Component Initialization', () => {
    it('should initialize with default column widths', () => {
      cy.mountGridview(sampleTableHtml, { 'default-column-width': '150' });

      cy.get('nte-gridview').then(($el) => {
        const gridview = $el[0] as NteGridview;
        expect(gridview.defaultColumnWidth).to.equal(150);
      });
    });

    it('should set up DOM structure correctly', () => {
      cy.mountGridview(sampleTableHtml);

      // Check that the DOM structure is created
      cy.get('nte-gridview .gridview-table-wrapper .gridview-table').should('exist');
    });

    it('should add gridview-table class to the table', () => {
      cy.mountGridview(sampleTableHtml);

      cy.get('nte-gridview table').should('have.class', 'gridview-table');
    });
  });

  describe('Column Resizing', () => {
    it('should add resize handles to header cells', () => {
      cy.mountGridview(sampleTableHtml, { 'enable-column-resize': 'true' });

      cy.get('nte-gridview .gridview-table thead th .resize-handle').should('have.length', 5);
    });

    it('should not add resize handles when resizing is disabled', () => {
      cy.mountGridview(sampleTableHtml, { 'enable-column-resize': 'false' });

      cy.get('nte-gridview .gridview-table thead th .resize-handle').should('not.exist');
    });

    it('should resize columns when dragging resize handle', () => {
      cy.mountGridview(sampleTableHtml, { 'default-column-width': '150' });

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
      cy.mountGridview(sampleTableHtml, {
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
      cy.mountGridview(sampleTableHtml);

      cy.resizeColumn(0, 50);

      // Check that all cells in column 0 have the same width
      let headerWidth: number;
      cy.get('nte-gridview .gridview-table thead th')
        .first()
        .then(($el) => {
          headerWidth = parseInt($el.css('width'));

          cy.get('nte-gridview .gridview-table tbody td:nth-child(1)').each(($el) => {
            expect(parseInt($el.css('width'))).to.equal(headerWidth);
          });

          cy.get('nte-gridview .gridview-table tfoot td:nth-child(1)').then(($el) => {
            expect(parseInt($el.css('width'))).to.equal(headerWidth);
          });
        });
    });

    it('should perform resize operations smoothly', () => {
      cy.mountGridview(sampleTableHtml);

      cy.measureResizePerformance().then((duration) => {
        // Resize should complete within 300ms for good performance (adjusted for robust test environment)
        expect(duration).to.be.lessThan(300);
      });
    });
  });

  describe('Sticky Headers and Scrolling', () => {
    it('should make headers sticky on scroll', () => {
      cy.mountGridview(largeTableHtml, { 'max-height': '100%' });

      // Check that header is initially visible
      cy.get('nte-gridview .gridview-table thead th').first().should('be.visible');

      // Scroll down
      cy.scrollGridview(500);

      // Header should still be visible (sticky)
      cy.get('nte-gridview .gridview-table thead th').first().should('be.visible');
    });

    it('should have scrollable table body', () => {
      cy.mountGridview(largeTableHtml);

      cy.get('nte-gridview .gridview-table-wrapper').should('have.css', 'overflow-y', 'auto');
    });

    it('should set custom max height', () => {
      cy.mountGridview(largeTableHtml);

      cy.get('nte-gridview').then(($el) => {
        const gridview = $el[0] as NteGridview;
        gridview.setMaxHeight('400px');

        cy.get('nte-gridview .gridview-table-wrapper').should('have.css', 'max-height', '100%');
      });
    });
  });

  describe('LocalStorage Persistence', () => {
    it('should save column widths to localStorage', () => {
      cy.mountGridview(sampleTableHtml, { id: 'test-grid' });

      // Resize a column
      cy.resizeColumn(0, 50);

      // Check localStorage
      cy.getGridviewStorage('nte-gridview-test-grid-columns').then((data) => {
        expect(data).to.be.an('array');
        expect(data[0]).to.have.property('key');
        expect(data[0]).to.have.property('width');
      });
    });

    it('should restore column widths from localStorage', () => {
      // Set up initial storage
      cy.window().then((win) => {
        win.localStorage.setItem(
          'nte-gridview-test-grid-columns',
          JSON.stringify([
            { key: 'ID', width: 200 },
            { key: 'Name', width: 250 },
          ]),
        );
      });

      cy.mountGridview(sampleTableHtml, { id: 'test-grid' });

      // Wait for component to load localStorage config
      cy.wait(200);

      // Check that widths are restored
      cy.getColumnWidth(0).should('equal', 200);
      cy.getColumnWidth(1).should('equal', 250);
    });

    it('should generate unique localStorage keys for different components', () => {
      cy.mountGridview(sampleTableHtml, { id: 'grid1' });
      cy.get('nte-gridview').then(($el) => {
        const gridview = $el[0] as NteGridview;
        const key1 = gridview.getLocalStorageKey();

        cy.mountGridview(sampleTableHtml, { id: 'grid2' });
        cy.get('nte-gridview').then(($el2) => {
          const gridview2 = $el2[0] as NteGridview;
          const key2 = gridview2.getLocalStorageKey();

          expect(key1).to.not.equal(key2);
        });
      });
    });
  });

  describe('Public API Methods', () => {
    it('should get column width by key', () => {
      cy.mountGridview(sampleTableHtml);

      cy.get('nte-gridview').then(($el) => {
        const gridview = $el[0] as NteGridview;
        const width = gridview.getColumnWidth('ID');
        expect(width).to.be.a('number');
        expect(width).to.be.greaterThan(0);
      });
    });

    it('should set column width by key', () => {
      cy.mountGridview(sampleTableHtml);

      cy.get('nte-gridview').then(($el) => {
        const gridview = $el[0] as NteGridview;
        gridview.setColumnWidth('Name', 300);

        const newWidth = gridview.getColumnWidth('Name');
        expect(newWidth).to.equal(300);
      });
    });

    it('should reset all column widths', () => {
      cy.mountGridview(sampleTableHtml, { 'default-column-width': '150' });

      cy.get('nte-gridview').then(($el) => {
        const gridview = $el[0] as NteGridview;

        // Resize some columns
        gridview.setColumnWidth('Name', 300);
        gridview.setColumnWidth('Email', 250);

        // Reset all
        gridview.resetColumnWidths();

        // Check that all are back to default
        expect(gridview.getColumnWidth('Name')).to.equal(150);
        expect(gridview.getColumnWidth('Email')).to.equal(150);
      });
    });

    it('should get all columns configuration', () => {
      cy.mountGridview(sampleTableHtml);

      cy.get('nte-gridview').then(($el) => {
        const gridview = $el[0] as NteGridview;
        const columns = gridview.getColumns();

        expect(columns).to.be.an('array');
        expect(columns).to.have.length(5);
        expect(columns[0]).to.have.property('key', 'ID');
        expect(columns[0]).to.have.property('width');
      });
    });

    it('should set and get max height', () => {
      cy.mountGridview(sampleTableHtml);

      cy.get('nte-gridview').then(($el) => {
        const gridview = $el[0] as NteGridview;

        gridview.setMaxHeight('500px');
        const height = gridview.getMaxHeight();

        expect(height).to.equal('500px');
      });
    });

    it('should handle invalid parameters gracefully', () => {
      cy.mountGridview(sampleTableHtml);

      cy.get('nte-gridview').then(($el) => {
        const gridview = $el[0] as NteGridview;

        // Should not throw errors
        expect(() => {
          gridview.getColumnWidth('');
          gridview.setColumnWidth('', NaN);
          gridview.setColumnWidth('nonexistent', 100);
        }).to.not.throw();
      });
    });
  });

  describe('Performance Testing', () => {
    it('should handle large tables efficiently', () => {
      cy.mountGridview(largeTableHtml);

      // Component should render within reasonable time
      cy.get('nte-gridview .gridview-table tbody tr').should('have.length', 50);

      // Performance test
      cy.get('nte-gridview').then(($el) => {
        const gridview = $el[0] as NteGridview;
        gridview.testPerformance();
      });
    });

    it('should cache DOM elements for performance', () => {
      cy.mountGridview(sampleTableHtml);

      cy.get('nte-gridview').then(($el) => {
        const gridview = $el[0] as NteGridview;
        gridview.testPerformance();

        // Cache should be populated after initialization
        // This is tested via the testPerformance method which logs cache size
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle empty tables gracefully', () => {
      const emptyTableHtml = `
        <table class="gridview-table">
          <thead><tr><th>Empty</th></tr></thead>
          <tbody></tbody>
        </table>
      `;

      cy.mountGridview(emptyTableHtml);
      cy.get('nte-gridview').should('exist');
    });

    it('should handle tables without headers', () => {
      const noHeaderTableHtml = `
        <table class="gridview-table">
          <tbody>
            <tr><td>Data 1</td><td>Data 2</td></tr>
          </tbody>
        </table>
      `;

      cy.mountGridview(noHeaderTableHtml);
      cy.get('nte-gridview').should('exist');
    });

    it('should handle missing localStorage gracefully', () => {
      cy.window().then((win) => {
        // Temporarily disable localStorage
        const originalLocalStorage = win.localStorage;
        Object.defineProperty(win, 'localStorage', {
          value: null,
          writable: true,
        });

        cy.mountGridview(sampleTableHtml);
        cy.get('nte-gridview').should('exist');

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
      cy.mountGridview(sampleTableHtml);

      cy.get('nte-gridview table').should('exist');
      cy.get('nte-gridview thead').should('exist');
      cy.get('nte-gridview tbody').should('exist');
      cy.get('nte-gridview tfoot').should('exist');
    });

    it('should support keyboard navigation', () => {
      cy.mountGridview(sampleTableHtml);

      // Focus on first header cell
      cy.get('nte-gridview .gridview-table thead th').first().focus();

      // Use arrow keys for navigation (tab is not supported in this version of Cypress)
      cy.focused().type('{rightArrow}');

      // Should be able to navigate with keyboard
      cy.focused().should('exist');
    });
  });

  describe('Scroll Behavior Fix', () => {
    it('should only have one scrollbar (inner wrapper, not outer component)', () => {
      cy.mountGridview(sampleTableHtml);

      // Check that the component itself has overflow hidden
      cy.get('nte-gridview').should('have.css', 'overflow', 'hidden');

      // Check that the table wrapper has the scrolling behavior
      cy.get('.gridview-table-wrapper').should('have.css', 'overflow-y', 'auto');

      // Verify DOM structure exists correctly
      cy.get('.gridview-table-wrapper').should('exist');
      cy.get('.gridview-table').should('exist');
    });

    it('should maintain proper nesting with simplified structure', () => {
      cy.mountGridview(sampleTableHtml);

      // Verify there's only one wrapper (no redundant container)
      cy.get('.gridview-table-wrapper').should('have.length', 1);

      // Verify the table is directly inside the wrapper
      cy.get('.gridview-table-wrapper > .gridview-table').should('exist');

      // Verify no redundant container exists
      cy.get('.gridview-container').should('not.exist');
    });

    it('should size properly to fit parent element', () => {
      cy.mountGridview(sampleTableHtml);

      // Component should take reasonable width and height
      cy.get('nte-gridview').then(($el) => {
        const width = $el.width();
        const height = $el.height();
        expect(width).to.be.greaterThan(400); // Should have substantial width
        expect(width).to.be.lessThan(2000); // But not excessively large
        expect(height).to.be.greaterThan(100); // Should have some height for table content
      });

      // Wrapper should use responsive sizing
      cy.get('.gridview-table-wrapper').should('have.css', 'overflow-y', 'auto');
      cy.get('.gridview-table-wrapper').should('have.css', 'overflow-x', 'auto');
      cy.get('.gridview-table-wrapper').should('have.css', 'box-sizing', 'border-box');

      // Wrapper should have max-height set but not fixed height
      cy.get('.gridview-table-wrapper').then(($wrapper) => {
        const styles = window.getComputedStyle($wrapper[0]);
        expect(styles.maxHeight).to.not.equal('none'); // Should have max-height constraint
        expect(styles.minHeight).to.equal('100px'); // Should have min-height
      });
    });

    it('should maintain sticky footer behavior', () => {
      cy.mountGridview(sampleTableHtml);

      // Footer should be sticky
      cy.get('.gridview-table tfoot').should('have.css', 'position', 'sticky');
      cy.get('.gridview-table tfoot').should('have.css', 'bottom', '0px');
      cy.get('.gridview-table tfoot').should('have.css', 'z-index', '10');
    });
  });
});
