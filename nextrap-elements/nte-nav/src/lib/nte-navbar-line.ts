import { SlotTool } from '@nextrap/nt-framework';
import { html, LitElement, PropertyValues, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import style from './nte-navbar-line.scss?inline';

@customElement('nte-navbar-line')
class NteNavbarLine extends LitElement {
  static get is() {
    return 'nte-navbar-line';
  }
  static override styles = [unsafeCSS(style)];

  private _isScrolled = false;

  protected updateScrollState() {
    const currentScrollY = window.scrollY;

    // Handle "is-scrolled" state
    if (currentScrollY > 1 && !this._isScrolled) {
      this.classList.add('is-scrolled');
      this._isScrolled = true;
    } else if (currentScrollY <= 1 && this._isScrolled) {
      this.classList.remove('is-scrolled');
      this._isScrolled = false;
    }
  }

  override connectedCallback() {
    super.connectedCallback();

    window.addEventListener('scroll', () => this.updateScrollState(), { passive: true });
  }

  override async firstUpdated(_changedProperties: PropertyValues) {
    SlotTool.observeEmptySlots(this);
    this.updateScrollState();
  }
  override render() {
    return html`
      <div id="main" part="main">
        <div id="container" part="container">
          <div id="brand" part="brand">
            <slot name="brand"></slot>
          </div>
          <div id="nav" part="nav">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }
}
