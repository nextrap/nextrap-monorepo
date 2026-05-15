import { html } from 'lit';

import type { NteInputPlugin, NteInputRenderContext } from '../lib/types';

export const defaultTextPlugin: NteInputPlugin = {
  types: ['text', 'email', 'password'],
  getHtml: (context) => {
    const { element, controlId, validationId } = context as NteInputRenderContext;

    return html`
      <input
        id=${controlId}
        type=${element.type}
        name=${element.getAttribute('name') ?? ''}
        .value=${element.getAttribute('value') ?? ''}
        placeholder=${element.getAttribute('placeholder') ?? ''}
        aria-describedby=${validationId}
        ?disabled=${element.hasAttribute('disabled')}
        ?readonly=${element.hasAttribute('readonly')}
        ?required=${element.hasAttribute('required')}
      />
    `;
  },
};
