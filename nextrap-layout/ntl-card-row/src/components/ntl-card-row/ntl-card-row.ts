import { html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';

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

  beforeLayoutCallback(sourceElement: HTMLElement) {
    const slottedHeader = sourceElement.querySelector(':scope > section > [slot="header"]');

    if (slottedHeader instanceof HTMLElement) {
      const headerSection = slottedHeader.parentElement;
      const firstHeader = Array.from(sourceElement.children).find((child) =>
        child.matches('.header, h1, h2, h3, h4, h5, h6'),
      );

      firstHeader?.setAttribute('slot', 'header');

      if (firstHeader) {
        firstHeader.after(slottedHeader);
      } else {
        sourceElement.prepend(slottedHeader);
      }

      if (
        headerSection?.matches('section') &&
        headerSection.children.length === 0 &&
        headerSection.textContent?.trim() === ''
      ) {
        headerSection.remove();
      }
    }

    return false;
  }

  override render() {
    return html`
      <div part="container" id="container">
        <div id="header" part="header">
          <slot
            name="header"
            data-query=":scope > .header | :scope > h1,:scope > h2,:scope > h3,:scope > h4,:scope > h5,:scope > h6, :scope > p"
          ></slot>
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
