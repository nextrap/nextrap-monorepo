import { LoggingMixin } from '@trunkjs/browser-utils';
import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

// Styles for the light DOM
import { resetStyle } from '@nextrap/style-reset';

// Styles for your component's shadow DOM
import style from './ntl-parallax-bg.scss?inline';

@customElement('ntl-parallax-bg')
export class NtlParallaxBg extends LoggingMixin(LitElement) {
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
  private onScroll = () => {
    const scrolled = window.scrollY;
    const rect = this.getBoundingClientRect();
    const elementTop = rect.top + scrolled;

    // Calculate and apply parallax offset (negative to move up as you scroll down)
    const parallaxOffset = (scrolled - elementTop) * -0.3;
    const container = this.shadowRoot?.querySelector('.parallax-container') as HTMLElement;
    if (container) {
      container.style.transform = `translateY(${parallaxOffset}px)`;
    }
  };

  override connectedCallback() {
    super.connectedCallback();
    window.addEventListener('scroll', this.onScroll, { passive: true });
    this.updateComplete.then(() => {
      this.setupSlotObserver();
      this.extractImageFromSlot();
      // Initialize parallax position on load
      this.onScroll();
    });
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('scroll', this.onScroll);
  }

  private setupSlotObserver() {
    const slot = this.shadowRoot?.querySelector('slot');
    if (slot) {
      slot.addEventListener('slotchange', () => {
        this.extractImageFromSlot();
      });
    }
  }

  private extractImageFromSlot() {
    const slot = this.shadowRoot?.querySelector('slot') as HTMLSlotElement;
    if (!slot) {
      return;
    }

    const assignedElements = slot.assignedElements();
    let foundImage = false;
    assignedElements.forEach((element) => {
      if (element instanceof HTMLElement) {
        // Extract image source from slotted element
        const imgSrc = element.getAttribute('src') || element.querySelector('img')?.getAttribute('src');
        if (imgSrc && imgSrc !== this.image) {
          this.image = imgSrc;
          foundImage = true;
        }
        // Hide the slotted element since we're using it as background
        element.style.display = 'none';
      }
    });
    
    // Trigger re-render if we found a new image
    if (foundImage) {
      this.requestUpdate();
    }
  }

  override render() {
    return html`
      <div
        class="parallax-wrapper"
        style="height: ${this.height}; width: ${this.width}; background-color: ${this.backgroundColor}"
      >
        <div
          class="parallax-container"
          style="background-image: url('${this.image}')"
        ></div>
        <slot></slot>
      </div>
    `;
  }
}
