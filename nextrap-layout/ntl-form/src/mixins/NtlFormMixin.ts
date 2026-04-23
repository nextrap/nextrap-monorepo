import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { NtlFormElement } from '../components/ntl-form/ntl-form';

type Constructor<T = object> = abstract new (...args: any[]) => T;

// @ts-ignore
export function NtlFormMixin<TBase extends Constructor<object>>(Base: TBase) {
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
    #ref?: NtlFormElement;

    mixinMethod() {
      /**
       * Demonstration on mixin classes
       */
    }

    render(content?: unknown) {
      return html` <ntl-form ${(el: NtlFormElement) => (this.#ref = el)}> ${content || ''} </ntl-form> `;
    }
  }

  return MixinClass;
}
