import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import style from './nte-multiselect-item.scss?inline';

@customElement('nte-multiselect-item')
export class NteMultiselectItemElement extends LitElement {
  static override styles = [unsafeCSS(style)];

  @property({ type: String, reflect: true })
  type: 'radio' | 'checkbox' = 'radio';

  @property({ type: String, reflect: true })
  name: string = '';

  @property({ type: String, reflect: true })
  value: string = '';

  @property({ type: Boolean, reflect: true })
  checked: boolean = false;

  @property({ type: Boolean, reflect: true })
  disabled: boolean = false;

  @property({ type: String, attribute: 'control-position', reflect: true })
  controlPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' = 'bottom-right';

  @property({ type: Boolean, attribute: 'show-controls', reflect: true })
  showControls: boolean = true;

  @state()
  private _focused: boolean = false;

  override render() {
    const classes = {
      card: true,
      checked: this.checked,
      disabled: this.disabled,
      focused: this._focused,
      [`control-${this.controlPosition}`]: true,
    };

    return html`
      <div part="card" class=${classMap(classes)} @click=${this._handleClick}>
        <div class="card-content">
          <div part="leading" class="leading">
            <slot name="leading"></slot>
          </div>

          <div part="content" class="content">
            <div part="title" class="title">
              <slot name="title"></slot>
            </div>
            <div part="value" class="value">
              <slot name="value"></slot>
            </div>
            <div part="description" class="description">
              <slot name="description"></slot>
            </div>
          </div>

          <div part="trailing" class="trailing">
            <slot name="trailing"></slot>
          </div>
        </div>

        ${this.showControls
          ? html`
              <div part="control" class="control">
                <!-- Native input - always present for accessibility, but visually hidden -->
                <input
                  type=${this.type}
                  name=${this.name}
                  .value=${this.value}
                  .checked=${this.checked}
                  ?disabled=${this.disabled}
                  @change=${this._handleInputChange}
                  @focus=${this._handleFocus}
                  @blur=${this._handleBlur}
                  aria-label=${this.value || 'Select option'}
                  class="native-input"
                />
                <!-- Custom visual control -->
                <div part="control-visual" class="control-visual ${this.type}"></div>
              </div>
            `
          : html`
              <!-- Hidden native input for functionality when controls are hidden -->
              <input
                type=${this.type}
                name=${this.name}
                .value=${this.value}
                .checked=${this.checked}
                ?disabled=${this.disabled}
                @change=${this._handleInputChange}
                @focus=${this._handleFocus}
                @blur=${this._handleBlur}
                aria-label=${this.value || 'Select option'}
                class="native-input hidden"
              />
            `}
      </div>
    `;
  }

  private _handleClick(e: Event): void {
    if (this.disabled) return;

    // Prevent double triggering if clicking directly on the input
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT') return;

    const input = this.shadowRoot?.querySelector('input') as HTMLInputElement;
    if (input) {
      input.checked = !this.checked;
      // Call _handleInputChange directly with the input element
      this._handleInputChange(input);
    }
  }

  private _handleInputChange(inputOrEvent: HTMLInputElement | Event): void {
    let input: HTMLInputElement;

    if (inputOrEvent instanceof HTMLInputElement) {
      // Called directly from _handleClick
      input = inputOrEvent;
    } else {
      // Called from actual input change event
      input = inputOrEvent.target as HTMLInputElement;
      if (!input) return;
    }

    this.checked = input.checked;

    // Dispatch custom event
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          checked: this.checked,
          value: this.value,
          name: this.name,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _handleFocus(): void {
    this._focused = true;
  }

  private _handleBlur(): void {
    this._focused = false;
  }

  // Public method to programmatically set checked state
  setChecked(checked: boolean): void {
    this.checked = checked;
    const input = this.shadowRoot?.querySelector('input') as HTMLInputElement;
    if (input) {
      input.checked = checked;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nte-multiselect-item': NteMultiselectItemElement;
  }
}
