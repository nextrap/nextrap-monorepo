/**
 * ScrollSpyObserver
 * Handles the intersection observation logic for tracking visible sections
 */

// Define highlight mode options
export type HighlightMode = 'first' | 'last' | 'most-visible' | 'nearest-top';

// Interface for observer configuration
export interface IScrollSpyObserverConfig {
  // The target container element to observe within (defaults to document.body)
  targetElement: HTMLElement;

  // Offset from the top of the viewport to consider for activation
  topOffset?: number;

  // Offset from the bottom of the viewport (in pixels)
  bottomOffset?: number;

  // How the active section is determined
  highlightMode?: HighlightMode;

  // Track progress through sections
  trackProgress?: boolean;

  // Debounce time for scroll events (ms)
  debounceTime?: number;

  // Root margin for intersection observer
  rootMargin?: string;

  // Intersection observer thresholds
  thresholds?: number[];

  // Callback function when active item changes
  onActiveItemChanged: (activeId: string, previousId?: string) => void;

  // Callback function when a section becomes visible
  onSectionVisible?: (sectionId: string) => void;

  // Callback function when a section becomes hidden
  onSectionHidden?: (sectionId: string) => void;

  // Callback for when visited sections change
  onVisitedSectionsChanged?: (visitedSections: string[]) => void;

  // List of item IDs to observe
  itemIds: string[];
}

export class ScrollSpyObserver {
  // Configuration options
  private config: IScrollSpyObserverConfig;

  // Intersection observer instance
  private intersectionObserver: IntersectionObserver | null = null;

  // Map of observed sections
  private observedSections: Map<string, HTMLElement> = new Map();

  // Currently visible sections
  private visibleSections: Set<string> = new Set();

  // Visited sections for progress tracking
  private visitedSections: Set<string> = new Set();

  // Currently active section ID
  private activeId: string | null = null;

  // Debounce timeout ID
  private debounceTimeout: number | null = null;

  /**
   * Creates a new ScrollSpyObserver
   * @param config Configuration options
   */
  constructor(config: IScrollSpyObserverConfig) {
    this.config = {
      topOffset: 0,
      bottomOffset: 0,
      highlightMode: 'nearest-top',
      debounceTime: 100,
      rootMargin: '0px',
      thresholds: [0, 0.25, 0.5, 0.75, 1],
      ...config,
    };

    this.initObserver();
  }

  /**
   * Initialize the intersection observer
   */
  private initObserver(): void {
    // Create intersection observer with appropriate options
    const options = {
      root: this.config.targetElement === document.body ? null : this.config.targetElement,
      rootMargin: this.config.rootMargin,
      threshold: this.config.thresholds,
    };

    this.intersectionObserver = new IntersectionObserver(this.handleIntersection.bind(this), options);

    // Find all sections to observe based on item IDs
    this.observedSections.clear();
    this.config.itemIds.forEach((id) => {
      const section = document.getElementById(id);

      if (section) {
        this.observedSections.set(id, section);
        this.intersectionObserver?.observe(section);
      }
    });
  }

  /**
   * Handle intersection events when sections enter/exit the viewport
   * @param entries Array of IntersectionObserverEntry objects
   */
  private handleIntersection(entries: IntersectionObserverEntry[]): void {
    // For each observed element that has changed visibility
    entries.forEach((entry) => {
      const targetElement = entry.target as HTMLElement;
      const targetId = targetElement.getAttribute('id') || '';

      if (!targetId) return;

      // Update visibility state based on intersection
      if (entry.isIntersecting) {
        this.visibleSections.add(targetId);
        // Trigger the onSectionVisible callback if provided
        this.config.onSectionVisible?.(targetId);
      } else {
        this.visibleSections.delete(targetId);

        // Trigger the onSectionHidden callback if provided
        this.config.onSectionHidden?.(targetId);
      }
    });

    // Update active section with debouncing
    this.debouncedUpdate();
  }

  /**
   * Handle debounce for scroll events
   */
  private debouncedUpdate(): void {
    // Cancel any existing timeout
    if (this.debounceTimeout !== null) {
      window.clearTimeout(this.debounceTimeout);
    }

    // Create a new timeout
    this.debounceTimeout = window.setTimeout(() => {
      this.updateActiveSection();
      this.debounceTimeout = null;
    }, this.config.debounceTime ?? 100);
  }

