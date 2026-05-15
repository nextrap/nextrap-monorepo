import { html } from 'lit';

import { AbstractNteInputPlugin } from '../lib/plugin';
import type { NteInputRenderContext, NteInputValue } from '../lib/types';

export class DefaultTextPlugin extends AbstractNteInputPlugin {
  static readonly types = ['text', 'email', 'password'];

  protected get input() {
    return this.query<HTMLInputElement>('input');
  }

  override render(context: NteInputRenderContext) {
    const { element, type, controlId, validationId } = context;

    return html`
      <input
        id=${controlId}
        type=${type}
        name=${element.getAttribute('name') ?? ''}
        .value=${this.normalizeStringValue(element.getAttribute('value'))}
        placeholder=${element.getAttribute('placeholder') ?? ''}
        aria-describedby=${validationId}
        ?disabled=${element.hasAttribute('disabled')}
        ?readonly=${element.hasAttribute('readonly')}
        ?required=${element.hasAttribute('required')}
      />
    `;
  }

  override updated() {
    const input = this.input;
    const signal = this.prepareEventBindings();

    input?.addEventListener(
      'input',
      () => {
        this.setHostStringAttribute('value', input.value);
        this.syncHostState();
      },
      { signal },
    );

    this.syncInputValue();
  }

  override getValue() {
    return this.input?.value ?? this.getHostAttribute('value');
  }

  override setValue(value: NteInputValue) {
    const nextValue = this.normalizeStringValue(value);
    this.setHostStringAttribute('value', nextValue);
    this.syncInputValue(nextValue);
  }

  protected syncInputValue(nextValue: NteInputValue = this.getHostAttribute('value')) {
    const input = this.input;
    const value = this.normalizeStringValue(nextValue);

    if (input && input.value !== value) {
      input.value = value;
    }
  }
}

export const defaultTextPlugin = DefaultTextPlugin;
