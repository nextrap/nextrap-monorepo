import { html } from 'lit';

import type { NteInputPlugin, NteInputRenderContext } from '../lib/types';

export const defaultCheckboxPlugin: NteInputPlugin = {
  types: ['checkbox'],
  getHtml: (context) => {
    const { element, controlId, validationId } = context as NteInputRenderContext;

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
  },
};
