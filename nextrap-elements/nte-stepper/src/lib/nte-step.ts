import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import style from './nte-step-shadow.scss?inline';

/**
 * `nte-step` - A single step component for the nte-stepper
 *
 * @element nte-step
 *
 * @prop {boolean} active - Whether the step is active
 * @prop {boolean} completed - Whether the step is completed
 * @prop {boolean} disabled - Whether the step is disabled
 * @prop {boolean} hidden - Whether the step is hidden
 * @prop {number} index - Internal property for nte-stepper to identify the step
 *
 * @slot icon - Slot for the step icon (accepts i, img, svg elements)
 * @slot title - Slot for the step title (accepts h2, h3, h4 elements)
 *
 * @fires nte-step-click - Fired when the step is clicked (if not disabled)
 */
@customElement('nte-step')
export class nteStepElement extends LitElement {
  static override styles = [unsafeCSS(style)];

  /**
   * Whether the step is active
   */
  @property({ type: Boolean, reflect: true })
  active = false;

  /**
   * Whether the step is completed
   */
  @property({ type: Boolean, reflect: true })
  completed = false;

  /**
   * Whether the step is disabled
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * Whether the step is hidden
   */
  @property({ type: Boolean, reflect: true })
  override hidden = false;

  /**
   * Internal property for nte-stepper to identify the step
   */
  @property({ type: Number })
  index = -1;

  /**
   * Handle click events on the step
   */
  override connectedCallback(): void {
    super.connectedCallback();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
  }

  private handleClick(event: Event): void {
    event.preventDefault();

    // If disabled, don't do anything
    if (this.disabled) {
      return;
    }

    // Dispatch a custom event
    this.dispatchEvent(
      new CustomEvent('nte-step-click', {
        detail: {
          index: this.index,
          element: this,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  override render() {
    return html`
      <div class="nte-step-circle" part="step-circle" @click="${this.handleClick}">
        <div class="nte-step-circle-progress" part="step-circle-progress"></div>
        <slot name="icon"></slot>
      </div>
      <div class="nte-step-info" part="step-info" @click="${this.handleClick}">
        <slot name="title"></slot>
      </div>
      <div class="nte-step-action" part="step-action" @click="${this.handleClick}"></div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nte-step': nteStepElement;
  }
}
