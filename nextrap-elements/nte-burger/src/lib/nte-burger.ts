import { nextrap_element } from '@nextrap/nt-core';
import { EVENT_NAME_GROUP_OPEN_CLOSE, triggerGroupOpenCloseEvent } from '@nextrap/nt-framework';
import { html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import style from './hamburger.scss?inline';

import { Listen } from '@trunkjs/browser-utils';

@customElement('nte-burger')
export class NteBurger extends nextrap_element({
  eventBinding: true,
}) {
  static override styles = [unsafeCSS(style)];

  @property({ type: Boolean, attribute: 'open', reflect: true })
  accessor open = false;

  // Keeps the burger visually closed while allowing its click event to control an external disclosure.
  @property({ type: Boolean, attribute: 'static-state', reflect: true })
  accessor staticState = false;

  @property({ type: String, reflect: true })
  accessor text = 'Menu';

  @property({ type: String, attribute: 'aria-label' })
  accessor accessibleLabel = '';

  @property({ type: String, attribute: 'aria-controls' })
  accessor controls = '';

  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  /**
   * Listen to burger-open and burger-close events on main document
   */
  @property({ type: String, reflect: false, attribute: 'data-group-name' })
  accessor dataGroupName = '';

  override render() {
    return html`
      <button
        id="button"
        class="hamburger"
        part="button"
        type="button"
        aria-label=${this.accessibleLabel || this.text || 'Menu'}
        aria-expanded=${this.open ? 'true' : 'false'}
        aria-controls=${ifDefined(this.controls || undefined)}
        ?disabled=${this.disabled}
        @click=${this.toggle}
      >
        <span class="bar" part="bar bar-top"></span>
        <span class="bar" part="bar bar-middle"></span>
        <span class="bar" part="bar bar-bottom"></span>
      </button>
    `;
  }

  toggle(): void {
    if (!this.disabled && !this.staticState) this.open = !this.open;
  }

  @Listen(EVENT_NAME_GROUP_OPEN_CLOSE, { target: 'document' })
  protected listenEvents(event: Event) {
    if (!(event instanceof CustomEvent)) {
      return;
    }
    if (event.detail.groupName !== this.dataGroupName) {
      return;
    }
    this.open = event.detail.open;
  }

  override update(changedProperties: Map<string | number | symbol, unknown>): void {
    super.update(changedProperties);
    if (changedProperties.has('open') && this.dataGroupName !== '') {
      triggerGroupOpenCloseEvent(this.open, this.dataGroupName);
    }
  }
}
