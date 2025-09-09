import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import style from './nte-progress-shadow.scss?inline';

/**
 * `nte-progress` - A reusable and flexible progress bar web component
 *
 * @element nte-progress
 *
 * @prop {number} value - Current progress value
 * @prop {number} min - Minimum value of the progress bar
 * @prop {number} max - Maximum value of the progress bar
 * @prop {number} steps - Optional number of discrete steps
 * @prop {boolean} striped - Whether the progress bar has striped pattern
 * @prop {boolean} animated - Whether the striped pattern is animated
 * @prop {string} type - Type of progress indicator ('bar' or 'circle')
 *
 * @fires progress-changed - Fired when the progress value changes
 * @fires step-changed - Fired when a step changes (only when steps > 0)
 * @fires completed - Fired when the progress reaches its maximum value
 */
@customElement('nte-progress')
export class nteProgressElement extends LitElement {
  static override styles = [unsafeCSS(style)];

  private static readonly DEFAULT_MIN = 0;
  private static readonly DEFAULT_MAX = 100;
  private static readonly DEFAULT_VALUE = 0;

  /**
   * The type of progress indicator to display
   */
  @property({ type: String, reflect: true })
  type: 'bar' | 'circle' = 'bar';

  /**
   * The current progress value
   */
  @property({ type: Number })
  get value(): number {
    return this._value;
  }
  set value(newValue: number) {
    const oldValue = this._value;

    // Validate and constrain the value
    this._value = this.validateValue(newValue);

    // Only trigger updates if the value has actually changed
    if (this._value !== oldValue) {
      this.requestUpdate('value', oldValue);

      // Dispatch the progress-changed event
      this.dispatchEvent(
        new CustomEvent('progress-changed', {
          detail: { value: this._value },
          bubbles: true,
          composed: true,
        }),
      );

      // Check if we need to dispatch a step-changed event
      if (this.steps > 0) {
        const newStepIndex = this.calculateStepIndex(this._value);
        const oldStepIndex = this.calculateStepIndex(oldValue);

        if (newStepIndex !== oldStepIndex) {
          this.dispatchEvent(
            new CustomEvent('step-changed', {
              detail: { stepIndex: newStepIndex },
              bubbles: true,
              composed: true,
            }),
          );
        }
      }

      // Check if the progress is now complete
      if (this._value === this.max && oldValue !== this.max) {
        this.dispatchEvent(
          new CustomEvent('completed', {
            detail: { value: this._value },
            bubbles: true,
            composed: true,
          }),
        );
      }
    }
  }

  /**
   * The minimum value of the progress bar
   */
  @property({ type: Number })
  get min(): number {
    return this._min;
  }
  set min(value: number) {
    const oldMin = this._min;
    this._min = value;

    // Ensure max is always >= min
    if (this._max < this._min) {
      this._max = this._min;
    }

    // Re-validate current value with new range
    this.value = this._value;

    this.requestUpdate('min', oldMin);
  }

  /**
   * The maximum value of the progress bar
   */
  @property({ type: Number })
  get max(): number {
    return this._max;
  }
  set max(value: number) {
    const oldMax = this._max;
    this._max = value > this._min ? value : this._min;

    // Re-validate current value with new range
    this.value = this._value;

    this.requestUpdate('max', oldMax);
  }

  /**
   * The number of discrete steps (if > 0)
   */
  @property({ type: Number })
  steps = 0;

  /**
   * Whether the progress bar should have a striped pattern
   */
  @property({ type: Boolean })
  striped = false;

  /**
   * Whether the striped pattern should be animated
   */
  @property({ type: Boolean })
  animated = false;

  // Internal state properties
  @state()
  private _value: number = nteProgressElement.DEFAULT_VALUE;

  @state()
  private _min: number = nteProgressElement.DEFAULT_MIN;

  @state()
  private _max: number = nteProgressElement.DEFAULT_MAX;

  constructor() {
    super();
    // Initialize with default values
    this._value = nteProgressElement.DEFAULT_VALUE;
    this._min = nteProgressElement.DEFAULT_MIN;
    this._max = nteProgressElement.DEFAULT_MAX;
  }

  /**
   * Calculates the percentage of progress completion
   */
  private calculatePercentage(): number {
    const range = this._max - this._min;
    if (range <= 0) {
      return 100; // If min and max are equal, we're at 100%
    }

    const valueRelativeToMin = this._value - this._min;
    return Math.min(100, Math.max(0, (valueRelativeToMin / range) * 100));
  }

