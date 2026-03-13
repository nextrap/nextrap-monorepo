import { isBiggerThanBreakpoint } from '@nextrap/nt-framework';
import { nextrap_element, NteFeatures } from '@nextrap/nte-core';
import '@nextrap/nte-offcanvas';
import { NteOffcanvas } from '@nextrap/nte-offcanvas';
import { Listen, sleep, waitForLoad } from '@trunkjs/browser-utils';
import { html, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import style from './nav.scss?inline';

const features: NteFeatures = {
  eventBinding: true,
  logging: true,
};

/**
 * <nte-nav>
 *   <span slot="brand">Brand</span>
 *   <a slot="links" href="/">Home</a>
 *   ...
 *   [optionally:] <nte-burger slot="burger"></nte-burger>
 * </nte-nav>
 */
@customElement('nte-nav')
export class NteNav extends nextrap_element(features) {
  static override styles = [unsafeCSS(style)];

  @property({ type: String, reflect: true }) accessor mode: 'master' | 'slave' = 'slave';
  // Only for mode "sidebar"

  @property({ type: String, reflect: true }) accessor breakpoint: string | number = '99999px';

  @property({ type: String, reflect: true, attribute: 'transfer-to' }) accessor transferTo = '';

  @property({ type: String, reflect: false, attribute: 'data-group-name' }) accessor dataGroupName = '';

  @state() private accessor _isTransferred = false;

  #curClickLi: HTMLLIElement | null = null;

  @Listen('click', { target: 'host' })
  private handleClickOnSubmenu(e: Event) {
    const clickLi = (e.target as HTMLElement | null)?.closest('li:has(ul)') as HTMLLIElement | null;
    if (this.#curClickLi) {
      this.#curClickLi.classList.remove('is-open');
      this.#curClickLi = null;
    }

    if (!clickLi) {
      return;
    }

    this.#curClickLi = clickLi;
    clickLi.classList.add('is-open');
  }

  @Listen('click', { target: 'window' })
  private handleClickOutside(e: Event) {
    if (!this.#curClickLi) {
      return;
    }
    const clickInside = this.#curClickLi.contains(e.target as Node);
    if (!clickInside) {
      this.#curClickLi.classList.remove('is-open');
      this.#curClickLi = null;
    }
  }

  private getOffcanvas(): NteOffcanvas | null {
    if (!this.transferTo) {
      return null;
    }
    return document.querySelector(this.transferTo) as NteOffcanvas | null;
  }

  private getOffcanvasNav(): NteNav | null {
    const offcanvas = this.getOffcanvas();
    return offcanvas ? (offcanvas.querySelector('nte-nav') as NteNav | null) : null;
  }

  constructor() {
    super();
  }

  override render() {
    return html` <nav>
      <div id="burger-wrapper" ?hidden=${!this._isTransferred}>
        <slot
          name="burger"
          open
          aria-haspopup="true"
          id="burger"
          class="burger"
          @click=${() => this.getOffcanvas()?.open()}
        >
          <!-- fallback icon -->
          ${this._isTransferred
            ? html`<div id="burger-default" style="display:flex; align-items: center; justify-content: center;">
                <div id="text" part="menutext"><slot name="menu-text"></slot></div>
                <nte-burger
                  part="burger"
                  label="Menu"
                  data-group-name="${this.dataGroupName}"
                  id="open-burger"
                  onclick="this.open = true"
                ></nte-burger>
              </div>`
            : ''}
        </slot>
      </div>

      <div class="nt-nav-links" id="main" part="main">
        <slot id="main-slot"></slot>
      </div>
    </nav>`;
  }

  public transferToElement(targetElement: NteNav) {
    const mainSlot = this.shadowRoot?.querySelector('#main-slot') as HTMLSlotElement;
    if (mainSlot === null) {
      return;
    }
    const elements = Array.from(mainSlot.assignedElements({ flatten: true }));
    elements.forEach((el) => {
      if (el instanceof HTMLElement) {
        targetElement.appendChild(el);
      }
    });
  }

  override updated(_changedProperties: PropertyValues) {
    super.updated(_changedProperties);

    if (this._isTransferred) {
      this.transferToElement(
        this.getOffcanvasNav() ??
          (() => {
            throw new Error('No offcanvas nav found');
          })(),
      );
    } else {
      this.getOffcanvasNav()?.transferToElement(this);
      this.getOffcanvas()?.close();
    }
  }

  override firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);
    // Copy all styles from the parent element to the offcanvas

    const cl = this.classList;
    if (!cl.contains('nav-vertical') && !cl.contains('nav-horizontal')) {
      cl.add(this.closest('nte-offcanvas') === null ? 'nav-horizontal' : 'nav-vertical');
    }
  }

  private updateTransferState() {
    if (isBiggerThanBreakpoint(this.breakpoint)) {
      this._isTransferred = false;
    } else {
      this._isTransferred = true;
    }
  }

  override async connectedCallback() {
    super.connectedCallback();

    if (this.mode === 'slave') {
      return;
    }
    if (this.transferTo !== '') {
      this._isTransferred = false;
      if (this.breakpoint !== '') {
        if (!isBiggerThanBreakpoint(this.breakpoint)) {
          this._isTransferred = true;
        }
        window.addEventListener('breakpoint-changed', (event: Event) => {
          this.updateTransferState();
        });
      }
    }

    await waitForLoad();
    this.updateTransferState();

    await sleep(3000);
    this.updateTransferState();
  }
}
