import {
  customElement,
  EVENT_NAME_GROUP_OPEN_CLOSE,
  eventListener,
  property,
  triggerGroupOpenCloseEvent,
  unsafeCSS,
} from '@nextrap/nt-framework';
import { LitElement } from 'lit';
import style from './hamburger.scss?inline';

import { html } from 'lit/static-html.js';

@customElement('nte-burger')
export class NteBurger extends LitElement {
  static override styles = [unsafeCSS(style)];

  @property({ type: Boolean, attribute: 'open', reflect: true }) open = false;

  @property({ type: String, reflect: true }) text = 'Menu';

  /**
   * Listen to burger-open and burger-close events on main document
   */
  @property({ type: String, reflect: false, attribute: 'data-group-name' }) dataGroupName = '';

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

  @eventListener(EVENT_NAME_GROUP_OPEN_CLOSE, document)
  protected listenEvents(event: CustomEvent) {
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