  /**
   * Validates and constrains a progress value
   */
  private validateValue(value: number): number {
    // Constrain between min and max
    let validValue = Math.min(this._max, Math.max(this._min, value));

    // If steps are defined, round to the nearest step
    if (this.steps > 0) {
      const stepSize = (this._max - this._min) / this.steps;
      const stepIndex = Math.round((validValue - this._min) / stepSize);
      validValue = this._min + stepIndex * stepSize;
    }

    return validValue;
  }

  /**
   * Calculates the current step index based on the value
   */
  private calculateStepIndex(value: number): number {
    if (this.steps <= 0) return 0;

    const constrainedValue = Math.min(this._max, Math.max(this._min, value));
    const stepSize = (this._max - this._min) / this.steps;
    return Math.round((constrainedValue - this._min) / stepSize);
  }

  /**
   * Generates CSS classes for the progress bar based on props
   */
  private getProgressBarClasses(): string {
    const classes = ['nte-progress-bar'];

    if (this.striped) {
      classes.push('nte-progress-bar--striped');
    }

    if (this.striped && this.animated) {
      classes.push('nte-progress-bar--animated');
    }

    return classes.join(' ');
  }

  /**
   * Generates CSS classes for the progress container, including any external classes
   * This allows custom classes to be added from outside
   */
  private getContainerClasses(): string {
    // Start with the base class
    const classes = ['nte-progress'];

    if (this.type === 'circle') {
      classes.push('nte-progress-circle');
    }

    // Add any classes from the host element
    const classAttr = this.getAttribute('class');
    if (classAttr) {
      const hostClasses = classAttr.split(' ').filter((c) => c.length > 0);
      classes.push(...hostClasses);
    }

    return classes.join(' ');
  }

  override render() {
    const stepPercentage = this.steps > 0 ? 100 / this.steps : 0;
    const percentage = this.calculatePercentage();

    if (this.type === 'circle') {
      const radius = 45; // Radius based on a 100x100 viewBox
      const circumference = 2 * Math.PI * radius;
      const dash = (percentage / 100) * circumference;

      return html`
        <div
          class="${this.getContainerClasses()}"
          part="container"
          style="--circumference: ${circumference}; --dash: ${dash};"
        >
          <svg class="nte-progress-circle-svg" viewBox="0 0 100 100" part="svg">
            <circle class="nte-progress-circle-bg" cx="50" cy="50" r="${radius}" part="circle-background"></circle>
            <circle class="nte-progress-circle-fg" cx="50" cy="50" r="${radius}" part="circle-foreground"></circle>
          </svg>
          <div class="nte-progress-circle-content" part="content">
            <slot></slot>
          </div>
        </div>
      `;
    }

    // For standard progress bar
    return html`
      <progress
        class="${this.getContainerClasses()} ${this.getProgressBarClasses()}"
        part="progress"
        value="${this._value}"
        min="${this._min}"
        max="${this._max}"
      >
        ${this.steps > 0
          ? html`
              <div class="nte-progress-steps" part="progress-steps">
                ${Array(this.steps + 1)
                  .fill(0)
                  .map(
                    (_, i) => html`
                      <div
                        class="nte-progress-step${this.calculateStepIndex(this._value) >= i
                          ? ' nte-progress-step--completed'
                          : ''}"
                        part="progress-step"
                        style="left: ${i * stepPercentage}%"
                      ></div>
                    `,
                  )}
              </div>
            `
          : ''}
        <slot></slot>
      </progress>
    `;
  }

  override updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);

    if (this.type === 'circle') {
      this.updateStrokeWidth();
    }
  }

  private updateStrokeWidth() {
    const svg = this.shadowRoot?.querySelector('.nte-progress-circle-svg') as SVGElement;
    if (!svg) return;

    // Get the actual rendered size of the SVG
    const rect = svg.getBoundingClientRect();
    const actualSize = Math.min(rect.width, rect.height);

    // Default size from CSS variable (100px)
    const defaultSize = 100;

    // Calculate scaling factor
    const scaleFactor = actualSize / defaultSize;

    // Adjust stroke width to maintain constant visual thickness
    const baseStrokeWidth = 8; // Default stroke width in pixels
    const adjustedStrokeWidth = baseStrokeWidth / scaleFactor;

    // Apply the adjusted stroke width to both circles
    const circles = svg.querySelectorAll('circle');
    circles.forEach((circle) => {
      circle.style.strokeWidth = `${adjustedStrokeWidth}px`;
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nte-progress': nteProgressElement;
  }
}
