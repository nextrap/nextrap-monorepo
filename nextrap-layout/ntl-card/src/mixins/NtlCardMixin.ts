import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { NtlCardElement } from '../components/ntl-card/ntl-card';

type Constructor<T = object> = abstract new (...args: any[]) => T;

// @ts-ignore
export function NtlCardMixin<TBase extends Constructor<object>>(Base: TBase) {
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
    #ref?: NtlCardElement;

    mixinMethod() {
      /**
       * Demonstration on mixin classes
       */
    }

    render(content?: unknown) {
      return html` <ntl-card ${(el: NtlCardElement) => (this.#ref = el)}> ${content || ''} </ntl-card> `;
    }
  }

  return MixinClass;
}
