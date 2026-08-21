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

/**
 * Keep input strict on purpose:
 * - `TInput = void` means the dialog takes no argument and `show()` / `open()` take none.
 * - any other `TInput` means that exact input is required.
 */
type OpenArgs<TInput> = [TInput] extends [void] ? [] : [input: TInput];
type SubmitArgs<TResult> = [TResult] extends [void] ? [] : [data: TResult];

/**
 * Base class for typed programmatic dialogs.
 *
 * The static show() method intentionally derives its argument and result types from
 * the concrete subclass instance instead of independently inferring TInput/TResult
 * against NteDialogComponent<TInput, TResult>. The class contains TResult-typed
 * private resolver state, which makes different TResult instantiations invariant.
 * Independent generic inference therefore widens TResult to unknown and breaks the
 * constructor `this` type. Deriving from InstanceType<TDialog> preserves the exact
 * subclass contract end-to-end without optional input or `any` resolver state.
 */
export abstract class NteDialogComponent<TInput = void, TResult = void> extends nextrap_element() {
  protected input!: TInput;
  protected dialogOptions: NteDialogComponentOptions = {};

  @query('nte-dialog')
  private accessor dialog: NteDialog | null = null;

  private resultResolver: ((result: NteDialogComponentResult<TResult>) => void) | null = null;
  private resultPromise: Promise<NteDialogComponentResult<TResult>> | null = null;
  private settled = false;

  protected override createRenderRoot() {
    return this;
  }

  static async show<TDialog extends abstract new () => NteDialogComponent<never, never>>(
    this: TDialog,
    ...args: InstanceType<TDialog> extends NteDialogComponent<infer TInput, infer _TResult> ? OpenArgs<TInput> : never
  ): Promise<
    InstanceType<TDialog> extends NteDialogComponent<infer _TInput, infer TResult>
      ? NteDialogComponentResult<TResult>
      : never
  > {
    // The constructor constraint is used only to obtain the concrete subclass.
    // Its generic parameters must not participate in inference; the conditional
    // types above extract the actual TInput/TResult from InstanceType<TDialog>.
    const modal = new this() as InstanceType<TDialog>;
    document.body.append(modal);

    try {
      return (await modal.open(...args)) as Awaited<ReturnType<InstanceType<TDialog>['open']>>;
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
    return this.resultPromise;
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
    const dialogClass = Array.isArray(options.dialogClass) ? options.dialogClass.join(' ') : (options.dialogClass ?? '');
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
