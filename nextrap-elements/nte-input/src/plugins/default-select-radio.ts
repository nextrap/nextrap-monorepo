import { html, nothing } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import { AbstractNteInputPlugin } from '../lib/plugin';
import {
  NTE_INPUT_CONTROL_ID,
  NTE_INPUT_VALIDATION_ID,
  type InputOption,
  type InputOptionsType,
  type NteInputRenderContext,
  type NteInputValue,
} from '../lib/types';
import { normalizeValueArray, resolveInputOptions, resolveSelectedInputOptions } from './select-utils';

import style from './default-select-radio.scss?inline';

export class DefaultSelectRadioPlugin extends AbstractNteInputPlugin {
  static readonly types = ['select-radio'];

  override getStyleSheet() {
    return style;
  }

  protected get inputs() {
    return this.queryAll<HTMLInputElement>('#control input');
  }

  override getFormElement() {
    return this.inputs[0] ?? null;
  }

  override getInitValue(): NteInputValue {
    return this.normalizeSelectedValues(this.host.getAttribute('value'));
  }

  override render(context: NteInputRenderContext) {
    const { element } = context;
    const options = resolveInputOptions(element);
    const selectedValues = new Set(this.normalizeSelectedValues(this.host.value));
    const inputType = element.multiple ? 'checkbox' : 'radio';
    const groupName = element.getAttribute('name') ?? `${NTE_INPUT_CONTROL_ID}-group`;
    const role = element.multiple ? 'group' : 'radiogroup';

    return html`
      <div
        id=${`${NTE_INPUT_CONTROL_ID}-group`}
        part="option-list"
        role=${role}
        aria-describedby=${NTE_INPUT_VALIDATION_ID}
      >
        ${options.map((option, index) => {
          const optionId = index === 0 ? NTE_INPUT_CONTROL_ID : `${NTE_INPUT_CONTROL_ID}-${index}`;

          return html`
            <label part="option-label" for=${optionId}>
              <input
                id=${optionId}
                part="option-input"
                type=${inputType}
                name=${groupName}
                value=${option.value}
                aria-describedby=${NTE_INPUT_VALIDATION_ID}
                ?checked=${selectedValues.has(option.value)}
                ?disabled=${Boolean(option.disabled) || element.hasAttribute('disabled')}
                ?required=${!element.multiple && element.hasAttribute('required')}
              />
              <span part="option-text">${this.renderOptionLabel(option) ?? nothing}</span>
            </label>
          `;
        })}
      </div>
    `;
  }

  override onInput() {
    this.host.value = this.getSelectedValuesFromInputs();
  }

  override onChange() {
    this.onInput();
  }

  override getValue() {
    return this.host.value;
  }

  override getFormValue() {
    return this.createFormData(this.normalizeSelectedValues(this.host.value));
  }

  override getSelectedOptions(): InputOptionsType {
    return resolveSelectedInputOptions(this.host, this.normalizeSelectedValues(this.host.value));
  }

  override hasPlaceholder() {
    return false;
  }

  override isHoverlabelActive() {
    return this.hasValue();
  }

  protected normalizeSelectedValues(value: NteInputValue) {
    const values = normalizeValueArray(value);
    return this.host.multiple ? values : values.slice(0, 1);
  }

  protected getSelectedValuesFromInputs() {
    return this.inputs.filter((input) => input.checked).map((input) => input.value);
  }

  protected renderOptionLabel(option: InputOption) {
    return option.html ? unsafeHTML(option.html) : option.label;
  }
}

export const defaultSelectRadioPlugin = DefaultSelectRadioPlugin;
