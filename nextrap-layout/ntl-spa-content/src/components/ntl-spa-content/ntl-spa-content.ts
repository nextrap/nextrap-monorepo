// Die Nextrap-Basis übernimmt Slot-Zustände und die Content-Pane-Zuordnung.
import { nextrap_element } from '@nextrap/nt-core';
import { html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import style from './ntl-spa-content.scss?inline';

// Das Layout benötigt außer dem Template keine eigene Zustands- oder Scrolllogik.
@customElement('ntl-spa-content')
export class NtlSpaContent extends nextrap_element({
  slotVisibility: true,
  subLayoutApply: true,
  logging: false,
}) {
  static override styles = unsafeCSS(style);

  // Header bleiben außerhalb der Scrollports; der Parent-Render bleibt erhalten.
  protected override render() {
    return html`
      ${super.render()}
      <div id="sidebar-left" part="sidebar-left">
        <slot name="sidebar-left-header" part="sidebar-left-header"></slot>
        <slot name="sidebar-left" part="sidebar-left-content" tabindex="0" role="region" aria-label="Left sidebar"></slot>
      </div>
      <div id="main" part="main">
        <slot name="header" part="header"></slot>
        <slot part="content" tabindex="0" role="region" aria-label="Content"></slot>
        <slot name="footer" part="footer"></slot>
      </div>
      <div id="sidebar-right" part="sidebar-right">
        <slot name="sidebar-right-header" part="sidebar-right-header"></slot>
        <slot name="sidebar-right" part="sidebar-right-content" tabindex="0" role="region" aria-label="Right sidebar"></slot>
      </div>
    `;
  }
}

// Macht DOM-Abfragen auf das registrierte Element auch für TypeScript typisiert.
declare global {
  interface HTMLElementTagNameMap {
    'ntl-spa-content': NtlSpaContent;
  }
}
