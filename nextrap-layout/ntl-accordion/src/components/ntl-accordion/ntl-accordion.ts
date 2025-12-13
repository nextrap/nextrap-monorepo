import { LoggingMixin } from '@trunkjs/browser-utils';
import { SubLayoutApplyMixin } from '@trunkjs/content-pane';
import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { resetStyle } from '@nextrap/style-reset';
import style from './ntl-accordion.scss?inline';

import '../ntl-accordion-item/ntl-accordion-item';
import { NtlAccordionItemElement } from '../ntl-accordion-item/ntl-accordion-item';

/**
 * Converter for initialOpenIndex that handles:
 * - Missing attribute: undefined
 * - Empty attribute (initial-open-index): 0
 * - Numeric value (initial-open-index="2"): 2
 */
const initialOpenIndexConverter = {
  fromAttribute(value: string | null): number | undefined {
    if (value === null) {
      return undefined;
    }
    if (value === '') {
      return 0;
    }
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? undefined : parsed;
  },
  toAttribute(value: number | undefined): string | null {
    return value !== undefined ? String(value) : null;
  },
};

@customElement('ntl-accordion')
export class NtlAccordionElement extends SubLayoutApplyMixin(LoggingMixin(LitElement)) {
  static override styles = [unsafeCSS(style), unsafeCSS(resetStyle)];

  @property({ type: Boolean, reflect: true })
  public accessor exclusive = false;

  @property({ converter: initialOpenIndexConverter, attribute: 'initial-open-index' })
  public accessor initialOpenIndex: number | undefined = undefined;

  @property({ type: String, reflect: true, attribute: 'marker-icon' })
  public accessor markerIcon: 'chevron' | 'plus' | null = null;

  @property({ type: String, reflect: true, attribute: 'marker-position' })
  public accessor markerPosition: 'start' | 'end' | null = null;

  private _initialized = false;

  override firstUpdated() {
    this.addEventListener('accordion-toggle', this._onItemToggle.bind(this) as EventListener);

    // Listen for slotchange to initialize items
    const slot = this.shadowRoot?.querySelector('slot:not([name])') as HTMLSlotElement | null;
    slot?.addEventListener('slotchange', () => this._onSlotChange());
  }

  private _onSlotChange() {
    this._propagateProperties();
    this._applyInitialOpenIndex();
  }

  private _propagateProperties() {
    const items = this._getAccordionItems();

    for (const item of items) {
      // Propagate marker-icon if set on accordion and not on item
      if (this.markerIcon && !item.hasAttribute('marker-icon')) {
        item.markerIcon = this.markerIcon;
      }

      // Propagate marker-position if set on accordion and not on item
      if (this.markerPosition && !item.hasAttribute('marker-position')) {
        item.markerPosition = this.markerPosition;
      }
    }
  }

  private _applyInitialOpenIndex() {
    if (this._initialized) return;
    this._initialized = true;

    if (this.initialOpenIndex === undefined) return;

    const items = this._getAccordionItems();
    if (this.initialOpenIndex >= 0 && this.initialOpenIndex < items.length) {
      items[this.initialOpenIndex].open = true;
    }
  }

  private _onItemToggle(e: CustomEvent<{ open: boolean }>) {
    if (!this.exclusive || !e.detail.open) return;

    const target = e.target as NtlAccordionItemElement;
    const items = this._getAccordionItems();

    for (const item of items) {
      if (item !== target && item.open) {
        item.open = false;
      }
    }
  }

  private _getAccordionItems(): NtlAccordionItemElement[] {
    const slot = this.shadowRoot?.querySelector('slot:not([name])') as HTMLSlotElement | null;
    if (!slot) return [];

    return slot
      .assignedElements({ flatten: true })
      .filter((el): el is NtlAccordionItemElement => el.tagName === 'NTL-ACCORDION-ITEM');
  }

  override render() {
    return html`
      <div class="accordion" part="accordion">
        <slot data-query=":scope > section" data-set-attribute-layout="ntl-accordion-item"></slot>
      </div>
    `;
  }
}
