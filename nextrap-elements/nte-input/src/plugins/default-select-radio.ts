import { html, nothing } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import { AbstractNteInputPlugin } from '../lib/plugin';
import type { InputOption, InputOptionsType, NteInputRenderContext, NteInputValue } from '../lib/types';
import { normalizeValueArray, resolveInputOptions, resolveSelectedInputOptions } from './select-utils';

export class DefaultSelectRadioPlugin extends AbstractNteInputPlugin {
  static readonly types = ['select-radio'];

  protected get inputs() {
    return this.queryAll<HTMLInputElement>('#control input');
  }

  override render(context: NteInputRenderContext) {
    const { element, controlId, validationId } = context;
    const options = resolveInputOptions(element);
    const selectedValues = new Set(this.normalizeSelectedValues(element.getAttribute('value')));
    const inputType = element.multiple ? 'checkbox' : 'radio';
    const groupName = element.getAttribute('name') ?? controlId;
    const role = element.multiple ? 'group' : 'radiogroup';

    return html`
      <div id=${`${controlId}-group`} part="option-list" role=${role} aria-describedby=${validationId}>
        ${options.map((option, index) => {
          const optionId = index === 0 ? controlId : `${controlId}-${index}`;

          return html`
            <label part="option-label" for=${optionId}>
              <input
                id=${optionId}
                part="option-input"
                type=${inputType}
                name=${groupName}
                value=${option.value}
                aria-describedby=${validationId}
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

  override updated() {
    const signal = this.prepareEventBindings();

    this.inputs.forEach((input) => {
      input.addEventListener(
        'change',
        () => {
          this.setHostStringAttribute('value', this.serializeSelectedValues(this.getSelectedValuesFromInputs()));
          this.syncHostState();
        },
        { signal },
      );
    });

    this.syncInputsFromValue();
  }

  override getValue() {
    return this.inputs.length > 0
      ? this.getSelectedValuesFromInputs()
      : this.normalizeSelectedValues(this.getHostAttribute('value'));
  }

  override setValue(value: NteInputValue) {
    const selectedValues = this.normalizeSelectedValues(value);
    this.setHostStringAttribute('value', this.serializeSelectedValues(selectedValues));
    this.syncInputsFromValue(selectedValues);
  }

  override getFormValue() {
    return this.createFormData(this.getValue() as string[]);
  }

  override getSelectedOptions(): InputOptionsType {
    return resolveSelectedInputOptions(this.host, this.getValue() as string[]);
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

  protected syncInputsFromValue(value: NteInputValue = this.getHostAttribute('value')) {
    const selectedValues = new Set(this.normalizeSelectedValues(value));

    this.inputs.forEach((input) => {
      input.checked = selectedValues.has(input.value);
    });
  }

  protected serializeSelectedValues(values: string[]) {
    return values.length > 0 ? JSON.stringify(values) : '';
  }

  protected renderOptionLabel(option: InputOption) {
    return option.html ? unsafeHTML(option.html) : option.label;
  }
}

export const defaultSelectRadioPlugin = DefaultSelectRadioPlugin;
