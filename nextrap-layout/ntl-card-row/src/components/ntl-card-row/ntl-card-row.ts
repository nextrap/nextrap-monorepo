import { html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

// Styles for the light DOM
import { resetStyle } from '@nextrap/style-reset';

// Styles for your component's shadow DOM
import { nextrap_layout } from '@nextrap/ntl-core';
import style from './ntl-card-row.scss?inline';

@customElement('ntl-card-row')
export class NtlCardRowElement extends nextrap_layout({
  breakpoints: true,
  subLayoutApply: true,
}) {
  static override styles = [unsafeCSS(style), unsafeCSS(resetStyle)];

  override render() {
    return html`
      <div part="container" id="container">
        <div id="header" part="header">
          <slot name="header" data-query=":scope > .header | :scope > h2,:scope > h3,:scope > h4,:scope > h5,:scope > h6"></slot>
        </div>
        <div part="main" id="main">
          <slot data-query=":scope > section" data-set-attribute-layout="ntl-card" data-query-opt=""></slot>
        </div>
        <div id="footer" part="footer">
          <slot name="footer" data-query=":scope > footer"></slot>
        </div>
      </div>
    `;
  }
}

type wurst = typeof NtlCardRowElement;
