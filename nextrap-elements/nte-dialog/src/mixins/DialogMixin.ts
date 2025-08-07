import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

type Constructor<T = {}> = abstract new (...args: any[]) => T;

export function DialogMixin<TBase extends Constructor<LitElement>>(Base: TBase) {
  abstract class DialogClass extends Base {
    private _title: string | null;

    constructor(title: string | null = null) {
      super();
      this._title = title;
      document.body.appendChild(this); // ensure dialog is in the body
    }

    @property({ type: Boolean, reflect: true }) open = false;
    private modalRef?: HTMLElement;

    show() {
      this.open = true;
      //this.modalRef['showModal'](); // call inner modal if available
    }

    hide() {
      this.open = false;
      this.modalRef?.['hide']?.();
    }

    render(content?: unknown) {
      return html`
        <nte-dialog ${(el: HTMLElement) => (this.modalRef = el)} mode=${this.open ? 'open' : 'closed'}>
          ${content || ''}
        </nte-dialog>
      `;
    }
  }

  return DialogClass;
}
