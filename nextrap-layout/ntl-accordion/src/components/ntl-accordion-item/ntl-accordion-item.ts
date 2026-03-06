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

  @property({ type: String, reflect: true, attribute: 'marker-icon' })
  public accessor markerIcon: 'chevron' | 'plus' | null = null;

  private _detailsElement: HTMLDetailsElement | null = null;

  override connectedCallback() {
    super.connectedCallback();
  }

  override firstUpdated(__changedProperties: Map<string, unknown>) {
    super.firstUpdated(__changedProperties);
    this._detailsElement = this.shadowRoot?.querySelector('details') ?? null;

    if (this._detailsElement) {
      this._detailsElement.open = this.open;
    }
  }

  override updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties);
    if (changedProperties.has('open') && this._detailsElement) {
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
      <details @toggle="${this._onToggle}">
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
