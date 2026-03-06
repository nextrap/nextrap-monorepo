import { nextrap_layout, NtlFeatures } from '@nextrap/ntl-core';
import { create_element, Listen } from '@trunkjs/browser-utils';
import { html, nothing, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';

// Styles for the light DOM
import { resetStyle } from '@nextrap/style-reset';

// Styles for your component's shadow DOM
import style from './ntl-consent-blocker.scss?inline';

// use nextrap_element for pure elements

const features: NtlFeatures = {
  breakpoints: true, // Enables responsive design features
  subLayoutApply: true, // For NTL only: Enable <slot data-query= support for sub-layouts
  slotVisibility: false, // quick fix for marking empty slots (unless CSS Standard supports :empty for slots)
  eventBinding: true, // Switch event binding using @Listen decorators
};

@customElement('ntl-consent-blocker')
export class NtlConsentBlockerElement extends nextrap_layout(features) {
  static override styles = [unsafeCSS(style), unsafeCSS(resetStyle)];

  // Example of listening to window scroll events
  @Listen('click', { target: 'host' })
  private onClick(e: Event) {
    if (e.target instanceof HTMLButtonElement && e.target.closest('[data-action="save"]')) {
      this.#giveConsent();
    }
  }

  #giveConsent() {
    const template = this.querySelector(':scope > template');
    if (!template) {
      this.warn(
        'No template found for consented content. Please provide a <template> element as a child of ntl-consent-blocker with the consented content.',
      );
      return;
    }
    const consentContent = create_element('div', { innerHTML: template.innerHTML, slot: 'consented-content' });
    this.appendChild(consentContent);
    this.consentGiven = true;
  }

  @state()
  private accessor consentGiven = false;

  override render() {
    return html`
      <div id="wrapper" part="wrapper">
        <div id="background" part="background">
          <slot name="background" data-query=":scope > .background | :scope > p:has(img:not(.keep))"></slot>
        </div>

        ${this.consentGiven
          ? nothing
          : html`
              <div id="content" part="content">
                <slot></slot>
              </div>
            `}
        ${this.consentGiven
          ? html`
              <div id="consented-content" part="consented-content">
                <slot name="consented-content"></slot>
              </div>
            `
          : nothing}
      </div>
    `;
  }
}
