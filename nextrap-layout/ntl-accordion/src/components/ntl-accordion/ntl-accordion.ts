import { nextrap_layout } from '@nextrap/ntl-core';
import { resetStyle } from '@nextrap/style-reset';
import { html, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import '../ntl-accordion-item/ntl-accordion-item';
import { NtlAccordionItemElement } from '../ntl-accordion-item/ntl-accordion-item';
import style from './ntl-accordion.scss?inline';

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
export class NtlAccordionElement extends nextrap_layout({
  subLayoutApply: true,
  slotVisibility: false,
  eventBinding: false,
}) {
  static override styles = [unsafeCSS(resetStyle), unsafeCSS(style)];

  @property({ type: Boolean, reflect: true })
  public accessor exclusive = true;

  @property({ converter: initialOpenIndexConverter, attribute: 'initial-open-index' })
  public accessor initialOpenIndex: number | undefined = 0;

  @property({ type: String, reflect: true, attribute: 'marker-position' })
  public accessor markerPosition: 'start' | 'end' | null = null;

  @property({ type: String, reflect: true, attribute: 'marker-icon' })
  public accessor markerIcon: 'chevron' | 'plus' | null = null;

  private _initialized = false;

  override connectedCallback() {
    super.connectedCallback();
    this.classList.add('ntl-accordion');
  }

  override firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    this.addEventListener('accordion-toggle', this._onItemToggle as EventListener);
    this._onSlotChange();
  }

  private _onSlotChange = () => {
    this._propagateProperties();
    this._applyInitialOpenIndex();
  };

  private _propagateProperties() {
    const items = this._getAccordionItems();

    for (const item of items) {
      if (this.markerPosition && !item.hasAttribute('marker-position')) {
        item.markerPosition = this.markerPosition;
      }
      if (this.markerIcon && !item.hasAttribute('marker-icon')) {
        item.markerIcon = this.markerIcon;
      }
    }
  }

  private _applyInitialOpenIndex() {
    if (this._initialized || this.initialOpenIndex === undefined) return;
    this._initialized = true;

    const items = this._getAccordionItems();
    if (this.initialOpenIndex >= 0 && this.initialOpenIndex < items.length) {
      items[this.initialOpenIndex].open = true;
    }
  }

  private _onItemToggle = (e: CustomEvent<{ open: boolean }>) => {
    if (!this.exclusive || !e.detail.open) return;

    const target = e.target as NtlAccordionItemElement;
    const items = this._getAccordionItems();

    for (const item of items) {
      if (item !== target && item.open) {
        item.open = false;
      }
    }
  };

  private _getAccordionItems(): NtlAccordionItemElement[] {
    const slot = this.shadowRoot?.querySelector('slot:not([name])') as HTMLSlotElement | null;
    if (!slot) return [];

    return slot
      .assignedElements({ flatten: true })
      .filter((el): el is NtlAccordionItemElement => el.tagName === 'NTL-ACCORDION-ITEM');
  }

  override render() {
    return html`
      <div id="accordion" part="accordion">
        <slot
          data-query=":scope > section:not(.keep)"
          data-set-attribute-layout="ntl-accordion-item"
          @slotchange=${this._onSlotChange}
        ></slot>
      </div>
    `;
  }
}
