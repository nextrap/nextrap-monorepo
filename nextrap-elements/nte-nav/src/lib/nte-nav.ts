import { ka_dom_ready } from '@kasimirjs/core';
import { customElement, isBiggerThanBreakpoint, property, unsafeCSS } from '@nextrap/nt-framework';
import '@nextrap/nte-offcanvas';
import { NteOffcanvas } from '@nextrap/nte-offcanvas';
import { html, LitElement, PropertyValues } from 'lit';
import { state } from 'lit/decorators.js';
import style from './nav.scss?inline';

/**
 * <nte-nav>
 *   <span slot="brand">Brand</span>
 *   <a slot="links" href="/">Home</a>
 *   ...
 *   [optionally:] <nte-burger slot="burger"></nte-burger>
 * </nte-nav>
 */
@customElement('nte-nav')
export class NteNav extends LitElement {
  static override styles = [unsafeCSS(style)];

  @property({ type: String, reflect: true }) mode: 'master' | 'slave' = 'slave';
  // Only for mode "sidebar"

  @property({ type: String, reflect: true }) breakpoint: string | number = '99999px';

  @property({ type: String, reflect: true, attribute: 'transfer-to' }) transferTo = '';

  @property({ type: String, reflect: false, attribute: 'data-group-name' }) dataGroupName = '';

  @state() private _isTransferred = false;

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
                <div id="text"><slot name="menu-text"></slot></div>
                <nte-burger
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

  protected override updated(_changedProperties: PropertyValues) {
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

  protected override firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);
    // Copy all styles from the parent element to the offcanvas

    const cl = this.classList;
    if (!cl.contains('nav-vertical') && !cl.contains('nav-horizontal')) {
      cl.add(this.closest('nte-offcanvas') === null ? 'nav-horizontal' : 'nav-vertical');
    }
  }

  override async connectedCallback() {
    await ka_dom_ready();

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
          if (isBiggerThanBreakpoint(this.breakpoint)) {
            this._isTransferred = false;
          } else {
            this._isTransferred = true;
          }
        });
      }
    }
  }
}
