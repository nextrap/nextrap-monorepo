import { html } from 'lit';
import { property } from 'lit/decorators.js';

type Constructor<T = object> = abstract new (...args: any[]) => T;

// @ts-ignore
export function NtlDemoMixin<TBase extends Constructor<object>>(Base: TBase) {
  abstract class MixinClass extends Base {
    __title: string | null;

    constructor(...args: any[]) {
      super(...args);

      // document.body.appendChild(this); // Automatically appends the component to the body
    }

    @property({ type: Boolean, reflect: true }) open = false;

    /**
     * The Ref to the component instance
     */
    #ref?: NtlDemo;

    mixinMethod() {
      /**
       * Demonstration on mixin classes
       */
    }

    render(content?: unknown) {
      return html` <ntl-demo ${(el: NtlDemo) => (this.#ref = el)}> ${content || ''} </ntl-demo> `;
    }
  }

  return MixinClass;
}
