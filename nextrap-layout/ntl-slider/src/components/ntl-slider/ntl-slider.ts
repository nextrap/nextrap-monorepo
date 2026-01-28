import { EventBindingsMixin, LoggingMixin, SlotVisibilityMixin } from '@trunkjs/browser-utils';
import { SubLayoutApplyMixin } from '@trunkjs/content-pane';
import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property, queryAssignedElements, state } from 'lit/decorators.js';

// Styles for the light DOM
import { resetStyle } from '@nextrap/style-reset';

// Styles for your component's shadow DOM
import style from './ntl-slider.scss?inline';

@customElement('ntl-slider')
export class NtlSliderElement extends SlotVisibilityMixin(
  SubLayoutApplyMixin(EventBindingsMixin(LoggingMixin(LitElement))),
) {
  static override styles = [unsafeCSS(style), unsafeCSS(resetStyle)];

  @property({ type: String, reflect: true })
  public accessor name = 'ntl-slider';

  @property({ type: Number, reflect: true, attribute: 'active-index' })
  public accessor activeIndex = 0;

  @property({ type: Boolean, reflect: true })
  public accessor autoplay = false;

  @property({ type: Number, attribute: 'autoplay-interval' })
  public accessor autoplayInterval = 5000;

  @state()
  private accessor slides: Element[] = [];

  private autoplayTimer?: number;

  @queryAssignedElements()
  private accessor slottedElements!: Element[];

  override connectedCallback() {
    super.connectedCallback();
    if (this.autoplay) {
      this.startAutoplay();
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.stopAutoplay();
  }

  private handleSlotChange() {
    this.warn('handleSlotChange: slides = ', this.slottedElements, '');
    this.slides = this.slottedElements.filter((el) => el.matches(':not(hr)'));
    this.activeIndex = 0;
    this.setActiveSlide(this.activeIndex);
  }

  private setActiveSlide(activeIndex: number) {
    this.slides.forEach((slide, index) => {
      slide.classList.remove('prev', 'active', 'next');
      if (index === activeIndex) {
        slide.classList.add('active');
      }
    });
    this.renderIndicators();
  }

  /**
   * NAVIGATION
   * @private
   */
  public goToSlide(index: number) {
    if (index < 0) {
      index = this.slides.length - 1;
    }
    if (index >= this.slides.length) {
      index = 0;
    }
    this.activeIndex = index;
    this.setActiveSlide(index);
    this.dispatchEvent(new CustomEvent('slide-change', { detail: { index: this.activeIndex } }));
  }

  public next() {
    this.goToSlide(this.activeIndex + 1);
  }

  public prev() {
    this.goToSlide(this.activeIndex - 1);
  }

  /**
   * AUTO PLAY
   * @private
   */
  private startAutoplay() {
    this.stopAutoplay();
    this.autoplayTimer = window.setInterval(() => this.next(), this.autoplayInterval);
  }

  private stopAutoplay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = undefined;
    }
  }

  /**
   * INDICATORS
   * @private
   */
  private renderIndicators() {
    const container = this.shadowRoot?.getElementById('indicator');
    if (!container) return;
    container.innerHTML = '';
    this.slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.part.add('indicator-dot');
      dot.toggleAttribute('active', index === this.activeIndex);
      dot.addEventListener('click', () => this.goToSlide(index));
      container.appendChild(dot);
    });
  }

  override render() {
    return html`
      <div>
        <div part="wrapper" id="wrapper">
          <div part="content" id="content">
            <slot
              data-query=":scope > section:not(.keep)"
              data-set-attribute-layout="ntl-slide"
              @slotchange=${this.handleSlotChange}
            ></slot>
          </div>
          <div part="navigation" id="navigation">
            <button part="nav-prev" @click=${this.prev}>&#10094;</button>
            <button part="nav-next" @click=${this.next}>&#10095;</button>
          </div>
          <div part="indicator" id="indicator"></div>
        </div>
      </div>
    `;
  }
}
