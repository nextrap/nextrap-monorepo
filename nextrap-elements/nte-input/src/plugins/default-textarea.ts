import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

import { AbstractNteInputPlugin } from '../lib/plugin';
import { NTE_INPUT_CONTROL_ID, NTE_INPUT_VALIDATION_ID, type NteInputRenderContext } from '../lib/types';

import style from './default-textarea.scss?inline';

export class DefaultTextareaPlugin extends AbstractNteInputPlugin {
  static readonly types = ['textarea'];

  override getStyleSheet() {
    return style;
  }

  protected get textarea() {
    return this.query<HTMLTextAreaElement>('textarea');
  }

  override getFormElement() {
    return this.textarea;
  }

  override render(context: NteInputRenderContext) {
    const { element } = context;

    return html`
      <textarea
        id=${NTE_INPUT_CONTROL_ID}
        part="textarea"
        rows=${element.getAttribute('rows') ?? '3'}
        name=${element.getAttribute('name') ?? ''}
        .value=${this.normalizeStringValue(this.host.value)}
        placeholder=${element.getAttribute('placeholder') ?? ''}
        aria-describedby=${NTE_INPUT_VALIDATION_ID}
        minlength=${ifDefined(element.getAttribute('minlength') ?? undefined)}
        maxlength=${ifDefined(element.getAttribute('maxlength') ?? undefined)}
        ?disabled=${element.hasAttribute('disabled')}
        ?readonly=${element.hasAttribute('readonly')}
        ?required=${element.hasAttribute('required')}
      ></textarea>
    `;
  }

  override updated() {
    this.clampHeight();
  }

  override onInput() {
    this.host.value = this.textarea?.value ?? '';
    this.clampHeight();
  }

  override getValue() {
    return this.host.value;
  }

  override isValid(): boolean | null {
    return this.textarea?.checkValidity() ?? null;
  }

  protected clampHeight() {
    const textarea = this.textarea;
    if (!textarea) {
      return;
    }

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
