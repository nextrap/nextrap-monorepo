import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import style from './nte-stepper-shadow.scss?inline';
// Import the progress component
import '@nextrap/nte-progress';

// Import Tabler Icons CSS with all icons
const tablerIconsUrl = 'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css';

// Fetch and inject the Tabler icons CSS
async function loadTablerIconsCss() {
  try {
    const response = await fetch(tablerIconsUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch Tabler icons CSS: ${response.statusText}`);
    }
    return await response.text();
  } catch (error) {
    console.error('Error loading Tabler icons CSS:', error);
    return '';
  }
}

// Will hold the loaded CSS
let tablerIconsStyles = '';

// Load the CSS
(async () => {
  tablerIconsStyles = await loadTablerIconsCss();
})();

export interface IStepperItem {
  // The ID step
  id: string;

  // The label to display in the stepper menu
  label: string;

  // Whether the item is currently active
  active?: boolean;

  // Whether the item is currently completed
  completed?: boolean;

  // Whether the item is currently disabled
  disabled?: boolean;

  // The icon to display in the stepper menu
  icon?: string;
}

export interface IStepperConfig {
  // Custom CSS classes to apply to the element
  classes?: string[];

  // The mode of the stepper
  mode?: 'horizontal' | 'vertical' | 'circular';

  // The data for the stepper
  data?: IStepperItem[];
}

@customElement('nte-stepper')
export class nteStepperElement extends LitElement {
  static override styles = [unsafeCSS(style)];

  // Default configuration for the scrollspy component
  private static readonly DEFAULT_CONFIG: Partial<IStepperConfig> = {
    mode: 'horizontal',
    data: [],
  };

  // Declare reactive properties
  @property({ type: Object })
  config: IStepperConfig = { ...nteStepperElement.DEFAULT_CONFIG };

  // Add the data property to receive items directly
  @property({ type: Array })
  data: IStepperItem[] = [];

  // Direct access to mode property
  @property({ type: String })
  get mode(): 'horizontal' | 'vertical' | 'circular' {
    return this.config.mode || 'horizontal';
  }
  set mode(value: 'horizontal' | 'vertical' | 'circular') {
    this.config = { ...this.config, mode: value };
    this.requestUpdate('mode');
  }

  // Navigation items to display
  @state()
  private stepperItems: IStepperItem[] = [];

  // Reference to the slot element
  private slotElement: HTMLSlotElement | null = null;

  // Track if slot content exists
  @state()
  private hasSlottedContent = false;

  /**
   * Creates a new NtStepperElement
   * @param config Optional configuration for the element
   */

  public constructor(config?: IStepperConfig) {
    super();
    if (config) {
      this.config = { ...nteStepperElement.DEFAULT_CONFIG, ...config };
    }
    console.log(this.config);
    this.injectIconStyles();
  }

  /**
   * Injects the Tabler icon styles into the shadow root
   */
  private async injectIconStyles() {
    // If we already have the styles, use them
    if (tablerIconsStyles) {
      this.updateStyles(tablerIconsStyles);
      return;
    }

    // Otherwise load them
    tablerIconsStyles = await loadTablerIconsCss();
    this.updateStyles(tablerIconsStyles);
  }

  /**
   * Updates the component's styles with the given CSS
   */
  private updateStyles(css: string) {
    // Create a new style element
    const styleEl = document.createElement('style');
    styleEl.textContent = css;

    // Add it to the shadow root
    if (this.shadowRoot) {
      this.shadowRoot.appendChild(styleEl);
    }
  }

  protected override firstUpdated(): void {
    this.updateStepperItems();
  }

  /**
   * Responds to property changes in the component
   * @param changedProperties Map of changed properties with their previous values
   */
  protected override updated(changedProperties: Map<string, any>): void {
    if (changedProperties.has('data') || changedProperties.has('config')) {
      this.updateStepperItems();
    }
  }

  private updateStepperItems(): void {
    // First check if direct data property is available
    if (this.data && this.data.length > 0) {
      console.log('Using data property:', this.data);
      this.stepperItems = [...this.data];
      return;
    }

    // Fall back to config.data if available
    if (this.config.data && this.config.data.length > 0) {
      console.log('Using config.data:', this.config.data);
      this.stepperItems = [...this.config.data];
      return;
    }

    // Default to empty array if no data available
    console.log('No data available, using empty array');
    this.stepperItems = [];
  }

  private handleClick(event: Event): void {
    event.preventDefault();

    // Find the stepper item that was clicked
    const target = event.currentTarget as HTMLElement;
    const index = target.dataset.index ? parseInt(target.dataset.index) : -1;

    if (index >= 0 && index < this.stepperItems.length) {
      // Update active state - set all items to inactive except the clicked one
      this.stepperItems = this.stepperItems.map((item, i) => {
        return {
          ...item,
          active: i === index,
        };
      });

      // Dispatch a custom event for external listeners
      this.dispatchEvent(
        new CustomEvent('stepper-item-click', {
          detail: {
            item: this.stepperItems[index],
            index,
          },
          bubbles: true,
          composed: true,
        }),
      );

      // Trigger a re-render
      this.requestUpdate();
    }
  }

  private renderStepperItem(item: IStepperItem, index: number) {
    console.log(item);
    const stepperItemElement = html`
      <div
        class="nte-stepper-item"
        part="stepper-item"
        data-index="${index}"
        data-active="${item.active}"
        @click="${this.handleClick}"
      >
        <div class="nte-stepper-circle" part="stepper-circle">
          <div class="nte-stepper-circle-progress"></div>
          <i class="${item.icon}"></i>
        </div>
        <div class="nte-stepper-info" part="stepper-info">
          <h2>${item.label}</h2>
          <i class="ti ti-info-circle"></i>
        </div>
        <div class="nte-stepper-action" part="stepper-action">
          <i class="ti ti-arrow-narrow-right"></i>
        </div>
      </div>
      ${index === this.stepperItems.length - 1 ? '' : html`<div class="nte-stepper-separator"></div>`}
    `;

    return stepperItemElement;
  }

  // Render the UI as a function of component state
  override render() {
    // Find the active step index for the progress value
    const activeIndex = this.stepperItems.findIndex((item) => item.active === true);
    const progressValue = activeIndex >= 0 ? activeIndex : 0;
    console.log(progressValue, progressValue);
    return html` <div class="nte-stepper-wrapper nte-stepper-mode-${this.config.mode}">
      ${this.stepperItems.map((item, index) => this.renderStepperItem(item, index))}
      ${this.config.mode === 'horizontal'
        ? html`<div class="nte-stepper-progress">
            <nte-progress
              part="stepper-progress"
              min="0"
              max="${this.stepperItems.length}"
              value="${progressValue}"
              steps="${this.stepperItems.length}"
            ></nte-progress>
          </div>`
        : ''}
    </div>`;
  }
}
