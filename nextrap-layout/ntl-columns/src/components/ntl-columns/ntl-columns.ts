import { nextrap_element } from '@nextrap/nt-core';
import { resetStyle } from '@nextrap/style-reset';
import { html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import style from './ntl-columns.scss?inline';

// Verwendet die gemeinsame Slot-Zuordnung und Sichtbarkeit von Nextrap.
@customElement('ntl-columns')
export class NtlColumns extends nextrap_element({
  subLayoutApply: true,
  slotVisibility: true,
  breakpoints: false,
  eventBinding: false,
}) {
  static override styles = [unsafeCSS(resetStyle), unsafeCSS(style)];

  // Die DOM-Reihenfolge entspricht Mobile und Desktop ohne Reverse.
  protected override render(): unknown {
    return html`
      ${super.render()}
      <div part="wrapper" id="wrapper">
        <div part="start" class="column" id="start">
          <slot name="start"></slot>
        </div>
        <div part="center" class="column" id="center">
          <slot></slot>
        </div>
        <div part="end" class="column" id="end">
          <slot name="end" data-query=":scope > .aside"></slot>
        </div>
      </div>
    `;
  }
}
