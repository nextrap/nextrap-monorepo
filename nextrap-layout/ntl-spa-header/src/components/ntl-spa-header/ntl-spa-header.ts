// Die bestehende Nextrap-Basis erkennt leere Slots und ergänzt den Default-Style.
import { nextrap_element } from '@nextrap/nt-core';
import { html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import style from './ntl-spa-header.scss?inline';

// Der Header ordnet ausschließlich Inhalte an; Navigation und Aktionen bleiben im Light DOM.
@customElement('ntl-spa-header')
export class NtlSpaHeader extends nextrap_element({
  slotVisibility: true,
  subLayoutApply: true,
  logging: false,
}) {
  static override styles = unsafeCSS(style);

  // Getrennte Slot-Boxen zentrieren auch mehrere direkt eingesetzte Buttons.
  protected override render() {
    return html`
      ${super.render()}
      <div id="main-line" part="main-line" tabindex="0" role="group" aria-label="Header navigation">
        <slot name="brand" part="brand"></slot>
        <slot name="main-nav" part="main-nav"></slot>
        <slot name="right-nav" part="right-nav"></slot>
      </div>
      <div id="sub-line" part="sub-line" tabindex="0" role="group" aria-label="Additional header content">
        <slot name="sub-line"></slot>
      </div>
      <slot NO-DEFAULT-SLOT></slot>
    `;
  }
}

// DOM-Abfragen liefern den öffentlichen Komponententyp.
declare global {
  interface HTMLElementTagNameMap {
    'ntl-spa-header': NtlSpaHeader;
  }
}
