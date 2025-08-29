import { html } from 'lit';
import { NteCardElement } from '../components/nte-card/nte-card';

type Constructor<T = object> = abstract new (...args: any[]) => T;

// @ts-ignore
export function NteCardMixin<TBase extends Constructor<object>>(Base: TBase) {
  abstract class MixinClass extends Base {
    __title: string | null = null;

    constructor(...args: any[]) {
      super(...args);

      // document.body.appendChild(this); // Automatically appends the component to the body
    }

    /**
     * The Ref to the component instance
     */
    #ref?: NteCardElement;

    mixinMethod() {
      /**
       * Demonstration on mixin classes
       */
    }

    render(content?: unknown) {
      return html` <nte-card ${(el: NteCardElement) => (this.#ref = el)}> ${content || ''} </nte-card> `;
    }
  }

  return MixinClass;
}
