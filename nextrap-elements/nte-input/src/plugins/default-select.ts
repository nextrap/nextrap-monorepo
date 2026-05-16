import { html, nothing } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import { AbstractNteInputPlugin } from '../lib/plugin';
import type { InputOption, InputOptionsType, NteInputRenderContext } from '../lib/types';
import { normalizeValueArray, resolveInputOptions, resolveSelectedInputOptions } from './select-utils';

export class DefaultSelectPlugin extends AbstractNteInputPlugin {
  static readonly types = ['select'];

  protected get select() {
    return this.query<HTMLSelectElement>('select');
  }

  override render(context: NteInputRenderContext) {
    const { element, controlId, validationId } = context;
    const options = resolveInputOptions(element);
    const selectedValue = normalizeValueArray(this.host.value)[0] ?? '';

    return html`
      <select
        id=${controlId}
        name=${element.getAttribute('name') ?? ''}
        aria-describedby=${validationId}
        ?disabled=${element.hasAttribute('disabled')}
        ?required=${element.hasAttribute('required')}
      >
        ${options.map(
          (option) => html`
            <option
              value=${option.value}
              ?disabled=${Boolean(option.disabled)}
              ?selected=${option.value === selectedValue}
            >
              ${this.renderOptionLabel(option) ?? nothing}
            </option>
          `,
        )}
      </select>
    `;
  }

  override onInput() {
    this.host.value = this.select?.value ?? '';
  }

  override onChange() {
    this.onInput();
  }

  override getValue() {
    return this.host.value;
  }

  override getSelectedOptions(): InputOptionsType {
    return resolveSelectedInputOptions(this.host, normalizeValueArray(this.host.value));
  }

  protected renderOptionLabel(option: InputOption) {
    return option.html ? unsafeHTML(option.html) : option.label;
  }
}

export const defaultSelectPlugin = DefaultSelectPlugin;
