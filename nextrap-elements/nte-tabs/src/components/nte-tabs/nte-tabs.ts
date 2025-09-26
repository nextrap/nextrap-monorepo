import { resetStyle } from '@nextrap/style-reset';
import { html, LitElement, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './nte-tab';
import type { NteTabElement } from './nte-tab';
import style from './nte-tabs.scss?inline';

export interface TabChangeDetail {
  value: string;
  tab: HTMLElement;
}

@customElement('nte-tabs')
export class NteTabsElement extends LitElement {
  static override styles = [unsafeCSS(style), unsafeCSS(resetStyle)];

  @property({ type: String, reflect: true })
  accessor variant: 'line' | 'card' = 'line';

  @property({ type: String, reflect: true })
  accessor size: 'sm' | 'md' | 'lg' | 'xl' = 'md';

  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  @property({ type: String, reflect: true })
  accessor direction: 'horizontal' | 'vertical' = 'horizontal';

  @property({ type: String })
  accessor selected: string | undefined = undefined;

  @property({ type: String, attribute: 'aria-label' })
  accessor tabsAriaLabel: string | undefined = undefined;

  @property({ type: String, attribute: 'aria-labelledby' })
  accessor tabsAriaLabelledby: string | undefined = undefined;

  @property({ type: String })
  accessor borderWidth = '2px';

  @property({ type: String })
  accessor borderColor = '#e0e0e0';

  @property({ type: String })
  accessor indicatorColor = 'var(--nte-primary-color, #1976d2)';

  @property({ type: String })
  accessor colorInactive = '#9ca3af';

  @property({ type: String })
  accessor colorHover = '#6b7280';

  @property({ type: String })
  accessor colorSelected = '#374151';

  // Note: Using manual queries instead of @queryAssignedElements decorators to avoid TypeScript issues
  private get _tabs(): NteTabElement[] {
    const slot = this.shadowRoot?.querySelector('slot:not([name])') as HTMLSlotElement;
    if (!slot) return [];
    return slot
      .assignedElements({ flatten: true })
      .filter((el) => el.tagName.toLowerCase() === 'nte-tab') as NteTabElement[];
  }

  private get _panels(): HTMLElement[] {
    const slot = this.shadowRoot?.querySelector('slot[name="panel"]') as HTMLSlotElement;
    if (!slot) return [];
    return slot.assignedElements({ flatten: true }) as HTMLElement[];
  }

  // Note: Using manual queries instead of @query decorators to avoid TypeScript issues
  private get _indicator(): HTMLElement | null {
    return (this.shadowRoot?.querySelector('.selection-indicator') as HTMLElement) || null;
  }

  private get _tabsList(): HTMLElement | null {
    return (this.shadowRoot?.querySelector('#list') as HTMLElement) || null;
  }

  private _indicatorTransform: string = '';

  private _tabIdMap = new WeakMap<HTMLElement, string>();
  private _panelIdMap = new WeakMap<HTMLElement, string>();
  private _idCounter = 0;
  private _resizeObserver?: ResizeObserver;

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('tab-select', this._handleTabSelect);
    this.addEventListener('keydown', this._handleKeyDown);
    this.addEventListener('click', this._handleClick, true); // Use capture phase

    // Setup resize observer for indicator updates
    this._resizeObserver = new ResizeObserver(() => {
      this._updateIndicator();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('tab-select', this._handleTabSelect);
    this.removeEventListener('keydown', this._handleKeyDown);
    this.removeEventListener('click', this._handleClick);

    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }
  }

  protected override firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);

    // Use requestAnimationFrame to ensure DOM is fully rendered
    requestAnimationFrame(() => {
      this._updateTabs();
      this._updateTabsAppearance(); // Ensure appearance is updated on first load
      this._updatePanels();

      // Select first tab if none selected
      if (!this.selected && this._tabs.length > 0) {
        const firstEnabled = this._tabs.find((tab) => !tab.hasAttribute('disabled'));
        if (firstEnabled) {
          this.selected = firstEnabled.getAttribute('value') || '';
        }
      }

      // Start observing tabs list for size changes
      if (this._tabsList && this._resizeObserver) {
        this._resizeObserver.observe(this._tabsList);
      }

      // Also observe each tab for size changes
      this._tabs.forEach((tab) => {
        if (this._resizeObserver) {
          this._resizeObserver.observe(tab);
        }
      });

      // Initial indicator update
      this._updateIndicator();
    });
  }

  protected override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has('selected') || changedProperties.has('disabled')) {
      this._updateTabs();
      this._updatePanels();
      this._updateIndicator();
    }

    if (changedProperties.has('variant') || changedProperties.has('size') || changedProperties.has('direction')) {
      this._updateTabsAppearance();
      this._updateIndicator();
    }

    if (
      changedProperties.has('borderWidth') ||
      changedProperties.has('borderColor') ||
      changedProperties.has('indicatorColor') ||
      changedProperties.has('colorInactive') ||
      changedProperties.has('colorHover') ||
      changedProperties.has('colorSelected')
    ) {
      this.style.setProperty('--nte-tabs-border-width', this.borderWidth);
      this.style.setProperty('--nte-tabs-border-color', this.borderColor);
      this.style.setProperty('--nte-tabs-indicator-color', this.indicatorColor);
      this.style.setProperty('--nte-tabs-color-inactive', this.colorInactive);
      this.style.setProperty('--nte-tabs-color-hover', this.colorHover);
      this.style.setProperty('--nte-tabs-color-selected', this.colorSelected);
    }
  }

  override render() {
    const ariaOrientation = this.direction === 'vertical' ? 'vertical' : 'horizontal';

    return html`
      <div class="tabs-container ${this.variant} ${this.size} ${this.direction}">
        <div
          id="list"
          class="tabs-list"
          role="tablist"
          part="tablist"
          aria-orientation="${ariaOrientation}"
          aria-label="${this.tabsAriaLabel || ''}"
          aria-labelledby="${this.tabsAriaLabelledby || ''}"
        >
          <slot @slotchange="${this._handleSlotChange}"></slot>
          ${this.variant === 'line'
            ? html`<div class="selection-indicator" style="transform: ${this._indicatorTransform}"></div>`
            : ''}
        </div>
        <div class="panels-container">
          <slot name="panel" @slotchange="${this._handlePanelsSlotChange}"></slot>
        </div>
      </div>
    `;
  }

  private _handleSlotChange() {
    console.log('Slot changed, tabs count:', this._tabs.length);

    // Use requestAnimationFrame to ensure DOM is updated
    requestAnimationFrame(() => {
      this._updateTabs();
      this._updateTabsAppearance();
      this._updatePanels();

      // Observe new tabs for resize changes
      this._tabs.forEach((tab) => {
        if (this._resizeObserver) {
          this._resizeObserver.observe(tab);
        }
      });

      // Update indicator after DOM changes
      this._updateIndicator();
    });
  }

  private _handlePanelsSlotChange() {
    this._updatePanels();
  }

  private _updateTabs() {
    if (!this._tabs.length) return;
    this._tabs.forEach((tab, index) => {
      // Generate unique IDs
      if (!this._tabIdMap.has(tab)) {
        this._tabIdMap.set(tab, `tab-${++this._idCounter}`);
      }
      const tabId = this._tabIdMap.get(tab)!;
      tab.id = tab.id || tabId;

      const value = tab.getAttribute('value');
      const isSelected = value === this.selected;
      const isDisabled = this.disabled || tab.hasAttribute('disabled');

      // Set ARIA attributes and selected state
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', String(isSelected));
      tab.selected = isSelected;
      tab.setAttribute('tabindex', isSelected && !isDisabled ? '0' : '-1');

      if (isDisabled) {
        tab.setAttribute('aria-disabled', 'true');
      } else {
        tab.removeAttribute('aria-disabled');
      }

      // Set aria-controls to corresponding panel
      const panel = this._findPanelByValue(value);
      if (panel) {
        if (!this._panelIdMap.has(panel)) {
          this._panelIdMap.set(panel, `panel-${++this._idCounter}`);
        }
        const panelId = this._panelIdMap.get(panel)!;
        panel.id = panel.id || panelId;
        tab.setAttribute('aria-controls', panel.id);
      }

      // Update tab state
      if (isSelected) {
        tab.classList.add('selected');
        tab.selected = true; // Set the selected property on the tab
        tab.setAttribute('selected', '');
      } else {
        tab.classList.remove('selected');
        tab.selected = false; // Unset the selected property on the tab
        tab.removeAttribute('selected');
      }

      if (isDisabled) {
        tab.classList.add('disabled');
        tab.disabled = true; // Set the disabled property on the tab
        tab.setAttribute('disabled', '');
      } else {
        tab.classList.remove('disabled');
        tab.removeAttribute('disabled');
      }

      // Apply variant styles directly
      tab.classList.toggle('line', this.variant === 'line');
      tab.classList.toggle('card', this.variant === 'card');
      tab.classList.toggle('vertical', this.direction === 'vertical');
      tab.classList.toggle('horizontal', this.direction === 'horizontal');

      // Size classes
      tab.classList.remove('sm', 'md', 'lg', 'xl');
      tab.classList.add(this.size);

      // CSS classes and attributes are now set, styles are handled by CSS
    });
  }

  private _updateIndicator() {
    if (this.variant !== 'line') return;

    // Use requestAnimationFrame to ensure DOM is updated
    requestAnimationFrame(() => {
      // Re-query the indicator to make sure we have the latest reference
      const indicator = this.shadowRoot?.querySelector('.selection-indicator') as HTMLElement;
      const tabsList = this.shadowRoot?.querySelector('#list') as HTMLElement;

      if (!indicator || !tabsList || !this._tabs.length) {
        console.log('Indicator update failed: missing elements', {
          indicator: !!indicator,
          tabsList: !!tabsList,
          tabs: this._tabs.length,
        });
        return;
      }

      const selectedTab = this._tabs.find((tab) => tab.selected);
      if (!selectedTab) {
        this._indicatorTransform = 'translateX(0) scaleX(0)';
        indicator.style.transform = this._indicatorTransform;
        return;
      }

      // Get positions relative to tabs list
      const tabsListRect = tabsList.getBoundingClientRect();
      const tabRect = selectedTab.getBoundingClientRect();

      if (this.direction === 'horizontal') {
        const translateX = tabRect.left - tabsListRect.left;
        const width = tabRect.width;
        this._indicatorTransform = `translateX(${translateX}px)`;

        // Update both transform and width
        indicator.style.transform = this._indicatorTransform;
        indicator.style.width = `${width}px`;
      } else {
        // For vertical tabs
        const translateY = tabRect.top - tabsListRect.top;
        const height = tabRect.height;
        this._indicatorTransform = `translateY(${translateY}px)`;

        // Update both transform and height
        indicator.style.transform = this._indicatorTransform;
        indicator.style.height = `${height}px`;
      }
    });
  }

  private _updateTabsAppearance() {
    // This method is now integrated into _updateTabs for better reliability
    this._updateTabs();
  }

  private _updatePanels() {
    if (!this._panels.length) return;
    this._panels.forEach((panel) => {
      const panelValue = panel.getAttribute('data-tab-value');
      const isSelected = panelValue === this.selected;

      // Set ARIA attributes
      panel.setAttribute('role', 'tabpanel');

      // Find corresponding tab
      const tab = this._tabs.find((t) => t.getAttribute('value') === panelValue);
      if (tab && tab.id) {
        panel.setAttribute('aria-labelledby', tab.id);
      }

      // Show/hide panel
      if (isSelected) {
        panel.removeAttribute('hidden');
        panel.classList.add('active');
      } else {
        panel.setAttribute('hidden', '');
        panel.classList.remove('active');
      }
    });
  }

  private _findPanelByValue(value?: string | null): HTMLElement | undefined {
    if (!value || !this._panels.length) return undefined;
    return this._panels.find((panel) => panel.getAttribute('data-tab-value') === value);
  }

  private _handleClick = (event: Event) => {
    const target = event.target as HTMLElement;

    // Find the clicked tab - check if target is a tab or inside a tab
    let clickedTab = this._tabs.find((tab) => tab === target || tab.contains(target));

    if (!clickedTab || clickedTab.disabled || this.disabled) {
      return;
    }

    const value = clickedTab.value;
    if (value && value !== this.selected) {
      console.log('Tab clicked:', value);
      this.selected = value;

      // Dispatch change event
      this.dispatchEvent(
        new CustomEvent<TabChangeDetail>('change', {
          detail: { value, tab: clickedTab },
          bubbles: true,
          composed: true,
        }),
      );
    }
  };

  private _handleTabSelect = (event: Event) => {
    const customEvent = event as CustomEvent<{ value: string }>;
    const tab = event.target as HTMLElement;

    if (tab.hasAttribute('disabled') || this.disabled) {
      event.preventDefault();
      return;
    }

    const value = customEvent.detail.value;
    const oldValue = this.selected;

    if (value !== oldValue) {
      console.log('Tab select event:', value);
      this.selected = value;

      // Dispatch change event
      this.dispatchEvent(
        new CustomEvent<TabChangeDetail>('change', {
          detail: { value, tab },
          bubbles: true,
          composed: true,
        }),
      );
    }
  };

  private _handleKeyDown = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement;
    if (target.getAttribute('role') !== 'tab' || !this._tabs.length) return;

    const currentIndex = this._tabs.indexOf(target as NteTabElement);
    if (currentIndex === -1) return;

    let nextIndex: number | undefined;
    const isVertical = this.direction === 'vertical';

    switch (event.key) {
      case 'ArrowRight':
        if (!isVertical) {
          nextIndex = this._getNextEnabledTabIndex(currentIndex, 1);
        }
        break;
      case 'ArrowLeft':
        if (!isVertical) {
          nextIndex = this._getNextEnabledTabIndex(currentIndex, -1);
        }
        break;
      case 'ArrowDown':
        if (isVertical) {
          nextIndex = this._getNextEnabledTabIndex(currentIndex, 1);
        }
        break;
      case 'ArrowUp':
        if (isVertical) {
          nextIndex = this._getNextEnabledTabIndex(currentIndex, -1);
        }
        break;
      case 'Home':
        nextIndex = this._getFirstEnabledTabIndex();
        break;
      case 'End':
        nextIndex = this._getLastEnabledTabIndex();
        break;
      default:
        return;
    }

    if (nextIndex !== undefined && nextIndex !== currentIndex) {
      event.preventDefault();
      const nextTab = this._tabs[nextIndex];

      // Focus and activate the tab (automatic activation)
      nextTab.focus();
      nextTab.click();
    }
  };

  private _getNextEnabledTabIndex(currentIndex: number, direction: 1 | -1): number | undefined {
    if (!this._tabs.length) return undefined;
    const tabsCount = this._tabs.length;
    if (tabsCount === 0) return undefined;

    let nextIndex = currentIndex;
    let attempts = 0;

    do {
      nextIndex = (nextIndex + direction + tabsCount) % tabsCount;
      attempts++;

      const tab = this._tabs[nextIndex];
      if (!tab.hasAttribute('disabled') && !this.disabled) {
        return nextIndex;
      }
    } while (attempts < tabsCount);

    return undefined;
  }

  private _getFirstEnabledTabIndex(): number | undefined {
    if (!this._tabs.length) return undefined;
    for (let i = 0; i < this._tabs.length; i++) {
      if (!this._tabs[i].hasAttribute('disabled') && !this.disabled) {
        return i;
      }
    }
    return undefined;
  }

  private _getLastEnabledTabIndex(): number | undefined {
    if (!this._tabs.length) return undefined;
    for (let i = this._tabs.length - 1; i >= 0; i--) {
      if (!this._tabs[i].hasAttribute('disabled') && !this.disabled) {
        return i;
      }
    }
    return undefined;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nte-tabs': NteTabsElement;
  }
}
