import { html } from 'lit';
import { NteMultiselectElement } from '../components/nte-multiselect/nte-multiselect';

type Constructor<T = object> = abstract new (...args: any[]) => T;

// @ts-ignore
export function NteMultiselectMixin<TBase extends Constructor<object>>(Base: TBase) {
  abstract class MixinClass extends Base {
    __title: string | null = null;

    static get properties() {
      return {
        open: { type: Boolean, reflect: true },
      };
    }

    open = false;

    constructor(...args: any[]) {
      super(...args);

      // document.body.appendChild(this); // Automatically appends the component to the body
    }

    /**
     * The Ref to the component instance
     */
    #ref?: NteMultiselectElement;

    mixinMethod() {
      /**
       * Demonstration on mixin classes
       */
    }

    render(content?: unknown) {
      return html`
        <nte-multiselect ${(el: NteMultiselectElement) => (this.#ref = el)}> ${content || ''} </nte-multiselect>
      `;
    }
  }

  return MixinClass;
}
