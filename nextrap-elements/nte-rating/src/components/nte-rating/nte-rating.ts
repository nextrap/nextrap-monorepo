import { EventBindingsMixin, LoggingMixin } from '@trunkjs/browser-utils';
import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

// Styles for your component's shadow DOM
import style from './nte-rating.scss?inline';

export type RatingSize = 'sm' | 'md' | 'lg';

export interface StarState {
  index: number;
  isFilled: boolean;
  isHalf: boolean;
  isEmpty: boolean;
}

@customElement('nte-rating')
export class NteRatingElement extends EventBindingsMixin(LoggingMixin(LitElement)) {
  static override styles = [unsafeCSS(style)];

  // Rating value (v-model equivalent)
  @property({ type: Number, reflect: true })
  public accessor value = 0;

  // Maximum number of stars
  @property({ type: Number })
  public accessor max = 5;

  // Minimum rating value
  @property({ type: Number })
  public accessor min = 0;

  // Size of the stars
  @property({ type: String })
  public accessor size: RatingSize = 'md';

  // Whether the rating is interactive
  @property({ type: Boolean })
  public accessor interactive = true;

  // Disabled state
  @property({ type: Boolean, reflect: true })
  public accessor disabled = false;

  // Read-only state
  @property({ type: Boolean })
  public accessor readonly = false;

  // Show half stars
  @property({ type: Boolean, attribute: 'allow-half' })
  public accessor allowHalf = false;

  // Show rating value as text
  @property({ type: Boolean, attribute: 'show-value' })
  public accessor showValue = false;

  // Show rating count/reviews
  @property({ type: Boolean, attribute: 'show-count' })
  public accessor showCount = false;

  // Number of reviews/ratings
  @property({ type: Number })
  public accessor count = 0;

  // Required field validation
  @property({ type: Boolean })
  public accessor required = false;

  // Helper text
  @property({ type: String })
  public accessor hint = '';

  // Label for the rating
  @property({ type: String })
  public accessor label = '';

  // ARIA label
  @property({ type: String, attribute: 'aria-label' })
  public accessor ariaLabel = '';

  // Internal state
  @state()
  private accessor _hoverValue = 0;

  @state()
  private accessor _isHovering = false;

  // Computed properties
  private get _displayValue(): number {
    if (this._isHovering && this.interactive && !this.disabled && !this.readonly) {
      return this._hoverValue;
    }
    return this.value || 0;
  }

  private get _stars(): StarState[] {
    const starArray: StarState[] = [];
    for (let i = 1; i <= this.max; i++) {
      const isFilled = i <= this._displayValue;
      const isHalf = this.allowHalf && i - 0.5 === this._displayValue;

      starArray.push({
        index: i,
        isFilled,
        isHalf,
        isEmpty: !isFilled && !isHalf,
      });
    }
    return starArray;
  }

  private get _ratingText(): string {
    if (this.showValue && this.showCount) {
      return `${this._displayValue}/${this.max} (${this.count} reviews)`;
    } else if (this.showValue) {
      return `${this._displayValue}/${this.max}`;
    } else if (this.showCount) {
      return `(${this.count} reviews)`;
    }
    return '';
  }

  private get _ratingClasses() {
    return {
      rating: true,
      [`rating--${this.size}`]: true,
      'rating--interactive': this.interactive && !this.disabled && !this.readonly,
      'rating--disabled': this.disabled,
      'rating--readonly': this.readonly,
    };
  }

  // Event handlers
  private _handleStarClick(starIndex: number) {
    if (this.disabled || this.readonly || !this.interactive) return;

    let newValue = starIndex;

    // Handle half stars
    if (this.allowHalf && this.value === starIndex) {
      newValue = starIndex - 0.5;
    } else if (this.allowHalf && this.value === starIndex - 0.5) {
      newValue = 0;
    } else if (this.value === starIndex) {
      newValue = 0;
    }

    this.value = newValue;

    // Dispatch change event
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { value: newValue },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _handleStarHover(starIndex: number) {
    if (this.disabled || this.readonly || !this.interactive) return;

    this._hoverValue = starIndex;
    this._isHovering = true;

    // Dispatch hover event
    this.dispatchEvent(
      new CustomEvent('hover', {
        detail: { value: starIndex },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _handleMouseLeave() {
    if (this.disabled || this.readonly || !this.interactive) return;

    this._isHovering = false;
    this._hoverValue = 0;
  }

  private _handleKeyDown(event: KeyboardEvent, starIndex: number) {
    if (this.disabled || this.readonly || !this.interactive) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this._handleStarClick(starIndex);
    }
  }

  private _getStarFillRatio(star: StarState): number {
    if (star.isFilled) return 100;
    if (star.isHalf) return 50;
    return 0;
  }

  override render() {
    const effectiveAriaLabel = this.ariaLabel || `Rating: ${this._displayValue} out of ${this.max} stars`;

    return html`
      <div class=${classMap(this._ratingClasses)}>
        <!-- Label -->
        ${this.label
          ? html`
              <label class="rating__label">
                ${this.label}
                ${this.required ? html`<span class="rating__required" aria-label="required">*</span>` : ''}
              </label>
            `
          : ''}

        <!-- Rating Stars Container -->
        <div
          class="rating__stars"
          role=${this.interactive ? 'radiogroup' : 'img'}
          aria-label=${effectiveAriaLabel}
          ?aria-required=${this.required}
          @mouseleave=${this._handleMouseLeave}
        >
          ${this._stars.map(
            (star) => html`
              <button
                type="button"
                class="rating__star ${star.isFilled ? 'rating__star--filled' : ''} ${star.isHalf
                  ? 'rating__star--half'
                  : ''} ${star.isEmpty ? 'rating__star--empty' : ''}"
                ?disabled=${this.disabled || this.readonly || !this.interactive}
                tabindex=${this.interactive && !this.disabled && !this.readonly ? 0 : -1}
                aria-label="${star.index} star${star.index !== 1 ? 's' : ''}"
                @click=${() => this._handleStarClick(star.index)}
                @mouseenter=${() => this._handleStarHover(star.index)}
                @keydown=${(event: KeyboardEvent) => this._handleKeyDown(event, star.index)}
              >
                <span class="rating__star-icon" style="--fill-ratio: ${this._getStarFillRatio(star)}%">★</span>
              </button>
            `,
          )}
        </div>

        <!-- Rating Text -->
        ${this._ratingText ? html` <div class="rating__text">${this._ratingText}</div> ` : ''}

        <!-- Helper Text -->
        ${this.hint ? html` <div class="rating__hint">${this.hint}</div> ` : ''}
      </div>
    `;
  }
}