  /**
   * Update the active navigation item based on current scroll position
   * This provides a more natural scrolling experience by activating items sequentially
   */
  private updateActiveSection(): void {
    // Get all observed sections in their original order
    const orderedIds = this.config.itemIds;
    const highlightMode = this.config.highlightMode || 'nearest-top';

    // Get currently visible section IDs as an array
    this.updateVisibleSections();
    const visibleItems = Array.from(this.visibleSections);

    // Default: no active item
    let activeId: string | null = null;

    if (visibleItems.length > 0) {
      // Determine which section to highlight based on the mode
      switch (highlightMode) {
        case 'first':
          // First visible section in document order
          for (const id of orderedIds) {
            if (this.visibleSections.has(id)) {
              activeId = id;
              break;
            }
          }
          break;

        case 'last':
          // Last visible section in document order
          for (let i = orderedIds.length - 1; i >= 0; i--) {
            if (this.visibleSections.has(orderedIds[i])) {
              activeId = orderedIds[i];
              break;
            }
          }
          break;

        case 'most-visible':
          // Section with the highest visibility ratio
          {
            let maxVisibility = 0;

            for (const id of visibleItems) {
              const section = this.observedSections.get(id);
              if (!section) continue;

              const rect = section.getBoundingClientRect();
              const viewportHeight = window.innerHeight;
              const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
              const visibilityRatio = visibleHeight / rect.height;
              console.log(id, visibilityRatio);
              if (visibilityRatio > maxVisibility) {
                maxVisibility = visibilityRatio;
                activeId = id;
              }
            }
          }
          break;

        case 'nearest-top':
          // Section nearest to the top of the viewport
          {
            let minDistance = Infinity;

            for (const id of visibleItems) {
              const section = this.observedSections.get(id);
              if (!section) continue;

              const rect = section.getBoundingClientRect();
              const distance = Math.abs(rect.top - (this.config.topOffset ?? 0));

              if (distance < minDistance) {
                minDistance = distance;
                activeId = id;
              }
            }
          }
          break;
      }
    } else if (orderedIds.length > 0) {
      // If no sections are visible, check if we're at the beginning or end
      const firstSection = document.getElementById(orderedIds[0]);
      const lastSection = document.getElementById(orderedIds[orderedIds.length - 1]);

      if (firstSection && lastSection) {
        const firstRect = firstSection.getBoundingClientRect();
        const lastRect = lastSection.getBoundingClientRect();

        // If we're above the first section, activate the first
        if (firstRect.top > 0) {
          activeId = orderedIds[0];
        }
        // If we're below the last section, activate the last
        else if (lastRect.bottom < window.innerHeight) {
          activeId = orderedIds[orderedIds.length - 1];
        }
      }
    }

    // Update the active state via callback if there's a change
    if (activeId !== null && activeId !== this.activeId) {
      const previousId = this.activeId;
      this.activeId = activeId;
      this.config.onActiveItemChanged(activeId, previousId ?? undefined);

      // Update visited sections now that we have a new active element
      this.updateVisitedSections();
    }
  }

  /**
   * Update visited sections based on the active element
   * Only sections that come before the active element in order will be marked as visited
   * Sections after the active element will be removed from visited
   */
  private updateVisitedSections(): void {
    if (!this.activeId) {
      return;
    }

    // Get the index of the active element
    const orderedIds = this.config.itemIds;
    const activeIdIndex = this.activeId ? orderedIds.indexOf(this.activeId) : -1;

    if (activeIdIndex === -1) return;

    let visitedChanged = false;

    // Process all items in order up to active item
    for (let i = 0; i < activeIdIndex; i++) {
      const id = orderedIds[i];
      if (!this.visitedSections.has(id)) {
        this.visitedSections.add(id);
        visitedChanged = true;
      }
    }

    // Remove sections that are after the active element from the visited set
    // This handles the case where the user scrolls back up
    for (let i = activeIdIndex + 1; i < orderedIds.length; i++) {
      const id = orderedIds[i];
      if (this.visitedSections.has(id)) {
        this.visitedSections.delete(id);
        visitedChanged = true;
      }
    }

    // Notify about changes to visited sections if needed
    if (visitedChanged) {
      this.config.onVisitedSectionsChanged?.(Array.from(this.visitedSections));
    }
  }

  /**
   * Update the visible sections set
   */
  private updateVisibleSections(): void {
    this.observedSections.forEach((section, id) => {
      const rect = section.getBoundingClientRect();
      const isVisible =
        rect.top < window.innerHeight - (this.config.bottomOffset || 0) && rect.bottom > (this.config.topOffset || 0);
      if (isVisible) {
        this.visibleSections.add(id);
      }
    });
  }

  /**
   * Update observer with new items to track
   * @param itemIds Array of item IDs to observe
   */
  public updateItems(itemIds: string[]): void {
    // Disconnect existing observer
    this.disconnect();

    // Update item IDs
    this.config.itemIds = itemIds;

    // Reinitialize observer
    this.initObserver();
  }

  /**
   * Update the target container element
   * @param targetElement New target element
   */
  public updateTargetElement(targetElement: HTMLElement): void {
    // Disconnect existing observer
    this.disconnect();

    // Update target element
    this.config.targetElement = targetElement;

    // Reinitialize observer
    this.initObserver();
  }

  /**
   * Disconnect the observer when no longer needed
   */
  public disconnect(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = null;
    }
  }

  /**
   * Get list of visited section IDs
   */
  public getVisitedSections(): string[] {
    return Array.from(this.visitedSections);
  }

  /**
   * Manually set the active section
   * @param sectionId ID of the section to activate
   */
  public setActiveSection(sectionId: string): void {
    const previousId = this.activeId || undefined;
    this.activeId = sectionId;
    this.config.onActiveItemChanged(sectionId, previousId);
  }

  /**
   * Reset visited sections tracking
   */
  public resetVisited(): void {
    this.visitedSections.clear();
    this.config.onVisitedSectionsChanged?.([]);
  }

  /**
   * Force a recalculation of the active section
   */
  public refresh(): void {
    this.updateActiveSection();
  }

  /**
   * Update the observer configuration
   * @param config New configuration options
   */
  public updateConfig(config: Partial<IScrollSpyObserverConfig>): void {
    // Update config values
    this.config = {
      ...this.config,
      ...config,
    };

    // Reinitialize observer with new configuration
    this.disconnect();
    this.initObserver();
  }
}
