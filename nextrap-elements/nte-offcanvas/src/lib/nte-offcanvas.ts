import { ka_sleep } from '@kasimirjs/core';
import { SlotTool, triggerGroupOpenCloseEvent } from '@nextrap/nt-framework';
import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import style from './nte-offcanvas.scss?inline';

@customElement(NteOffcanvas.is)
export class NteOffcanvas extends LitElement {
  static override styles = [unsafeCSS(style)];

  static get is() {
    return 'nte-offcanvas';
  }

  @property({ type: Boolean, reflect: true })
  public backdrop = true;

  @property({ type: Boolean, reflect: true })
  public opened = false;

  @property({ type: String, attribute: 'data-group-name' }) private dataGroupName = '';

  override connectedCallback() {
    super.connectedCallback();
    // Additional setup can be done here if needed
  }

  @state()
  protected closedClass = true;

  public open() {
    this.opened = true;
  }
  public close() {
    this.opened = false;
  }
  public toggle() {
    this.opened = !this.opened;
  }

  constructor() {
    super();
    this.addEventListener('click', (event) => {
      if (event === undefined || !event.target || !(event.target instanceof HTMLElement)) {
        return;
      }
      if ((event.target as HTMLElement).closest("[data-nt-dismiss='offcanvas']") !== null) {
        this.close();
      }
    });
  }

  override async updated(changedProperties: Map<string | number | symbol, unknown>): Promise<void> {
    // Animation logic - display first - then apply
    if (changedProperties.has('opened')) {
      if (this.dataGroupName !== '') {
        // If DataGroupName is set, we dispatch custom events to syncronize all states
        triggerGroupOpenCloseEvent(this.opened, this.dataGroupName);
      }

      if (this.opened) {
        this.style.display = 'block';
        await ka_sleep(1);
        SlotTool.observeEmptySlots(this); // Check for empty slots

        this.closedClass = false;
      } else {
        this.closedClass = true;
        // Wait for the transition to finish before setting display to none
        await ka_sleep(400);
        this.style.display = 'none';
      }
    }
  }

  override render() {
    return html`
      <div
        id="backdrop"
        part="backdrop"
        @click=${() => (this.opened = false)}
        class=${classMap({ closed: this.closedClass })}
      ></div>
      <div
        id="offcanvas"
        part="offcanvas"
        role="dialog"
        aria-modal="true"
        class=${classMap({ closed: this.closedClass })}
        ?backdrop="${this.backdrop}"
      >
        <div id="header">
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
