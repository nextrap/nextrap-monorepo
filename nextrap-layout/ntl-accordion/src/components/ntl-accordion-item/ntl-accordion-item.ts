import { nextrap_layout } from '@nextrap/ntl-core';
import { resetStyle } from '@nextrap/style-reset';
import { html, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import style from './ntl-accordion-item.scss?inline';

@customElement('ntl-accordion-item')
export class NtlAccordionItemElement extends nextrap_layout({
  subLayoutApply: true,
  slotVisibility: false,
  eventBinding: false,
}) {
  static override styles = [unsafeCSS(resetStyle), unsafeCSS(style)];

  @property({ type: Boolean, reflect: true })
  public accessor open = false;

  @property({ type: String, reflect: true, attribute: 'marker-position' })
  public accessor markerPosition: 'start' | 'end' = 'end';

  @property({ type: String, reflect: true, attribute: 'marker-icon' })
  public accessor markerIcon: 'chevron' | 'plus' | null = null;

  private _detailsElement: HTMLDetailsElement | null = null;

  override firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    this._detailsElement = this.shadowRoot?.querySelector('details') ?? null;
    this._syncDetailsOpen();
  }

  override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    if (changedProperties.has('open')) {
      this._syncDetailsOpen();
    }
  }

  private _syncDetailsOpen() {
    if (this._detailsElement && this._detailsElement.open !== this.open) {
      this._detailsElement.open = this.open;
    }
  }

  private _onToggle(e: Event) {
    const details = e.target as HTMLDetailsElement;
    this.open = details.open;

    this.dispatchEvent(
      new CustomEvent('accordion-toggle', {
        detail: { open: this.open },
        bubbles: true,
        composed: true,
      }),
    );
  }

  override render() {
    return html`
      <details id="details" part="details" @toggle=${this._onToggle}>
        <summary id="summary" part="summary">
          <span id="title" part="title">
            <slot
              name="title"
              data-query=":scope > h1,:scope > h2,:scope > h3,:scope > h4,:scope > h5,:scope > h6"
            ></slot>
          </span>
          <span id="marker" part="marker"></span>
        </summary>
        <div id="content" part="content">
          <slot></slot>
        </div>
      </details>
    `;
  }
}
