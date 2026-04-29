import { nextrap_layout, NtlFeatures } from '@nextrap/ntl-core';
import { create_element, Debouncer, Listen } from '@trunkjs/browser-utils';
import { html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

// Styles for the light DOM
import { resetStyle } from '@nextrap/style-reset';

// Styles for your component's shadow DOM
import { PropertyValues } from '@lit/reactive-element';
import style from './ntl-form-format.scss?inline';

// use nextrap_element for pure elements

const features: NtlFeatures = {
  breakpoints: true, // Enables responsive design features
  subLayoutApply: false, // For NTL only: Enable <slot data-query= support for sub-layouts
  slotVisibility: false, // quick fix for marking empty slots (unless CSS Standard supports :empty for slots)
  eventBinding: true, // Switch event binding using @Listen decorators
};


@customElement('ntl-form-format')
export class NtlFormFormatElement extends nextrap_layout(features) {
  static override styles = [unsafeCSS(style), unsafeCSS(resetStyle)];

  #debouncer = new Debouncer(100, 500);

  override connectedCallback() {
    super.connectedCallback();

  }


  #formElements: HTMLElement[] = [];

  async _onMainSlotChange() {
    let slotIndex = 1;
    await this.#debouncer.wait();
    this.#formElements = [];
    this.childNodes.forEach((node) => {

      const wrapper = create_element('nte-input-control', { required: true, floating: true });
      node.replaceWith(wrapper);
      wrapper.appendChild(node);

      this.#formElements.push(node as HTMLElement);
      slotIndex++;
    });
    this.requestUpdate();
  }

  override firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);
    this._onMainSlotChange();
  }

  override render() {


    return html`<slot></slot>`;

    const formElements = this.#formElements.map((el, index) => {
      const slotName = `form-element-${index + 1}`;
      const formElement = el.querySelector('input, textarea, select, [name]');
      if (!formElement) {
        return html`
          <div class="form-description" part="form-description">
            <slot name="${slotName}"></slot>
          </div>`;
      }
      let id = formElement.getAttribute('id') || null;
      if (id === null) {
        id = `ntl-form-format-generated-id-${index + 1}`;
        formElement.setAttribute('id', id);
      }
      const label = formElement.getAttribute('label') || formElement.getAttribute('name') || formElement.getAttribute('id') || `Element ${index + 1}`;
      return html`
        <div class="form-element" part="form-element">
          <nte-input-control>
            <slot name="${slotName}"></slot>
          </nte-input-control>
        </div>`;
    });


    console.log (formElements);
    return html`
      <div id="form-container" part="form-container">
        ${formElements}
      </div><slot hidden @slotchange=${this._onMainSlotChange}></slot> `;
  }
}
