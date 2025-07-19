import { SlotTool } from '@nextrap/nt-framework';
import { html, LitElement, PropertyValues, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import style from './nte-navbar-line.scss?inline';

@customElement('nte-navbar-line')
class NteNavbarLine extends LitElement {
  static get is() {
    return 'nte-navbar-line';
  }
  static override styles = [unsafeCSS(style)];

  override connectedCallback() {
    super.connectedCallback();

    window.addEventListener(
      'scroll',
      () => {
        if (window.scrollY > 0) {
          this.classList.add('is-scrolled');
        } else {
          this.classList.remove('is-scrolled');
        }
      },
      { passive: true },
    );
  }

  override firstUpdated(_changedProperties: PropertyValues) {
    SlotTool.observeEmptySlots(this);
  }
  override render() {
    return html`
      <div id="main" part="main">
        <div id="container" part="container">
          <div id="brand" part="brand">
            <slot name="brand"></slot>
          </div>
          <div id="nav" part="nav">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }
}
