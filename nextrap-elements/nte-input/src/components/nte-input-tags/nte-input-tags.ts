import { html, LitElement, nothing, unsafeCSS } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import style from './nte-input-tags.scss?inline';

@customElement('nte-input-tags')
export class NteInputTags extends LitElement {
  static formAssociated = true;
  static override styles = [unsafeCSS(style)];

  private internals: ElementInternals | null = null;

  @property() label = '';
  @property() name = '';
  @property() placeholder = '';
  @property() helperText = '';
  @property() invalidFeedback = '';
  @property() validFeedback = '';
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) disabled = false;
  @property({ attribute: false }) suggestionFetcher?: (query: string) => Promise<string[]>;
  @property({
    attribute: 'search-suggestions-list',
    converter: {
      fromAttribute: (value: string) => {
        if (!value) return [];
        try {
          return JSON.parse(value);
        } catch (error) {
          console.warn('Invalid JSON in search-suggestions-list:', error);
          return [];
        }
      },
      toAttribute: (value: string[]) => {
        try {
          return JSON.stringify(value);
        } catch (error) {
          console.warn('Failed to serialize search-suggestions-list:', error);
          return '[]';
        }
      },
    },
  })
  searchSuggestionsList: string[] = [];

  @property()
  value = '';

  @state() private touched = false;
  @state() private valid = false;
  @state() private invalid = false;
  @state() private selectedTags: string[] = [];
  @state() private searchSuggestions: string[] = [];
  @state() private showSuggestions = false;
  @state() private suggestionLoading = false;
  @state() private currentInput = '';

  private generatedId = `nte-input-tags-${Math.random().toString(36).slice(2, 9)}`;

  @query('input.tags-input-field')
  private inputElement!: HTMLInputElement;

  constructor() {
    super();
    if (typeof this.attachInternals === 'function') {
      this.internals = this.attachInternals();
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    if (this.id) {
      window.addEventListener(`nxa-provide-suggestion-fetcher:${this.id}`, this.handleProvideFetcher);
    }
    if (this.value) {
      this.applyInitialValue(this.value);
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    if (this.id) {
      window.removeEventListener(`nxa-provide-suggestion-fetcher:${this.id}`, this.handleProvideFetcher);
    }
  }

  override firstUpdated() {
    this.applyInitialValue(this.getAttribute('value') ?? this.value);
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has('value')) {
      const previous = changed.get('value');
      if (typeof previous === 'string' && this.value !== this.selectedTags.join(',')) {
        this.applyInitialValue(this.value);
      }
    }
  }

  public validateOnSubmit(): boolean {
    this.touched = true;
    const result = this.validate();
    this.syncHostState();
    return result;
  }

  private handleProvideFetcher = (event: Event) => {
    const customEvent = event as CustomEvent;
    if (customEvent.detail && typeof customEvent.detail.fetcher === 'function') {
      if (!this.searchSuggestionsList || this.searchSuggestionsList.length === 0) {
        this.suggestionFetcher = customEvent.detail.fetcher;
      }
    }
  };

  private applyInitialValue(rawValue: string | null) {
    if (!rawValue) {
      this.selectedTags = [];
      this.updateFormValue();
      return;
    }

    try {
      const parsed = JSON.parse(rawValue);
      if (Array.isArray(parsed)) {
        this.selectedTags = parsed.map((item) => String(item));
        this.updateFormValue();
        return;
      }
    } catch (error) {
      // Treat as delimited string below
    }

    const tags = rawValue
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    this.selectedTags = tags;
    this.updateFormValue();
  }

  private handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.currentInput = target.value;
    this.fetchSuggestions();
  }

  private handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      if (this.currentInput.trim() !== '') {
        event.preventDefault();
        this.addTag(this.currentInput.trim());
      }
    } else if (event.key === 'Backspace' && this.currentInput === '' && this.selectedTags.length > 0) {
      this.removeTag(this.selectedTags[this.selectedTags.length - 1]);
    }
  }

  private async fetchSuggestions() {
    const query = this.currentInput.trim();

    if (!query) {
      this.searchSuggestions = [];
      this.showSuggestions = false;
      return;
    }

    if (this.searchSuggestionsList && this.searchSuggestionsList.length > 0) {
      this.searchSuggestions = this.searchSuggestionsList.filter(
        (suggestion) =>
          suggestion.toLowerCase().includes(query.toLowerCase()) && !this.selectedTags.includes(suggestion),
      );
      this.showSuggestions = this.searchSuggestions.length > 0;
      return;
    }

    if (!this.suggestionFetcher) {
      this.searchSuggestions = [];
      this.showSuggestions = false;
      return;
    }

    this.suggestionLoading = true;
    this.showSuggestions = true;
    try {
      const suggestions = await this.suggestionFetcher(query);
      this.searchSuggestions = suggestions.filter((suggestion) => !this.selectedTags.includes(suggestion));
    } catch (error) {
      console.error('Failed to load tag suggestions', error);
      this.searchSuggestions = [];
    } finally {
      this.suggestionLoading = false;
      this.showSuggestions = this.searchSuggestions.length > 0;
    }
  }

  private addTag(tagValue: string) {
    if (this.disabled || tagValue.length === 0) return;
    if (this.selectedTags.includes(tagValue)) {
      this.clearInput();
      return;
    }

    this.selectedTags = [...this.selectedTags, tagValue];
    this.clearInput();
    this.touched = true;
    this.updateFormValue();
    this.syncHostState();
    this.dispatchEvent(new CustomEvent('tag-added', { detail: { value: tagValue } }));
  }

  private removeTag(tagValue: string) {
    this.selectedTags = this.selectedTags.filter((tag) => tag !== tagValue);
    this.updateFormValue();
    this.syncHostState();
    this.dispatchEvent(new CustomEvent('tag-removed', { detail: { value: tagValue } }));
  }

  private selectSuggestion(suggestion: string) {
    this.addTag(suggestion);
    this.showSuggestions = false;
  }

  private clearInput() {
    this.currentInput = '';
    if (this.inputElement) {
      this.inputElement.value = '';
    }
    this.searchSuggestions = [];
    this.showSuggestions = false;
  }

  private updateFormValue() {
    const joined = this.selectedTags.join(',');
    if (this.value !== joined) {
      this.value = joined;
    }
    if (this.internals && typeof this.internals.setFormValue === 'function') {
      this.internals.setFormValue(joined);
    }
    this.validate();
    this.syncHostState();
  }

  private validate(): boolean {
    const anchor = this.inputElement || undefined;
    if (this.required && this.selectedTags.length === 0) {
      this.valid = false;
      this.invalid = true;
      if (this.internals && typeof this.internals.setValidity === 'function') {
        this.internals.setValidity(
          { valueMissing: true },
          this.invalidFeedback || 'Please add at least one value',
          anchor,
        );
      }
      this.syncHostState();
      return false;
    }

    this.valid = true;
    this.invalid = false;
    if (this.internals && typeof this.internals.setValidity === 'function') {
      this.internals.setValidity({}, '', anchor);
    }
    this.syncHostState();
    return true;
  }

  private handleInputFocus() {
    this.showSuggestions = this.searchSuggestions.length > 0;
  }

  private handleInputBlur() {
    this.touched = true;
    this.validate();
    this.syncHostState();
    setTimeout(() => {
      this.showSuggestions = false;
      this.syncHostState();
    }, 150);
  }

  private syncHostState() {
    this.classList.toggle('touched', this.touched);
    this.classList.toggle('valid', this.valid);
    this.classList.toggle('invalid', this.invalid);
  }

  override render() {
    const uniqueId = this.id || this.generatedId;
    const hasHelper = Boolean(this.helperText);

    return html`
      ${this.label
        ? html`<label class="form-label" for="${uniqueId}">
            ${this.label}${this.required ? html`<span class="required-indicator">*</span>` : nothing}
          </label>`
        : nothing}
      <div class="tags-input-wrapper" part="wrapper">
        <div class="pills-and-input" part="pills">
          ${this.selectedTags.map(
            (tag) =>
              html`<span class="pill" part="pill">
                ${tag}
                <button
                  class="remove-pill"
                  type="button"
                  ?disabled=${this.disabled}
                  @click=${() => this.removeTag(tag)}
                  aria-label="Remove ${tag}"
                >
                  ×
                </button>
              </span>`,
          )}
          <input
            id="${uniqueId}"
            class="tags-input-field"
            type="text"
            part="input"
            .value=${this.currentInput}
            name=${this.name}
            ?disabled=${this.disabled}
            placeholder=${this.placeholder}
            @input=${this.handleInput}
            @keydown=${this.handleKeydown}
            @focus=${this.handleInputFocus}
            @blur=${this.handleInputBlur}
            autocomplete="off"
          />
        </div>
        ${this.showSuggestions
          ? html`<div class="suggestions-container" part="suggestions">
              ${this.suggestionLoading ? html`<div class="suggestion-item loading">Loading...</div>` : nothing}
              ${this.searchSuggestions.map(
                (suggestion) =>
                  html`<div class="suggestion-item" @mousedown=${() => this.selectSuggestion(suggestion)}>
                    ${suggestion}
                  </div>`,
              )}
            </div>`
          : nothing}
      </div>
      ${hasHelper ? html`<div class="form-text">${this.helperText}</div>` : nothing}
      ${this.invalidFeedback ? html`<div class="invalid-feedback">${this.invalidFeedback}</div>` : nothing}
      ${this.validFeedback ? html`<div class="valid-feedback">${this.validFeedback}</div>` : nothing}
    `;
  }
}
