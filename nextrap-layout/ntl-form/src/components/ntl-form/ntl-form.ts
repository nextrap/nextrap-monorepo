import { nextrap_layout, NtlFeatures } from '@nextrap/ntl-core';
import { create_element, Listen } from '@trunkjs/browser-utils';
import { html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

// Styles for the light DOM
import { resetStyle } from '@nextrap/style-reset';

// Styles for your component's shadow DOM
import { PropertyValues } from '@lit/reactive-element';
import style from './ntl-form.scss?inline';

// use nextrap_element for pure elements

const features: NtlFeatures = {
  breakpoints: true, // Enables responsive design features
  subLayoutApply: true, // For NTL only: Enable <slot data-query= support for sub-layouts
  slotVisibility: false, // quick fix for marking empty slots (unless CSS Standard supports :empty for slots)
  eventBinding: true, // Switch event binding using @Listen decorators
};

let ids = 1;

@customElement('ntl-form')
export class NtlFormElement extends nextrap_layout(features) {
  static override styles = [unsafeCSS(style), unsafeCSS(resetStyle)];

  @property({ type: String, reflect: true })
  accessor formName = `form-${ids++}`;

  #formElement: HTMLFormElement | null = null;

  // Example of listening to window scroll events
  @Listen('click', { target: 'host', options: { passive: true } })
  private onClick(e: Event) {
    const target = e.target as HTMLElement;
    const element = target.closest('button') ?? target.closest('input[type="submit"]') ?? null;
    if (!element) return; // not a Button click

    console.log('Submit button clicked', element);
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
