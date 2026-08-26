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

  override firstUpdated(_changedProperties: PropertyValues) {
    const brandSlot = this.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="brand"]');
    if (brandSlot) {
      this.updateBrandSlotState(brandSlot);
    }
    this.updateScrollState();
  }

  private updateBrandSlotState(slot: HTMLSlotElement) {
    slot.toggleAttribute('empty', slot.assignedElements({ flatten: true }).length === 0);
  }

  override render() {
    return html`
      <div id="main" part="main">
        <div id="container" part="container">
          <div id="brand" part="brand">
            <slot
              name="brand"
              @slotchange=${(event: Event) => this.updateBrandSlotState(event.currentTarget as HTMLSlotElement)}
            ></slot>
          </div>
          <div id="nav" part="nav">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }
}
