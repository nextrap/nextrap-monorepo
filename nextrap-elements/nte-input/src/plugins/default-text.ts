import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

import { AbstractNteInputPlugin } from '../lib/plugin';
import type { NteInputRenderContext } from '../lib/types';

import style from './default-text.scss?inline';

export class DefaultTextPlugin extends AbstractNteInputPlugin {
  static readonly types = ['text', 'email', 'password'];

  override getStyleSheet() {
    return style;
  }

  protected get input() {
    return this.query<HTMLInputElement>('input');
  }

  public override onInput() {
    this.host.value = this.input?.value;
    //this.host.requestUpdate();
  }

  override render(context: NteInputRenderContext) {
    const { element, type, controlId, validationId } = context;

    return html`
      <input
        id=${controlId}
        part="input"
        type=${type}
        name=${element.getAttribute('name') ?? ''}
        .value=${this.normalizeStringValue(this.host.value)}
        placeholder=${element.getAttribute('placeholder') ?? ''}
        aria-describedby=${validationId}
        pattern=${ifDefined(element.getAttribute('pattern') ?? undefined)}
        minlength=${ifDefined(element.getAttribute('minlength') ?? undefined)}
        maxlength=${ifDefined(element.getAttribute('maxlength') ?? undefined)}
        ?disabled=${element.hasAttribute('disabled')}
        ?readonly=${element.hasAttribute('readonly')}
        ?required=${element.hasAttribute('required')}
      />
    `;
  }

  override isValid(): boolean | null {
    return (this.query('input') as HTMLInputElement).checkValidity();
  }

  override getValue() {
    return this.input?.value;
  }
}

export const defaultTextPlugin = DefaultTextPlugin;
