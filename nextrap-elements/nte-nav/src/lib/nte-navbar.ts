import { ka_dom_ready } from '@kasimirjs/core';
import { Debouncer, SlotTool } from '@nextrap/nt-framework';
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
    if (currentScrollY < 2) {
      this.classList.add('state-scrolled-top');
      this.classList.remove('state-pre-scrolled');
      return;
    } else {
      this.classList.remove('state-scrolled-top');
      this.classList.remove('state-scrolling-up');
    }

    if (currentScrollY < this._lastScrollY) {
      this.classList.add('state-scrolling-up');
      this.classList.remove('state-scrolling-down');
    } else {
      this.classList.remove('state-scrolling-up');
      this.classList.add('state-scrolling-down');
    }

    // Handle "state-scrolled" based on threshold
    if (currentScrollY > this.scrollThreshold) {
      this.classList.add('state-scrolled');
      this.classList.remove('state-pre-scrolled');
    } else {
      this.classList.add('state-pre-scrolled');
      this.classList.remove('state-scrolled');
    }

    // Handle "state-scrolling-up"

    this._lastScrollY = currentScrollY;
  }

  override async connectedCallback() {
    this.updateScrollState();
    await ka_dom_ready();
    super.connectedCallback();
    // Additional setup can be done here if needed
  }

  // Adjust the spacer height on every render
  override updated(_changedProperties: PropertyValues) {
    super.updated(_changedProperties);
    const navbar = this.navbarRef.value;
    const spacer = this.spacerRef.value;
    if (navbar && spacer) {
      spacer.style.height = `${navbar.offsetHeight}px`;
    }
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
          <div id="container" part="container">
            <div id="brand" part="brand">
              <slot name="brand"></slot>
            </div>
            <div id="navbars">
              <slot></slot>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
