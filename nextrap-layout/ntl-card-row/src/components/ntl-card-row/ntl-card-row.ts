import { LoggingMixin } from '@trunkjs/browser-utils';
import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

// Styles for the light DOM
import { resetStyle } from '@nextrap/style-reset';

// Styles for your component's shadow DOM
import style from './ntl-card-row.scss?inline';

@customElement('ntl-card-row')
export class NtlCardRowElement extends LoggingMixin(LitElement) {
  static override styles = [unsafeCSS(style), unsafeCSS(resetStyle)];

  @state()
  private accessor _count = 0;

  @property({ type: String, reflect: true })
  public accessor name = 'ntl-card-row';

  override render() {
    return html`
      <div class="wrapper">
        <div class="header" part="header">
          <slot name="header"></slot>
        </div>
        <div class="row">
          <slot></slot>
        </div>
        <div class="footer" part="footer">
          <slot name="footer"></slot>
        </div>
      </div>
    `;
  }

  private _increment() {
    this._count++;
  }
}
