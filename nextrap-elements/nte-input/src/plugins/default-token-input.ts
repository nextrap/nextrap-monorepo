import { html, nothing } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import { AbstractNteInputPlugin } from '../lib/plugin';
import {
  NTE_INPUT_CONTROL_ID,
  NTE_INPUT_VALIDATION_ID,
  type InputOptionsType,
  type NteInputRenderContext,
  type NteInputValue,
} from '../lib/types';
import { normalizeValueArray, resolveInputOptions } from './select-utils';

import style from './default-token-input.scss?inline';

export class DefaultTokenInputPlugin extends AbstractNteInputPlugin {
  static readonly types = ['token-input'];

  override getStyleSheet() {
    return style;
  }

  protected get input() {
    return this.query<HTMLInputElement>('input[type="text"]');
  }

  override getFormElement() {
    return this.input;
  }

  protected get isStrict() {
    return this.host.hasAttribute('strict');
  }

  override getInitValue(): NteInputValue {
    return this.normalizeSelectedValues(this.host.getAttribute('value'));
  }

  override render(context: NteInputRenderContext) {
    const { element } = context;
    const tokens = this.normalizeSelectedValues(this.host.value);
    const availableOptions = this.getAvailableOptions(tokens);

    return html`
      <div part="token-list" aria-describedby=${NTE_INPUT_VALIDATION_ID}>
        ${tokens.map((token) => {
          const option = this.resolveOption(token);
          const label = option?.html ? unsafeHTML(option.html) : (option?.label ?? token);

          return html`
            <span part="token">
              <span part="token-text">${label ?? nothing}</span>
              <button
                type="button"
                part="token-remove"
                aria-label=${`Token "${option?.label ?? token}" entfernen`}
                ?disabled=${element.hasAttribute('disabled') || element.hasAttribute('readonly')}
                @click=${() => this.removeToken(token)}
              >
                ×
              </button>
            </span>
          `;
        })}

        <input
          id=${NTE_INPUT_CONTROL_ID}
          part="token-input"
          type="text"
          list=${availableOptions.length > 0 ? `${NTE_INPUT_CONTROL_ID}-options` : ''}
          placeholder=${element.getAttribute('placeholder') ?? ''}
          aria-describedby=${NTE_INPUT_VALIDATION_ID}
          ?disabled=${element.hasAttribute('disabled')}
          ?readonly=${element.hasAttribute('readonly')}
          @input=${this.handleDraftInput}
          @change=${this.handleDraftCommit}
          @blur=${this.handleDraftCommit}
          @keydown=${this.handleKeydown}
        />
      </div>

      ${availableOptions.length > 0
        ? html`
            <datalist id=${`${NTE_INPUT_CONTROL_ID}-options`}>
              ${availableOptions.map((option) => html`<option value=${option.value}>${option.label}</option>`)}
            </datalist>
          `
        : nothing}
    `;
  }

  override onInput(e: Event) {
    if (e.target !== this.input) {
      return;
    }

    this.syncHostState();
  }

  override onChange(e: Event) {
    if (e.target !== this.input) {
      return;
    }

    this.commitDraftValue();
  }

  override getValue() {
    return this.normalizeSelectedValues(this.host.value);
  }

  override getSelectedOptions(): InputOptionsType {
    return this.normalizeSelectedValues(this.host.value).map((value) => {
      const option = this.resolveOption(value);

      return option ?? { value, label: value };
    });
  }

  override isValid(): boolean | null {
    if (!this.host.hasAttribute('required') || this.host.hasAttribute('disabled')) {
      return true;
    }

    return this.normalizeSelectedValues(this.host.value).length > 0;
  }

  override isHoverlabelActive(): boolean {
    return this.hasValue() || this.getDraftValue().length > 0 || this.host.shadowRoot?.activeElement === this.input;
  }

  override formResetCallback() {
    this.host.value = this.getInitValue();
    this.clearDraftValue();
  }

  override updated() {
    const normalizedValue = this.normalizeSelectedValues(this.host.value);

    if (!this.areValuesEqual(this.host.value, normalizedValue)) {
      this.host.value = normalizedValue;
    }
  }

  protected normalizeSelectedValues(value: NteInputValue) {
    const values = Array.from(new Set(normalizeValueArray(value)));

    if (!this.isStrict) {
      return values;
    }

    return values.filter((item) => this.resolveOption(item));
  }

  protected getDraftValue() {
    return this.input?.value.trim() ?? '';
  }

  protected clearDraftValue() {
    if (this.input) {
      this.input.value = '';
    }
  }

  protected commitDraftValue() {
    this.addTokens(this.getDraftValue());
  }

  protected addTokens(rawValue: string) {
    if (!rawValue || this.host.hasAttribute('disabled') || this.host.hasAttribute('readonly')) {
      return;
    }

    const nextValues = this.normalizeSelectedValues([
      ...this.normalizeSelectedValues(this.host.value),
      ...rawValue
        .split(/[;,\n]/)
        .map((part) => part.trim())
        .filter(Boolean),
    ]);

    this.host.value = nextValues;
    this.clearDraftValue();
    this.dispatchValueEvents();
  }

  protected removeToken(token: string) {
    if (this.host.hasAttribute('disabled') || this.host.hasAttribute('readonly')) {
      return;
    }

    this.host.value = this.normalizeSelectedValues(this.host.value).filter((value) => value !== token);
    this.dispatchValueEvents();
    this.input?.focus();
  }

  protected getAvailableOptions(tokens: string[]) {
    const tokenSet = new Set(tokens);
    return resolveInputOptions(this.host).filter((option) => !option.disabled && !tokenSet.has(option.value));
  }

  protected resolveOption(value: string) {
    return resolveInputOptions(this.host).find((option) => option.value === value) ?? null;
  }

  protected areValuesEqual(left: NteInputValue, right: string[]) {
    const leftValues = normalizeValueArray(left);

    return leftValues.length === right.length && leftValues.every((value, index) => value === right[index]);
  }

  protected dispatchValueEvents() {
    this.host.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
    this.host.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }

  protected handleDraftInput = () => {
    this.syncHostState();
  };

  protected handleDraftCommit = () => {
    this.commitDraftValue();
  };

  protected handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ',' || event.key === ';') {
      event.preventDefault();
      this.commitDraftValue();
      return;
    }

    if (event.key === 'Backspace' && !this.input?.value) {
      const tokens = this.normalizeSelectedValues(this.host.value);
      const lastToken = tokens[tokens.length - 1];

      if (lastToken) {
        event.preventDefault();
        this.removeToken(lastToken);
      }
    }
  };
}

export const defaultTokenInputPlugin = DefaultTokenInputPlugin;
