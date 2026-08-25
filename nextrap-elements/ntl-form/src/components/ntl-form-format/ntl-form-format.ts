import { nextrap_element, NteFeatures } from '@nextrap/nt-core';
import { create_element, Debouncer } from '@trunkjs/browser-utils';
import { PropertyValues } from '@lit/reactive-element';
import { html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import { resetStyle } from '@nextrap/style-reset';
import style from './ntl-form-format.scss?inline';

const features: NteFeatures = {
  breakpoints: true,
  subLayoutApply: false,
  slotVisibility: false,
  eventBinding: true,
};

@customElement('ntl-form-format')
export class NtlFormFormatElement extends nextrap_element(features) {
  static override styles = [unsafeCSS(style), unsafeCSS(resetStyle)];

  #debouncer = new Debouncer(100, 500);
  #formElements: HTMLElement[] = [];

  async _onMainSlotChange() {
    await this.#debouncer.wait();
    this.#formElements = [];
    this.childNodes.forEach((node) => {
      const wrapper = create_element('nte-input-control', { required: true, floating: true });
      node.replaceWith(wrapper);
      wrapper.appendChild(node);
      this.#formElements.push(node as HTMLElement);
    });
    this.requestUpdate();
  }

  override firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);
    this._onMainSlotChange();
  }

  override render() {
    return html`<slot></slot>`;
  }
}
