import { html, LitElement, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { IScrollSpyObserverConfig, ScrollSpyObserver } from './scrollspy-observer';
import style from './scrollspy-shadow.scss?inline';

// Interface for a navigation item in the scrollspy component
export interface INavigationItem {
  // The ID of the element to scroll to
  id: string;

  // The label to display in the navigation
  label: string;

  // Whether the item is currently active
  active?: boolean;
}

// Orientation options for the scrollspy component
export type ScrollspyOrientation = 'horizontal' | 'vertical';

// Interface for the scrollspy configuration
export interface IScrollspyConfig {
  // Custom CSS classes to apply to the element
  classes?: string[];

  // Custom attributes to apply to the element
  attributes?: {
    dataTarget?: string;
  };

  // Orientation of the scrollspy element, defaults to 'vertical'
  orientation?: ScrollspyOrientation;

  // Navigation items to display in the scrollspy
  data?: INavigationItem[];

  // Track progress through sections
  trackProgress?: boolean;

  // Whether to create links for the navigation items
  linkItems?: boolean;
}

/**
 * NtScrollSpyElement - A component that renders a navigation list based on configuration data
 * @element nte-scrollspy
 */
@customElement('nte-scrollspy')
export class NtScrollSpyElement extends LitElement {
  static override styles = [unsafeCSS(style)];

  // Default configuration for the scrollspy component
  private static readonly DEFAULT_CONFIG: Partial<IScrollspyConfig> = {
    orientation: 'vertical',
    trackProgress: true,
    linkItems: true,
    attributes: {
      dataTarget: 'document.body',
    },
  };

  /**
   * Configuration for the scrollspy component
   */
  @property({ type: Object })
  config: IScrollspyConfig = { ...NtScrollSpyElement.DEFAULT_CONFIG };

  /**
   * Target element selector for the scrollspy
   * This gets/sets the data-target attribute directly
   */
  @property({ attribute: 'data-target', reflect: true })
  dataTarget = '';

  // Navigation items to display
  @state()
  private navigationItems: INavigationItem[] = [];

  // Target element for scrollspy observation
  private targetElement: HTMLElement | null = null;

  // Scrollspy observer instance
  private scrollspyObserver: ScrollSpyObserver | null = null;

  // Visited sections tracking
  @state()
  private visitedSections: string[] = [];

  // Reference to the slot element
  private slotElement: HTMLSlotElement | null = null;

  // Track if slot content exists
  @state()
  private hasSlottedContent = false;

  /**
   * Creates a new NtScrollSpyElement
   * @param config Optional configuration for the element
   */
  public constructor(config?: IScrollspyConfig) {
    super();
    if (config) {
      this.config = { ...NtScrollSpyElement.DEFAULT_CONFIG, ...config };
    }
  }

  /**
   * Called when the element is first updated
   */
  protected override firstUpdated(): void {
    // Get the slot element and set up slot change listener
    this.slotElement = this.shadowRoot?.querySelector('slot') || null;

    if (this.slotElement) {
      // Use bind(this) to ensure correct context
      this.slotElement.addEventListener('slotchange', this.handleSlotChange.bind(this));
      // Initial check
      this.handleSlotChange();
    } else {
      console.warn('nte-scrollspy: No slot element found in shadow root');
    }

    this.updateNavigationItems();
    this.applyClasses();
    this.applyAttributes();
    this.setupScrollObserver();
  }

  /**
   * Handles slot content changes
   */
  private handleSlotChange(): void {
    if (!this.slotElement) {
      console.warn('nte-scrollspy: No slot element available');
      return;
    }

    // Check if we have any assigned elements in the slot
    const assignedNodes = this.slotElement.assignedNodes({ flatten: true });

    // Filter out text nodes and empty nodes
    const hasContent = assignedNodes.some((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        console.log('nte-scrollspy: Found element in slot:', (node as Element).tagName);
        return true;
      }
      if (node.nodeType === Node.TEXT_NODE && node.textContent && node.textContent.trim()) {
        console.log('nte-scrollspy: Found non-empty text node in slot');
        return true;
      }
      return false;
    });

    // Update state if changed
    if (this.hasSlottedContent !== hasContent) {
      this.hasSlottedContent = hasContent;
      this.requestUpdate();

      // Reset and setup observer with new content
      if (hasContent) {
        this.setupScrollObserver();
      }
    }
  }

  /**
   * Responds to property changes in the component
   * @param changedProperties Map of changed properties with their previous values
   */
  protected override updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);

    if (changedProperties.has('config')) {
      // Reset target element cache when config changes
      this._targetElementCache = null;

      this.updateNavigationItems();
      this.applyClasses();
      this.applyAttributes();
      this.setupScrollObserver(); // Re-initialize observer with new config
    }
  }

  /**
   * Lifecycle callback when the element is disconnected from the DOM
   */
  public override disconnectedCallback(): void {
    super.disconnectedCallback();

    // Remove slot change listener if exists
    if (this.slotElement) {
      this.slotElement.removeEventListener('slotchange', this.handleSlotChange.bind(this));
    }

    this.disconnectObserver();
  }

  /**
   * Update the navigation items based on configuration
   * This looks for data-title attributes in the target element if no config.data is provided
   */
  private updateNavigationItems(): void {
    // If we have explicit data in config, use that
    if (this.config.data && this.config.data.length > 0) {
      this.navigationItems = this.config.data;
      return;
    }

    // Otherwise, try to generate navigation items from DOM elements with data-title attributes
    const targetElement = this.getTargetElement();

    // Check if target element exists
    if (!targetElement) {
      console.error('NtScrollSpyElement: Target element not found');
      this.navigationItems = [];
      return;
    }

    // Wait a moment for the DOM to be fully available
    // This helps with dynamically created elements
    setTimeout(() => {
      this.findElementsWithDataTitle(targetElement);
    }, 0);
  }

  /**
   * Find elements with data-title attribute and create navigation items
   * @param targetElement The element to search within
   */
  private findElementsWithDataTitle(targetElement: HTMLElement): void {
    // Find elements with data-title attribute in the target element
    const elements = targetElement.querySelectorAll('[data-title]');

    if (elements.length === 0) {
      console.warn(
        'NtScrollSpyElement: No elements with data-title attribute found in target.',
        'Target element:',
        targetElement,
      );

      // Try manual DOM traversal as fallback
      const foundElements = this.findElementsManually(targetElement);
      if (foundElements.length > 0) {
        this.processFoundElements(foundElements);
        return;
      }

      this.navigationItems = [];
      return;
    }

    this.processFoundElements(Array.from(elements));
  }

  /**
   * Manual DOM traversal to find elements with data-title
   * @param element The element to start traversal from
   * @returns Array of elements with data-title attribute
   */
  private findElementsManually(element: Element): Element[] {
    const results: Element[] = [];

    // Check if current element has data-title
    if (element.hasAttribute && element.hasAttribute('data-title')) {
      results.push(element);
    }

    // Check children elements recursively
    if (element.children && element.children.length > 0) {
      Array.from(element.children).forEach((child) => {
        const childResults = this.findElementsManually(child);
        results.push(...childResults);
      });
    }

    return results;
  }

  /**
   * Process found elements with data-title and create navigation items
   * @param elements Elements with data-title attribute
   */
  private processFoundElements(elements: Element[]): void {
    if (elements.length === 0) {
      this.navigationItems = [];
      return;
    }

    // Create navigation items from elements with data-title attribute
    const items: INavigationItem[] = Array.from(elements).map((element) => {
      // Get data-title as the label for the navigation item
      const dataTitle = element.getAttribute('data-title') || '';

      // Use existing ID or generate a new one
      const id = element.id || `scrollspy-section-${Math.random().toString(36).substring(2, 9)}`;

      // Ensure the element has an ID for scrolling
      if (!element.id) {
        element.id = id;
      }

      return {
        id,
        label: dataTitle,
        active: false,
      };
    });

    this.navigationItems = items;

    // Request update and set up observer
    this.requestUpdate();

    // If we're tracking progress, set up the scroll observer
    if (this.isTrackingProgress() && this.navigationItems.length > 0) {
      this.setupScrollObserver();
    }
  }

  /**
   * Applies CSS classes from the config to the host element.
   */
  private applyClasses(): void {
    // Apply custom classes
    if (this.config.classes?.length) {
      this.config.classes.forEach((className) => {
        this.classList.add(className);
      });
    }

    // Apply orientation class
    const orientation = this.getOrientation();
    this.classList.remove('scrollspy-menu-horizontal', 'scrollspy-menu-vertical');
    this.classList.add(`scrollspy-menu-${orientation}`);
  }
  /**
   * Applies attributes from the config to the host element.
   */
  private applyAttributes(): void {
    // Apply data-target attribute from config if not already set directly as an attribute
    if (this.config.attributes?.dataTarget && !this.hasAttribute('data-target')) {
      this.dataTarget = this.config.attributes.dataTarget;
    }
  }

  /**
   * Gets the current orientation with fallback to default.
   * @returns The orientation value to use.
   */
  private getOrientation(): ScrollspyOrientation {
    return this.config.orientation ?? 'vertical';
  }

  /**
   * Checks if progress tracking is enabled
   * @returns True if progress tracking is enabled
   */
  private isTrackingProgress(): boolean {
    return Boolean(this.config.trackProgress ?? NtScrollSpyElement.DEFAULT_CONFIG.trackProgress);
  }

  // Cache for the target element
  private _targetElementCache: HTMLElement | null = null;

  /**
   * Gets the target element to observe based on the data-target attribute
   * Supports both ID selectors and full CSS selectors
   * @returns The target DOM element or document.body as fallback
   */
  private getTargetElement(): HTMLElement {
    // Return cached element if available and config hasn't changed
    if (this._targetElementCache) {
      return this._targetElementCache;
    }

    // Use the property value which is synced with the attribute via @property decorator
    // First check for HTML attribute, then config, then fallback to document.body
    const targetSelector = this.dataTarget || this.config.attributes?.dataTarget || 'document.body';
    let targetElement: HTMLElement | null = null;

    try {
      if (targetSelector === 'document.body') {
        targetElement = document.body;
      } else if (targetSelector.startsWith('#')) {
        // If it starts with #, it's an ID selector
        const id = targetSelector.substring(1);
        targetElement = document.getElementById(id);
      } else {
        // Try as a CSS selector
        targetElement = document.querySelector(targetSelector) as HTMLElement;
      }

      if (!targetElement) {
        console.warn(
          `NtScrollSpyElement: Target element not found for selector: ${targetSelector}. Using document.body as fallback.`,
        );
        targetElement = document.body;
      }
    } catch (error) {
      console.error(`NtScrollSpyElement: Error finding target element: ${error}. Using document.body as fallback.`);
      targetElement = document.body;
    }

    // Cache the result
    this._targetElementCache = targetElement;

    return targetElement;
  }

  /**
   * Renders a navigation item with optional visited state styling
   * @param item The navigation item to render
   * @param index The index of the item in the navigation array
   * @returns The rendered HTML for the item
   */
  private renderNavigationItem(item: INavigationItem, index: number) {
    // Determine item classes based on active and visited state
    let itemClass = 'scrollspy-item';

    // Always apply active class if item is active, regardless of trackProgress
    if (item.active) {
      itemClass += ' scrollspy-item-active';
    }

    // Apply viewed class only if tracking progress is enabled and item is visited
    const isVisited = this.isTrackingProgress() && this.visitedSections.includes(item.id);
    if (isVisited && !item.active) {
      itemClass += ' scrollspy-item-viewed';
    }

    // Event-Handler für das sanfte Scrollen
    const handleClick = (e: Event) => {
      e.preventDefault();
      const targetSection = document.getElementById(item.id);
      if (targetSection) {
        // Sanftes Scrollen zum Zielabschnitt
        targetSection.scrollIntoView({ behavior: 'smooth' });

        // Update URL-Hash ohne zu springen
        history.pushState(null, '', `#${item.id}`);
      }
    };

    // Create link or span for the item content
    const contentElement = !this.config.linkItems
      ? html`<a
          href="#${item.id}"
          @click=${handleClick}
          part="scrollspy-item-link item-link ${item.active ? 'active-link' : ''} ${isVisited ? 'viewed-link' : ''}"
          class="scrollspy-item-link"
          >${item.label}</a
        >`
      : html`<span
          part="scrollspy-item-label ${item.active ? 'active-label' : ''} ${isVisited ? 'viewed-label' : ''}"
          class="scrollspy-item-label"
          >${item.label}</span
        >`;

    return html`
      <li
        id="${item.id}"
        part="scrollspy-item item ${item.active ? 'active-item' : ''} ${isVisited ? 'viewed-item' : ''}"
        class="${itemClass}"
        ?data-viewed="${isVisited}"
        aria-current="${item.active ? 'true' : 'false'}"
      >
        <span
          part="scrollspy-decorator decorator ${item.active ? 'active-decorator' : ''} ${isVisited
            ? 'viewed-decorator'
            : ''}"
          class="scrollspy-item-decorator"
          data-index="${index + 1}"
        ></span>
        ${contentElement}
      </li>
    `;
  }

  // Renders the navigation list
  protected override render() {
    const orientation = this.getOrientation();
    console.log('nte-scrollspy: Rendering with hasSlottedContent:', this.hasSlottedContent);

    return html`
      <div id="scrollspy" part="scrollspy container" class="scrollspy scrollspy-${orientation}">
        <!-- Always include the slot in the template -->
        <slot></slot>
        ${!this.hasSlottedContent
          ? html`
              <ul part="scrollspy-menu menu" class="scrollspy-menu">
                ${this.navigationItems.map((item, index) => this.renderNavigationItem(item, index))}
              </ul>
            `
          : ''}
      </div>
    `;
  }

  /**
   * Returns the component name for registration
   * @returns The custom element name
   */
  static get is(): string {
    return 'nte-scrollspy';
  }

  /**
   * Setup the ScrollSpyObserver to detect when sections are in view
   */
  private setupScrollObserver(): void {
    // Disconnect any existing observer first
    this.disconnectObserver();

    // Get the target element using our helper method
    const targetElement = this.getTargetElement();

    // Get IDs of all navigation items to observe
    const itemIds = this.navigationItems.map((item) => item.id);

    // Prepare observer configuration
    const observerConfig: IScrollSpyObserverConfig = {
      targetElement,
      itemIds: itemIds,
      trackProgress: this.config.trackProgress,

      // Callbacks
      onActiveItemChanged: this.updateActiveItem.bind(this),
      onSectionVisible: (sectionId: string) => {
        // Custom event when a section becomes visible
        this.dispatchCustomEvent('section-visible', { sectionId });
      },
      onSectionHidden: (sectionId: string) => {
        // Custom event when a section is no longer visible
        this.dispatchCustomEvent('section-hidden', { sectionId });
      },
      onVisitedSectionsChanged: (visitedSections: string[]) => {
        // Update our internal list of visited sections
        this.visitedSections = visitedSections;
        // Force re-render to update viewed status in the UI
        this.requestUpdate();
      },
    };

    // Initialize the ScrollSpyObserver
    this.scrollspyObserver = new ScrollSpyObserver(observerConfig);

    // Update visited sections if progress tracking is enabled
    if (this.isTrackingProgress()) {
      this.updateVisitedSections();
    }
  }

  /**
   * Disconnect the observer when no longer needed
   */
  private disconnectObserver(): void {
    if (this.scrollspyObserver) {
      this.scrollspyObserver.disconnect();
      this.scrollspyObserver = null;
    }
  }

  /**
   * Helper method to dispatch custom events with consistent configuration
   * @param eventName Name of the custom event to dispatch
   * @param detail Event detail object
   */
  private dispatchCustomEvent(eventName: string, detail: Record<string, unknown>): void {
    this.dispatchEvent(
      new CustomEvent(eventName, {
        detail,
        bubbles: true,
        composed: true,
      }),
    );
  }

  /**
   * Update the active state of navigation items
   * @param activeId ID of the currently active section or null if no section active
   * @param previousId ID of the previously active section (if any)
   */
  private updateActiveItem(activeId: string | null, previousId?: string | null): void {
    // Skip if no navigation items exist
    if (!this.navigationItems.length) {
      return;
    }

    const updatedItems = this.navigationItems.map((item) => ({
      ...item,
      active: item.id === activeId,
    }));

    // Only update if there's an actual change to avoid infinite loops
    const hasChanges = updatedItems.some((item, index) => item.active !== this.navigationItems[index].active);

    if (hasChanges) {
      this.navigationItems = updatedItems;

      // Dispatch custom event for active item change
      this.dispatchCustomEvent('active-changed', { activeId, previousId });

      // Update visited sections only if tracking progress is enabled
      if (this.isTrackingProgress()) {
        this.updateVisitedSections();
      }
    }
  }

  /**
   * Updates the list of visited sections from the observer
   */
  private updateVisitedSections(): void {
    if (this.scrollspyObserver) {
      this.visitedSections = this.scrollspyObserver.getVisitedSections();

      // Force re-render when visited sections are updated
      // This ensures the viewed state is applied correctly
      this.requestUpdate();
    } else {
      this.visitedSections = [];
    }
  }

  /**
   * Manually activate a specific section
   * @param sectionId ID of the section to activate
   */
  public activateSection(sectionId: string): void {
    if (this.scrollspyObserver) {
      this.scrollspyObserver.setActiveSection(sectionId);
    }
  }

  /**
   * Reset tracking of visited sections
   */
  public resetProgress(): void {
    if (this.scrollspyObserver) {
      this.scrollspyObserver.resetVisited();
      this.updateVisitedSections();
    }
  }

  /**
   * Force a recalculation of the active section
   */
  public refresh(): void {
    if (this.scrollspyObserver) {
      this.scrollspyObserver.refresh();
    }
  }

  /**
   * Update the observer configuration
   * @param config New partial configuration for the observer
   */
  public updateObserverConfig(config: Partial<IScrollSpyObserverConfig>): void {
    if (this.scrollspyObserver) {
      this.scrollspyObserver.updateConfig(config);

      // Force update after config change
      this.requestUpdate();
    }
  }
}
