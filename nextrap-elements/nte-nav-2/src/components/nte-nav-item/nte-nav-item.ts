import { nextrap_element } from '@nextrap/nt-core';
import { html, nothing, type PropertyValues, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import style from './nte-nav-item.scss?inline';

export type NteNavItemCurrent = 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | '';

@customElement('nte-nav-item')
export class NteNavItem extends nextrap_element({ slotVisibility: true }) {
  static override styles = [unsafeCSS(style)];

  @property({ type: String, reflect: true }) public accessor href = '';
  @property({ type: String, reflect: true }) public accessor target = '';
  @property({ type: String, reflect: true }) public accessor rel = '';
  @property({ type: String, reflect: true }) public accessor download = '';
  @property({ type: String, reflect: true }) public accessor current: NteNavItemCurrent = '';
  @property({ type: Number, reflect: true }) public accessor order: number | undefined;

  /** Accessible name prefix for a submenu disclosure control. */
  @property({ type: String, attribute: 'submenu-label' })
  public accessor submenuLabel = 'Untermenü';

  @state() private accessor _hasSubmenu = false;
  @state() private accessor _labelText = '';

  override connectedCallback() {
    super.connectedCallback();

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'listitem');
    }

    this._assignNestedItems();
  }

  protected override updated(changedProperties: PropertyValues<this>) {
    super.updated(changedProperties);

    if (changedProperties.has('order')) {
      if (this.order === undefined || Number.isNaN(this.order)) {
        this.style.removeProperty('order');
      } else {
        this.style.order = String(this.order);
      }
    }
  }

  protected override render() {
    const label = this._renderLabel();

    return html`
      <div id="item" part="item">
        ${
          this._hasSubmenu
            ? html`
                ${this.href ? this._renderLink(label) : nothing}
                <details id="details" part="details">
                  ${this.href ? this._renderIconOnlyDisclosure() : this._renderLabelDisclosure(label)}
                  ${this._renderSubmenu()}
                </details>
              `
            : this.href
              ? this._renderLink(label)
              : html`<span id="text" part="text">${label}</span>`
        }
      </div>
    `;
  }

  private _renderLink(label: unknown) {
    return html`
      <a
        id="link"
        part="link"
        href=${this.href}
        target=${ifDefined(this.target || undefined)}
        rel=${ifDefined(this.rel || undefined)}
        download=${ifDefined(this.hasAttribute('download') ? this.download : undefined)}
        aria-current=${ifDefined(this.current || undefined)}
      >
        ${label}
      </a>
    `;
  }

  private _renderLabel() {
    return html`
      <span id="icon" part="icon">
        <slot name="icon"></slot>
      </span>
      <span id="label" part="label">
        <slot @slotchange=${this._onLabelSlotChange}></slot>
      </span>
    `;
  }

  private _renderIconOnlyDisclosure() {
    return html`
      <summary id="toggle" part="toggle" aria-label=${this._submenuAccessibleName()}>
        ${this._renderIndicator()}
      </summary>
    `;
  }

  private _renderLabelDisclosure(label: unknown) {
    return html` <summary id="disclosure" part="disclosure">${label} ${this._renderIndicator()}</summary> `;
  }

  private _renderSubmenu() {
    return html`
      <div id="submenu" part="submenu" role="list" aria-label=${this._submenuAccessibleName()}>
        <div id="submenu-inner" part="submenu-inner">
          <slot name="submenu" @slotchange=${this._onSubmenuSlotChange}></slot>
        </div>
      </div>
    `;
  }

  private _renderIndicator() {
    return html`
      <svg id="indicator" part="indicator" aria-hidden="true" viewBox="0 0 16 16">
        <path d="m3 6 5 5 5-5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" />
      </svg>
    `;
  }

  private _submenuAccessibleName() {
    return this._labelText ? `${this.submenuLabel}: ${this._labelText}` : this.submenuLabel;
  }

  private _onLabelSlotChange(event: Event) {
    const slot = event.currentTarget as HTMLSlotElement;
    const assignedNodes = slot.assignedNodes({ flatten: true });

    this._assignNestedItems();

    this._labelText = assignedNodes
      .filter((node) => !(node instanceof HTMLElement && node.matches('nte-nav-item')))
      .map((node) => node.textContent?.trim() ?? '')
      .filter(Boolean)
      .join(' ');
  }

  private _onSubmenuSlotChange(event: Event) {
    const slot = event.currentTarget as HTMLSlotElement;
    this._hasSubmenu = slot.assignedElements({ flatten: true }).some((element) => element.matches('nte-nav-item'));
  }

  private _assignNestedItems() {
    const nestedItems = Array.from(this.children).filter((element) => element.matches('nte-nav-item'));

    nestedItems.forEach((item) => item.setAttribute('slot', 'submenu'));
    this._hasSubmenu = nestedItems.length > 0;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nte-nav-item': NteNavItem;
  }
}
