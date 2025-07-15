import { customElement, isBiggerThanBreakpoint, NtElementDefinition, property, unsafeCSS } from '@nextrap/nt-framework';
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
  static DEFINITION: NtElementDefinition = {
    classes: ['align-left', 'align-right', 'align-center'],
    attributes: {},
  };

  static override styles = [unsafeCSS(style)];

  @property({ type: String, reflect: true }) mode: 'row' | 'column' | 'auto' = 'auto';
  // Only for mode "sidebar"

  @property({ type: String, reflect: true }) text = 'Menu';

  @property({ type: String, reflect: true }) breakpoint: string | number = '99999px';

  private offcanvas: NteOffcanvas;

  @state() private _sidebar = false;

  constructor() {
    super();
    this.offcanvas = new NteOffcanvas();
    this.offcanvas.classList.add('nav-offcanvas');
    this.offcanvas.innerHTML = `<div slot="header"><nte-burger state="open"></nte-burger></div>`;
    // @ts-expect-error: onclick is definitly defined
    this.offcanvas.querySelector('nte-burger').onclick = () => {
      this.offcanvas.close();
    };

    document.body.appendChild(this.offcanvas);
  }

  override render() {
    const normal = html`
      <div class="nt-nav-links" id="main" part="main">
        <slot id="main-slot"></slot>
      </div>
    `;

    return html` <nav>
      <slot
        ?hidden=${!this._sidebar}
        name="burger"
        open
        aria-haspopup="true"
        id="burger"
        class="burger"
        @click=${() => this.offcanvas.open()}
      >
        <!-- fallback icon -->
        <div style="display:flex; align-items: center; justify-content: center;">
          <div id="text"><slot name="menu-text"></slot></div>
          <nte-burger id="open-burger"></nte-burger>
        </div>
      </slot>
      ${normal}
    </nav>`;
  }

  protected override updated(_changedProperties: PropertyValues) {
    super.updated(_changedProperties);

    if (this._sidebar) {
      const slot = this.shadowRoot?.querySelector('#main-slot') as HTMLSlotElement;
      this.offcanvas.append(...slot.assignedElements());
    }
  }

  protected override firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);
    // Copy all styles from the parent element to the offcanvas
    const styles = getComputedStyle(this);
    for (const styleName of styles) {
      console.debug(`Copying style ${styleName} with value ${styles.getPropertyValue(styleName)}`);
      if (styleName.startsWith('--')) {
        this.offcanvas.style.setProperty(styleName, styles.getPropertyValue(styleName));
      }
    }
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
