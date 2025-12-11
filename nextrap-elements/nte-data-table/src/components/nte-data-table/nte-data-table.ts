import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import './nte-data-table.scss';

export interface ColumnConfig {
  key: string;
  width: number;
  minWidth?: number;
  maxWidth?: number;
  resizable?: boolean;
}

export interface DataTableOptions {
  defaultColumnWidth?: number;
  minColumnWidth?: number;
  maxColumnWidth?: number;
  enableColumnResize?: boolean;
}

@customElement('nte-data-table')
export class NteDataTable extends LitElement {
  static override styles = css``;

  // Override to use Light DOM instead of Shadow DOM
  override createRenderRoot() {
    return this; // Use Light DOM
  }

  // Auto-generated localStorage key based on component ID
  private get localStorageKey(): string {
    // Use custom key if set, otherwise auto-generate
    if (this._customStorageKey) {
      return this._customStorageKey;
    }

    // Try to get ID from multiple sources for maximum compatibility
    const id =
      this.id ||
      this.getAttribute('id') ||
      this.getAttribute('data-id') ||
      this.getAttribute('name') ||
      this.generateUniqueId();
    return `nte-data-table-${id}-columns`;
  }

  // Generate a unique ID if none is provided
  private generateUniqueId(): string {
    if (!this._uniqueId) {
      this._uniqueId = `auto-${Math.random().toString(36).substr(2, 9)}`;
    }
    return this._uniqueId;
  }

  private _uniqueId: string | null = null;
  private _customStorageKey: string | null = null;

  // Allow setting a custom localStorage key
  public setLocalStorageKey(key: string): void {
    this._customStorageKey = key;
  }

  // Get the current localStorage key (useful for debugging)
  public getLocalStorageKey(): string {
    return this.localStorageKey;
  }

  @property({ type: Number, attribute: 'default-column-width' })
  defaultColumnWidth = 150;

  @property({ type: Number, attribute: 'min-column-width' })
  minColumnWidth = 15;

  @property({ type: Number, attribute: 'max-column-width' })
  maxColumnWidth = 400;

  @property({
    type: Boolean,
    attribute: 'enable-column-resize',
    converter: {
      fromAttribute: (value: string | null) => {
        if (value === null) return false;
        if (value === '' || value === 'true') return true;
        return false;
      },
    },
  })
  enableColumnResize = true;

  @state()
  private columns: ColumnConfig[] = [];

  @state()
  private isResizing = false;

  @state()
  private resizingColumn: string | null = null;

  @state()
  private startX = 0;

  @state()
  private startWidth = 0;

  // Performance optimizations
  private resizeTimeout: number | null = null;
  private observer: MutationObserver | null = null;
  private cachedElements = new Map<string, Element[]>();
  private resizeAnimationFrame: number | null = null;
  private pendingWidth: number | null = null;

  override connectedCallback() {
    super.connectedCallback();
    this.setupDOMStructure();
    this.loadColumnConfig();
    this.setupMutationObserver();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.cleanup();
    // Ensure resize event listeners are removed from document
    document.removeEventListener('mousemove', this.handleResize);
    document.removeEventListener('mouseup', this.stopResize);
  }

  override render() {
    // In Light DOM mode, don't render children - they already exist
    // Just return empty template since we'll manipulate DOM directly
    return html``;
  }

