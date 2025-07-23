import { Debouncer, SlotTool, waitForDomContentLoaded } from '@nextrap/nt-framework';
import { html, LitElement, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef, ref, Ref } from 'lit/directives/ref.js';
import style from './nte-navbar.scss?inline';

@customElement('nte-navbar')
export class NteNavbar extends LitElement {
  static get is() {
    return 'nte-navbar';
  }

  static override styles = [unsafeCSS(style)];

  // lit refs for navbar and spacer
  private navbarRef: Ref<HTMLDivElement> = createRef<HTMLDivElement>();
  private spacerRef: Ref<HTMLDivElement> = createRef<HTMLDivElement>();

  // Scroll threshold after which "state-scrolled" becomes active
  @property({ type: Number, attribute: 'scroll-threshold', reflect: true })
  scrollThreshold = 0;

  // Track last scroll position to detect scroll direction
  private _lastScrollY = window.scrollY;
  private _scrollUpPixels = 0;

  private _debouncer: Debouncer;

  constructor() {
    super();
    // Initialize any properties or state here if needed

    this._debouncer = new Debouncer(100, 300);

    document.addEventListener(
      'scroll',
      async () => {
        this.updateScrollState();
      },
      { passive: true },
    );
  }

  private updateScrollState() {
    const currentScrollY = window.scrollY;

    // Handle "state-scrolled-top"
    if (currentScrollY > 1) {
      this.classList.add('is-scrolled');
    } else {
      this.classList.remove('is-scrolled');
    }

    // Switch to is-scrolling-up if
    // - Scroled up more than 10 pixels
    // - below the scroll threshold
    if (currentScrollY < this._lastScrollY) {
      this._scrollUpPixels += this._lastScrollY - currentScrollY;
      if (this._scrollUpPixels > 10 && currentScrollY < this.scrollThreshold) {
        this.classList.add('is-scrolling-up');
      }
    } else {
      this._scrollUpPixels = 0; // Reset if scrolling down
      this.classList.remove('is-scrolling-up');
    }

    // Handle "state-scrolled" based on threshold
    if (currentScrollY > this.scrollThreshold) {
      this.classList.add('is-below-threshold');
    } else {
      this.classList.remove('is-below-threshold');
    }

    // Handle "state-scrolling-up"

    this._lastScrollY = currentScrollY;
  }

  override async connectedCallback() {
    this.updateScrollState();
    await waitForDomContentLoaded();
    super.connectedCallback();
    // Additional setup can be done here if needed
  }

  // Adjust the spacer height on every render
  override async updated(_changedProperties: PropertyValues) {
    await waitForDomContentLoaded();
    super.updated(_changedProperties);
  }

  override firstUpdated(_changedProperties: PropertyValues) {
    SlotTool.observeEmptySlots(this);
  }

  override render() {
    // calculate the height of the navbar and set it as a style on the spacer div

    return html`
      <div id="wrapper" part="wrapper">
        <div id="spacer" part="spacer" ${ref(this.spacerRef)}></div>
        <div id="navbar" part="navbar" ${ref(this.navbarRef)}>
          <div id="brand" part="brand">
            <slot name="brand"></slot>
          </div>
          <div id="main">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }
}
