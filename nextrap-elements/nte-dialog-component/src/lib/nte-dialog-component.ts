import { nextrap_element } from '@nextrap/nte-core';
import '@nextrap/nte-dialog';
import { NteDialog, NteDialogBackdropAction } from '@nextrap/nte-dialog';
import { html, nothing, TemplateResult } from 'lit';
import { query } from 'lit/decorators.js';

export type NteDialogComponentResult<TResult = void> = { submitted: true; data: TResult } | { submitted: false };

export interface NteDialogComponentDismissOptions {
  closeButton?: boolean;
  escape?: boolean;
  backdrop?: NteDialogBackdropAction;
}

export interface NteDialogComponentOptions {
  /** Classes applied to the inner nte-dialog. Visual styling belongs in CSS/Sass. */
  dialogClass?: string | string[];
  dismiss?: false | NteDialogComponentDismissOptions;
}

type DialogComponentConstructor<TInput, TResult, TDialog extends NteDialogComponent<TInput, TResult>> = {
  new (): TDialog;
};

type OpenArgs<TInput> = [TInput] extends [void] ? [] : [input?: TInput];
type SubmitArgs<TResult> = [TResult] extends [void] ? [] : [data: TResult];

/**
 * Base class for application/SPAs that create dialogs programmatically.
 * Rendering and browser-level dialog behavior remain owned by @nextrap/nte-dialog.
 *
 * NteDialogComponent deliberately renders into its own light DOM. This keeps the
 * generated title, body and footer nodes in light DOM as direct children of the
 * nested NteDialog, so they use NteDialog's normal slot projection and remain
 * available to application CSS and DOM integrations.
 */
export abstract class NteDialogComponent<TInput = void, TResult = void> extends nextrap_element() {
  protected input!: TInput;
  protected dialogOptions: NteDialogComponentOptions = {};

  @query('nte-dialog')
  private accessor dialog: NteDialog | null = null;

  private resultResolver: ((result: NteDialogComponentResult<any>) => void) | null = null;
  private resultPromise: Promise<NteDialogComponentResult<any>> | null = null;
  private settled = false;

  protected override createRenderRoot() {
    return this;
  }

  static async show<TInput, TResult, TDialog extends NteDialogComponent<TInput, TResult>>(
    this: DialogComponentConstructor<TInput, TResult, TDialog>,
    ...args: OpenArgs<TInput>
  ): Promise<NteDialogComponentResult<TResult>> {
    const modal = new this();
    document.body.append(modal);

    try {
      return await modal.open(...args);
    } finally {
      modal.remove();
    }
  }

  async open(...args: OpenArgs<TInput>): Promise<NteDialogComponentResult<TResult>> {
    if (this.resultPromise) return this.resultPromise;

    this.input = args[0] as TInput;
    this.settled = false;
    this.resultPromise = new Promise<NteDialogComponentResult<TResult>>((resolve) => {
      this.resultResolver = resolve;
    });

    this.requestUpdate();
    await this.updateComplete;
    this.dialog?.showModal();
    return this.resultPromise as Promise<NteDialogComponentResult<TResult>>;
  }

  protected submit(...args: SubmitArgs<TResult>): void {
    void this.finish({ submitted: true, data: args[0] as TResult });
  }

  protected abort(): void {
    void this.finish({ submitted: false });
  }

  protected renderTitle(): TemplateResult | string | null {
    return null;
  }

  protected abstract renderDialog(): TemplateResult;

  protected renderFooter(): TemplateResult | null {
    return null;
  }

  protected override render() {
    const options = this.dialogOptions;
    const dismiss = options.dismiss === false ? false : (options.dismiss ?? {});
    const dialogClass = Array.isArray(options.dialogClass)
      ? options.dialogClass.join(' ')
      : (options.dialogClass ?? '');
    const title = this.renderTitle();
    const footer = this.renderFooter();

    return html`
      <nte-dialog
        class=${dialogClass}
        ?no-dismiss=${dismiss === false}
        ?hide-close-button=${dismiss !== false && dismiss.closeButton === false}
        ?no-escape=${dismiss !== false && dismiss.escape === false}
        backdrop-action=${dismiss === false ? 'shake' : (dismiss.backdrop ?? 'shake')}
        @dismiss=${this.onDismiss}
        @closed=${this.onClosed}
      >
        ${title === null ? nothing : html`<div slot="title">${title}</div>`} ${this.renderDialog()}
        ${footer === null ? nothing : html`<div slot="footer">${footer}</div>`}
      </nte-dialog>
    `;
  }

  private onDismiss = (event: Event) => {
    event.preventDefault();
    this.abort();
  };

  private onClosed = () => {
    if (!this.settled) this.abort();
  };

  private async finish(result: NteDialogComponentResult<TResult>): Promise<void> {
    if (this.settled || !this.resultResolver) return;

    this.settled = true;
    const resolve = this.resultResolver;
    this.resultResolver = null;
    await this.dialog?.close();
    resolve(result);
  }
}
