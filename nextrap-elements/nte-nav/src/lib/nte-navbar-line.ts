import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('nte-navbar-line')
class NteNavbarLine extends LitElement {
  static get is() {
    return 'nte-navbar-line';
  }

  override createRenderRoot() {
    return this.attachShadow({ mode: 'open' });
  }

  override connectedCallback() {
    super.connectedCallback();
    // Additional setup can be done here if needed
  }

  override render() {
    return html`
      <div id="main">
        <div id="topbar" part="topbar">
          <div id="container-top" part="container-top">
            <slot name="top"></slot>
          </div>
        </div>

        <div id="navbar" part="navbar">
          <div id="container" part="container">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }
}
