import { html } from 'lit';

import { AbstractNteInputPlugin } from '../lib/plugin';
import type { InputOptionsType, NteInputRenderContext, NteInputValue } from '../lib/types';
import {
  getSelect,
  normalizeValueArray,
  resolveSelectedInputOptions,
  syncOptions,
  syncSelectedValue,
} from './select-utils';

export class DefaultSelectPlugin extends AbstractNteInputPlugin {
  static readonly types = ['select'];

  protected get select() {
    return getSelect(this.host);
  }

  override render(context: NteInputRenderContext) {
    const { element, controlId, validationId } = context;

    return html`
      <select
        id=${controlId}
        name=${element.getAttribute('name') ?? ''}
        aria-describedby=${validationId}
        ?disabled=${element.hasAttribute('disabled')}
        ?required=${element.hasAttribute('required')}
      ></select>
    `;
  }

  override updated() {
    const select = this.select;
    const signal = this.prepareEventBindings();

    select?.addEventListener(
      'change',
      () => {
        this.setHostStringAttribute('value', select.value);
        this.syncHostState();
      },
      { signal },
    );

    syncOptions(this.host);
  }

  override getValue() {
    return this.select?.value ?? this.getHostAttribute('value');
  }

  override setValue(value: NteInputValue) {
    const nextValue = normalizeValueArray(value)[0] ?? '';
    this.setHostStringAttribute('value', nextValue);

    const select = this.select;
    if (select) {
      syncSelectedValue(this.host, select);
    }
  }

  override getSelectedOptions(): InputOptionsType {
    return resolveSelectedInputOptions(this.host, normalizeValueArray(this.getValue()));
  }
}

export const defaultSelectPlugin = DefaultSelectPlugin;
