import { nextrap_element } from '@nextrap/nt-core';
import { html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import style from './nte-nav-2.scss?inline';

@customElement('nte-nav-2')
export class NteNav2 extends nextrap_element() {
  static override styles = [unsafeCSS(style)];

  /** Accessible name forwarded to the internal navigation landmark. */
  @property({ type: String, reflect: true, attribute: 'aria-label' })
  public override accessor ariaLabel = '';

  protected override render() {
    return html`
      <nav id="nav" part="nav" aria-label=${ifDefined(this.ariaLabel || undefined)}>
        <div id="list" part="list" role="list">
          <slot></slot>
        </div>
      </nav>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nte-nav-2': NteNav2;
  }
}
