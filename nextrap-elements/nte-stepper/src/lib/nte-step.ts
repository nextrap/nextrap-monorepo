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
   * Track when animation should play
   */
  private shouldAnimateCheckmark = false;

  /**
   * Handle property changes
   */
  override updated(changedProperties: Map<string, unknown>): void {
    // If the completed status has changed to true, trigger animation
    if (changedProperties.has('completed') && this.completed) {
      // Force reset the animation by removing the class briefly
      this.shouldAnimateCheckmark = false;

      // Use requestAnimationFrame to ensure the DOM has updated before re-adding the class
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.shouldAnimateCheckmark = true;
          this.requestUpdate();

          // Reset the animation state after animation completes
          setTimeout(() => {
            this.shouldAnimateCheckmark = false;
            this.requestUpdate();
          }, 1000);
        });
      });
    }
  }

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
        ${this.completed
          ? html`<svg
              class="check-icon ${this.shouldAnimateCheckmark ? 'animate' : ''}"
              viewBox="0 0 78.369 78.369"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M78.049,19.015L29.458,67.606c-0.428,0.428-1.121,0.428-1.548,0L0.32,40.015c-0.427-0.426-0.427-1.119,0-1.547l6.704-6.704
                c0.428-0.427,1.121-0.427,1.548,0l20.113,20.112l41.113-41.113c0.429-0.427,1.12-0.427,1.548,0l6.703,6.704
                C78.477,17.894,78.477,18.586,78.049,19.015z"
              />
            </svg>`
          : html`<slot name="icon"></slot>`}
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
