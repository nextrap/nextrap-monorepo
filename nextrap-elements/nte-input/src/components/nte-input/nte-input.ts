import { css, html, LitElement, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import style from './nte-input.scss?inline';

const inputStyles = css`
  ${unsafeCSS(style)}
`;

type SelectOption =
  | {
      key?: string;
      value: string;
    }
  | {
      [key: string]: string;
    }
  | string;

type SupportedElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

@customElement('nte-input')
export class NteInput extends LitElement {
  static formAssociated = true;

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
  @property({ type: Boolean, attribute: 'data-controlled' }) controlled = false;
  @property({
    attribute: 'select-options',
    converter: {
      fromAttribute: (value: string) => {
        if (!value) return [];
        try {
          return JSON.parse(value);
        } catch (error) {
          console.warn('Invalid JSON in select-options:', error);
          return [];
        }
      },
      toAttribute: (value: SelectOption[]) => {
        try {
          return JSON.stringify(value);
        } catch (error) {
          console.warn('Failed to serialize select-options:', error);
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

  private input: SupportedElement | null = null;

  constructor() {
    super();
  }

  get inputElement(): SupportedElement | null {
    return this.input;
  }

  public validateOnSubmit(): boolean {
    if (!this.input) return false;
    this.touched = true;
    const result = this._validate(this.input);
    this.syncHostState();
    return result;
  }

  override firstUpdated() {
    const slot = this.shadowRoot?.querySelector('slot[name="input"]') as HTMLSlotElement | undefined;
    slot?.addEventListener('slotchange', () => this.hydrateSlottedElement(slot));
    if (slot) {
      this.hydrateSlottedElement(slot);
    }
  }

  override updated(changed: Map<string, unknown>) {
    super.updated(changed);
    if (changed.has('selectOptions') && this.input instanceof HTMLSelectElement) {
      this.updateSelectOptions(this.input);
    }
  }

  private hydrateSlottedElement(slot: HTMLSlotElement) {
    const slotted = slot.assignedElements()[0] as SupportedElement | undefined;
    if (!slotted) return;

    this.input = slotted;
    this.input.id = this._uniqueId;
    this.required = this.input.hasAttribute('required');
    this.name = this.input.getAttribute('name') || this.name;

    if (this.input instanceof HTMLInputElement) {
      this.bindInputElement(this.input);
    } else if (this.input instanceof HTMLSelectElement) {
      this.bindSelectElement(this.input);
    } else if (this.input instanceof HTMLTextAreaElement) {
      this.bindTextAreaElement(this.input);
    }

    if (this.input.value) {
      this._validate(this.input);
    }
  }

  private bindInputElement(input: HTMLInputElement) {
    const uiType = this.type || input.type;

    if (!['checkbox', 'radio'].includes(uiType)) {
      input.addEventListener('input', (event) => {
        this._handleInput(event);
      });
      input.addEventListener('blur', (event) => this._handleBlur(event));
    }

    if (uiType === 'checkbox' || uiType === 'file' || input.type === 'checkbox') {
      input.addEventListener('change', (event) => this._handleInput(event));
    }

    if (uiType === 'radio') {
      const groupName = input.getAttribute('name');
      if (groupName) {
        input.addEventListener('change', () => this.syncRadioGroup(groupName));
      }
    }
  }

  private bindSelectElement(select: HTMLSelectElement) {
    select.addEventListener('change', (event) => {
      this._handleInput(event);
    });
    select.addEventListener('blur', (event) => this._handleBlur(event));
    if (this.selectOptions.length > 0) {
      this.updateSelectOptions(select);
    }
  }

  private bindTextAreaElement(textarea: HTMLTextAreaElement) {
    textarea.addEventListener('input', (event) => {
      this._handleInput(event);
    });
    textarea.addEventListener('blur', (event) => this._handleBlur(event));
  }

  private syncRadioGroup(groupName: string) {
    const form = this.input?.closest('form');
    const radios = form
      ? form.querySelectorAll(`input[name="${groupName}"]`)
      : document.querySelectorAll(`input[name="${groupName}"]`);

    radios.forEach((radio) => {
      const radioInput = radio as HTMLInputElement;
      const parentComponent = radioInput.closest('nte-input') as NteInput | null;
      parentComponent?._validate(radioInput);
    });
  }

  private updateSelectOptions(select: HTMLSelectElement) {
    select.innerHTML = '';
    if (!Array.isArray(this.selectOptions)) return;

    this.selectOptions.forEach((option) => {
      const optionElement = document.createElement('option');
      if (typeof option === 'string') {
        optionElement.value = option;
        optionElement.textContent = option;
      } else if ('key' in option && 'value' in option) {
        optionElement.value = option.key ?? '';
        optionElement.textContent = option.value;
      } else {
        const [entry] = Object.entries(option);
        if (entry) {
          const [key, value] = entry;
          optionElement.value = key;
          optionElement.textContent = value;
        }
      }
      select.appendChild(optionElement);
    });
  }

  private _handleInput(event: Event) {
    const target = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    this.isEmpty = !target.value;
    this._validate(target);
  }

  private _handleBlur(event: Event) {
    this.touched = true;
    const target = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    this._validate(target);
    this.syncHostState();
  }

  private _validate(input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): boolean {
    if (!input) return false;

    if (this.type === 'range') {
      this.valid = true;
      this.invalid = false;
      return true;
    }

    if (input instanceof HTMLInputElement && (this.type === 'checkbox' || this.type === 'radio')) {
      if (this.type === 'radio') {
        if (this.required && this.touched) {
          const groupName = input.getAttribute('name');
          if (!groupName) return false;

          const form = input.closest('form');
          const isGroupValid = form
            ? form.querySelector(`input[name="${groupName}"]:checked`) !== null
            : document.querySelector(`input[name="${groupName}"]:checked`) !== null;

          this.valid = isGroupValid;
          this.invalid = !isGroupValid;

          if (!isGroupValid) {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
          } else {
            input.classList.remove('is-invalid', 'is-valid');
          }
        } else {
          input.classList.remove('is-invalid', 'is-valid');
        }
      } else {
        if (this.required) {
          this.valid = input.checked;
          this.invalid = !input.checked;
          if (this.touched) {
            if (this.valid) {
              input.classList.remove('is-invalid');
              input.classList.add('is-valid');
            } else {
              input.classList.add('is-invalid');
              input.classList.remove('is-valid');
            }
          }
        } else {
          input.classList.remove('is-invalid');
          this.valid = true;
          this.invalid = false;
        }
      }
      this.syncHostState();
      return this.valid;
    }

    this.isEmpty = !input.value;

    if (this.required && this.isEmpty) {
      this.valid = false;
      this.invalid = true;
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
      this.syncHostState();
      return false;
    }

    if (!this.required && this.isEmpty) {
      this.valid = false;
      this.invalid = false;
      input.classList.remove('is-valid', 'is-invalid');
      this.syncHostState();
      return true;
    }

    this.valid = input.checkValidity();
    this.invalid = !this.valid;

    if (this.valid) {
      input.classList.add('is-valid');
      input.classList.remove('is-invalid');
    } else {
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
    }

    this.syncHostState();
    return this.valid;
  }

  override render() {
    if (!this.hasChildNodes()) {
      const element = this.createNativeControl();
      this.appendChild(element);
    }

    return html`
      <style>
        ${this.controlled
          ? inputStyles
          : css`
              :host {
                display: block;
              }
            `}
      </style>
      <slot name="input"></slot>
    `;
  }

  private createNativeControl(): SupportedElement {
    const attributesToMirror = [
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
      'rows',
      'cols',
    ];

    let element: SupportedElement;

    if (this.type === 'select') {
      element = document.createElement('select');
    } else if (this.type === 'textarea') {
      element = document.createElement('textarea');
    } else {
      const input = document.createElement('input');
      if (this.type) {
        input.setAttribute('type', this.type);
      }
      element = input;
    }

    attributesToMirror.forEach((attribute) => {
      const attrValue = this.getAttribute(attribute);
      if (this.hasAttribute(attribute) && attrValue !== null) {
        element.setAttribute(attribute, attrValue);
      }
    });

    element.setAttribute('slot', 'input');

    if (element instanceof HTMLInputElement) {
      if (this.type === 'checkbox' || this.type === 'radio') {
        element.classList.add('form-check-input');
      } else {
        element.classList.add('form-control');
      }
    } else {
      element.classList.add('form-control');
    }

    if (element instanceof HTMLSelectElement && this.selectOptions.length > 0) {
      this.updateSelectOptions(element);
    }

    return element;
  }

  private _generatedId = `nte-input-${Math.random().toString(36).substring(2, 9)}`;

  private get _uniqueId() {
    return this.id || this._generatedId;
  }

  private syncHostState() {
    this.classList.toggle('touched', this.touched);
    this.classList.toggle('valid', this.valid);
    this.classList.toggle('invalid', this.invalid);
  }
}
