import { html } from 'lit';

import type { NteInput } from '../components/nte-input/nte-input';
import type { NteInputPlugin, NteInputRenderContext } from '../lib/types';

const inputControllers = new WeakMap<NteInput, AbortController>();
const valueObservers = new WeakMap<NteInput, MutationObserver>();

function getTextarea(element: NteInput) {
  return element.renderRoot.querySelector('textarea');
}

function parsePixelValue(value: string) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function clampHeight(textarea: HTMLTextAreaElement) {
  textarea.style.height = 'auto';

  const styles = getComputedStyle(textarea);
  const minHeight = parsePixelValue(styles.minHeight) ?? 0;
  const maxHeight = parsePixelValue(styles.maxHeight) ?? Number.POSITIVE_INFINITY;
  const targetHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);

  textarea.style.height = `${targetHeight}px`;
  textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
}

function syncTextareaValue(element: NteInput) {
  const textarea = getTextarea(element);
  if (!(textarea instanceof HTMLTextAreaElement)) {
    return;
  }

  const value = element.getAttribute('value') ?? '';

  if (textarea.value !== value) {
    textarea.value = value;
  }

  clampHeight(textarea);
}

export const defaultTextareaPlugin: NteInputPlugin = {
  types: ['textarea'],
  getHtml: (context) => {
    const { element, controlId, validationId } = context as NteInputRenderContext;

    return html`
      <textarea
        id=${controlId}
        rows=${element.getAttribute('rows') ?? '3'}
        name=${element.getAttribute('name') ?? ''}
        placeholder=${element.getAttribute('placeholder') ?? ''}
        aria-describedby=${validationId}
        ?disabled=${element.hasAttribute('disabled')}
        ?readonly=${element.hasAttribute('readonly')}
        ?required=${element.hasAttribute('required')}
      ></textarea>
    `;
  },
  init: (element) => {
    inputControllers.get(element)?.abort();
    valueObservers.get(element)?.disconnect();

    const textarea = getTextarea(element);
    if (!(textarea instanceof HTMLTextAreaElement)) {
      return;
    }

    const controller = new AbortController();

    textarea.addEventListener(
      'input',
      () => {
        if (textarea.value) {
          element.setAttribute('value', textarea.value);
        } else {
          element.removeAttribute('value');
        }

        clampHeight(textarea);
      },
      { signal: controller.signal },
    );

    inputControllers.set(element, controller);

    const observer = new MutationObserver(() => {
      syncTextareaValue(element);
    });

    observer.observe(element, {
      attributes: true,
      attributeFilter: ['value'],
    });

    valueObservers.set(element, observer);
    syncTextareaValue(element);
  },
  shouldHoverlabelFloat: (element) => element.hasPlaceholder || element.hasValue,
};
