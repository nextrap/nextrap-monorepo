import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { NtlCardRowElement } from '../components/ntl-card-row/ntl-card-row';

type Constructor<T = object> = abstract new (...args: any[]) => T;

// @ts-ignore
export function NtlCardRowMixin<TBase extends Constructor<object>>(Base: TBase) {
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
    #ref?: NtlCardRowElement;

    mixinMethod() {
      /**
       * Demonstration on mixin classes
       */
    }

    render(content?: unknown) {
      return html` <ntl-card-row ${(el: NtlCardRowElement) => (this.#ref = el)}> ${content || ''} </ntl-card-row> `;
    }
  }

  return MixinClass;
}
