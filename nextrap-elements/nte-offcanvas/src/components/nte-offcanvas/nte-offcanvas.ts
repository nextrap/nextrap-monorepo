import { triggerGroupOpenCloseEvent } from '@nextrap/nt-framework';
import { nextrap_element } from '@nextrap/nt-core';
import '@nextrap/style-base';
import { resetStyle } from '@nextrap/style-reset';
import { Listen, sleep } from '@trunkjs/browser-utils';
import { html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import style from './nte-offcanvas.scss?inline';

@customElement('nte-offcanvas')
export class NteOffcanvas extends nextrap_element({
  eventBinding: true,
  slotVisibility: true,
}) {
  static override styles = [unsafeCSS(style), unsafeCSS(resetStyle)];

  static get is() {
    return 'nte-offcanvas';
  }

  @property({ type: Boolean, reflect: true })
  public accessor backdrop = true;

  @property({ type: Boolean, reflect: true })
  public accessor opened = false;

  @property({ type: String, attribute: 'data-group-name' })
  private accessor dataGroupName = '';

  @state()
  protected accessor closedClass = true;

  public open() {
    this.opened = true;
  }

  public close() {
    this.opened = false;
  }

  public toggle() {
    this.opened = !this.opened;
  }

  @Listen('click', { target: 'host' })
  protected onHostClick(event: Event) {
    if (!(event.target instanceof HTMLElement)) {
      return;
    }

    if (event.target.closest("[data-nt-dismiss='offcanvas']") !== null) {
      this.close();
    }
  }

  override async updated(changedProperties: Map<string | number | symbol, unknown>): Promise<void> {
    super.updated(changedProperties);

    if (!changedProperties.has('opened')) {
      return;
    }

    if (this.dataGroupName !== '') {
      triggerGroupOpenCloseEvent(this.opened, this.dataGroupName);
    }

    if (this.opened) {
      this.style.display = 'block';
      await sleep(1);
      this.closedClass = false;
      return;
    }

    this.closedClass = true;
    await sleep(400);
    this.style.display = 'none';
  }

  override render() {
    return html`
      <div
        id="backdrop"
        part="backdrop"
        ?hidden=${!this.backdrop}
        @click=${() => (this.opened = false)}
        class=${classMap({ closed: this.closedClass })}
      ></div>
      <div
        id="offcanvas"
        part="offcanvas"
        role="dialog"
        aria-modal="true"
        class=${classMap({ closed: this.closedClass })}
      >
        <div id="header" part="header">
          <slot name="header"></slot>
        </div>

        <div id="main" part="main">
          <slot></slot>
        </div>

        <div id="footer" part="footer">
          <slot name="footer"></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nte-offcanvas': NteOffcanvas;
  }
}
