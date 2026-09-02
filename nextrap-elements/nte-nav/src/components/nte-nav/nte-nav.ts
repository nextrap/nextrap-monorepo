import { nextrap_element } from '@nextrap/nt-core';
import { html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import style from './nte-nav.scss?inline';

@customElement('nte-nav')
export class NteNav extends nextrap_element() {
  static override styles = [unsafeCSS(style)];

  /** Accessible name forwarded to the internal navigation landmark. */
  @property({ type: String, reflect: true, attribute: 'aria-label' })
  public override accessor ariaLabel = '';

  protected override render() {
    super.render();

    return html`
      <nav id="nav" part="nav" aria-label=${ifDefined(this.ariaLabel || undefined)}>
        <div id="list" part="list" role="list">
          <slot @slotchange=${this._onSlotChange}></slot>
        </div>
      </nav>
    `;
  }

  private _onSlotChange(event: Event): void {
    const slot = event.currentTarget as HTMLSlotElement;
    const items = slot.assignedElements({ flatten: true }).filter((element) => element.matches('nte-nav-item'));
    const isVertical = getComputedStyle(this).getPropertyValue('--nte-nav-flow').trim() === 'column';

    items.forEach((item) => {
      const hasSubmenu = Array.from(item.children).some((child) => child.matches('nte-nav-item'));
      item.toggleAttribute('submenu-popover', hasSubmenu && !isVertical);
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nte-nav': NteNav;
  }
}
