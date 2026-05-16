import { html } from 'lit';

import { AbstractNteInputPlugin } from '../lib/plugin';
import type { InputOptionsType, NteInputRenderContext, NteInputValue } from '../lib/types';

export class DefaultCheckboxPlugin extends AbstractNteInputPlugin {
  static readonly types = ['checkbox'];

  protected get checkbox() {
    return this.query<HTMLInputElement>('input[type="checkbox"]');
  }

  override getInitValue(): NteInputValue {
    return this.host.hasAttribute('checked');
  }

  override onInput() {
    this.host.value = this.checkbox?.checked;
  }

  override render(context: NteInputRenderContext) {
    const { element, controlId, validationId } = context;

    return html`
      <label part="checkbox-label" for=${controlId}>
        <input
          id=${controlId}
          type="checkbox"
          aria-describedby=${validationId}
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
