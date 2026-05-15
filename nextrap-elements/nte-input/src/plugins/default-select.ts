import { html } from 'lit';

import type { NteInputPlugin, NteInputRenderContext } from '../lib/types';
import { syncOptions } from './select-utils';

export const defaultSelectPlugin: NteInputPlugin = {
  types: ['select'],
  getHtml: (context) => {
    const { controlId, validationId } = context as NteInputRenderContext;

    return html`<select id=${controlId} aria-describedby=${validationId}></select>`;
  },
  init: (element) => {
    syncOptions(element);
  },
  shouldHoverlabelFloat: (element) => element.hasPlaceholder || element.hasValue,
};
