import { html, LitElement, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import style from './nte-step-shadow.scss?inline';

/**
 * `nte-step` - A single step component for the nte-stepper
 *
 * @element nte-step
 *
 * @prop {string} status - The status of the step: 'inactive', 'active', or 'disabled'
 * @prop {boolean} hidden - Whether the step is hidden
 * @prop {number} index - Internal property for nte-stepper to identify the step
 * @prop {string} href - Optional URL or anchor link for navigation
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
   * Whether the step is hidden
   */
  @property({ type: Boolean, reflect: true })
  override hidden = false;

  /**
   * The status of the step
   */
  @property({ type: String, reflect: true })
  status: 'inactive' | 'active' | 'disabled' = 'inactive';

  /**
   * Internal property for nte-stepper to identify the step
   */
  @property({ type: Number })
  index = -1;

  /**
   * The mode of the parent stepper
   */
  @property({ type: String, reflect: true })
  mode: 'horizontal' | 'vertical' | 'circular' = 'horizontal';

  /**
   * Optional URL or anchor link for navigation
   */
  @property({ type: String, reflect: true })
  href?: string;

  /**
   * Track when animation should play
   */
  private shouldAnimateCheckmark = false;

  /**
   * Track if the step is completed (for rendering check icon)
   */
  @state()
  private isCompleted = false;

  /**
   * Track if slot content has been loaded
   */
  @state()
  private iconSlotHasContent = false;

  /**
   * Validates the href value
   * @param href The href value to validate
   * @returns true if valid, false otherwise
   */
  private validateHref(href: string): boolean {
    if (!href || href.trim() === '') {
      return false;
    }

    const trimmedHref = href.trim();

    // Check if it's an anchor link (starts with #)
    if (trimmedHref.startsWith('#')) {
      // Anchor must have at least one character after #
      return trimmedHref.length > 1;
    }

    // Check if it's a valid URL
    try {
      const url = new URL(trimmedHref);
      // Only allow http and https protocols for security
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }

  /**
   * Handles navigation based on href value
   * @param href The href value to navigate to
   */
  private handleNavigation(href: string): void {
    const trimmedHref = href.trim();

    if (trimmedHref.startsWith('#')) {
      // Handle anchor navigation
      const targetId = trimmedHref.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        // Smooth scroll to the target element
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }

      // Update the URL hash
      if (window.history && window.history.pushState) {
        window.history.pushState(null, '', trimmedHref);
      } else {
        window.location.hash = trimmedHref;
      }
    } else {
      // Handle URL navigation
      try {
        const url = new URL(trimmedHref);
        if (url.protocol === 'http:' || url.protocol === 'https:') {
          window.open(trimmedHref, '_blank', 'noopener,noreferrer');
        }
      } catch (error) {
        console.warn('Invalid URL for navigation:', trimmedHref, error);
      }
    }
  }

  /**
   * Updates the empty state of slots
   * This is particularly important for the icon slot when toggling between completed states
   */
  private _updateSlotEmptyState(): void {
    if (!this.shadowRoot) return;

    // Get the icon slot specifically
    const iconSlot = this.shadowRoot.querySelector('slot[name="icon"]') as HTMLSlotElement;
    if (iconSlot) {
      // Check if the slot has any assigned elements
      const hasAssignedElements =
        iconSlot.assignedNodes({ flatten: true }).filter((node) => node.nodeType === Node.ELEMENT_NODE).length > 0;

      // Update the is-empty class based on content
      if (hasAssignedElements) {
        iconSlot.classList.remove('is-empty');
        this.iconSlotHasContent = true;
      } else {
        iconSlot.classList.add('is-empty');
        this.iconSlotHasContent = false;
      }
    }

    // Update other slots as well
    this.shadowRoot.querySelectorAll('slot:not([name="icon"])').forEach((slotElement) => {
      const slot = slotElement as HTMLSlotElement;
      if (slot.assignedElements().length === 0) {
        slot.classList.add('is-empty');
      } else {
        slot.classList.remove('is-empty');
      }
    });
  }

  protected override firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);

    this._updateSlotEmptyState();

    // Add slot change listeners to update empty state when content changes
    if (this.shadowRoot) {
      const iconSlot = this.shadowRoot.querySelector('slot[name="icon"]') as HTMLSlotElement;
      if (iconSlot) {
        iconSlot.addEventListener('slotchange', () => {
          this._updateSlotEmptyState();
        });
      }
    }
  }
  /**
   * Apply backwards animation to the separator
   */
  public applyBackwardsAnimation(): void {
    if (this.shadowRoot) {
      const separator = this.shadowRoot.querySelector('.nte-step-separator') as HTMLElement;
      if (separator) {
        // Reset animation first to ensure it plays again
        separator.classList.remove('backwards');
        // Force a reflow
        void separator.offsetWidth;
        // Add backwards class to trigger animation
        separator.classList.add('backwards');
      }
    }
  }

  /**
   * Handle property changes and attribute changes
   */
  override updated(changedProperties: Map<string, unknown>): void {
    // Validate href when it changes
    if (changedProperties.has('href') && this.href) {
      if (!this.validateHref(this.href)) {
        console.warn(`Invalid href value "${this.href}". Expected format: "#anchor" or "https://example.com"`);
      }
    }

    // Update tabindex when href or status changes
    if (changedProperties.has('href') || changedProperties.has('status')) {
      this._updateTabIndex();
    }

    // Always update slot empty state on any update
    // This ensures the slot state is correct even when the DOM changes
    this._updateSlotEmptyState();

    // Check if the completed class has been added/removed
    if (this.classList.contains('completed') !== this.isCompleted) {
      // Update internal state to match class
      this.isCompleted = this.classList.contains('completed');

      // Handle completed state change
      this._handleCompletedStateChange();

      // If newly completed, trigger animation
      if (this.isCompleted && !this._wasCompletedBefore) {
        this._wasCompletedBefore = true;
        // Force reset the animation by removing the class briefly
        this.shouldAnimateCheckmark = false;

        // Use requestAnimationFrame to ensure the DOM has updated before re-adding the class
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            // Get the separator and remove backwards class if it exists
            if (this.shadowRoot) {
              const separator = this.shadowRoot.querySelector('.nte-step-separator');
              if (separator) {
                separator.classList.remove('backwards');
              }
            }

            this.shouldAnimateCheckmark = true;
            this.requestUpdate();

            // Reset the animation state after animation completes
            setTimeout(() => {
              this.shouldAnimateCheckmark = false;
              this.requestUpdate();

              // Update slot empty states again after animation completes
              this._updateSlotEmptyState();
            }, 1000);
          });
        });
      } else if (!this.isCompleted) {
        this._wasCompletedBefore = false;

        // Also update slot empty states when going from completed to not completed
        requestAnimationFrame(() => {
          this._updateSlotEmptyState();
        });
      }
    }
  }

  // Track if the element was completed before
  private _wasCompletedBefore = false;

  /**
   * Handle completed state changes
   * This ensures the icon slot's empty state is properly maintained
   */
  private _handleCompletedStateChange(): void {
    // Force update the slot empty state
    if (this.isCompleted) {
      // When completed, we don't need to check the icon slot content
      // as the checkmark will be shown instead
    } else {
      // When not completed, we need to check if the icon slot has content
      // and update the is-empty class accordingly
      this._updateSlotEmptyState();
    }

    // Request an update to ensure the UI reflects the current state
    this.requestUpdate();
  }

  /**
   * When connected to DOM, set up observers
   */
  override connectedCallback(): void {
    super.connectedCallback();

    // Initialize completed state
    this.isCompleted = this.classList.contains('completed');

    // Set up mutation observer to watch for class changes
    this._setupClassObserver();

    // Add click event listener to the host element
    this.addEventListener('click', this.handleClick);

    // Set appropriate tabindex for keyboard navigation when href is provided
    this._updateTabIndex();

    // Initialize slot empty states
    // We use requestAnimationFrame to ensure the DOM is fully initialized
    requestAnimationFrame(() => {
      this._updateSlotEmptyState();
      this._handleCompletedStateChange();
    });
  }

  /**
   * Update tabindex based on href and status
   */
  private _updateTabIndex(): void {
    if (this.status === 'disabled') {
      this.tabIndex = -1;
    } else if (this.href && this.validateHref(this.href)) {
      this.tabIndex = 0; // Make it focusable for keyboard navigation
    } else {
      this.tabIndex = 0; // Default clickable behavior
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();

    // Remove click event listener
    this.removeEventListener('click', this.handleClick);

    // Disconnect observer
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
  }

  // Mutation observer to watch for class changes
  private _observer: MutationObserver | null = null;

  /**
   * Set up observer to watch for class changes
   */
  private _setupClassObserver(): void {
    // Create observer if it doesn't exist
    if (!this._observer) {
      this._observer = new MutationObserver((mutations) => {
        // Check if the completed class was added/removed
        const classChanged = mutations.some(
          (mutation) => mutation.type === 'attributes' && mutation.attributeName === 'class',
        );

        if (classChanged) {
          const isNowCompleted = this.classList.contains('completed');
          if (isNowCompleted !== this.isCompleted) {
            this.isCompleted = isNowCompleted;

            // Handle completed state change
            this._handleCompletedStateChange();

            this.requestUpdate();
          }
        }
      });
    }

    // Start observing
    this._observer.observe(this, {
      attributes: true,
      attributeFilter: ['class'],
    });
  }

  private handleClick(event: Event): void {
    // Remove preventDefault() as it interferes with hover states
    // event.preventDefault();

    // If disabled status, don't do anything
    if (this.status === 'disabled') {
      return;
    }

    // Handle navigation if href is provided and valid
    if (this.href) {
      if (this.validateHref(this.href)) {
        this.handleNavigation(this.href);
      } else {
        console.warn('Invalid href value:', this.href);
      }
    }

    // Dispatch a custom event
    this.dispatchEvent(
      new CustomEvent('nte-step-click', {
        detail: {
          index: this.index,
          element: this,
          href: this.href,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  override render() {
    // Set appropriate role and accessibility attributes based on href
    const hasValidHref = this.href && this.validateHref(this.href);

    return html`
      <div class="nte-step-wrapper">
        <div class="nte-step-wrapper-content">
          <div
            class="nte-step-circle"
            part="step-circle"
            role="${hasValidHref ? 'link' : 'button'}"
            aria-label="${hasValidHref ? `Navigate to ${this.href}` : 'Step action'}"
          >
            <div class="nte-step-circle-progress" part="step-circle-progress"></div>
            ${this.isCompleted
              ? html`<svg
                  class="check-icon ${this.shouldAnimateCheckmark ? 'animate' : ''}"
                  viewBox="0 0 78.369 78.369"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M78.049,19.015L29.458,67.606c-0.428,0.428-1.121,0.428-1.548,0L0.32,40.015c-0.427-0.426-0.427-1.119,0-1.547l6.704-6.704
                c0.428-0.427,1.121-0.427,1.548,0l20.113,20.112l41.113-41.113c0.429-0.427,1.12-0.427,1.548,0l6.703,6.704
                C78.477,17.894,78.477,18.586,78.049,19.015z"
                  />
                </svg>`
              : html`
                  <!-- We use @slotchange to ensure the empty state is updated when content changes -->
                  <slot name="icon" @slotchange=${this._updateSlotEmptyState}></slot>
                  <!-- Only show default icon when not completed -->
                  <div class="nte-step-default-icon" ?hidden=${this.iconSlotHasContent}></div>
                `}
          </div>
          <div class="nte-step-info" part="step-info">
            <slot name="title"></slot>
            <slot name="info"></slot>
          </div>
          <div class="nte-step-action" part="step-action"></div>
          <div class="nte-step-separator ${this.mode}" part="step-separator">
            <div class="nte-step-separator-dashed-line"></div>
            <div class="nte-step-separator-solid-line"></div>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nte-step': nteStepElement;
  }
}
