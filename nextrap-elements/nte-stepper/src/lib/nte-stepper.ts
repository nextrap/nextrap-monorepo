import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import style from './nte-stepper-shadow.scss?inline';
// Import the progress component
import '@nextrap/nte-progress';
// Import the step component
import './nte-step';

export interface IStepperConfig {
  // Custom CSS classes to apply to the element
  classes?: string[];

  // The mode of the stepper
  mode?: 'horizontal' | 'vertical' | 'circular';

  // Whether the stepper is in linear mode (restricts navigation) - false for non-linear mode (free navigation)
  linear?: boolean;
}

@customElement('nte-stepper')
export class nteStepperElement extends LitElement {
  static override styles = [unsafeCSS(style)];

  // Default configuration for the stepper component
  private static readonly DEFAULT_CONFIG: Partial<IStepperConfig> = {
    mode: 'horizontal',
    linear: false,
  };

  // Declare reactive properties
  @property({ type: Object })
  config: IStepperConfig = { ...nteStepperElement.DEFAULT_CONFIG };

  // Direct access to mode property
  @property({ type: String })
  get mode(): 'horizontal' | 'vertical' | 'circular' {
    return this.config.mode || 'horizontal';
  }
  set mode(value: 'horizontal' | 'vertical' | 'circular') {
    this.config = { ...this.config, mode: value };

    // Update mode on all steps
    if (this.stepElements) {
      this.stepElements.forEach((step) => {
        step.setAttribute('mode', value);
      });
    }

    this.requestUpdate('mode');
  }

  // Direct access to linear property
  @property({ type: Boolean })
  get linear(): boolean {
    return this.config.linear || false;
  }
  set linear(value: boolean) {
    this.config = { ...this.config, linear: value };
    this.requestUpdate('linear');
    // Update step statuses when linear mode changes
    this.updateStepsState();
  }

  // Track active step index
  @state()
  private activeIndex = 0;

  // Track if overlay menu is open
  @state()
  private isMenuOpen = false;

  // Reference to the default slot element
  private slotElement: HTMLSlotElement | null = null;

  // Track if slot content exists
  @state()
  private hasSlottedContent = false;

  // Store references to slotted nte-step elements
  @state()
  private stepElements: HTMLElement[] = [];

  // MutationObserver to watch for class changes on the stepper element
  private classObserver: MutationObserver | null = null;

  /**
   * Creates a new NtStepperElement
   * @param config Optional configuration for the element
   */

  public constructor(config?: IStepperConfig) {
    super();
    if (config) {
      this.config = { ...nteStepperElement.DEFAULT_CONFIG, ...config };
    }
  }

