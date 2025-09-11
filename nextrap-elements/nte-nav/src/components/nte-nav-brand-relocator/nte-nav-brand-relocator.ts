import { waitForDomContentLoaded } from '@nextrap/nt-framework';
import { create_element, EventBindingsMixin, Listen, LoggingMixin, sleep, waitForLoad } from '@trunkjs/browser-utils';
import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import style from './nte-nav-brand-relocator.scss?inline';
// Styles for the light DOM

// Styles for your component's shadow DOM

@customElement('nte-nav-brand-relocator')
export class NteNavBrandRelocator extends EventBindingsMixin(LoggingMixin(LitElement)) {
  static override styles = [unsafeCSS(style)];

  @property({ type: String, reflect: true })
  public accessor brandSelector = '.brand-image';

  @property({ type: Boolean, reflect: true })
  public accessor active: boolean | null = null;

  @property({ type: String, reflect: true })
  public accessor mode = 'auto';

  @state()
  private accessor done = false;

  @state()
  private accessor initialized = false;

  @Listen('scroll', { target: 'window', options: { passive: true } })
  private onScroll() {
    if (this.mode !== 'auto') {
      this.log('Mode is not auto, skipping scroll handling');
      return;
    }
    const active = window.scrollY <= 2;
    if (active !== this.active) {
      this.active = active; // Debounce
    }
  }

  private onanimationEnd() {
    this.log('Animation ended - finalizing state');
    if (!this.active) {
      this.brandElement.style.visibility = 'visible';
      this.done = true;
    }
  }

  #brandElement: HTMLElement | null = null;
  private get brandElement() {
    if (!this.#brandElement) {
      this.#brandElement = document.querySelector(this.brandSelector) as HTMLElement;
      if (!this.#brandElement) {
        this.warn(`Brand element not found using selector: ${this.brandSelector}`);
      }
    }
    return this.#brandElement;
  }

  override render() {
    const brandRect = this.brandElement?.getBoundingClientRect();
    if (!brandRect) {
      return null;
    }

    const selfRect = this.getBoundingClientRect();

    const styles = {
      '--orig-top': brandRect.top + 'px',
      '--orig-left': brandRect.left + 'px',
      '--orig-width': brandRect.width + 'px',
      '--orig-height': brandRect.height + 'px',
      '--self-top': selfRect.top + 'px',
      '--self-left': selfRect.left + 'px',
      '--self-width': selfRect.width + 'px',
      '--self-height': selfRect.height + 'px',
    };

    return html`<div
      class="wrapper ${this.active ? '' : 'inactive'} ${this.done ? 'done' : ''} ${this.initialized
        ? 'initialized'
        : ''}"
      style=${styleMap(styles)}
      @transitionend=${() => this.onanimationEnd()}
    >
      <slot></slot>
    </div>`;
  }

  override update(changedProperties: Map<string, any>) {
    if (changedProperties.has('active')) {
      if (this.active === true) {
        this.#brandElement?.style.setProperty('visibility', 'hidden');
        this.done = false;
      }
    }
    super.update(changedProperties);
  }

  private get ghostElement() {
    return this.querySelector('img');
  }

  override async firstUpdated() {
    if (this.brandElement === null) {
      this.warn(`Brand element not found using selector: ${this.brandSelector}`);
      return;
    }
    this.log('Waiting for Ghost element loading...', this.ghostElement);
    await waitForLoad(this.ghostElement);
    await sleep(10); // Ensure styles are applied
    while (!this.ghostElement?.naturalWidth) {
      this.log('Waiting for Ghost element to have naturalWidth...', this.ghostElement);
      await sleep(100);
    }
    while (this.brandElement && !this.brandElement.getBoundingClientRect().width) {
      this.log('Waiting for Brand element to have width...', this.brandElement);
      await sleep(100);
    }
    const aspectRatio = this.ghostElement?.naturalWidth / this.ghostElement?.naturalHeight;
    this.log('Setting Aspect ratio:', aspectRatio);
    this.style.setProperty('--auto-aspect-ratio', aspectRatio.toString());

    this.log('Brand element is now loaded:', this.brandElement);
    this.initialized = true;
    this.onScroll();
  }

  override async connectedCallback() {
    await waitForDomContentLoaded();

    if (this.ghostElement === null) {
      const brand = this.brandElement;
      this.log('first connectedCallback() on Brand element:', brand);
      if (!brand) {
        this.warn(`Brand element not found using selector: ${this.brandSelector}`);
        return;
      }

      if (!this.hasChildNodes()) {
        const ghost = create_element('img', { src: brand.getAttribute('src') }) as HTMLImageElement;
        this.appendChild(ghost);
        this.onScroll(); // Initial check
      }
    }
    super.connectedCallback();
  }
}
