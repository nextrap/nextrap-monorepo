import { LoggingMixin } from '@trunkjs/browser-utils';
import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

// Styles for the light DOM
import { resetStyle } from '@nextrap/style-reset';

// Styles for your component's shadow DOM
import style from './nte-card.scss?inline';

@customElement('nte-card')
export class NteCardElement extends LoggingMixin(LitElement) {
  static override styles = [unsafeCSS(style), unsafeCSS(resetStyle)];

  /**
   * When true, the card will stretch to available height and its body will expand
   * to fill the remaining space (flex layout).
   */
  @property({ type: Boolean, reflect: true })
  public accessor fill = false;

  @state() private accessor _hasHeader = false;
  @state() private accessor _hasImage = false;
  @state() private accessor _hasFooter = false;
  @state() private accessor _role = '';
  @state() private accessor _ariaLabel: string | null = null;

  #aHrefElmeent: HTMLAnchorElement | null = null;

  override render() {
    return html`
      <div
        class="card"
        part="card"
        role=${this._role}
        @click=${() => this.#click()}
        @keydown=${(e: KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.#click();
          }
        }}
        aria-label=${this._ariaLabel}
        tabindex=${this._role === 'button' ? '0' : '-1'}
      >
        <div class="card-header" part="header" ?hidden=${!this._hasHeader}>
          <slot name="header" @slotchange=${this.#onHeaderSlot}></slot>
        </div>

        <div class="card-img-top" part="image" ?hidden=${!this._hasImage}>
          <slot name="image" @slotchange=${this.#onImageSlot}></slot>
        </div>

        <div class="card-body" part="body">
          <slot></slot>
        </div>

        <div class="card-footer" part="footer" ?hidden=${!this._hasFooter}>
          <slot name="footer" @slotchange=${this.#onFooterSlot}></slot>
        </div>
        <div hidden>
          <slot name="link" @slotchange=${this.#onLinkSlot}></slot>
        </div>
      </div>
    `;
  }

  #click = () => {
    this.#aHrefElmeent?.click();
  };

  #onHeaderSlot = (e: Event) => {
    const slot = e.target as HTMLSlotElement;
    const assigned = slot.assignedNodes({ flatten: true }).filter((n) => this.#isRenderableNode(n));
    this._hasHeader = assigned.length > 0;
    // Optional: normalize header spacing if needed (handled by styles).
  };

  #onFooterSlot = (e: Event) => {
    const slot = e.target as HTMLSlotElement;
    const assigned = slot.assignedNodes({ flatten: true }).filter((n) => this.#isRenderableNode(n));
    this._hasFooter = assigned.length > 0;
  };

  #onImageSlot = (e: Event) => {
    const slot = e.target as HTMLSlotElement;
    const assigned = slot.assignedElements({ flatten: true });
    this._hasImage = assigned.length > 0;
  };
  #onLinkSlot = async (e: Event) => {
    const slot = e.target as HTMLSlotElement;
    const assigned = slot.assignedElements({ flatten: true });
    if (assigned.length > 0) {
      this._role = 'button';
      const el = assigned[0];
      if (el instanceof HTMLAnchorElement) {
        this.#aHrefElmeent = el;
        console.log('Found link element in slot:', el, el.getAttribute('aria-label'), el.textContent);
        this._ariaLabel = el.getAttribute('aria-label') || el.textContent?.trim() || '';
      } else {
        this.warn(
          "nte-card: The element assigned to the 'link' slot is not an anchor (<a>) element. Element found:",
          el,
        );
        this.#aHrefElmeent = null;
      }
    }
  };
  #isRenderableNode(n: Node): boolean {
    if (n.nodeType === Node.TEXT_NODE) {
      return (n.textContent || '').trim().length > 0;
    }
    return n.nodeType === Node.ELEMENT_NODE;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nte-card': NteCardElement;
  }
}
