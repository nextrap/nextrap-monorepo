import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import './nte-gridview.scss';

export interface ColumnConfig {
  key: string;
  width: number;
  minWidth?: number;
  maxWidth?: number;
  resizable?: boolean;
}

export interface GridViewOptions {
  defaultColumnWidth?: number;
  minColumnWidth?: number;
  maxColumnWidth?: number;
  enableColumnResize?: boolean;
}

@customElement('nte-gridview')
export class NteGridview extends LitElement {
  static override styles = css``;

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
    return `nte-gridview-${id}-columns`;
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

  @property({ type: Number })
  defaultColumnWidth = 150;

  @property({ type: Number })
  minColumnWidth = 15;

  @property({ type: Number })
  maxColumnWidth = 400;

  @property({ type: Boolean })
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

  override connectedCallback() {
    super.connectedCallback();
    this.loadColumnConfig();
    this.setupMutationObserver();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.cleanup();
  }

  override render() {
    return html`
      <div class="gridview-container">
        <slot></slot>
      </div>
    `;
  }

  override updated() {
    // Use requestIdleCallback for better performance
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => this.initializeColumns());
    } else {
      setTimeout(() => this.initializeColumns(), 0);
    }
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
          this.clearCache();
          this.initializeColumns();
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
      if (this.columns[index]) {
        updates.push({ element: cell as HTMLElement, width: this.columns[index].width });
      }
    });

    bodyRows.forEach((row) => {
      const cells = row.querySelectorAll('td');
      cells.forEach((cell, index) => {
        if (this.columns[index]) {
          updates.push({ element: cell as HTMLElement, width: this.columns[index].width });
        }
      });
    });

    footerCells.forEach((cell, index) => {
      if (this.columns[index]) {
        updates.push({ element: cell as HTMLElement, width: this.columns[index].width });
      }
    });

    // Apply all updates in one batch
    if (updates.length > 0) {
      // Use requestAnimationFrame for smooth updates
      requestAnimationFrame(() => {
        updates.forEach(({ element, width }) => {
          element.style.width = `${width}px`;
        });
      });
    }
  }

  private addResizeHandles() {
    if (!this.enableColumnResize) return;

    const headerCells = this.getCachedElements('thead th');

    headerCells.forEach((cell, index) => {
      if (this.columns[index]?.resizable !== false) {
        // Check if resize handle already exists
        if (cell.querySelector('.resize-handle')) return;

        const handle = document.createElement('div');
        handle.className = 'resize-handle';

        // Use event delegation for better performance
        handle.addEventListener('mousedown', (e) => this.startResize(e, index));

        (cell as HTMLElement).style.position = 'relative';
        cell.appendChild(handle);
      }
    });
  }

  private startResize(event: MouseEvent, columnIndex: number) {
    event.preventDefault();
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
    const deltaX = event.clientX - this.startX;
    const newWidth = Math.max(this.minColumnWidth, Math.min(this.maxColumnWidth, this.startWidth + deltaX));

    if (this.columns[columnIndex]) {
      this.columns[columnIndex].width = newWidth;

      // Debounce width updates for better performance
      if (this.resizeTimeout) {
        clearTimeout(this.resizeTimeout);
      }

      this.resizeTimeout = window.setTimeout(() => {
        this.applyColumnWidths();
      }, 16); // ~60fps
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

    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    this.clearCache();
  }

  // Public API methods
  public getColumnWidth(columnKey: string): number {
    const column = this.columns.find((col) => col.key === columnKey);
    return column?.width || this.defaultColumnWidth;
  }

  public setColumnWidth(columnKey: string, width: number): void {
    const column = this.columns.find((col) => col.key === columnKey);
    if (column) {
      column.width = Math.max(this.minColumnWidth, Math.min(this.maxColumnWidth, width));
      this.applyColumnWidths();
      this.saveColumnConfig();
    }
  }

  public resetColumnWidths(): void {
    this.columns.forEach((col) => {
      col.width = this.defaultColumnWidth;
    });
    this.applyColumnWidths();
    this.saveColumnConfig();
  }
}
