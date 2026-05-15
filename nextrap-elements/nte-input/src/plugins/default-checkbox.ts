import { html } from 'lit';

import { AbstractNteInputPlugin } from '../lib/plugin';
import type { InputOptionsType, NteInputRenderContext, NteInputValue } from '../lib/types';

export class DefaultCheckboxPlugin extends AbstractNteInputPlugin {
  static readonly types = ['checkbox'];

  protected get checkbox() {
    return this.query<HTMLInputElement>('input[type="checkbox"]');
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
          ?checked=${element.hasAttribute('checked')}
          ?disabled=${element.hasAttribute('disabled')}
          ?required=${element.hasAttribute('required')}
        />
        <span part="checkbox-text">${element.label}</span>
      </label>
    `;
  }

  override updated(changedProperties: Map<PropertyKey, unknown>) {
    const checkbox = this.checkbox;
    const signal = this.prepareEventBindings();

    checkbox?.addEventListener(
      'change',
      () => {
        this.setHostBooleanAttribute('checked', checkbox.checked);
        this.syncHostState();
      },
      { signal },
    );

    if (checkbox) {
      checkbox.checked = this.host.hasAttribute('checked');

      if (changedProperties.has('value')) {
        checkbox.value = this.getHostAttribute('value', 'on');
      }
    }
  }

  override getValue() {
    return this.checkbox?.checked ?? this.hasHostAttribute('checked');
  }

  override setValue(value: NteInputValue) {
    const nextValue = Boolean(value);
    this.setHostBooleanAttribute('checked', nextValue);

    if (this.checkbox) {
      this.checkbox.checked = nextValue;
    }
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
