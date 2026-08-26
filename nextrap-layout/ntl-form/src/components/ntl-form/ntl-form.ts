import { nextrap_element, NteFeatures } from '@nextrap/nt-core';
import { create_element, Listen } from '@trunkjs/browser-utils';
import { html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

// Styles for the light DOM
import { resetStyle } from '@nextrap/style-reset';

// Styles for your component's shadow DOM
import { PropertyValues } from '@lit/reactive-element';
import style from './ntl-form.scss?inline';

const features: NteFeatures = {
  breakpoints: true,
  subLayoutApply: true,
  slotVisibility: false,
  eventBinding: true,
};

let ids = 1;

@customElement('ntl-form')
export class NtlFormElement extends nextrap_element(features) {
  static override styles = [unsafeCSS(style), unsafeCSS(resetStyle)];

  @property({ type: String, reflect: true })
  accessor formName = `form-${ids++}`;

  #formElement: HTMLFormElement | null = null;

  @Listen('click', { target: 'host', options: { passive: true } })
  private onClick(e: Event) {
    const target = e.target as HTMLElement;
    const element = target.closest('button') ?? target.closest('input[type="submit"]') ?? target.closest('input[type="button"]') ?? null;
    if (!element) return;

    const type = (element.getAttribute('type') || '').toLowerCase() ?? null;
    const dataAction = element.getAttribute('data-action') ?? null;

    console.log('Submit button clicked', element, type, dataAction);
  }

  override firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);
    this.#formElement = create_element('form', { id: this.formName }) as HTMLFormElement;
    this.appendChild(this.#formElement);

    this.querySelectorAll('input, select, textarea, [name]').forEach((el) => {
      if (el.hasAttribute('form')) return;
      el.setAttribute('form', this.formName);
    });
  }

  override render() {
    return html` <slot></slot> `;
  }
}
