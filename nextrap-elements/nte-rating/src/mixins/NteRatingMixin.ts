import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { NteRatingElement } from '../components/nte-rating/nte-rating';

type Constructor<T = object> = abstract new (...args: any[]) => T;

// @ts-ignore
export function NteRatingMixin<TBase extends Constructor<object>>(Base: TBase) {
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
    #ref?: NteRatingElement;

    mixinMethod() {
      /**
       * Demonstration on mixin classes
       */
    }

    render(content?: unknown) {
      return html` <nte-rating ${(el: NteRatingElement) => (this.#ref = el)}> ${content || ''} </nte-rating> `;
    }
  }

  return MixinClass;
}
