import { LoggingMixin } from '@trunkjs/browser-utils';
import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

// Styles for the light DOM
import { resetStyle } from '@nextrap/style-reset';

// Styles for your component's shadow DOM
import style from './nte-tree-node.scss?inline';

@customElement('nte-tree-node')
export class NteTreeNodeElement extends LoggingMixin(LitElement) {
  static override styles = [unsafeCSS(style), unsafeCSS(resetStyle)];

  @property({ type: Boolean, reflect: true })
  public accessor expanded = false;

  @state()
  private accessor hasChildren = false;

  override firstUpdated() {
    this.updateHasChildren();
  }

  private updateHasChildren() {
    const tagName = this.tagName.toLowerCase();
    const children = Array.from(this.children).filter((child) => child.tagName.toLowerCase() === tagName);
    this.hasChildren = children.length > 0;
  }

  private toggleExpanded() {
    if (this.hasChildren) {
      this.expanded = !this.expanded;
    }
  }

  override render() {
    const ariaExpanded = this.hasChildren ? this.expanded.toString() : undefined;

    return html`
      <div class="tree-node" role="treeitem" aria-expanded="${ariaExpanded}">
        <button
          class="tree-node-header"
          @click="${this.toggleExpanded}"
          @keydown="${this.handleKeyDown}"
          aria-expanded="${ariaExpanded}"
        >
          <div class="tree-node-toggle">
            ${this.hasChildren
              ? html`
                  <svg
                    class="toggle-icon ${classMap({ expanded: this.expanded })}"
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 4.5L6 7.5L9 4.5"
                      stroke="currentColor"
                      stroke-width="1.5"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                `
              : html`<span class="toggle-spacer" aria-hidden="true"></span>`}
          </div>

          <div class="tree-node-icon" aria-hidden="true">
            <slot name="icon"></slot>
          </div>

          <div class="tree-node-name">
            <slot name="name"></slot>
          </div>
        </button>
        <div
          class="tree-node-children ${classMap({ collapsed: !this.expanded })}"
          role="group"
          ?inert="${!this.expanded}"
        >
          <slot></slot>
        </div>
      </div>
    `;
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (!this.hasChildren) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.toggleExpanded();
        break;
      case 'ArrowRight':
        if (!this.expanded) {
          event.preventDefault();
          this.expanded = true;
        }
        break;
      case 'ArrowLeft':
        if (this.expanded) {
          event.preventDefault();
          this.expanded = false;
        }
        break;
    }
  }
}
