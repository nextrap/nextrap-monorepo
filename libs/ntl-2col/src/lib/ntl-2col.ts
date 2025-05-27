import { isBiggerThanBreakpoint } from '@nextrap/framework';
import { html, LitElement, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import style from './ntl-2col.scss?inline';

@customElement('ntl-2col')
export class Ntl2Col extends LitElement {
  static override styles = [unsafeCSS(style)];

  @property({ type: String, reflect: true })
  breakAt = 'md';

  @property({ type: Number, reflect: true })
  cols = 6;

  override connectedCallback() {
    super.connectedCallback();

    window.addEventListener('breakpoint-changed', () => this.requestUpdate());
  }

  protected override firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);

    this.shadowRoot?.querySelectorAll('slot').forEach((slot) => {
      if (slot.assignedElements().length === 0) {
        slot.classList.add('is-empty');
      } else {
        slot.classList.remove('is-empty');
      }
    });
  }

  protected override render(): unknown {
    const isBigger = isBiggerThanBreakpoint(this.breakAt);

    return html`
      <section part="section" style="--cols: ${this.cols};">
        <div part="top">
          <slot name="top"></slot>
        </div>
        <div id="row" class="${isBigger ? 'row' : 'col'}">
          <div part="main">
            <slot></slot>
          </div>
          <div part="aside">
            <slot name="aside"></slot>
          </div>
        </div>
        <div part="bottom">
          <slot name="bottom"></slot>
        </div>
      </section>
    `;
  }
}
