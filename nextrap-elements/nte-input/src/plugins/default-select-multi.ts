import { html } from 'lit';

import type { NteInputPlugin, NteInputRenderContext } from '../lib/types';
import { syncOptions } from './select-utils';

export const defaultSelectMultiPlugin: NteInputPlugin = {
  types: ['select-multi'],
  getHtml: (context) => {
    const { controlId, validationId, element } = context as NteInputRenderContext;

    return html`
      <select
        id=${controlId}
        multiple
        size=${element.getAttribute('size') ?? '4'}
        aria-describedby=${validationId}
      ></select>
    `;
  },
  init: (element) => {
    syncOptions(element);
  },
  shouldHoverlabelFloat: (element) => element.hasValue,
};
