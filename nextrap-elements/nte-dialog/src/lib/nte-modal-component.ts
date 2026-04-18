import { LitElement, TemplateResult, html } from 'lit';
import { query } from 'lit/decorators.js';
import { state } from 'lit/decorators/state.js';
import { NteDialog } from '../index';

type Constructor<T = object> = abstract new (...args: any[]) => T;

export interface NextrapComponentMixinInterface {
  wrap(template: TemplateResult): TemplateResult;
}

export interface NteModalComponentWrapperInterface extends NextrapComponentMixinInterface {
  open(): void;
  close(): void;
  dialogClass: ('' | 'dialog-fullsize' | 'dialog-xxl' | 'dialog-floating-header')[];
}

export function NteModalComponentWrapper<TBase extends Constructor<LitElement>>(Base: TBase) {
  abstract class mixin extends Base implements NteModalComponentWrapperInterface {
    @query('nte-dialog')
    accessor _dialog: NteDialog | null = null;

    @state()
    accessor dialogClass: ('' | 'dialog-fullsize' | 'dialog-xxl' | 'dialog-floating-header')[] = [];

    wrap(template: TemplateResult) {
      return html`<nte-dialog exportparts="" class="${this.dialogClass.join(' ')}">${template}</nte-dialog>`;
    }

    open() {
      this._dialog?.showModal();
    }

    close() {
      this._dialog?.close();
    }
  }

  return mixin as TBase & Constructor<NteModalComponentWrapperInterface>;
}
