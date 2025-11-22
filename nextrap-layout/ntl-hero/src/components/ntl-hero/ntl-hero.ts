import { LoggingMixin } from '@trunkjs/browser-utils';
import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';

// Styles for the light DOM
import { resetStyle } from '@nextrap/style-reset';

// Styles for your component's shadow DOM
import style from './ntl-hero.scss?inline';

/**
 * Hero element with slots for background, slider, and text content
 *
 * @slot background - Background element (e.g., ntl-parallax-bg)
 * @slot slider - Slider/carousel element
 * @slot content - Text content and call-to-action elements
 */
@customElement('ntl-hero')
export class NtlHeroElement extends LoggingMixin(LitElement) {
  static override styles = [unsafeCSS(style), unsafeCSS(resetStyle)];

  @state()
  private accessor _hasBackground = false;

  @state()
  private accessor _hasSlider = false;

  @state()
  private accessor _hasContent = false;

  override render() {
    return html`
      <div class="hero-container">
        <!-- Background slot (e.g., for ntl-parallax-bg) -->
        <div class="hero-background" part="background" ?hidden=${!this._hasBackground}>
          <slot name="background" @slotchange=${this._onBackgroundSlot}></slot>
        </div>

        <!-- Slider/carousel slot -->
        <div class="hero-slider" part="slider" ?hidden=${!this._hasSlider}>
          <slot name="slider" @slotchange=${this._onSliderSlot}></slot>
        </div>

        <!-- Text content slot -->
        <div class="hero-content" part="content" ?hidden=${!this._hasContent}>
          <slot name="content" @slotchange=${this._onContentSlot}></slot>
        </div>
      </div>
    `;
  }

  private _onBackgroundSlot = (e: Event) => {
    const slot = e.target as HTMLSlotElement;
    const assigned = slot.assignedElements({ flatten: true });
    this._hasBackground = assigned.length > 0;
  };

  private _onSliderSlot = (e: Event) => {
    const slot = e.target as HTMLSlotElement;
    const assigned = slot.assignedElements({ flatten: true });
    this._hasSlider = assigned.length > 0;
  };

  private _onContentSlot = (e: Event) => {
    const slot = e.target as HTMLSlotElement;
    const assigned = slot.assignedNodes({ flatten: true }).filter((n) => this._isRenderableNode(n));
    this._hasContent = assigned.length > 0;
  };

  private _isRenderableNode(n: Node): boolean {
    if (n.nodeType === Node.TEXT_NODE) {
      return (n.textContent || '').trim().length > 0;
    }
    return n.nodeType === Node.ELEMENT_NODE;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ntl-hero': NtlHeroElement;
  }
}
