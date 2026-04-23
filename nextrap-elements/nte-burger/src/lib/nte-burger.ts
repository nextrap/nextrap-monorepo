import { EVENT_NAME_GROUP_OPEN_CLOSE, triggerGroupOpenCloseEvent } from '@nextrap/nt-framework';
import { unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import style from './hamburger.scss?inline';

import { nextrap_element } from '@nextrap/nte-core';
import { Listen } from '@trunkjs/browser-utils';
import { html } from 'lit/static-html.js';

@customElement('nte-burger')
export class NteBurger extends nextrap_element({
  eventBinding: true,
}) {
  static override styles = [unsafeCSS(style)];

  @property({ type: Boolean, attribute: 'open', reflect: true })
  accessor open = false;

  @property({ type: String, reflect: true })
  accessor text = 'Menu';

  /**
   * Listen to burger-open and burger-close events on main document
   */
  @property({ type: String, reflect: false, attribute: 'data-group-name' })
  accessor dataGroupName = '';

  constructor() {
    super();
  }

  override render() {
    return html` <button id="button" class="hamburger">
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
    </button>`;
  }

  @Listen(EVENT_NAME_GROUP_OPEN_CLOSE, { target: 'document' })
  protected listenEvents(event: Event) {
    if (!(event instanceof CustomEvent)) {
      return; // Ignore non-CustomEvents
    }
    if (event.detail.groupName !== this.dataGroupName) {
      return; // Ignore events from other groups
    }
    this.open = event.detail.open;
  }

  override update(changedProperties: Map<string | number | symbol, unknown>): void {
    super.update(changedProperties);

    // If DataGroupName is set, we dispatch custom events to syncronize all states
    if (changedProperties.has('open') && this.dataGroupName !== '') {
      triggerGroupOpenCloseEvent(this.open, this.dataGroupName);
    }
  }
}