  /**
   * When the component is first connected to the DOM
   */
  override connectedCallback() {
    super.connectedCallback();

    // Listen for step click events
    this.addEventListener('nte-step-click', this.handleStepClick as EventListener);

    // Set up MutationObserver to watch for class changes on the stepper element
    this.classObserver = new MutationObserver((mutationsList, observer) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          this.applyAllowedClassesToSteps();
        }
      }
    });
    this.classObserver.observe(this, { attributes: true });
  }

  /**
   * When the component is removed from the DOM
   */
  override disconnectedCallback() {
    super.disconnectedCallback();

    // Remove event listeners
    this.removeEventListener('nte-step-click', this.handleStepClick as EventListener);

    if (this.slotElement) {
      this.slotElement.removeEventListener('slotchange', this.handleSlotChange);
    }

    // Disconnect MutationObserver
    if (this.classObserver) {
      this.classObserver.disconnect();
      this.classObserver = null;
    }
  }

  /**
   * After first render, set up slot change listener
   */
  override firstUpdated() {
    // Get slot element
    this.slotElement = this.shadowRoot?.querySelector('slot') || null;

    if (this.slotElement) {
      // Listen for slotchange event
      this.slotElement.addEventListener('slotchange', this.handleSlotChange.bind(this));
      // Initialize slotted elements
      this.handleSlotChange();
    }

    // Configure separators after initial render is complete
    this.updateComplete.then(() => {
      this.addSeparatorsBetweenSteps();
    });
  }

  /**
   * When the component's properties are updated
   */
  override updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties);

    // Update active class when activeIndex changes
    if (changedProperties.has('activeIndex')) {
      setTimeout(() => this.updateStepsState(), 400);
    }

    // Check if mode has changed
    if (changedProperties.has('mode')) {
      // Update mode attribute on all steps
      this.stepElements.forEach((step) => {
        step.setAttribute('mode', this.mode);
      });
      // Re-create separators when mode changes
      this.addSeparatorsBetweenSteps();
    }

    // Check if linear mode has changed
    if (changedProperties.has('linear')) {
      // Update step statuses when linear mode changes
      this.updateStepsState();
    }
  }

  /**
   * Handle slot change event
   */
  private handleSlotChange() {
    if (!this.slotElement) return;

    // Get all slotted elements
    const assignedElements = this.slotElement.assignedElements();

    // Filter for only nte-step elements
    this.stepElements = assignedElements.filter((el) => el.tagName.toLowerCase() === 'nte-step') as HTMLElement[];

    // Set has slotted content flag
    this.hasSlottedContent = this.stepElements.length > 0;

    // Update step indices and initialize states
    this.stepElements.forEach((step, index) => {
      // Set the index property on each step for identification
      step.setAttribute('index', index.toString());
      step.setAttribute('mode', this.mode);
    });

    // Apply allowed CSS classes from stepper to step elements
    this.applyAllowedClassesToSteps();

    // Initialize active state based on current activeIndex
    this.updateStepsState();

    // Add separators between steps if in vertical mode
    this.addSeparatorsBetweenSteps();
    // Force re-render
    this.requestUpdate();
  }

  /**
   * Apply allowed CSS classes from the stepper element to the step elements
   */
  private applyAllowedClassesToSteps(): void {
    // List of allowed classes that can be transferred from stepper to steps
    const allowedClasses = ['style-route'];

    // Get the current classes from the stepper element
    const stepperClasses = Array.from(this.classList);

    // Find which allowed classes are present on the stepper
    const classesToApply = allowedClasses.filter((className) => stepperClasses.includes(className));

    // Apply these classes to all step elements
    this.stepElements.forEach((step) => {
      // First remove any previously applied allowed classes
      allowedClasses.forEach((className) => {
        step.classList.remove(className);
      });

      // Then add the classes that should be applied
      classesToApply.forEach((className) => {
        step.classList.add(className);
      });
    });
  }

  /**
   * Update the state of all step elements based on activeIndex
   */
  private updateStepsState() {
    // First pass: update status states
    this.stepElements.forEach((step, index) => {
      // Set status based on linear mode and position relative to activeIndex
      if (index === this.activeIndex) {
        step.setAttribute('status', 'active');
      } else if (index < this.activeIndex) {
        // Steps before active are always inactive (accessible)
        step.setAttribute('status', 'inactive');
      } else {
        // Steps after active: disabled in linear mode, inactive in non-linear mode
        if (this.linear) {
          step.setAttribute('status', 'disabled');
        } else {
          step.setAttribute('status', 'inactive');
        }
      }
    });

    // Add completed class to steps before active index and update separators
    this.stepElements.forEach((step, index) => {
      if (index < this.activeIndex) {
        // Add completed class if not already present
        if (!step.classList.contains('completed')) {
          step.classList.add('completed');
        }

        // Ensure the separator solid line is filled for completed steps
        if (step.shadowRoot) {
          const separator = step.shadowRoot.querySelector('.nte-step-separator') as HTMLElement;
          if (separator) {
            // Only add the filled class if it doesn't have the backwards class
            // and doesn't already have the filled class
            if (!separator.classList.contains('backwards') && !separator.classList.contains('filled')) {
              // Remove any existing animations first
              separator.classList.remove('backwards');
              // Force a reflow to ensure animations play correctly
              void separator.offsetWidth;
              // Add filled class to trigger forward animation
              separator.classList.add('filled');
            }
          }
        }
      } else {
        // For steps at or after the active index, remove the completed class
        step.classList.remove('completed');

        // Remove the filled class from the separator
        if (step.shadowRoot) {
          const separator = step.shadowRoot.querySelector('.nte-step-separator') as HTMLElement;
          if (separator) {
            separator.classList.remove('filled');
            // Only remove backwards class if it's not actively animating backwards
            if (!separator.classList.contains('backwards')) {
              separator.classList.remove('backwards');
            }
          }
        }
      }
    });

    // Update all separator classes to ensure proper state
    this.updateSeparatorClasses();
  }

  /**
   * Update the classes of separator elements based on step states
   */
  private updateSeparatorClasses(): void {
    // No need to update separators if there are no steps
    if (this.stepElements.length === 0) return;

    // Each step (except the last) has its own separator
    for (let i = 0; i < this.stepElements.length - 1; i++) {
      const step = this.stepElements[i];
      if (step && step.shadowRoot) {
        const separator = step.shadowRoot.querySelector('.nte-step-separator') as HTMLElement;
        if (separator) {
          // If the step is completed, ensure the separator is filled
          if (step.classList.contains('completed')) {
            separator.classList.add('filled');
            separator.classList.remove('backwards');
          } else {
            // If the step is not completed, ensure the separator is not filled
            separator.classList.remove('filled');
            // Only remove backwards if it's not actively animating
            if (!separator.classList.contains('backwards')) {
              separator.classList.remove('backwards');
            }
          }
        }
      }
    }
  }

  /**
   * Handles when a slotted nte-step is clicked
   * @param event Custom event from nte-step with step index
   */
  private handleStepClick(event: CustomEvent) {
    const step = event.target as HTMLElement;
    const index = parseInt(step.getAttribute('index') || '0', 10);
    const status = step.getAttribute('status') as 'inactive' | 'active' | 'disabled';

    // Only allow clicking if the step is not disabled
    if (step && status !== 'disabled') {
      // In linear mode, only allow navigation to completed steps or adjacent steps
      if (this.linear) {
        // Allow navigation to completed steps (index < activeIndex) or the next step (index = activeIndex + 1)
        if (index <= this.activeIndex || index === this.activeIndex + 1) {
          this.setActiveStep(index);
        } else {
          // Don't allow navigation to future steps in linear mode
          return;
        }
      } else {
        // In non-linear mode, allow navigation to any non-disabled step
        this.setActiveStep(index);
      }

      // Dispatch a custom event for external listeners
      this.dispatchEvent(
        new CustomEvent('nte-stepper-change', {
          detail: {
            index,
            step,
          },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  /**
   * Sets the active step by index
   * @param index Index of the step to set active
   */
  private setActiveStep(index: number) {
    if (index >= 0 && index < this.stepElements.length) {
      // Store the previous index to determine direction of navigation
      const previousIndex = this.activeIndex;
      const isGoingBackward = index < previousIndex;
      const isSkippingSteps = Math.abs(index - previousIndex) > 1;

      // If navigating backwards, apply backwards classes BEFORE updating step states
      if (isGoingBackward) {
        // Mark steps for backwards animation
        this.markBackwardSeparators(index, previousIndex);
      }
      // If skipping forward multiple steps, make sure intermediate steps are marked as completed
      else if (isSkippingSteps && index > previousIndex) {
        // Mark all steps between previous and new index as completed
        for (let i = previousIndex + 1; i < index; i++) {
          const step = this.stepElements[i];
          if (step) {
            // Add completed class to intermediate steps
            step.classList.add('completed');

            // Ensure separator is filled
            if (step.shadowRoot) {
              const separator = step.shadowRoot.querySelector('.nte-step-separator') as HTMLElement;
              if (separator) {
                separator.classList.add('filled');
                separator.classList.remove('backwards');
              }
            }

            // Force a reflow to ensure the DOM updates
            void step.offsetWidth;
          }
        }
      }

      // Set the new active index
      this.activeIndex = index;

      // Update the steps states (this also updates separator classes)
      this.updateStepsState();

      // Force an update on all steps to ensure they render correctly
      this.stepElements.forEach((step) => {
        // Trigger a class change to ensure the step updates
        if (step.classList.contains('completed')) {
          // Toggle class to force update
          step.classList.remove('completed');
          // Force a reflow
          void step.offsetWidth;
          // Add class back
          step.classList.add('completed');
        }
      });
    }
  }

  /**
   * Mark separators with backwards class for reverse animation
   * @param newIndex The new (lower) index user is navigating to
   * @param previousIndex The previous (higher) index user is navigating from
   */
  private markBackwardSeparators(newIndex: number, previousIndex: number): void {
    // Only process with steps that have separators
    if (this.stepElements.length === 0) return;

    // For each step between newIndex and previousIndex, add the backwards class to its separator
    for (let i = newIndex; i < previousIndex; i++) {
      const step = this.stepElements[i] as any; // Cast to any to access the applyBackwardsAnimation method
      if (step) {
        // Remove completed class when going backwards
        step.classList.remove('completed');

        // Use the step's applyBackwardsAnimation method if available
        if (typeof step.applyBackwardsAnimation === 'function') {
          step.applyBackwardsAnimation();
        } else {
          // Fallback if the method is not available
          if (step.shadowRoot) {
            const separator = step.shadowRoot.querySelector('.nte-step-separator') as HTMLElement;
            if (separator) {
              // Make sure the separator has the filled class first
              // so the backwards animation has something to animate from
              if (!separator.classList.contains('filled')) {
                separator.classList.add('filled');
                // Force a reflow
                void separator.offsetWidth;
              }

              // Remove filled class and add backwards class to trigger animation
              separator.classList.remove('filled');
              // Force a reflow to ensure animations play correctly
              void separator.offsetWidth;
              // Add backwards class to trigger animation
              separator.classList.add('backwards');
            }
          }
        }
      }
    }
  }

  /**
   * Public method to set active step programmatically
   * @param index Index of the step to activate
   */
  public setActiveIndex(index: number): void {
    this.setActiveStep(index);
  }

  /**
   * Gets the number of steps in the stepper
   */
  public getStepCount(): number {
    return this.stepElements.length;
  }

  /**
   * Add separator elements between step items
   */
  private addSeparatorsBetweenSteps(): void {
    // Update the last step to hide its separator if needed
    if (this.stepElements.length > 0) {
      const lastStep = this.stepElements[this.stepElements.length - 1];
      if (lastStep) {
        // Hide separator on last step
        const separator = lastStep.shadowRoot?.querySelector('.nte-step-separator') as HTMLElement;
        if (separator) {
          separator.style.display = 'none';
        }
      }
    }
  }

  /**
   * Toggle the overlay menu open/closed
   */
  private toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  /**
   * Close the overlay menu
   */
  private closeMenu() {
    this.isMenuOpen = false;
  }

  /**
   * Navigate to a step from the menu
   * @param index Index of the step to navigate to
   */
  private navigateToStep(index: number) {
    // In linear mode, only allow navigation to completed steps or the next step
    if (this.linear) {
      if (index <= this.activeIndex || index === this.activeIndex + 1) {
        this.setActiveStep(index);
        this.closeMenu();
      }
    } else {
      // In non-linear mode, allow navigation to any step
      this.setActiveStep(index);
      this.closeMenu();
    }
  }

  private increaseActiveIndex() {
    if (this.activeIndex >= this.stepElements.length - 1) return;
    this.activeIndex++;

    this.updateStepsState();
  }

  private decreaseActiveIndex() {
    if (this.activeIndex <= 0) return;
    this.activeIndex--;
    this.updateStepsState();
  }

  /**
   * Render the UI as a function of component state
   */
  override render() {
    const stepsCount = this.stepElements.length;

    // Extract menu template to avoid duplication
    const renderMenu = () => {
      if (!this.isMenuOpen) return '';

      return html`
        <div class="nte-stepper-menu" @click="${(e: Event) => e.stopPropagation()}">
          <div class="nte-stepper-menu-header">
            <h3>Steps</h3>
            <button class="nte-stepper-menu-close" @click="${this.closeMenu}">×</button>
          </div>
          <div class="nte-stepper-menu-items">
            ${this.stepElements.map((step, index) => {
              const isActive = index === this.activeIndex;
              const isCompleted = index < this.activeIndex;
              const isSelectable = index <= this.activeIndex;
              const iconElement = step.querySelector('nte-icon') || null;
              const title = step.getAttribute('title') || `Step ${index + 1}`;

              return html`
                <div
                  class="nte-stepper-menu-item ${isActive ? 'active' : ''} ${isCompleted
                    ? 'completed'
                    : ''} ${isSelectable ? 'selectable' : ''}"
                  @click="${isSelectable ? () => this.navigateToStep(index) : null}"
                >
                  <div class="nte-stepper-menu-item-icon">
                    ${iconElement
                      ? iconElement.cloneNode(true)
                      : html`<div class="nte-stepper-menu-item-number">${index + 1}</div>`}
                  </div>
                  <div class="nte-stepper-menu-item-title">${title}</div>
                </div>
              `;
            })}
          </div>
        </div>
      `;
    };

    // Extract circular progress template
    const renderCircularProgress = () => {
      return html`
        <nte-progress
          type="circle"
          min="0"
          max="${stepsCount - 1}"
          value="${this.activeIndex}"
          @click="${this.toggleMenu}"
        >
          <span style="font-size: 0.8rem; opacity: 0.7;">STEP</span>
          <span>${this.activeIndex + 1} / ${stepsCount}</span>
        </nte-progress>
      `;
    };

    return html`
      <div class="nte-stepper-wrapper nte-stepper-mode-${this.mode}" part="wrapper">
        ${this.mode === 'circular'
          ? html`
              ${renderCircularProgress()} ${renderMenu()}
              <div class="nte-stepper-steps">
                <slot @slotchange=${this.handleSlotChange}></slot>
              </div>
              <div
                style="cursor:pointer; width:48px;height:48px;background-color:var(--nt-primary);;margin-inline:1rem; border-radius:8px; place-items:center;display:grid; color:white; font-size:1.5rem;"
                @click="${this.increaseActiveIndex}"
              >
                +
              </div>
              <div
                style="cursor:pointer; width:48px;height:48px;background-color:var(--nt-primary); border-radius:8px; place-items:center;display:grid; color:white; font-size:1.5rem;margin-inline:1rem;"
                @click="${this.decreaseActiveIndex}"
              >
                -
              </div>
            `
          : html`
              <div class="nte-stepper-steps">
                <slot @slotchange=${this.handleSlotChange}></slot>
              </div>
            `}
      </div>
    `;
  }
}
