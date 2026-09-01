import { nextrap_element } from '@nextrap/nt-core';
import { html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import style from './nte-navbar-line.scss?inline';

@customElement('nte-navbar-line')
export class NteNavbarLine extends nextrap_element({ slotVisibility: true }) {
  static get is() {
    return 'nte-navbar-line';
  }

  static override styles = [unsafeCSS(style)];

  override render() {
    return html`
      <div id="line" part="line">
        <div id="container" part="container">
          <div id="start" class="region" part="start"><slot name="start"></slot></div>
          <div id="center" class="region" part="center"><slot name="center"></slot></div>
          <div id="end" class="region" part="end"><slot name="end"></slot></div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nte-navbar-line': NteNavbarLine;
  }
}
