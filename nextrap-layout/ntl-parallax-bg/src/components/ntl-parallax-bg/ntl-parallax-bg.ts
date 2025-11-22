import { EventBindingsMixin, Listen, LoggingMixin } from '@trunkjs/browser-utils';
import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

// Styles for the light DOM
import { resetStyle } from '@nextrap/style-reset';

// Styles for your component's shadow DOM
import style from './ntl-parallax-bg.scss?inline';

@customElement('ntl-parallax-bg')
export class NtlParallaxBgElement extends EventBindingsMixin(LoggingMixin(LitElement)) {
  static override styles = [unsafeCSS(style), unsafeCSS(resetStyle)];

  @property({ type: String })
  public accessor image = '';

  @property({ type: String })
  public accessor height = '100vh';

  @property({ type: String })
  public accessor width = '100vw';

  @property({ type: String })
  public accessor backgroundColor = 'transparent';

  // Listen to window scroll events for parallax effect
  @Listen('scroll', { target: 'window', options: { passive: true } })
  private onScroll() {
    const scrolled = window.scrollY;
    const rect = this.getBoundingClientRect();
    const elementTop = rect.top + scrolled;
    const elementBottom = elementTop + rect.height;

    // Only apply parallax when element is in viewport
    if (scrolled + window.innerHeight > elementTop && scrolled < elementBottom) {
      const parallaxOffset = (scrolled - elementTop) * 0.5;
      const container = this.shadowRoot?.querySelector('.parallax-container') as HTMLElement;
      if (container) {
        container.style.transform = `translateY(${parallaxOffset}px)`;
      }
    }
  }

  override render() {
    return html`
      <div
        class="parallax-wrapper"
        style="height: ${this.height}; width: ${this.width}; background-color: ${this.backgroundColor};"
      >
        <div class="parallax-container" style="background-image: url('${this.image}');"></div>
      </div>
    `;
  }
}
