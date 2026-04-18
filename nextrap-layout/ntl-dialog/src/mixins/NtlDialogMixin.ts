import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { NtlDialogElement } from '../components/ntl-dialog/ntl-dialog';

type Constructor<T = object> = abstract new (...args: any[]) => T;

// @ts-ignore
export function NtlDialogMixin<TBase extends Constructor<object>>(Base: TBase) {
  abstract class MixinClass extends Base {
    __title: string | null = null;

    constructor(...args: any[]) {
      super(...args);

      // document.body.appendChild(this); // Automatically appends the component to the body
    }

    @property({ type: Boolean, reflect: true }) open = false;

    /**
     * The Ref to the component instance
     */
    #ref?: NtlDialogElement;

    mixinMethod() {
      /**
       * Demonstration on mixin classes
       */
    }

    render(content?: unknown) {
      return html` <ntl-dialog ${(el: NtlDialogElement) => (this.#ref = el)}> ${content || ''} </ntl-dialog> `;
    }
  }

  return MixinClass;
}
