import { nextrap_layout, NtlFeatures } from '@nextrap/ntl-core';
import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

// Styles for the light DOM

// Styles for your component's shadow DOM

// use nextrap_element for pure elements

const features: NtlFeatures = {
  breakpoints: true, // Enables responsive design features
  subLayoutApply: true, // For NTL only: Enable <slot data-query= support for sub-layouts
  slotVisibility: false, // quick fix for marking empty slots (unless CSS Standard supports :empty for slots)
  eventBinding: true, // Switch event binding using @Listen decorators
};

function stripQuotes(str: string) {
  return str.replace(/^['"]|['"]$/g, '');
}

@customElement('ntl-consent-blocker')
export class NtlConsentBlockerElement extends nextrap_layout(features) {
  // static override styles = [unsafeCSS(style), unsafeCSS(resetStyle)];
  //
  // // Example of listening to window scroll events
  // @Listen('click', { target: 'host' })
  // private onClick(e: Event) {
  //   if (e.target instanceof HTMLButtonElement && e.target.closest('[data-action="consent"]')) {
  //     this.#giveConsent();
  //   }
  // }
  //
  // #giveConsent() {
  //   const template = this.querySelector(':scope > template') as HTMLTemplateElement;
  //   if (!template) {
  //     this.warn(
  //       'No template found for consented content. Please provide a <template> element as a child of ntl-consent-blocker with the consented content.',
  //     );
  //     return;
  //   }
  //   Array.from(template.content.children).forEach((el) => {
  //     const clone = el.cloneNode(true);
  //     if (clone instanceof HTMLElement) {
  //       clone.setAttribute('slot', 'consented-content');
  //       this.appendChild(clone);
  //     }
  //   });
  //   this.consentGiven = true;
  // }  // static override styles = [unsafeCSS(style), unsafeCSS(resetStyle)];
  //
  // // Example of listening to window scroll events
  // @Listen('click', { target: 'host' })
  // private onClick(e: Event) {
  //   if (e.target instanceof HTMLButtonElement && e.target.closest('[data-action="consent"]')) {
  //     this.#giveConsent();
  //   }
  // }
  //
  // #giveConsent() {
  //   const template = this.querySelector(':scope > template') as HTMLTemplateElement;
  //   if (!template) {
  //     this.warn(
  //       'No template found for consented content. Please provide a <template> element as a child of ntl-consent-blocker with the consented content.',
  //     );
  //     return;
  //   }
  //   Array.from(template.content.children).forEach((el) => {
  //     const clone = el.cloneNode(true);
  //     if (clone instanceof HTMLElement) {
  //       clone.setAttribute('slot', 'consented-content');
  //       this.appendChild(clone);
  //     }
  //   });
  //   this.consentGiven = true;
  // }

  @property({ reflect: true })
  private accessor consentGiven = false;

  // override firstUpdated2(changedProperties: PropertyValues) {
  //   super.firstUpdated(changedProperties);
  //   if (this.querySelector(':scope > template') === null) {
  //     const defaultTemplate = getComputedStyle(this).getPropertyValue('--default-template');
  //     if (defaultTemplate) {
  //       this.#copyElementFromString(defaultTemplate, null);
  //     }
  //   }
  //
  //   if (this.querySelector(':scope > [slot="background"]') === null) {
  //     const defaultBg = getComputedStyle(this).getPropertyValue('--default-bg');
  //     if (defaultBg) {
  //       this.#copyElementFromString(defaultBg, 'background');
  //     }
  //   }
  //
  //   if (this.querySelector(':scope > template') === null) {
  //     const defaultContent = getComputedStyle(this).getPropertyValue('--default-content');
  //     if (defaultContent) {
  //       this.#copyElementFromString(defaultContent, null);
  //     }
  //   }
  // }

  // #copyElementFromString(htmlString: string, slotName: string | null) {
  //   const template = document.createElement('template');
  //   template.innerHTML = stripQuotes(htmlString);
  //   Array.from(template.content.children).forEach((element) => {
  //     const clone = element.cloneNode(true);
  //     if (!(clone instanceof HTMLElement)) {
  //       return;
  //     }
  //
  //     if (slotName) {
  //       clone.setAttribute('slot', slotName);
  //     }
  //     this.appendChild(clone);
  //   });
  // }

  override render() {
    return html`
      <div id="wrapper" part="wrapper">
        <div id="background" part="background">
          <slot name="background" data-query=":scope > .background | :scope > p:has(img:not(.keep))"></slot>
        </div>

        <div id="consented-content" part="consented-content">
          <slot name="consented-content"></slot>
        </div>

        <div id="pre-consent" part="pre-consent">
          <slot name="pre-consent"></slot>
        </div>

        <div id="loading-text">Bitte warten...</div>
      </div>
    `;
  }
}
