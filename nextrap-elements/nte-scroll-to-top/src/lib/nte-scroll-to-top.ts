import { nextrap_element } from '@nextrap/nt-core';
import { resetStyle } from '@nextrap/style-reset';
import { html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { style } from './style';

@customElement('nte-scroll-to-top')
export class NteScrollToTop extends nextrap_element() {
  static override styles = [unsafeCSS(resetStyle), style];

  @property({ type: Number }) public accessor threshold = 300;
  @property({ type: String, attribute: 'scroll-behavior' })
  public accessor scrollBehavior: ScrollBehavior = 'smooth';
  @property({ type: String, attribute: 'aria-label' })
  public accessor accessibleLabel = 'Scroll to top';

  @state() private accessor visible = false;

  private animationFrame?: number;

  override connectedCallback() {
    super.connectedCallback();
    window.addEventListener('scroll', this.handleScroll, { passive: true });
    this.updateVisibility();
  }

  override disconnectedCallback() {
    window.removeEventListener('scroll', this.handleScroll);
    if (this.animationFrame !== undefined) cancelAnimationFrame(this.animationFrame);
    super.disconnectedCallback();
  }

  private readonly handleScroll = () => {
    if (this.animationFrame !== undefined) return;
    this.animationFrame = requestAnimationFrame(() => {
      this.animationFrame = undefined;
      this.updateVisibility();
    });
  };

  private updateVisibility() {
    const visible = window.scrollY > Math.max(0, this.threshold);
    if (visible === this.visible) return;
    this.visible = visible;
    this.toggleAttribute('visible', visible);
    this.classList.toggle('show', visible);
  }

  private scrollToTop() {
    window.scrollTo({ top: 0, behavior: this.scrollBehavior });
  }

  override render() {
    return html`<button
      part="button"
      type="button"
      aria-label=${this.accessibleLabel}
      aria-hidden=${this.visible ? 'false' : 'true'}
      tabindex=${this.visible ? '0' : '-1'}
      @click=${this.scrollToTop}
    >
      <slot name="icon">
        <svg part="icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
          <path
            fill-rule="evenodd"
            d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707z"
          />
        </svg>
      </slot>
    </button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nte-scroll-to-top': NteScrollToTop;
  }
}
