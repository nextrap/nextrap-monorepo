import { LoggingMixin } from '@trunkjs/browser-utils';
import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';

// Styles for the light DOM
import { resetStyle } from '@nextrap/style-reset';

// Styles for your component's shadow DOM
import style from './ntl-hero.scss?inline';

/**
 * Layered hero layout with background, centered content, and an optional framed slider.
 *
 * @slot bg - Optional background layer (e.g., `ntl-parallax-bg`). If omitted, the hero falls back to `--nt-body` / `--ntl-hero-bg-color`.
 * @slot - Hero heading, text, buttons and other call-to-action elements (default slot), centered and constrained in width.
 * @slot slider - Optional slider/carousel content that is rendered inside the hero card frame.
 * @slot nav - Optional navigation bar positioned at the top of the hero.
 *
 * @csspart section - Root `<section>` element of the hero.
 * @csspart nav - Wrapper around the navigation slot.
 * @csspart content - Wrapper around the default slot (hero text/content area).
 * @csspart slider-frame - Outer card frame around the slider content.
 * @csspart slider - Inner slider container.
 *
 * @cssprop --ntl-hero-bg-color - Background color of the hero if no `bg` slot content is provided. Defaults to `var(--nt-body, #e4e6ef)`.
 * @cssprop --ntl-hero-max-height - Maximum height of the hero container. Defaults to `950px`.
 * @cssprop --ntl-hero-shell-max-width - Maximum width of the inner hero shell. Defaults to `1200px`.
 * @cssprop --ntl-hero-content-max-width - Maximum width of the centered content block. Defaults to `940px`.
 * @cssprop --ntl-hero-slider-max-height - Maximum height of the framed slider area. Defaults to `560px`.
 * @cssprop --ntl-hero-outer-radius - Border radius of the outer slider wrapper/card. Defaults to `30px`.
 * @cssprop --ntl-hero-inner-radius - Border radius of the inner slider frame. Defaults to `20px`.
 * @cssprop --ntl-hero-height-offset - Value subtracted from `100vh` to reduce hero height (e.g. `80px`, `10vh`). Defaults to `0px`.
 * @cssprop --ntl-hero-slider-offset - Vertical translation applied to the slider card from its default bottom-aligned position (can move it outside the host). Defaults to `0px`.
 * @cssprop --ntl-hero-padding-block - Vertical padding of the hero root. Defaults to `3rem`.
 * @cssprop --ntl-hero-padding-inline - Horizontal padding of the hero root. Defaults to `1.5rem`.
 * @cssprop --ntl-hero-gap - Vertical space between content and slider card. Defaults to `1.5rem`.
 */
@customElement('ntl-hero')
export class NtlHero extends LoggingMixin(LitElement) {
  static override styles = [unsafeCSS(style), unsafeCSS(resetStyle)];

  @state()
  private accessor _hasNav = false;

  @state()
  private accessor _hasBackground = false;

  @state()
  private accessor _hasSlider = false;

  @state()
  private accessor _hasContent = false;

  protected override render(): unknown {
    return html`
      <section
        part="section"
        class="hero-root"
        data-has-nav=${this._hasNav ? 'true' : 'false'}
        data-has-bg=${this._hasBackground ? 'true' : 'false'}
        data-has-slider=${this._hasSlider ? 'true' : 'false'}
        data-has-content=${this._hasContent ? 'true' : 'false'}
      >
        <div class="hero-background">
          <slot name="bg" @slotchange=${this._onBgSlotChange}></slot>
        </div>

        <div class="hero-nav" part="nav" ?hidden=${!this._hasNav} aria-hidden=${this._hasNav ? 'false' : 'true'}>
          <slot name="nav" @slotchange=${this._onNavSlotChange}></slot>
        </div>

        <div class="hero-shell">
          <div class="hero-content" part="content">
            <slot @slotchange=${this._onContentSlotChange}></slot>
          </div>

          <div
            class="hero-slider-wrapper"
            ?hidden=${!this._hasSlider}
            aria-hidden=${this._hasSlider ? 'false' : 'true'}
          >
            <div class="hero-slider-frame" part="slider-frame">
              <div class="hero-slider" part="slider">
                <slot name="slider" @slotchange=${this._onSliderSlotChange}></slot>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  private _onNavSlotChange(event: Event): void {
    const slot = event.target as HTMLSlotElement;
    this._hasNav = slot.assignedElements({ flatten: true }).length > 0;
  }

  private _onBgSlotChange(event: Event): void {
    const slot = event.target as HTMLSlotElement;
    this._hasBackground = slot.assignedElements({ flatten: true }).length > 0;
  }

  private _onContentSlotChange(event: Event): void {
    const slot = event.target as HTMLSlotElement;
    this._hasContent = slot.assignedElements({ flatten: true }).length > 0;
  }

  private _onSliderSlotChange(event: Event): void {
    const slot = event.target as HTMLSlotElement;
    this._hasSlider = slot.assignedElements({ flatten: true }).length > 0;
  }
}
