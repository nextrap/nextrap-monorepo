import { html } from 'lit';
import { NteTabsElement } from '../components/nte-tabs/nte-tabs';

type Constructor<T = object> = abstract new (...args: any[]) => T;

// @ts-ignore
export function NteTabsMixin<TBase extends Constructor<object>>(Base: TBase) {
  abstract class MixinClass extends Base {
    __title: string | null = null;

    constructor(...args: any[]) {
      super(...args);

      // document.body.appendChild(this); // Automatically appends the component to the body
    }

    open = false;

    /**
     * The Ref to the component instance
     */
    #ref?: NteTabsElement;

    mixinMethod() {
      /**
       * Demonstration on mixin classes
       */
    }

    render(content?: unknown) {
      return html` <nte-tabs ${(el: NteTabsElement) => (this.#ref = el)}> ${content || ''} </nte-tabs> `;
    }
  }

  return MixinClass;
}
