import { html } from 'lit';

import { AbstractNteInputPlugin } from '../lib/plugin';
import type { NteInputRenderContext, NteInputValue } from '../lib/types';

export class DefaultTextareaPlugin extends AbstractNteInputPlugin {
  static readonly types = ['textarea'];

  protected get textarea() {
    return this.query<HTMLTextAreaElement>('textarea');
  }

  override render(context: NteInputRenderContext) {
    const { element, controlId, validationId } = context;

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
  }

  override updated() {
    const textarea = this.textarea;
    const signal = this.prepareEventBindings();

    textarea?.addEventListener(
      'input',
      () => {
        this.setHostStringAttribute('value', textarea.value);
        this.clampHeight(textarea);
        this.syncHostState();
      },
      { signal },
    );

    this.syncTextareaValue();
  }

  override getValue() {
    return this.textarea?.value ?? this.getHostAttribute('value');
  }

  override setValue(value: NteInputValue) {
    const nextValue = this.normalizeStringValue(value);
    this.setHostStringAttribute('value', nextValue);
    this.syncTextareaValue(nextValue);
  }

  protected syncTextareaValue(nextValue: NteInputValue = this.getHostAttribute('value')) {
    const textarea = this.textarea;
    const value = this.normalizeStringValue(nextValue);

    if (!textarea) {
      return;
    }

    if (textarea.value !== value) {
      textarea.value = value;
    }

    this.clampHeight(textarea);
  }

  protected clampHeight(textarea: HTMLTextAreaElement) {
    textarea.style.height = 'auto';

    const styles = getComputedStyle(textarea);
    const minHeight = this.parsePixelValue(textarea.style.minHeight || styles.minHeight) ?? 0;
    const maxHeight = this.parsePixelValue(textarea.style.maxHeight || styles.maxHeight) ?? Number.POSITIVE_INFINITY;
    const targetHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);

    textarea.style.height = `${targetHeight}px`;
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
  }

  protected parsePixelValue(value: string) {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
}

export const defaultTextareaPlugin = DefaultTextareaPlugin;