  override updated(changedProperties: Map<string, any>) {
    super.updated(changedProperties);

    // If enableColumnResize changed, update resize handles
    if (changedProperties.has('enableColumnResize')) {
      this.addResizeHandles();
    }

    // Use requestIdleCallback for better performance
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => this.waitForChildrenAndInitialize());
    } else {
      setTimeout(() => this.waitForChildrenAndInitialize(), 0);
    }
  }

  private setupDOMStructure() {
    // Create the wrapper structure for sticky headers/footers
    const existingTable = this.querySelector('table');

    // Check if we already have the wrapper structure
    const existingWrapper = this.querySelector('.data-table-table-wrapper');

    if (existingTable && !existingWrapper) {
      // Add the required class to the table
      existingTable.classList.add('data-table-table');

      // Create simplified wrapper structure (removed redundant container)
      const tableWrapper = document.createElement('div');
      tableWrapper.className = 'data-table-table-wrapper';

      // Ensure the CSS custom property is available for the wrapper
      if (!this.style.getPropertyValue('--data-table-max-height')) {
        this.style.setProperty('--data-table-max-height', 'calc(100vh - 200px)');
      }

      // Move the table into the simplified wrapper structure
      this.insertBefore(tableWrapper, existingTable);
      tableWrapper.appendChild(existingTable);

      // Debug: log the wrapper structure
      console.log('DOM structure created:', {
        wrapper: tableWrapper.className,
        table: existingTable.className,
        maxHeight: this.style.getPropertyValue('--data-table-max-height'),
      });
    }
  }

  private waitForChildrenAndInitialize() {
    // Wait for children to be available
    if (this.children.length === 0) {
      // If no children yet, wait a bit more
      setTimeout(() => this.waitForChildrenAndInitialize(), 50);
      return;
    }

    this.initializeColumns();
  }

  // Public method to force initialization (for testing)
  public forceInitialization() {
    this.setupDOMStructure();
    this.initializeColumns();
  }

  private setupMutationObserver() {
    // Only observe if the browser supports it
    if ('MutationObserver' in window) {
      this.observer = new MutationObserver((mutations) => {
        // Only reinitialize if table structure changes
        const hasTableChanges = mutations.some(
          (mutation) =>
            mutation.type === 'childList' &&
            (mutation.target.nodeName === 'THEAD' ||
              mutation.target.nodeName === 'TBODY' ||
              mutation.target.nodeName === 'TFOOT'),
        );

        if (hasTableChanges) {
          // Debounce the reinitialization to prevent excessive calls
          if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
          }
          this.resizeTimeout = window.setTimeout(() => {
            this.clearCache();
            this.initializeColumns();
          }, 100);
        }
      });

      this.observer.observe(this, {
        childList: true,
        subtree: true,
      });
    }
  }

  private clearCache() {
    this.cachedElements.clear();
  }

  private getCachedElements(selector: string): Element[] {
    if (!this.cachedElements.has(selector)) {
      const elements = Array.from(this.querySelectorAll(selector));
      this.cachedElements.set(selector, elements);
    }
    return this.cachedElements.get(selector) || [];
  }

  private initializeColumns() {
    // Debounce initialization to prevent multiple calls
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }

    this.resizeTimeout = window.setTimeout(() => {
      const headerCells = this.getCachedElements('thead th');
      const bodyRows = this.getCachedElements('tbody tr');

      if (headerCells.length > 0) {
        this.columns = Array.from(headerCells).map((cell, index) => {
          const key = cell.textContent?.trim() || `col-${index}`;
          const existingConfig = this.columns.find((col) => col.key === key);

          return {
            key,
            width: existingConfig?.width || this.defaultColumnWidth,
            minWidth: this.minColumnWidth,
            maxWidth: this.maxColumnWidth,
            resizable: this.enableColumnResize,
          };
        });

        // Apply column widths and add resize handles
        this.applyColumnWidths();
        this.addResizeHandles();
      } else if (bodyRows.length > 0) {
        // If no header, infer columns from body
        const firstRow = bodyRows[0];
        const cells = firstRow.querySelectorAll('td');

        this.columns = Array.from(cells).map((cell, index) => {
          const key = `col-${index}`;
          const existingConfig = this.columns.find((col) => col.key === key);

          return {
            key,
            width: existingConfig?.width || this.defaultColumnWidth,
            minWidth: this.minColumnWidth,
            maxWidth: this.maxColumnWidth,
            resizable: this.enableColumnResize,
          };
        });

        this.applyColumnWidths();
      }
    }, 100);
  }

  private applyColumnWidths() {
    // Batch DOM updates for better performance
    const updates: Array<{ element: HTMLElement; width: number }> = [];

    const headerCells = this.getCachedElements('thead th');
    const bodyRows = this.getCachedElements('tbody tr');
    const footerCells = this.getCachedElements('tfoot td');

    // Collect all updates
    headerCells.forEach((cell, index) => {
      if (this.columns[index] && cell instanceof HTMLElement) {
        updates.push({ element: cell, width: this.columns[index].width });
      }
    });

    bodyRows.forEach((row) => {
      const cells = row.querySelectorAll('td');
      cells.forEach((cell, index) => {
        if (this.columns[index] && cell instanceof HTMLElement) {
          updates.push({ element: cell, width: this.columns[index].width });
        }
      });
    });

    footerCells.forEach((cell, index) => {
      if (this.columns[index] && cell instanceof HTMLElement) {
        updates.push({ element: cell, width: this.columns[index].width });
      }
    });

    // Apply all updates in one batch
    if (updates.length > 0) {
      // Use requestAnimationFrame for smooth updates
      requestAnimationFrame(() => {
        updates.forEach(({ element, width }) => {
          if (element && element.style) {
            element.style.width = `${width}px`;
          }
        });
      });
    }
  }

  private applyColumnWidthsOptimized(columnIndex: number, width: number) {
    // Optimized method that only updates the specific column being resized
    const headerCells = this.getCachedElements('thead th');
    const bodyRows = this.getCachedElements('tbody tr');
    const footerCells = this.getCachedElements('tfoot td');

    // Update header cell
    const headerCell = headerCells[columnIndex] as HTMLElement;
    if (headerCell) {
      headerCell.style.width = `${width}px`;
    }

    // Update body cells in the same column (more efficient than full row query)
    bodyRows.forEach((row) => {
      const cell = row.children[columnIndex] as HTMLElement;
      if (cell && cell.tagName === 'TD') {
        cell.style.width = `${width}px`;
      }
    });

    // Update footer cell
    const footerCell = footerCells[columnIndex] as HTMLElement;
    if (footerCell) {
      footerCell.style.width = `${width}px`;
    }
  }

  private addResizeHandles() {
    const headerCells = this.getCachedElements('thead th');

    headerCells.forEach((cell, index) => {
      // Remove existing resize handles first
      const existingHandle = cell.querySelector('.resize-handle');
      if (existingHandle) {
        existingHandle.remove();
      }

      // Make header cells focusable for accessibility
      if (cell instanceof HTMLElement) {
        cell.setAttribute('tabindex', '0');
      }

      // Only add handles if resizing is enabled
      if (this.enableColumnResize && this.columns[index]?.resizable !== false) {
        const handle = document.createElement('div');
        handle.className = 'resize-handle';

        // Use event delegation for better performance
        handle.addEventListener('mousedown', (e) => this.startResize(e, index));

        // Ensure the cell has relative positioning for the resize handle
        if (cell instanceof HTMLElement) {
          cell.style.position = 'relative';
          cell.appendChild(handle);
        }
      }
    });
  }

  private startResize(event: MouseEvent, columnIndex: number) {
    event.preventDefault();
    event.stopPropagation();

    // Validate column index
    if (columnIndex < 0 || columnIndex >= this.columns.length) {
      console.warn('Invalid column index for resize:', columnIndex);
      return;
    }

    this.isResizing = true;
    this.resizingColumn = columnIndex.toString();
    this.startX = event.clientX;

    if (this.columns[columnIndex]) {
      this.startWidth = this.columns[columnIndex].width;
    }

    // Use passive listeners for better performance
    document.addEventListener('mousemove', this.handleResize, { passive: true });
    document.addEventListener('mouseup', this.stopResize, { passive: true });
  }

  private handleResize = (event: MouseEvent) => {
    if (!this.isResizing || this.resizingColumn === null) return;

    const columnIndex = parseInt(this.resizingColumn);

    // Validate column index
    if (columnIndex < 0 || columnIndex >= this.columns.length) {
      this.stopResize();
      return;
    }

    const deltaX = event.clientX - this.startX;
    const newWidth = Math.max(this.minColumnWidth, Math.min(this.maxColumnWidth, this.startWidth + deltaX));

    if (this.columns[columnIndex]) {
      this.columns[columnIndex].width = newWidth;
      this.pendingWidth = newWidth;

      // Use requestAnimationFrame for optimal performance
      if (this.resizeAnimationFrame) {
        cancelAnimationFrame(this.resizeAnimationFrame);
      }

      this.resizeAnimationFrame = requestAnimationFrame(() => {
        this.applyColumnWidthsOptimized(columnIndex, this.pendingWidth!);
        this.resizeAnimationFrame = null;
        this.pendingWidth = null;
      });
    }
  };

  private stopResize = () => {
    this.isResizing = false;
    this.resizingColumn = null;
    this.saveColumnConfig();

    document.removeEventListener('mousemove', this.handleResize);
    document.removeEventListener('mouseup', this.stopResize);
  };

  private loadColumnConfig() {
    try {
      const saved = localStorage.getItem(this.localStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          this.columns = parsed.map((col) => ({
            ...col,
            minWidth: this.minColumnWidth,
            maxWidth: this.maxColumnWidth,
            resizable: this.enableColumnResize,
          }));
        }
      }
    } catch (error) {
      console.warn('Failed to load column configuration:', error);
    }
  }

  private saveColumnConfig() {
    try {
      const configToSave = this.columns.map((col) => ({
        key: col.key,
        width: col.width,
      }));
      localStorage.setItem(this.localStorageKey, JSON.stringify(configToSave));
    } catch (error) {
      console.warn('Failed to save column configuration:', error);
    }
  }

  private cleanup() {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = null;
    }

    if (this.resizeAnimationFrame) {
      cancelAnimationFrame(this.resizeAnimationFrame);
      this.resizeAnimationFrame = null;
    }

    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    this.clearCache();
  }

  // Public API methods
  public getColumnWidth(columnKey: string): number {
    if (!columnKey) {
      console.warn('Invalid column key provided to getColumnWidth');
      return this.defaultColumnWidth;
    }

    const column = this.columns.find((col) => col.key === columnKey);
    return column?.width || this.defaultColumnWidth;
  }

  public getColumns(): ColumnConfig[] {
    return [...this.columns]; // Return a copy to prevent external mutation
  }

  public setColumnWidth(columnKey: string, width: number): void {
    if (!columnKey || typeof width !== 'number' || isNaN(width)) {
      console.warn('Invalid parameters for setColumnWidth:', { columnKey, width });
      return;
    }

    const column = this.columns.find((col) => col.key === columnKey);
    if (column) {
      column.width = Math.max(this.minColumnWidth, Math.min(this.maxColumnWidth, width));
      this.applyColumnWidths();
      this.saveColumnConfig();
    } else {
      console.warn('Column not found:', columnKey);
    }
  }

  public resetColumnWidths(): void {
    if (this.columns.length === 0) {
      console.warn('No columns to reset');
      return;
    }

    this.columns.forEach((col) => {
      col.width = this.defaultColumnWidth;
    });
    this.applyColumnWidths();
    this.saveColumnConfig();
  }

  public setMaxHeight(maxHeight: string): void {
    if (typeof maxHeight === 'string') {
      this.style.setProperty('--data-table-max-height', maxHeight);
    }
  }

  public getMaxHeight(): string {
    return this.style.getPropertyValue('--data-table-max-height') || 'calc(100vh - 200px)';
  }

  public testScrolling(): void {
    const wrapper = this.querySelector('.data-table-table-wrapper') as HTMLElement;
    if (wrapper) {
      console.log('Wrapper found:', {
        scrollHeight: wrapper.scrollHeight,
        clientHeight: wrapper.clientHeight,
        offsetHeight: wrapper.offsetHeight,
        maxHeight: window.getComputedStyle(wrapper).maxHeight,
        overflowY: window.getComputedStyle(wrapper).overflowY,
      });
    } else {
      console.log('No wrapper found');
    }
  }

  public testPerformance(): void {
    const tableSize = {
      headerCells: this.getCachedElements('thead th').length,
      bodyRows: this.getCachedElements('tbody tr').length,
      footerCells: this.getCachedElements('tfoot td').length,
    };

    const totalCells = tableSize.bodyRows * tableSize.headerCells + tableSize.headerCells + tableSize.footerCells;

    console.log('Performance info:', {
      ...tableSize,
      totalCells,
      cacheSize: this.cachedElements.size,
      isResizing: this.isResizing,
      pendingAnimationFrame: this.resizeAnimationFrame !== null,
      performanceOptimization: 'Column-specific updates during resize',
    });
  }
}
