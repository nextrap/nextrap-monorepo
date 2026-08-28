import { nextrap_element } from '@nextrap/nt-core';
import { html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import style from './ntl-2col.scss?inline';

// Styles for the light DOM
import { resetStyle } from '@nextrap/style-reset';

@customElement('ntl-2col')
export class Ntl2Col extends nextrap_element({
  breakpoints: true,
  subLayoutApply: true,
  slotVisibility: true,
  eventBinding: false,
}) {
  static override styles = [unsafeCSS(resetStyle), unsafeCSS(style)];

  override connectedCallback() {
    super.connectedCallback();
    this.classList.add('ntl-2col');
  }

  protected override render(): unknown {
    return html`
      <div part="container" id="container">
        <div part="header" id="header">
          <slot name="header" data-query="@var(--ntl-2col-header-selector) | :scope > .header"></slot>
        </div>
        <div part="wrapper" id="wrapper">
          <div part="top" id="top">
            <slot name="top" data-query="@var(--ntl-2col-top-selector) | :scope > .top"></slot>
          </div>
          <div part="main" id="main">
            <slot></slot>
          </div>
          <div part="aside" id="aside">
            <slot
              name="aside"
              data-query="@var(--ntl-2col-aside-selector) | :scope > .aside | :scope > p:has(img)"
              data-set-attribute-class="auto"
            ></slot>
          </div>
          <div part="bottom" id="bottom">
            <slot name="bottom" data-query="@var(--ntl-2col-bottom-selector) | :scope > .bottom"></slot>
          </div>
        </div>
        <div part="footer" id="footer">
          <slot name="footer" data-query="@var(--ntl-2col-footer-selector) | :scope > .footer"></slot>
        </div>
      </div>
    `;
  }
}
