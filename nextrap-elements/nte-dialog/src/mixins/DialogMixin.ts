import { html } from 'lit';

type Constructor<T = object> = new (...args: any[]) => T;

export function DialogMixin<TBase extends Constructor<object>>(Base: TBase) {
  // @gts-ignore
  class Mixin extends Base {
    constructor(...args: any[]) {
      super();

      document.body.appendChild(this as unknown as HTMLElement); // ensure dialog is in the body
    }

    __modalRef?: HTMLElement | null;

    hide() {}

    render(content?: unknown) {
      return html` <nte-dialog ${(el: HTMLElement) => (this.__modalRef = el)}> ${content || ''} </nte-dialog> `;
    }
  }
  return Mixin;
}
