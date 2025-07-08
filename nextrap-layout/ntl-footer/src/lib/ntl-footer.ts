import { isBiggerThanBreakpoint } from '@nextrap/nt-framework';
import { html, LitElement, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import style from './ntl-footer-shadow.scss?inline';

@customElement('ntl-footer')
export class NtlFooter extends LitElement {
  static override styles = [unsafeCSS(style)];

  @property({ type: String, reflect: true })
  breakAt = 'md';

  @property({ type: Number, reflect: true })
  cols = 12;

  @property({ type: Boolean, reflect: true })
  parallax = true;

  @property({ type: Number, reflect: true })
  parallaxIntensity = 0.5;

  @property({ type: String, reflect: true })
  parallaxSelector = '*';

  private scrollListener?: () => void;
  private ticking = false;
  private backgroundElements: Array<{ element: HTMLElement; speed: number }> = [];

  override connectedCallback() {
    super.connectedCallback();

    window.addEventListener('breakpoint-changed', () => this.requestUpdate());

    if (this.parallax) {
      this.initParallax();
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();

    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }

  private initParallax() {
    this.scrollListener = () => {
      if (!this.ticking) {
        requestAnimationFrame(() => {
          this.updateParallax();
          this.ticking = false;
        });
        this.ticking = true;
      }
    };

    window.addEventListener('scroll', this.scrollListener, { passive: true });
  }

  private updateParallax(forceUpdate = false) {
    if (!this.parallax || this.backgroundElements.length === 0) {
      return;
    }

    const scrollTop = window.pageYOffset;
    const footerRect = this.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Calculate if footer is in viewport
    const footerTop = footerRect.top + scrollTop;
    const footerBottom = footerTop + footerRect.height;
    const viewportTop = scrollTop;
    const viewportBottom = scrollTop + windowHeight;

    // Apply parallax when footer is visible OR when forced (initial load)
    if (forceUpdate || (footerBottom > viewportTop && footerTop < viewportBottom)) {
      const parallaxOffset = (scrollTop - footerTop) * this.parallaxIntensity;

      this.backgroundElements.forEach((item) => {
        const yPos = parallaxOffset * item.speed;
        item.element.style.transform = `translateY(${yPos}px)`;
      });
    }
  }

  private calculateParallaxSpeed(element: HTMLElement, index: number, total: number): number {
    // Check if element has data-parallax-speed attribute
    const dataSpeed = element.dataset['parallaxSpeed'];
    if (dataSpeed) {
      return parseFloat(dataSpeed);
    }

    // Check for CSS custom property --parallax-speed
    const computedStyle = getComputedStyle(element);
    const cssSpeed = computedStyle.getPropertyValue('--parallax-speed').trim();
    if (cssSpeed) {
      return parseFloat(cssSpeed);
    }

    // Auto-generate speeds based on position in DOM
    // First element = slowest, last element = fastest
    const speedRange = 0.6; // Range from 0.1 to 0.7
    const minSpeed = 0.1;
    const step = total > 1 ? speedRange / (total - 1) : 0;

    return minSpeed + index * step;
  }

  protected override firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);

    this.shadowRoot?.querySelectorAll('slot').forEach((slot) => {
      if (slot.assignedElements().length === 0) {
        slot.classList.add('is-empty');
      } else {
        slot.classList.remove('is-empty');
      }
    });

    // Collect background elements for parallax
    if (this.parallax) {
      this.collectBackgroundElements();

      // Initialize parallax positioning on page load
      requestAnimationFrame(() => {
        this.updateParallax(true);
      });
    }
  }

  private collectBackgroundElements() {
    this.backgroundElements = []; // Reset array

    const backgroundSlot = this.shadowRoot?.querySelector('slot[name="background"]') as HTMLSlotElement;
    if (backgroundSlot) {
      const assignedElements = backgroundSlot.assignedElements();
      const allElements: HTMLElement[] = [];

      assignedElements.forEach((element) => {
        const children = element.querySelectorAll(this.parallaxSelector) as NodeListOf<HTMLElement>;
        allElements.push(...Array.from(children));
      });

      // Calculate speeds for all elements
      allElements.forEach((element, index) => {
        const speed = this.calculateParallaxSpeed(element, index, allElements.length);
        this.backgroundElements.push({ element, speed });
      });
    }
  }

  protected override render(): unknown {
    const isBigger = isBiggerThanBreakpoint(this.breakAt);

    return html`
      <footer part="footer" style="--cols: ${this.cols};">
        <div part="background">
          <slot name="background"></slot>
        </div>
        <div part="main" class="${isBigger ? 'row' : 'col'}">
          <slot></slot>
        </div>
        <div part="bottom">
          <slot name="bottom"></slot>
        </div>
      </footer>
    `;
  }
}
