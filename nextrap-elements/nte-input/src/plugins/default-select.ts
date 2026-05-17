import { html, nothing } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import { AbstractNteInputPlugin } from '../lib/plugin';
import {
  NTE_INPUT_CONTROL_ID,
  NTE_INPUT_VALIDATION_ID,
  type InputOption,
  type InputOptionsType,
  type NteInputRenderContext,
} from '../lib/types';
import { normalizeValueArray, resolveInputOptions, resolveSelectedInputOptions } from './select-utils';

import style from './default-select.scss?inline';

export class DefaultSelectPlugin extends AbstractNteInputPlugin {
  static readonly types = ['select'];

  override getStyleSheet() {
    return style;
  }

  protected get select() {
    return this.query<HTMLSelectElement>('select');
  }

  override getFormElement() {
    return this.select;
  }

  override render(context: NteInputRenderContext) {
    const { element } = context;
    const options = resolveInputOptions(element);
    const selectedValue = normalizeValueArray(this.host.value)[0] ?? '';

    return html`
      <select
        id=${NTE_INPUT_CONTROL_ID}
        part="select"
        name=${element.getAttribute('name') ?? ''}
        aria-describedby=${NTE_INPUT_VALIDATION_ID}
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

  override isValid(): boolean | null {
    return this.select?.checkValidity() ?? null;
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
