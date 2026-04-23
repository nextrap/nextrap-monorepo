import { nextrap_layout } from '@nextrap/ntl-core';
import { html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import style from './ntl-2col.scss?inline';

// Styles for the light DOM
import { resetStyle } from '@nextrap/style-reset';

@customElement('ntl-2col')
export class Ntl2Col extends nextrap_layout({
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
        <div part="top">
          <slot name="top" data-query=":scope > .top"></slot>
        </div>
        <div part="wrapper" id="wrapper">
          <div part="main" id="main">
            <slot></slot>
          </div>
          <div part="aside" id="aside">
            <slot name="aside" data-query=":scope > .aside | :scope > p:has(img)"></slot>
          </div>
        </div>
        <div part="bottom">
          <slot name="bottom" data-query=":scope > .bottom"></slot>
        </div>
      </div>
    `;
  }
}
