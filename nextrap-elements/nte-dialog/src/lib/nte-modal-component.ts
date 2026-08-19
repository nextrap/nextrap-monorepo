import { nextrap_element } from '@nextrap/nte-core';
import { html, nothing, TemplateResult } from 'lit';
import { query } from 'lit/decorators.js';
import { NteDialog, NteDialogBackdropAction } from './nte-dialog';

export type NteModalResult<TResult = void> =
  | { submitted: true; data: TResult }
  | { submitted: false };

export interface NteModalDismissOptions {
  closeButton?: boolean;
  escape?: boolean;
  backdrop?: NteDialogBackdropAction;
}

export interface NteModalOptions {
  /** Classes applied to the inner nte-dialog. Visual styling belongs in CSS/Sass. */
  dialogClass?: string | string[];
  dismiss?: false | NteModalDismissOptions;
}

type ModalConstructor<TInput, TResult, TModal extends NteModalComponent<TInput, TResult>> = {
  new (): TModal;
};

/**
 * Base class for application dialogs that are created and opened programmatically.
 * NteDialog remains the UI primitive; this class only owns mounting, input/result and cleanup.
 */
export abstract class NteModalComponent<TInput = void, TResult = void> extends nextrap_element() {
  protected input!: TInput;
  protected modalOptions: NteModalOptions = {};

  @query('nte-dialog')
  private accessor dialog: NteDialog | null = null;

  private resultResolver: ((result: NteModalResult<TResult>) => void) | null = null;
  private resultPromise: Promise<NteModalResult<TResult>> | null = null;
  private settled = false;

  static async show<TInput, TResult, TModal extends NteModalComponent<TInput, TResult>>(
    this: ModalConstructor<TInput, TResult, TModal>,
    input: TInput,
  ): Promise<NteModalResult<TResult>> {
    const modal = new this();
    document.body.append(modal);

    try {
      return await modal.open(input);
    } finally {
      modal.remove();
    }
  }

  async open(input: TInput): Promise<NteModalResult<TResult>> {
    if (this.resultPromise) {
      return this.resultPromise;
    }

    this.input = input;
    this.settled = false;
    this.resultPromise = new Promise<NteModalResult<TResult>>((resolve) => {
      this.resultResolver = resolve;
    });

    this.requestUpdate();
    await this.updateComplete;
    this.dialog?.showModal();

    return this.resultPromise;
  }

  protected submit(...args: TResult extends void ? [] | [TResult] : [TResult]): void {
    const data = args[0] as TResult;
    this.finish({ submitted: true, data });
  }

  protected abort(): void {
    this.finish({ submitted: false });
  }

  protected renderTitle(): TemplateResult | string | null {
    return null;
  }

  protected abstract renderModal(): TemplateResult;

  protected renderFooter(): TemplateResult | null {
    return null;
  }

  protected override render() {
    const options = this.modalOptions;
    const dismiss = options.dismiss === false ? false : options.dismiss ?? {};
    const dialogClass = Array.isArray(options.dialogClass)
      ? options.dialogClass.join(' ')
      : options.dialogClass ?? '';
    const title = this.renderTitle();
    const footer = this.renderFooter();

    return html`
      <nte-dialog
        class=${dialogClass}
        exportparts="dialog,header,content,footer,close-button"
        ?no-dismiss=${dismiss === false}
        ?hide-close-button=${dismiss !== false && dismiss.closeButton === false}
        ?no-escape=${dismiss !== false && dismiss.escape === false}
        backdrop-action=${dismiss === false ? 'shake' : dismiss.backdrop ?? 'shake'}
        @dismiss=${this.onDismiss}
        @closed=${this.onClosed}
      >
        ${title === null ? nothing : html`<div slot="title">${title}</div>`}
        ${this.renderModal()}
        ${footer === null ? nothing : html`<div slot="footer">${footer}</div>`}
      </nte-dialog>
    `;
  }

  private onDismiss = (event: Event) => {
    event.preventDefault();
    this.abort();
  };

  private onClosed = () => {
    if (!this.settled) {
      this.abort();
    }
  };

  private finish(result: NteModalResult<TResult>): void {
    if (this.settled || !this.resultResolver) return;

    this.settled = true;
    const resolve = this.resultResolver;
    this.resultResolver = null;
    resolve(result);
    void this.dialog?.close();
  }
}
