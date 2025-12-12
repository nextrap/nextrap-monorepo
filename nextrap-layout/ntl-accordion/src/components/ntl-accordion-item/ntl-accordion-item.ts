import { LoggingMixin } from '@trunkjs/browser-utils';
import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { resetStyle } from '@nextrap/style-reset';
import { SubLayoutApplyMixin } from '@trunkjs/content-pane';
import style from './ntl-accordion-item.scss?inline';

@customElement('ntl-accordion-item')
export class NtlAccordionItemElement extends SubLayoutApplyMixin(LoggingMixin(LitElement)) {
  static override styles = [unsafeCSS(style), unsafeCSS(resetStyle)];

  @property({ type: Boolean, reflect: true })
  public accessor open = false;

  @property({ type: String, reflect: true, attribute: 'marker-position' })
  public accessor markerPosition: 'start' | 'end' = 'end';

  private _detailsElement: HTMLDetailsElement | null = null;

  override firstUpdated() {
    this._detailsElement = this.shadowRoot?.querySelector('details') ?? null;
    if (this._detailsElement) {
      this._detailsElement.open = this.open;
    }
  }

  private _onToggle(e: Event) {
    const details = e.target as HTMLDetailsElement;
    this.open = details.open;

    this.dispatchEvent(
      new CustomEvent('toggle', {
        detail: { open: this.open },
        bubbles: true,
        composed: true,
      }),
    );
  }

  override render() {
    return html`
      <details @toggle="${this._onToggle}">
        <summary class="summary" part="summary">
          <span class="icon">
            <slot name="icon"></slot>
          </span>
          <span class="title">
            <slot name="title" data-query=":scope > h1,h2,h3,h4,h5,h6"></slot>
          </span>
          <span class="marker">
            <slot name="marker">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </slot>
          </span>
        </summary>
        <div class="content" part="content">
          <div class="content-inner">
            <slot></slot>
          </div>
        </div>
      </details>
    `;
  }
}
