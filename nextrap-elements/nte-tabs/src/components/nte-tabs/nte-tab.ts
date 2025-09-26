import { resetStyle } from '@nextrap/style-reset';
import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import style from './nte-tab.scss?inline';

@customElement('nte-tab')
export class NteTabElement extends LitElement {
  static override styles = [unsafeCSS(style), unsafeCSS(resetStyle)];

  @property({ type: String, reflect: true })
  accessor value: string = '';

  @property({ type: String })
  accessor label: string = '';

  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  @property({ type: Boolean, reflect: true })
  accessor selected = false;

  override connectedCallback() {
    super.connectedCallback();
    // Set role attribute
    this.setAttribute('role', 'tab');
    this.addEventListener('click', this._handleClick);
    this.addEventListener('keydown', this._handleKeyDown);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this._handleClick);
    this.removeEventListener('keydown', this._handleKeyDown);
  }

  protected override updated(changedProperties: Map<string, any>) {
    super.updated(changedProperties);

    // Update aria-selected based on selected property
    if (changedProperties.has('selected')) {
      this.setAttribute('aria-selected', String(this.selected));
    }
  }

  override render() {
    return html`
      <div class="tab-content">
        <slot name="icon" class="tab-icon"></slot>
        <span class="tab-label">
          <slot></slot>
        </span>
        <slot name="action" class="tab-action"></slot>
      </div>
    `;
  }

  private _handleClick = (event: Event) => {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    // Dispatch custom event for parent tabs component
    this.dispatchEvent(
      new CustomEvent('tab-select', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  };

  private _handleKeyDown = (event: KeyboardEvent) => {
    // Space or Enter should activate the tab
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this._handleClick(event);
    }
  };

  override focus() {
    super.focus();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nte-tab': NteTabElement;
  }
}
