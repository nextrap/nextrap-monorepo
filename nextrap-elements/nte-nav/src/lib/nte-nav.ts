import { customElement, isBiggerThanBreakpoint, NtElementDefinition, property, unsafeCSS } from '@nextrap/nt-framework';
import '@nextrap/nte-offcanvas';
import { NteOffcanvas } from '@nextrap/nte-offcanvas';
import { html, LitElement } from 'lit';
import { state } from 'lit/decorators.js';
import { createRef, ref, Ref } from 'lit/directives/ref.js';
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
  static DEFINITION: NtElementDefinition = {
    classes: ['align-left', 'align-right', 'align-center'],
    attributes: {},
  };

  static override styles = [unsafeCSS(style)];

  @property({ type: String, reflect: true }) mode: 'row' | 'column' | 'auto' = 'auto';
  // Only for mode "sidebar"

  @property({ type: String, reflect: true }) breakpoint: string | number = '99999px';

  private offcanvasRef: Ref<NteOffcanvas> = createRef<NteOffcanvas>();

  @state() private _sidebar = false;

  override render() {
    const sidebar = html`
      <nte-offcanvas ${ref(this.offcanvasRef)} id="sidebar" part="sidebar">
        <nte-burger id="close-burger" open slot="header" @click=${() => this.offcanvasRef.value?.close()}></nte-burger>
        <slot></slot>
      </nte-offcanvas>
    `;

    const normal = html`
      <div class="nt-nav-links" id="main" part="main">
        <slot></slot>
      </div>
    `;

    return html` <nav>
      <slot
        ?hidden=${!this._sidebar}
        name="burger"
        open
        id="burger"
        class="burger"
        @click=${() => this.offcanvasRef.value?.open()}
      >
        <!-- fallback icon -->
        <nte-burger id="open-burger"></nte-burger>
      </slot>
      ${this._sidebar ? sidebar : normal}
    </nav>`;
  }

  switchMode(mode: 'row' | 'column') {
    this.classList.remove('nav-row', 'nav-column');
    this.classList.add(`nav-${mode}`);
  }

  override connectedCallback() {
    super.connectedCallback();
    this.switchMode('column');
    this._sidebar = true;
    if (this.breakpoint !== '') {
      if (isBiggerThanBreakpoint(this.breakpoint)) {
        this.switchMode('row');
        this._sidebar = false;
      }
      window.addEventListener('breakpoint-changed', (event: Event) => {
        if (isBiggerThanBreakpoint(this.breakpoint)) {
          this.switchMode('row');
          this._sidebar = false;
        } else {
          this.switchMode('column');
          this._sidebar = true;
        }
      });
    }
  }
}
