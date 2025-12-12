import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { NtlAccordionElement } from '../components/ntl-accordion/ntl-accordion';

type Constructor<T = object> = abstract new (...args: any[]) => T;

// @ts-ignore
export function NtlAccordionMixin<TBase extends Constructor<object>>(Base: TBase) {
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
    #ref?: NtlAccordionElement;

    mixinMethod() {
      /**
       * Demonstration on mixin classes
       */
    }

    render(content?: unknown) {
      return html` <ntl-accordion ${(el: NtlAccordionElement) => (this.#ref = el)}> ${content || ''} </ntl-accordion> `;
    }
  }

  return MixinClass;
}
