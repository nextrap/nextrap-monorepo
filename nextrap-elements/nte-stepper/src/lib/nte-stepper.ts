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
}

@customElement('nte-stepper')
export class nteStepperElement extends LitElement {
  static override styles = [unsafeCSS(style)];

  // Default configuration for the stepper component
  private static readonly DEFAULT_CONFIG: Partial<IStepperConfig> = {
    mode: 'horizontal',
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
    this.requestUpdate('mode');
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

    // Add separators after initial render is complete
    this.updateComplete.then(() => {
      this.addSeparatorsBetweenSteps();
      this.updateCircularProgress();
    });
  }

  /**
   * When the component's properties are updated
   */
  override updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties);

    // Update active class when activeIndex changes
    if (changedProperties.has('activeIndex')) {
      this.updateStepsState();
      this.updateCircularProgress();
    }

    // Check if mode has changed
    if (changedProperties.has('mode')) {
      // Re-create separators when mode changes
      this.addSeparatorsBetweenSteps();
      this.updateCircularProgress();
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
    });

    // Initialize active state based on current activeIndex
    this.updateStepsState();

    // Add separators between steps if in vertical mode
    this.addSeparatorsBetweenSteps();
    this.updateCircularProgress();
    // Force re-render
    this.requestUpdate();
  }

  /**
   * Update the state of all step elements based on activeIndex
   */
  private updateStepsState() {
    this.stepElements.forEach((step, index) => {
      // Set active state
      if (index === this.activeIndex) {
        step.setAttribute('active', '');
      } else {
        step.removeAttribute('active');
      }

      // Set completed state for steps before active index
      if (index < this.activeIndex) {
        step.setAttribute('completed', '');
      } else if (index > this.activeIndex) {
        step.removeAttribute('completed');
      }
    });

    // Update separator classes when step states change
    this.updateSeparatorClasses();
  }

  private updateCircularProgress(): void {
    if (this.mode !== 'circular' || !this.shadowRoot) return;
    const circularWrapper = this.shadowRoot.querySelector<HTMLElement>('.nte-stepper-circular');
    if (!circularWrapper) return;
    const stepCount = this.stepElements.length;
    const progressPercentage = stepCount > 1 ? (this.activeIndex / (stepCount - 1)) * 100 : 0;
    circularWrapper.style.setProperty('--progress', progressPercentage.toString());
  }

  /**
   * Update the classes of separator elements based on step states
   */
  private updateSeparatorClasses(): void {
    // Only update separators in vertical mode
    if (this.mode !== 'vertical' || !this.shadowRoot) return;

    // Get the wrapper element
    const wrapper = this.shadowRoot.querySelector('.nte-stepper-steps');
    if (!wrapper) return;

    // Get all separator elements
    const separators = wrapper.querySelectorAll('.nte-stepper-separator');
    if (separators.length === 0) return;

    // Update each separator's class based on the next step's state
    separators.forEach((separator, i) => {
      if (this.stepElements[i + 1]?.hasAttribute('active') || this.stepElements[i + 1]?.hasAttribute('completed')) {
        separator.classList.add('completed');
      } else {
        separator.classList.remove('completed');
      }
    });
  }

  /**
   * Handles when a slotted nte-step is clicked
   * @param event Custom event from nte-step with step index
   */
  private handleStepClick(event: CustomEvent) {
    const step = event.target as HTMLElement;
    const index = parseInt(step.getAttribute('index') || '0', 10);

    // Only allow clicking if the step is not disabled
    if (step && !step.hasAttribute('disabled')) {
      this.setActiveStep(index);

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
      this.activeIndex = index;
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
   * Helper method to create separator elements between steps
   */
  private createSeparator(): HTMLElement {
    const separator = document.createElement('div');
    separator.className = 'nte-stepper-separator';
    separator.setAttribute('part', 'separator');
    return separator;
  }

  /**
   * Add separator elements between step items when in vertical mode
   */
  private addSeparatorsBetweenSteps(): void {
    // Only add separators in vertical mode
    if (this.mode !== 'vertical') {
      // Remove existing separators when not in vertical mode
      this.removeAllSeparators();
      return;
    }

    // Remove any existing separators before adding new ones
    this.removeAllSeparators();

    // Make sure we have a shadow root and a wrapper element
    if (!this.shadowRoot) return;

    // Get the wrapper element from the shadow DOM
    const wrapper = this.shadowRoot.querySelector('.nte-stepper-steps');
    if (!wrapper) return;

    // Use the actual stepElements array
    if (this.stepElements.length < 2) return;

    // For each pair of slots, add a separator
    for (let i = 0; i < this.stepElements.length - 1; i++) {
      // Create a new separator
      const separator = this.createSeparator();

      // Add "completed" class if the next step (i+1) is active or completed
      if (this.stepElements[i + 1]?.hasAttribute('active') || this.stepElements[i + 1]?.hasAttribute('completed')) {
        separator.classList.add('completed');
      }

      // Add it to the wrapper
      wrapper.appendChild(separator);

      // Position it appropriately using CSS
      separator.style.setProperty('--nte-stepper-separator-top', `calc(${i + 1} * 100% / ${this.stepElements.length})`);
    }
  }

  /**
   * Remove all separator elements
   */
  private removeAllSeparators(): void {
    // We need the shadow root to access the wrapper
    if (!this.shadowRoot) return;

    // Get the wrapper element
    const wrapper = this.shadowRoot.querySelector('.nte-stepper-steps');
    if (!wrapper) return;

    // Find and remove all separator elements within the wrapper
    const separators = wrapper.querySelectorAll('.nte-stepper-separator');
    separators.forEach((separator) => separator.remove());
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
    // Only allow navigation to completed steps or the active step
    if (index <= this.activeIndex) {
      this.setActiveStep(index);
      this.closeMenu();
    }
  }

  private increaseActiveIndex() {
    if (this.activeIndex >= this.stepElements.length - 1) return;
    this.activeIndex++;

    this.updateStepsState();
    this.updateCircularProgress();
  }

  private decreaseActiveIndex() {
    if (this.activeIndex <= 0) return;
    this.activeIndex--;
    this.updateStepsState();
    this.updateCircularProgress();
  }

  /**
   * Render the UI as a function of component state
   */
  override render() {
    const stepsCount = this.stepElements.length;

    return html`
      <div class="nte-stepper-wrapper nte-stepper-mode-${this.mode}" part="wrapper">
        <div class="nte-stepper-circular ${this.isMenuOpen ? 'menu-open' : ''}" @click="${this.toggleMenu}">
          <svg
            width="var(--nte-stepper-circular-progress-size)"
            height="var(--nte-stepper-circular-progress-size)"
            style="width: var(--nte-stepper-circular-progress-size); height: var(--nte-stepper-circular-progress-size);"
            viewBox="0 0 100 100"
            class="nte-stepper-circular-progress"
          >
            <circle class="nte-stepper-circular-progress-bg"></circle>
            <circle class="nte-stepper-circular-progress-fg"></circle>
          </svg>
          <div class="nte-stepper-circular-text" part="circular-text">
            <span>STEP</span>
            <span>${this.activeIndex + 1} / ${stepsCount}</span>
          </div>

          ${this.isMenuOpen
            ? html` <div class="nte-stepper-menu" @click="${(e: Event) => e.stopPropagation()}">
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
              </div>`
            : ''}
        </div>
        <div class="nte-stepper-steps">
          <slot @slotchange=${this.handleSlotChange}></slot>
        </div>
        ${this.mode == 'circular'
          ? html`<div
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
              </div>`
          : ''}
        ${this.mode === 'horizontal'
          ? html`
              <div class="nte-stepper-progress" part="progress-container">
                <nte-progress
                  part="progress"
                  min="0"
                  max="${stepsCount}"
                  value="${this.activeIndex}"
                  steps="${stepsCount}"
                ></nte-progress>
              </div>
            `
          : ''}
      </div>
    `;
  }
}
