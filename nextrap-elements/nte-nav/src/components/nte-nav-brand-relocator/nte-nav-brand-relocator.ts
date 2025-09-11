import { waitForDomContentLoaded } from '@nextrap/nt-framework';
import { EventBindingsMixin, Listen, LoggingMixin } from '@trunkjs/browser-utils';
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
    const brandRect = this.brandElement.getBoundingClientRect();

    const aspectRatio = brandRect.width / brandRect.height;
    this.style.setProperty('--auto-aspect-ratio', aspectRatio.toString());

    const selfRect = this.getBoundingClientRect();
    if (!brandRect) {
      return html`<div>No brand element found</div>`;
    }
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
      class="wrapper ${this.active ? '' : 'inactive'} ${this.done ? 'done' : ''}"
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

  override async firstUpdated() {
    await waitForDomContentLoaded();

    const brand = this.brandElement;
    if (!brand) {
      this.warn(`Brand element not found using selector: ${this.brandSelector}`);
      return;
    }
    const ghostElement = brand.cloneNode(true) as HTMLElement;
    this.appendChild(ghostElement);

    this.onScroll(); // Initial check
  }
}
