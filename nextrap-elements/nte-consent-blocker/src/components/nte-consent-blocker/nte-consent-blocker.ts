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
      const defaultTemplateSelector = stripQuotes(
        getComputedStyle(this).getPropertyValue('--default-template-selector').trim(),
      );
      if (defaultTemplateSelector) this.#copyTemplateFromSelector(defaultTemplateSelector);
    }

    if (this.querySelector(':scope > [slot="background"]') === null) {
      const defaultBg = getComputedStyle(this).getPropertyValue('--default-bg');
      if (defaultBg) this.#copyElementFromString(defaultBg, 'background');
    }

    if (this.querySelector(':scope > [slot="pre-consent"]') === null) {
      const defaultPreConsent = getComputedStyle(this).getPropertyValue('--default-pre-consent');
      if (defaultPreConsent) this.#copyElementFromString(defaultPreConsent, 'pre-consent');
    }
  }

  // Kopiert nur den Inhalt des referenzierten Templates, damit die Quelle wiederverwendbar bleibt und keine ID dupliziert wird.
  #copyTemplateFromSelector(selector: string) {
    let source: Element | null;
    try {
      source = this.ownerDocument.querySelector(selector);
    } catch {
      this.warn(`Invalid default template selector: ${selector}`);
      return;
    }

    if (!(source instanceof HTMLTemplateElement)) {
      this.warn(`Default template selector does not reference a <template>: ${selector}`);
      return;
    }

    const template = this.ownerDocument.createElement('template');
    template.content.appendChild(source.content.cloneNode(true));
    this.appendChild(template);
  }

  // Überführt die bestehenden HTML-String-Defaults für Hintergrund und Consent-Hinweis in ihren Ziel-Slot.
  #copyElementFromString(htmlString: string, slotName: string | null) {
    const template = document.createElement('template');
    template.innerHTML = stripQuotes(htmlString);
    Array.from(template.content.children).forEach((element) => {
      const clone = element.cloneNode(true);
      if (slotName && clone instanceof HTMLElement) clone.setAttribute('slot', slotName);
      this.appendChild(clone);
    });
  }

  override render() {
    return html`
      <div id="wrapper" part="wrapper">
        <div id="background" part="background">
          <slot name="background" data-query=":scope > .background | :scope > p:has(img:not(.keep))"></slot>
        </div>
        <div id="consented-content" part="consented-content"><slot name="consented-content"></slot></div>
        <div id="pre-consent" part="pre-consent"><slot name="pre-consent"></slot></div>
        <div id="loading-text" part="loading-text">Bitte warten...</div>
      </div>
    `;
  }
}
