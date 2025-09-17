import { html, LitElement, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';

import { resetStyle } from '@nextrap/style-reset';
import style from './nte-multiselect.scss?inline';

import '../nte-multiselect-item/nte-multiselect-item';
import type { NteMultiselectItemElement } from '../nte-multiselect-item/nte-multiselect-item';

export interface MultiselectChangeDetail {
  values: Array<{ name: string; value: string; checked: boolean }>;
  checkedValues: string[];
}

@customElement('nte-multiselect')
export class NteMultiselectElement extends LitElement {
  static override styles = [unsafeCSS(style), unsafeCSS(resetStyle)];

  @property({ type: String, reflect: true })
  layout: 'rows' | 'columns' | 'grid' = 'rows';

  @queryAssignedElements({ selector: 'nte-multiselect-item' })
  private _items!: NteMultiselectItemElement[];

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('change', this._handleItemChange as EventListener);
  }

  override disconnectedCallback(): void {
    this.removeEventListener('change', this._handleItemChange as EventListener);
    super.disconnectedCallback();
  }

  override render(): TemplateResult {
    return html`
      <div class="container ${this.layout}">
        <slot @slotchange=${this._onSlotChange}></slot>
      </div>
    `;
  }

  private _onSlotChange(): void {
    // Setup initial state and listeners for newly added items
    this._items.forEach((item) => {
      // Ensure proper radio button behavior
      if (item.type === 'radio' && item.checked) {
        this._handleRadioSelection(item);
      }
    });
  }

  private _handleItemChange(event: CustomEvent): void {
    // Check if the event is from a direct child nte-multiselect-item
    const target = event.target as HTMLElement;
    if (target.tagName !== 'NTE-MULTISELECT-ITEM') return;

    // Stop propagation to prevent bubbling up further
    event.stopPropagation();

    const item = target as NteMultiselectItemElement;

    // Handle radio button group behavior
    if (item.type === 'radio' && item.checked) {
      this._handleRadioSelection(item);
    }

    // Dispatch consolidated change event
    this._dispatchChangeEvent();
  }

  private _handleRadioSelection(selectedItem: NteMultiselectItemElement): void {
    if (!selectedItem.name) return;

    // Uncheck all other radio items with the same name
    this._items.forEach((item) => {
      if (item !== selectedItem && item.type === 'radio' && item.name === selectedItem.name) {
        item.setChecked(false);
      }
    });
  }

  private _dispatchChangeEvent(): void {
    const values = this._items.map((item) => ({
      name: item.name,
      value: item.value,
      checked: item.checked,
    }));

    const checkedValues = values.filter((v) => v.checked).map((v) => v.value);

    const detail: MultiselectChangeDetail = {
      values,
      checkedValues,
    };

    this.dispatchEvent(
      new CustomEvent('change', {
        detail,
        bubbles: true,
        composed: true,
      }),
    );
  }

  /**
   * Get all selected values
   */
  getSelectedValues(): string[] {
    return this._items.filter((item) => item.checked).map((item) => item.value);
  }

  /**
   * Get selected values grouped by name
   */
  getSelectedValuesByGroup(): Record<string, string[]> {
    const groups: Record<string, string[]> = {};

    this._items
      .filter((item) => item.checked)
      .forEach((item) => {
        const groupName = item.name || 'default';
        if (!groups[groupName]) {
          groups[groupName] = [];
        }
        groups[groupName].push(item.value);
      });

    return groups;
  }

  /**
   * Set selected values programmatically
   */
  setSelectedValues(values: string[]): void {
    this._items.forEach((item) => {
      item.setChecked(values.includes(item.value));
    });
    this._dispatchChangeEvent();
  }

  /**
   * Clear all selections
   */
  clearSelection(): void {
    this._items.forEach((item) => {
      item.setChecked(false);
    });
    this._dispatchChangeEvent();
  }

  /**
   * Select all items (only works for checkboxes)
   */
  selectAll(): void {
    this._items.forEach((item) => {
      if (item.type === 'checkbox') {
        item.setChecked(true);
      }
    });
    this._dispatchChangeEvent();
  }

  /**
   * Toggle selection of a specific value
   */
  toggleValue(value: string): void {
    const item = this._items.find((i) => i.value === value);
    if (item) {
      item.setChecked(!item.checked);
      if (item.type === 'radio' && item.checked) {
        this._handleRadioSelection(item);
      }
      this._dispatchChangeEvent();
    }
  }

  /**
   * Check if a value is selected
   */
  isValueSelected(value: string): boolean {
    const item = this._items.find((i) => i.value === value);
    return item ? item.checked : false;
  }

  /**
   * Get all items
   */
  getItems(): NteMultiselectItemElement[] {
    return Array.from(this._items);
  }

  /**
   * Validate the form (checks if required groups have selections)
   */
  validate(requiredGroups?: string[]): boolean {
    if (!requiredGroups || requiredGroups.length === 0) {
      return true;
    }

    const selectedGroups = this.getSelectedValuesByGroup();
    return requiredGroups.every((group) => selectedGroups[group] && selectedGroups[group].length > 0);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nte-multiselect': NteMultiselectElement;
  }
}
