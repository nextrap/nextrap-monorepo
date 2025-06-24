import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styleInput } from './style-form-input';

type SelectOption =
  | {
      key?: string;
      value: string;
    }
  | {
      [key: string]: string;
    }
  | string;

@customElement('nxa-form-input')
export class NxaFormInput extends LitElement {
  static formAssociated = true;
  static override styles = styleInput;

  private internals: ElementInternals;
  @property() label = '';
  @property() name = '';
  @property() type = 'text';
  @property() size: 'sm' | 'md' | 'lg' = 'md';
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) floating = false;
  @property({ type: Boolean }) inline = false;
  @property() helperText = '';
  @property() switchStyle: 'classic' | 'modern' = 'classic';
  @property({ type: Boolean, reflect: true }) modern = false;
  @property() invalidFeedback = '';
  @property() validFeedback = '';
  @property({ attribute: false }) // For programmatic assignment if needed
  suggestionFetcher?: (query: string) => Promise<string[]>;
  @property({
    // New property for static list of suggestions
    attribute: 'search-suggestions-list',
    converter: {
      fromAttribute: (value: string) => {
        if (!value) return [];
        try {
          return JSON.parse(value);
        } catch (e) {
          console.warn('Invalid JSON in search-suggestions-list:', e);
          return [];
        }
      },
      toAttribute: (value: string[]) => {
        try {
          return JSON.stringify(value);
        } catch (e) {
          return '[]';
        }
      },
    },
  })
  searchSuggestionsList: string[] = [];

  @property({
    attribute: 'select-options',
    converter: {
      fromAttribute: (value: string) => {
        if (!value) return [];
        try {
          return JSON.parse(value);
        } catch (e) {
          console.warn('Invalid JSON in select-options:', e);
          return [];
        }
      },
      toAttribute: (value: SelectOption[]) => {
        try {
          return JSON.stringify(value);
        } catch (e) {
          return '[]';
        }
      },
    },
  })
  selectOptions: SelectOption[] = [];

  @state() private touched = false;
  @state() private valid = false;
  @state() private invalid = false;
  @state() private isEmpty = true;
  @state() private selectedPills: string[] = [];
  @state() private searchSuggestions: string[] = [];
  @state() private showSuggestions = false;
  @state() private suggestionLoading = false;

  private input:
    | HTMLInputElement
    | HTMLSelectElement
    | HTMLTextAreaElement
    | null = null;

  constructor() {
    super();
    this.internals = this.attachInternals();
  }

  get inputElement():
    | HTMLInputElement
    | HTMLSelectElement
    | HTMLTextAreaElement
    | null {
    return this.input;
  }

  public validateOnSubmit(): boolean {
    if (!this.input) return false;
    this.touched = true;
    if (this.type === 'search') {
      // TODO: Define validation for search/pill input if needed
      return true;
    }
    return this._validate(this.input as HTMLInputElement | HTMLSelectElement);
  }

  private updateFloatingState(
    input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  ) {
    if (!this.floating || this.type === 'search') return;

    const floatingDiv = this.shadowRoot?.querySelector('.form-floating');
    if (floatingDiv) {
      if (input.value) {
        floatingDiv.classList.add('has-value');
      } else {
        floatingDiv.classList.remove('has-value');
      }
    }
  }

  override createRenderRoot() {
    const root = super.createRenderRoot();
    root.addEventListener('click', (e) => {
      const label = e.target as HTMLLabelElement;
      if (label.tagName === 'LABEL') {
        const slot = this.shadowRoot?.querySelector(
          'slot[name="input"]'
        ) as HTMLSlotElement;
        if (slot) {
          const elements = slot.assignedElements();
          const input = elements[0] as
            | HTMLInputElement
            | HTMLSelectElement
            | HTMLTextAreaElement;
          if (input) {
            input.focus();
            if (
              input instanceof HTMLInputElement &&
              (input.type === 'checkbox' || input.type === 'radio')
            ) {
              input.click();
            }
          }
        }
      }
    });
    return root;
  }

  override connectedCallback() {
    super.connectedCallback();
    // Event listener for fetcher can remain for advanced use cases,
    // but local list will take precedence if provided.
    if (this.id) {
      // Ensure ID is present for event listener
      window.addEventListener(
        `nxa-provide-suggestion-fetcher:\${this.id}`,
        this._handleProvideFetcherEvent
      );
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    if (this.id) {
      window.removeEventListener(
        `nxa-provide-suggestion-fetcher:\${this.id}`,
        this._handleProvideFetcherEvent
      );
    }
  }

  private _handleProvideFetcherEvent = (event: Event) => {
    const customEvent = event as CustomEvent;
    if (
      customEvent.detail &&
      typeof customEvent.detail.fetcher === 'function'
    ) {
      // Only set if searchSuggestionsList is not being used
      if (
        !this.searchSuggestionsList ||
        this.searchSuggestionsList.length === 0
      ) {
        this.suggestionFetcher = customEvent.detail.fetcher;
        console.log(
          `[NxaFormInput] Received suggestionFetcher via event for ID: \${this.id}`,
          this.suggestionFetcher
        );
      } else {
        console.log(
          `[NxaFormInput] Ignored suggestionFetcher via event due to presence of searchSuggestionsList for ID: \${this.id}`
        );
      }
    }
  };

  override firstUpdated() {
    const slot = this.shadowRoot?.querySelector(
      'slot[name="input"]'
    ) as HTMLSlotElement;
    if (slot) {
      slot.addEventListener('slotchange', () => {
        const elements = slot.assignedElements();
        this.input = elements[0] as
          | HTMLInputElement
          | HTMLSelectElement
          | HTMLTextAreaElement;
        if (this.input) {
          this.input.id = this._uniqueId;
          this.required = this.input.hasAttribute('required');
          this.name = this.input.getAttribute('name') || this.name;

          const componentUIType = this.type;

          if (this.input instanceof HTMLInputElement) {
            if (componentUIType === 'search') {
              this.input.addEventListener('keydown', (e: KeyboardEvent) =>
                this._handleSearchInputKeydown(e)
              );
              console.log('[NxaFormInput] Attaching input listener for search');
              this.input.addEventListener('input', () =>
                this._handleSearchInputChange()
              );
              console.log('[NxaFormInput] Attaching focus listener for search');
              this.input.addEventListener('focus', () =>
                this._fetchSuggestions()
              );
              this.input.addEventListener('blur', () => {
                setTimeout(() => {
                  this.showSuggestions = false;
                }, 150);
              });
            } else if (componentUIType === 'radio') {
              const groupName = this.input.getAttribute('name');
              if (groupName) {
                this.input.addEventListener('change', () => {
                  const form = this.input?.closest('form');
                  const allGroupRadios = form
                    ? form.querySelectorAll(`input[name="${groupName}"]`)
                    : document.querySelectorAll(`input[name="${groupName}"]`);
                  allGroupRadios.forEach((radio) => {
                    const radioInput = radio as HTMLInputElement;
                    const radioComponent = radio.closest('nxa-form-input');
                    if (radioComponent) {
                      (radioComponent as NxaFormInput)._validate(radioInput);
                    }
                  });
                });
              }
            } else {
              // Default event listeners for other HTMLInputElement types (text, email, password, etc.)
              // Check actual input type to avoid adding listeners to types like 'checkbox' here,
              // as they are often handled by 'change' more appropriately.
              const actualInputType = this.input.type;
              if (
                ![
                  'checkbox',
                  'file',
                  'button',
                  'submit',
                  'reset',
                  'image',
                ].includes(actualInputType)
              ) {
                this.input.addEventListener('input', (e) => {
                  this._handleInput(e);
                  this.updateFloatingState(this.input!);
                });
                this.input.addEventListener('blur', (e) => this._handleBlur(e));
              }
              // Add change listener for types like checkbox, or if component type implies it
              if (
                actualInputType === 'checkbox' ||
                componentUIType === 'checkbox' ||
                componentUIType === 'file'
              ) {
                this.input.addEventListener('change', (e) =>
                  this._handleInput(e)
                );
              }
            }
          } else if (this.input instanceof HTMLSelectElement) {
            // Event listeners for HTMLSelectElement
            this.input.addEventListener('change', (e) => this._handleInput(e));
            this.input.addEventListener('blur', (e) => this._handleBlur(e)); // Optional for select
            if (this.selectOptions.length > 0) {
              this.updateSelectOptions(this.input);
            }
          } else if (this.input instanceof HTMLTextAreaElement) {
            // Event listeners for HTMLTextAreaElement (similar to text inputs)
            this.input.addEventListener('input', (e) => {
              this._handleInput(e);
              this.updateFloatingState(this.input!);
            });
            this.input.addEventListener('blur', (e) => this._handleBlur(e));
          }

          // Initial validation for non-search types if there's a value
          if (this.input.value && componentUIType !== 'search') {
            this._validate(this.input as HTMLInputElement | HTMLSelectElement);
            this.updateFloatingState(this.input);
          }
        }
      });
    }
  }

  private updateSelectOptions(select: HTMLSelectElement) {
    select.innerHTML = '';
    if (!this.selectOptions || !Array.isArray(this.selectOptions)) {
      console.warn('selectOptions is not an array:', this.selectOptions);
      return;
    }
    this.selectOptions.forEach((option) => {
      const optionElement = document.createElement('option');
      if (typeof option === 'string') {
        optionElement.value = option;
        optionElement.textContent = option;
      } else if ('key' in option && 'value' in option) {
        optionElement.value = option.key ?? '';
        optionElement.textContent = option.value;
      } else {
        const entries = Object.entries(option);
        if (entries.length === 1) {
          const [key, value] = entries[0];
          optionElement.value = key;
          optionElement.textContent = value;
        }
      }
      select.appendChild(optionElement);
    });
  }

  override updated(changedProperties: Map<string, any>) {
    super.updated(changedProperties);
    if (changedProperties.has('selectOptions')) {
      if (this.input instanceof HTMLSelectElement) {
        this.updateSelectOptions(this.input);
      }
    }
  }

  private _handleInput(e: Event) {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    this.isEmpty = !target.value;
    this._validate(target);
  }

  private _handleBlur(e: Event) {
    this.touched = true;
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    this._validate(target);
  }

  private _validate(input: HTMLInputElement | HTMLSelectElement): boolean {
    if (!input || this.type === 'search') return true;

    if (this.type === 'range') {
      this.valid = true;
      this.invalid = false;
      this.style.setProperty('--show-valid-feedback', 'none');
      this.style.setProperty('--show-invalid-feedback', 'none');
      return true;
    }

    if (
      input instanceof HTMLInputElement &&
      (this.type === 'checkbox' || this.type === 'radio')
    ) {
      if (this.type === 'radio') {
        if (this.required && this.touched) {
          const groupName = input.getAttribute('name');
          if (!groupName) return false;
          const form = input.closest('form');
          const isGroupValid = form
            ? form.querySelector(`input[name="${groupName}"]:checked`) !== null
            : document.querySelector(`input[name="${groupName}"]:checked`) !==
              null;
          this.valid = isGroupValid;
          this.invalid = !isGroupValid;
          if (!isGroupValid) {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
            this.style.setProperty('--show-valid-feedback', 'none');
            this.style.setProperty('--show-invalid-feedback', 'block');
          } else {
            input.classList.remove('is-invalid', 'is-valid');
            this.style.setProperty('--show-valid-feedback', 'none');
            this.style.setProperty('--show-invalid-feedback', 'none');
          }
        } else {
          input.classList.remove('is-invalid', 'is-valid');
          this.style.setProperty('--show-valid-feedback', 'none');
          this.style.setProperty('--show-invalid-feedback', 'none');
        }
      } else {
        if (this.required) {
          this.valid = input.checked;
          this.invalid = !input.checked;
          if (this.touched) {
            if (this.valid) {
              input.classList.remove('is-invalid');
              input.classList.add('is-valid');
              this.style.setProperty('--show-valid-feedback', 'block');
              this.style.setProperty('--show-invalid-feedback', 'none');
            } else {
              input.classList.add('is-invalid');
              input.classList.remove('is-valid');
              this.style.setProperty('--show-valid-feedback', 'none');
              this.style.setProperty('--show-invalid-feedback', 'block');
            }
          }
        } else {
          input.classList.remove('is-invalid');
          this.valid = true;
          this.invalid = false;
          this.style.setProperty('--show-valid-feedback', 'none');
          this.style.setProperty('--show-invalid-feedback', 'none');
        }
      }
      return this.valid;
    }

    this.isEmpty = !input.value;
    if (this.required && this.isEmpty) {
      this.valid = false;
      this.invalid = true;
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
      this.style.setProperty('--show-valid-feedback', 'none');
      this.style.setProperty('--show-invalid-feedback', 'block');
      return false;
    }

    if (!this.required && this.isEmpty) {
      this.valid = false;
      this.invalid = false;
      input.classList.remove('is-valid', 'is-invalid');
      this.style.setProperty('--show-valid-feedback', 'none');
      this.style.setProperty('--show-invalid-feedback', 'none');
      return true;
    }

    this.valid = input.checkValidity();
    this.invalid = !this.valid;

    if (this.valid) {
      input.classList.add('is-valid');
      input.classList.remove('is-invalid');
      this.style.setProperty('--show-valid-feedback', 'block');
      this.style.setProperty('--show-invalid-feedback', 'none');
    } else {
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
      this.style.setProperty('--show-valid-feedback', 'none');
      this.style.setProperty('--show-invalid-feedback', 'block');
    }
    return this.valid;
  }

  override render() {
    if (!this.hasChildNodes()) {
      const inputElement = document.createElement('input');
      const copyVals = [
        'name',
        'type',
        'value',
        'placeholder',
        'required',
        'min',
        'max',
        'step',
        'pattern',
        'autocomplete',
        'autofocus',
        'disabled',
        'readonly',
        'size',
        'maxlength',
        'minlength',
        'multiple',
        'accept',
        'inputmode',
        'list',
        'form',
        'formaction',
        'formenctype',
        'formmethod',
        'formnovalidate',
        'formtarget',
      ];
      copyVals.forEach((val) => {
        const attrValue = this.getAttribute(val);
        if (this.hasAttribute(val) && attrValue !== null) {
          inputElement.setAttribute(val, attrValue);
        }
      });
      inputElement.setAttribute('slot', 'input');
      if (this.type === 'checkbox' || this.type === 'radio') {
        inputElement.classList.add('form-check-input');
      } else if (this.type === 'search') {
        // For search, we might want a different default class or no specific class if handled by slot
        inputElement.type = 'text'; // Default underlying input to text for search
        inputElement.classList.add('form-control'); // Add form-control for search inputs
      } else {
        inputElement.classList.add('form-control');
      }
      this.appendChild(inputElement);
    }

    const uniqueId = this._uniqueId;

    if (this.type === 'checkbox' || this.type === 'radio') {
      return html`
        <div
          class="form-check ${this.switchStyle === 'modern'
            ? 'form-switch'
            : ''}"
        >
          <slot name="input"></slot>
          <label class="form-check-label" for="${uniqueId}">
            ${this.label}${this.required
              ? html`<span class="required-indicator">*</span>`
              : ''}
          </label>
          ${this.helperText
            ? html` <div class="form-text">${this.helperText}</div> `
            : ''}
          ${this.invalidFeedback !== ''
            ? html`
                <div class="invalid-feedback">${this.invalidFeedback}</div>
              `
            : ''}
        </div>
      `;
    } else if (this.type === 'search') {
      return html`
        ${this.label
          ? html`
              <label class="form-label" for="${this._uniqueId}">
                ${this.label}${this.required
                  ? html`<span class="required-indicator">*</span>`
                  : ''}
              </label>
            `
          : ''}
        <div class="search-input-wrapper">
          <div class="pills-and-input-container">
            ${this.selectedPills.map(
              (pill) => html`
                <span class="pill">
                  ${pill}
                  <button
                    class="remove-pill"
                    @click=${() => this._removePill(pill)}
                  >
                    ×
                  </button>
                </span>
              `
            )}
            <slot name="input"></slot>
          </div>
          ${this.showSuggestions &&
          (this.searchSuggestions.length > 0 || this.suggestionLoading)
            ? html` <div class="suggestions-container">
                ${this.suggestionLoading
                  ? html`<div class="suggestion-item loading">Loading...</div>`
                  : ''}
                ${this.searchSuggestions.map(
                  (suggestion) => html`
                    <div
                      class="suggestion-item"
                      @mousedown=${() => this._selectSuggestion(suggestion)}
                    >
                      ${suggestion}
                    </div>
                  `
                )}
              </div>`
            : ''}
        </div>
        ${this.helperText
          ? html`<div class="form-text">${this.helperText}</div>`
          : ''}
        ${this.invalidFeedback !== ''
          ? html`<div class="invalid-feedback">${this.invalidFeedback}</div>`
          : ''}
        ${this.validFeedback !== ''
          ? html`<div class="valid-feedback">${this.validFeedback}</div>`
          : ''}
      `;
    } else if (!this.floating) {
      const content = html`
        <slot name="input"></slot>
        ${this.helperText
          ? html` <div class="form-text">${this.helperText}</div> `
          : ''}
        ${this.invalidFeedback !== ''
          ? html` <div class="invalid-feedback">${this.invalidFeedback}</div> `
          : ''}
        ${this.validFeedback !== ''
          ? html` <div class="valid-feedback">${this.validFeedback}</div> `
          : ''}
      `;

      if (this.inline) {
        return html`
          <div class="form-inline">
            ${this.label
              ? html`
                  <label class="form-label" for="${uniqueId}">
                    ${this.label}${this.required
                      ? html`<span class="required-indicator">*</span>`
                      : ''}
                  </label>
                `
              : ''}
            <div class="input-wrapper">${content}</div>
          </div>
        `;
      } else {
        return html`
          ${this.label
            ? html`
                <label class="form-label" for="${uniqueId}">
                  ${this.label}${this.required
                    ? html`<span class="required-indicator">*</span>`
                    : ''}
                </label>
              `
            : ''}
          ${content}
        `;
      }
    } else {
      // Floating label
      return html`
        <div class="form-floating ${this.isEmpty ? '' : 'has-value'}">
          <slot name="input"></slot>
          <label class="form-label ${this.size}" for="${uniqueId}">
            ${this.label}${this.required
              ? html`<span class="required-indicator">*</span>`
              : ''}
          </label>
          ${this.helperText
            ? html` <div class="form-text">${this.helperText}</div> `
            : ''}
          ${this.invalidFeedback !== ''
            ? html`
                <div class="invalid-feedback">${this.invalidFeedback}</div>
              `
            : ''}
          ${this.validFeedback !== ''
            ? html` <div class="valid-feedback">${this.validFeedback}</div> `
            : ''}
        </div>
      `;
    }
  }

  private async _fetchSuggestions() {
    if (
      this.type !== 'search' ||
      !this.input ||
      !(this.input instanceof HTMLInputElement)
    )
      return;
    const query = this.input.value.trim();

    // Prioritize searchSuggestionsList if available and query matches
    if (this.searchSuggestionsList && this.searchSuggestionsList.length > 0) {
      this.searchSuggestions = this.searchSuggestionsList.filter(
        (s) =>
          s.toLowerCase().includes(query.toLowerCase()) &&
          !this.selectedPills.includes(s)
      );
      this.showSuggestions = this.searchSuggestions.length > 0;
      return;
    }

    // Fallback to suggestionFetcher if no static list or no matches from static list
    if (!this.suggestionFetcher) {
      this.showSuggestions = false;
      return;
    }

    this.suggestionLoading = true;
    this.showSuggestions = true;
    try {
      const suggestions = await this.suggestionFetcher(query);
      this.searchSuggestions = suggestions.filter(
        (s) => !this.selectedPills.includes(s)
      );
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      this.searchSuggestions = [];
    } finally {
      this.suggestionLoading = false;
      // Keep suggestions visible if there are any, otherwise hide
      this.showSuggestions =
        this.searchSuggestions.length > 0 || this.suggestionLoading;
    }
  }

  private _handleSearchInputChange() {
    if (
      this.type !== 'search' ||
      !this.input ||
      !(this.input instanceof HTMLInputElement)
    )
      return;
    this._fetchSuggestions();
  }

  private _selectSuggestion(suggestion: string) {
    if (
      this.type !== 'search' ||
      !this.input ||
      !(this.input instanceof HTMLInputElement)
    )
      return;
    if (!this.selectedPills.includes(suggestion)) {
      this.selectedPills = [...this.selectedPills, suggestion];
      this.input.value = ''; // Clear input after selection
      this.searchSuggestions = []; // Clear suggestions
      this.showSuggestions = false;
      this.requestUpdate();
      // Optionally, dispatch an event or update form value here
    }
  }

  private _handleSearchInputKeydown(e: KeyboardEvent) {
    if (
      this.type !== 'search' ||
      !this.input ||
      !(this.input instanceof HTMLInputElement)
    )
      return;
    if (e.key === 'Enter' && this.input.value.trim() !== '') {
      e.preventDefault();
      this._selectSuggestion(this.input.value.trim());
    }
  }

  private _removePill(pillValue: string) {
    this.selectedPills = this.selectedPills.filter(
      (pill) => pill !== pillValue
    );
    this.requestUpdate();
    // Optionally, dispatch an event or update form value here
  }

  private _generatedId = `nxa-form-input-${Math.random()
    .toString(36)
    .substring(2, 9)}`;

  private get _uniqueId() {
    return this.id || this._generatedId;
  }
}
