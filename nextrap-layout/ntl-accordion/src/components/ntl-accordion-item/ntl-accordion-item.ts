import { LoggingMixin } from '@trunkjs/browser-utils';
import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { resetStyle } from '@nextrap/style-reset';
import { SubLayoutApplyMixin } from '@trunkjs/content-pane';
import style from './ntl-accordion-item.scss?inline';

@customElement('ntl-accordion-item')
export class NtlAccordionItemElement extends SubLayoutApplyMixin(LoggingMixin(LitElement)) {
  static override styles = [unsafeCSS(style), unsafeCSS(resetStyle)];

  @property({ type: Boolean, reflect: true })
  public accessor open = false;

  @property({ type: String, reflect: true, attribute: 'marker-position' })
  public accessor markerPosition: 'start' | 'end' = 'end';

  @property({ type: String, reflect: true, attribute: 'marker-icon' })
  public accessor markerIcon: 'chevron' | 'plus' | null = null;

  private _detailsElement: HTMLDetailsElement | null = null;

  override connectedCallback() {
    super.connectedCallback();

    // Delay reading marker-icon to ensure parent is fully initialized
    // This is needed because SubLayoutApplyMixin creates elements dynamically
    if (!this.hasAttribute('marker-icon')) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!this.markerIcon) {
            this._readMarkerIconFromHost();
          }
        });
      });
    }
  }

  override firstUpdated() {
    this._detailsElement = this.shadowRoot?.querySelector('details') ?? null;

    if (this._detailsElement) {
      this._detailsElement.open = this.open;
    }

    // Listen for slotchange to read CSS variable from slotted elements
    const titleSlot = this.shadowRoot?.querySelector('slot[name="title"]') as HTMLSlotElement | null;
    titleSlot?.addEventListener('slotchange', () => this._onTitleSlotChange());
  }

  private _onTitleSlotChange() {
    // Skip if marker-icon is already set via attribute
    if (this.hasAttribute('marker-icon')) return;

    const titleSlot = this.shadowRoot?.querySelector('slot[name="title"]') as HTMLSlotElement | null;
    const slottedElements = titleSlot?.assignedElements({ flatten: true }) ?? [];

    for (const el of slottedElements) {
      const value = this._extractMarkerIcon(el as HTMLElement);
      if (value) {
        this.markerIcon = value;
        return;
      }
    }
  }

  private _readMarkerIconFromHost() {
    // Check this element first
    let value = this._extractMarkerIcon(this);

    // If not found, traverse up the DOM tree to find ntl-accordion or any element with --marker-icon
    if (!value) {
      let parent: HTMLElement | null = this.parentElement;
      while (parent && !value) {
        value = this._extractMarkerIcon(parent);
        parent = parent.parentElement;
      }
    }

    // Also check shadow DOM host if we're slotted
    if (!value) {
      const rootNode = this.getRootNode();
      if (rootNode instanceof ShadowRoot && rootNode.host) {
        value = this._extractMarkerIcon(rootNode.host as HTMLElement);
      }
    }

    if (value) {
      this.markerIcon = value;
    }
  }

  private _extractMarkerIcon(el: HTMLElement): 'chevron' | 'plus' | null {
    // First try inline style attribute (for CSS custom properties)
    const styleAttr = el.getAttribute('style') || '';
    const match = styleAttr.match(/--marker-icon\s*:\s*['"]?(plus|chevron)['"]?/);
    if (match) {
      return match[1] as 'chevron' | 'plus';
    }

    // Fallback to computed style
    const computed = getComputedStyle(el).getPropertyValue('--marker-icon').trim().replace(/["']/g, '');
    if (computed === 'plus' || computed === 'chevron') {
      return computed as 'chevron' | 'plus';
    }

    return null;
  }

  override updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties);
    if (changedProperties.has('open') && this._detailsElement) {
      this._detailsElement.open = this.open;
    }
  }

  private _onToggle(e: Event) {
    const details = e.target as HTMLDetailsElement;
    this.open = details.open;

    this.dispatchEvent(
      new CustomEvent('accordion-toggle', {
        detail: { open: this.open },
        bubbles: true,
        composed: true,
      }),
    );
  }

  override render() {
    return html`
      <details @toggle="${this._onToggle}">
        <summary class="summary" part="summary">
          <span class="title">
            <slot name="title" data-query=":scope > h1,h2,h3,h4,h5,h6"></slot>
          </span>
          <span class="marker" part="marker"></span>
        </summary>
        <div class="content" part="content">
          <slot></slot>
        </div>
      </details>
    `;
  }
}
