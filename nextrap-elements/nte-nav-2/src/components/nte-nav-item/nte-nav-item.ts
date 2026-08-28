import { nextrap_element } from '@nextrap/nt-core';
import { html, nothing, type PropertyValues, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import style from './nte-nav-item.scss?inline';

export type NteNavItemCurrent = 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | '';

@customElement('nte-nav-item')
export class NteNavItem extends nextrap_element({ slotVisibility: true }) {
  static override styles = [unsafeCSS(style)];

  private _presentationObserver: ResizeObserver | undefined;
  private _lastInlinePresentation: boolean | undefined;
  private _preserveDetailsOnPopoverClose = false;

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

    if (this.hasUpdated) {
      queueMicrotask(() => this._startPresentationObserver());
    }
  }

  override disconnectedCallback() {
    this._presentationObserver?.disconnect();
    super.disconnectedCallback();
  }

  protected override updated(changedProperties: PropertyValues<this>) {
    super.updated(changedProperties);

    if (!this._presentationObserver) {
      this._startPresentationObserver();
    }

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
      <summary
        id="toggle"
        part="toggle"
        aria-label=${this._submenuAccessibleName()}
        @click=${this._onDisclosureClick}
      >
        ${this._renderIndicator()}
      </summary>
    `;
  }

  private _renderLabelDisclosure(label: unknown) {
    return html`<summary id="disclosure" part="disclosure" @click=${this._onDisclosureClick}>${label} ${this._renderIndicator()}</summary>`;
  }

  private _renderSubmenu() {
    return html`
      <div
        id="submenu"
        part="submenu"
        role="list"
        aria-label=${this._submenuAccessibleName()}
        @toggle=${this._onPopoverToggle}
      >
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

  private _onDisclosureClick(event: MouseEvent) {
    const submenu = this._submenuElement();

    if (!submenu || this._usesInlinePresentation() || !this._supportsPopover(submenu)) {
      return;
    }

    event.preventDefault();

    if (this._isPopoverOpen(submenu)) {
      submenu.hidePopover();
      return;
    }

    this._showPopover(submenu, event.currentTarget as HTMLElement);
  }

  private _onPopoverToggle(event: Event) {
    const toggleEvent = event as Event & { newState?: 'open' | 'closed' };

    if (toggleEvent.newState !== 'closed') {
      return;
    }

    const submenu = event.currentTarget as HTMLElement;
    const details = this.shadowRoot?.getElementById('details') as HTMLDetailsElement | null;

    submenu.removeAttribute('popover');

    if (this._preserveDetailsOnPopoverClose) {
      this._preserveDetailsOnPopoverClose = false;
      if (details) {
        details.open = true;
      }
      return;
    }

    if (details) {
      details.open = false;
    }
  }

  private _startPresentationObserver() {
    if (!this.isConnected || typeof ResizeObserver === 'undefined') {
      return;
    }

    this._presentationObserver ??= new ResizeObserver(() => this._syncSubmenuPresentation());
    this._presentationObserver.disconnect();
    this._presentationObserver.observe(this);
    this._presentationObserver.observe(document.documentElement);
    this._syncSubmenuPresentation();
  }

  private _syncSubmenuPresentation() {
    const usesInlinePresentation = this._usesInlinePresentation();

    if (usesInlinePresentation === this._lastInlinePresentation) {
      return;
    }

    this._lastInlinePresentation = usesInlinePresentation;

    const submenu = this._submenuElement();
    const details = this.shadowRoot?.getElementById('details') as HTMLDetailsElement | null;

    if (!submenu || !details || !this._supportsPopover(submenu)) {
      return;
    }

    if (usesInlinePresentation) {
      if (this._isPopoverOpen(submenu)) {
        this._preserveDetailsOnPopoverClose = details.open;
        submenu.hidePopover();
      } else {
        submenu.removeAttribute('popover');
      }
      return;
    }

    if (details.open) {
      this._showPopover(submenu);
    }
  }

  private _showPopover(submenu: HTMLElement, source = this._disclosureElement()) {
    const details = this.shadowRoot?.getElementById('details') as HTMLDetailsElement | null;

    if (!details || !this._supportsPopover(submenu)) {
      return;
    }

    details.open = true;
    submenu.setAttribute('popover', 'auto');

    try {
      (submenu.showPopover as (options?: { source?: HTMLElement }) => void)({ source: source ?? undefined });
    } catch {
      submenu.removeAttribute('popover');
    }
  }

  private _usesInlinePresentation() {
    return getComputedStyle(this).getPropertyValue('--nte-nav-submenu-position').trim() === 'static';
  }

  private _submenuElement() {
    return this.shadowRoot?.getElementById('submenu') ?? null;
  }

  private _disclosureElement() {
    return this.shadowRoot?.querySelector<HTMLElement>('#toggle, #disclosure') ?? null;
  }

  private _supportsPopover(element: HTMLElement) {
    return typeof element.showPopover === 'function' && typeof element.hidePopover === 'function';
  }

  private _isPopoverOpen(element: HTMLElement) {
    try {
      return element.matches(':popover-open');
    } catch {
      return false;
    }
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
