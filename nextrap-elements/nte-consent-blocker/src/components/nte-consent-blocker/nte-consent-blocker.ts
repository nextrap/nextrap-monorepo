import { nextrap_element, NteFeatures } from '@nextrap/nt-core';
import { resetStyle } from '@nextrap/style-reset';
import { Listen, waitForDomContentLoaded } from '@trunkjs/browser-utils';
import { SubLayoutApplyMixin } from '@trunkjs/content-pane';
import { html, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import style from './nte-consent-blocker.scss?inline';

const features: NteFeatures = {
  breakpoints: true,
  slotVisibility: true,
  eventBinding: true,
};

function stripQuotes(str: string) {
  return str.replace(/^['"]|['"]$/g, '');
}

@customElement('nte-consent-blocker')
export class NteConsentBlockerElement extends SubLayoutApplyMixin(nextrap_element(features)) {
  static override styles = [unsafeCSS(resetStyle), unsafeCSS(style)];

  override async connectedCallback() {
    await waitForDomContentLoaded();
    super.connectedCallback();
    this.classList.add('nte-consent-blocker');
  }

  #giveConsent() {
    const template = this.querySelector(':scope > template') as HTMLTemplateElement;
    if (!template) {
      this.warn(
        'No template found for consented content. Please provide a <template> element as a child of nte-consent-blocker with the consented content.',
      );
      return;
    }
    Array.from(template.content.childNodes).forEach((el) => {
      const clone = el.cloneNode(true);
      if (clone instanceof HTMLElement) {
        clone.setAttribute('slot', 'consented-content');
        this.appendChild(clone);
      }
    });
    this.consentGiven = true;
  }

  @Listen('click', { target: 'host' })
  private onClick(e: Event) {
    if (e.target instanceof HTMLButtonElement && e.target.closest('[data-action="consent"]')) {
      this.#giveConsent();
    }
  }

  @property({ reflect: true })
  private accessor consentGiven = false;

  // Ergänzt ausschließlich fehlende Light-DOM-Inhalte aus den konfigurierten CSS-Defaults.
  override firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    if (this.querySelector(':scope > template') === null) {
      const defaultTemplateSelector = this.#readSelector('--default-template-selector');
      if (defaultTemplateSelector) this.#copyTemplateFromSelector(defaultTemplateSelector);
    }

    if (this.querySelector(':scope > [slot="background"]') === null) {
      const selector = this.#readSelector('--default-background-selector');
      if (selector) this.#copyTemplateFromSelector(selector, 'background');
    }
    if (this.querySelector(':scope > [slot="pre-consent"]') === null) {
      const selector = this.#readSelector('--default-pre-consent-selector');
      if (selector) this.#copyTemplateFromSelector(selector, 'pre-consent');
    }
  }

  // Normalisiert einen CSS-Selector, damit unquotierte und aus Sass übergebene Werte gleich behandelt werden.
  #readSelector(propertyName: string) {
    return stripQuotes(getComputedStyle(this).getPropertyValue(propertyName).trim());
  }

  // Kopiert Template-Inhalte wahlweise als Consent-Template oder als direkt zugewiesene Slot-Elemente.
  #copyTemplateFromSelector(selector: string, slotName: string | null = null) {
    let source: Element | null;
    try {
      source = this.ownerDocument.querySelector(selector);
    } catch {
      this.warn(`Invalid default template selector: ${selector}`);
      return false;
    }

    if (!(source instanceof HTMLTemplateElement)) {
      this.warn(`Default template selector does not reference a <template>: ${selector}`);
      return false;
    }

    if (slotName) {
      Array.from(source.content.children).forEach((element) => {
        const clone = element.cloneNode(true) as Element;
        clone.setAttribute('slot', slotName);
        this.appendChild(clone);
      });
    } else {
      const template = this.ownerDocument.createElement('template');
      template.content.appendChild(source.content.cloneNode(true));
      this.appendChild(template);
    }

    return true;
  }

  override render() {
    return html`
      <div id="wrapper" part="wrapper">
        <div id="background" part="background">
          <slot name="background" data-query=":scope > .background | :scope > p:has(img:not(.keep))">
            <img loading="lazy" fetchpriority="low" alt="Karte noch nicht geladen" src="https://cdn.leuffen.de/hyperpage-components/v1.0/google-maps/maps-preview.jpg" />
          </slot>
        </div>
        <div id="consented-content" part="consented-content"><slot name="consented-content"></slot></div>
        <div id="pre-consent" part="pre-consent"><slot name="pre-consent">
          <button type="button" class="btn btn-primary" data-action="consent">Daten von Google laden</button>
          <p>Mit Klick auf Daten von Google laden, wird der externe Inhalt geladen und die zugehörige Datenschutzerklärung akzeptiert.</p>
        </slot></div>
        <div id="loading-text" part="loading-text">Bitte warten...</div>
      </div>
    `;
  }
}
