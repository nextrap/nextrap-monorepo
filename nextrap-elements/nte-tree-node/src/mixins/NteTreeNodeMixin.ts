import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { NteTreeNodeElement } from '../components/nte-tree-node/nte-tree-node';

type Constructor<T = object> = abstract new (...args: any[]) => T;

// @ts-ignore
export function NteTreeNodeMixin<TBase extends Constructor<object>>(Base: TBase) {
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
    #ref?: NteTreeNodeElement;

    mixinMethod() {
      /**
       * Demonstration on mixin classes
       */
    }

    render(content?: unknown) {
      return html` <nte-tree-node ${(el: NteTreeNodeElement) => (this.#ref = el)}> ${content || ''} </nte-tree-node> `;
    }
  }

  return MixinClass;
}
