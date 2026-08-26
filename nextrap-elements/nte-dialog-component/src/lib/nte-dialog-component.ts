import { nextrap_element } from '@nextrap/nt-core';
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

const dialogTypes: unique symbol = Symbol('nte-dialog-component-types');

type DialogTypeMarker<TInput, TResult> = {
  readonly [dialogTypes]: {
    input: TInput;
    result: TResult;
  };
};

type DialogComponentConstructor<TInput, TResult> = new () =>
  NteDialogComponent<TInput, TResult> & DialogTypeMarker<TInput, TResult>;

/**
 * Keep input strict on purpose:
 * - `TInput = void` means the dialog takes no argument and `show()` / `open()` take none.
 * - any other `TInput` means that exact input is required.
 *
 * Making the non-void tuple optional would allow e.g.
 * `NteDialogComponent<{ userId: string }, User>.show()` without a userId and would
 * defeat the central compile-time contract of the component abstraction.
 */
type OpenArgs<TInput> = [TInput] extends [void] ? [] : [input: TInput];
type SubmitArgs<TResult> = [TResult] extends [void] ? [] : [data: TResult];

/**
 * Base class for typed programmatic dialogs.
 *
 * TInput and TResult form one end-to-end public type contract:
 *
 *   TInput  -> show()/open() -> this.input
 *   TResult -> submit()      -> resolver -> returned Promise
 *
 * The private resolver makes different TResult instantiations intentionally
 * invariant. Therefore static show() must not try to recover the generic types by
 * widening the component to `unknown`, and the resolver must not be changed to
 * `any` merely to make constructor inference pass.
 *
 * Instead, the class carries a non-exported, type-only unique-symbol marker. It has
 * no runtime value on instances (`declare` emits no field), but gives TypeScript a
 * covariant place from which static show() can infer the concrete subclass's exact
 * TInput and TResult. This keeps both valid forms correctly typed:
 *
 *   ConfirmDialog extends NteDialogComponent<void, void>       -> ConfirmDialog.show()
 *   UserDialog extends NteDialogComponent<UserInput, User>     -> UserDialog.show(input)
 *
 * and still rejects missing input for non-void dialogs at compile time.
 */
export abstract class NteDialogComponent<TInput = void, TResult = void> extends nextrap_element() {
  declare readonly [dialogTypes]: {
    input: TInput;
    result: TResult;
  };

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

  static async show<TInput, TResult>(
    this: DialogComponentConstructor<TInput, TResult>,
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
