import { html } from 'lit';

import { AbstractNteInputPlugin } from '../lib/plugin';
import {
  NTE_INPUT_CONTROL_ID,
  NTE_INPUT_VALIDATION_ID,
  type InputOptionsType,
  type NteInputRenderContext,
  type NteInputValue,
} from '../lib/types';

import style from './default-checkbox.scss?inline';

export class DefaultCheckboxPlugin extends AbstractNteInputPlugin {
  static readonly types = ['checkbox'];

  override getStyleSheet() {
    return style;
  }

  protected get checkbox() {
    return this.query<HTMLInputElement>('input[type="checkbox"]');
  }

  override getFormElement() {
    return this.checkbox;
  }

  override getInitValue(): NteInputValue {
    return this.host.hasAttribute('checked');
  }

  override onInput() {
    this.host.value = this.checkbox?.checked;
  }

  override render(context: NteInputRenderContext) {
    const { element } = context;

    return html`
      <label part="checkbox-label" for=${NTE_INPUT_CONTROL_ID}>
        <input
          id=${NTE_INPUT_CONTROL_ID}
          part="checkbox-input"
          type="checkbox"
          aria-describedby=${NTE_INPUT_VALIDATION_ID}
          name=${element.getAttribute('name') ?? ''}
          value=${element.getAttribute('value') ?? 'on'}
          ?checked=${this.host.value === true}
          ?disabled=${element.hasAttribute('disabled')}
          ?required=${element.hasAttribute('required')}
        />
        <span part="checkbox-text">${element.label}</span>
      </label>
    `;
  }

  override isValid(): boolean | null {
    return this.checkbox?.checkValidity() ?? null;
  }

  override getSelectedOptions(): InputOptionsType {
    if (!this.getValue()) {
      return [];
    }

    return [
      {
        value: this.getHostAttribute('value', this.checkbox?.value ?? 'on'),
        label: this.host.label || this.getHostAttribute('value', 'on'),
      },
    ];
  }

  override hasPlaceholder() {
    return false;
  }

  override isHoverlabelActive() {
    return false;
  }

  override isLabelHidden() {
    return true;
  }
}

export const defaultCheckboxPlugin = DefaultCheckboxPlugin;
