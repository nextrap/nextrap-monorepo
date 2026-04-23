import { nextrap_layout, NtlFeatures } from '@nextrap/ntl-core';
import { Listen } from '@trunkjs/browser-utils';
import { html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

// Styles for the light DOM
import { resetStyle } from '@nextrap/style-reset';

// Styles for your component's shadow DOM
import style from './ntl-form.scss?inline';

// use nextrap_element for pure elements

const features: NtlFeatures = {
  breakpoints: true, // Enables responsive design features
  subLayoutApply: true, // For NTL only: Enable <slot data-query= support for sub-layouts
  slotVisibility: false, // quick fix for marking empty slots (unless CSS Standard supports :empty for slots)
  eventBinding: true, // Switch event binding using @Listen decorators
};

@customElement('ntl-form')
export class NtlFormElement extends nextrap_layout(features) {
  static override styles = [unsafeCSS(style), unsafeCSS(resetStyle)];

  @state()
  private accessor _count = 0;

  @property({ type: String, reflect: true })
  public accessor name = 'ntl-form';

  // Example of listening to window scroll events
  @Listen('click', { target: 'host', options: { passive: true } })
  private onScroll(e: Event) {
    this.log('Click event', e);
  }

  override render() {
    return html`
      <form>
        <slot></slot>
      </form>
    `;
  }
}
