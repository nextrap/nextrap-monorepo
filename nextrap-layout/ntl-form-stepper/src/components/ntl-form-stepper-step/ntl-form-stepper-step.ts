import { nextrap_layout, NtlFeatures } from '@nextrap/ntl-core';
import { Listen } from '@trunkjs/browser-utils';
import { html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

// Styles for the light DOM
import { resetStyle } from '@nextrap/style-reset';

// Styles for your component's shadow DOM
import style from './ntl-form-stepper-step.scss?inline';

// use nextrap_element for pure elements

const features: NtlFeatures = {
  breakpoints: true, // Enables responsive design features
  subLayoutApply: true, // For NTL only: Enable <slot data-query= support for sub-layouts
  slotVisibility: false, // quick fix for marking empty slots (unless CSS Standard supports :empty for slots)
  eventBinding: true, // Switch event binding using @Listen decorators
};

@customElement('ntl-form-stepper-step')
export class NtlFormStepperStepElement extends nextrap_layout(features) {
  static override styles = [unsafeCSS(style), unsafeCSS(resetStyle)];

  @property({ type: Boolean, reflect: true })
  public accessor valid = true;

  // Example of listening to window scroll events
  @Listen('scroll', { target: 'window', options: { passive: true } })
  private onScroll(e: Event) {
    this.log('info', 'Window scrolled', e);
  }

  public get isAccessible() {}
  public get isValid() {}

  override render() {
    return html`
      <div>
        <slot id="header" name="header" data-query=":scope > h3"></slot>
        <slot></slot>
      </div>
    `;
  }
}
