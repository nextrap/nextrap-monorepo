import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { NteDemoViewerElement } from '../components/nte-demo-viewer/nte-demo-viewer';

type Constructor<T = object> = abstract new (...args: any[]) => T;

// @ts-ignore
export function NteDemoViewerMixin<TBase extends Constructor<object>>(Base: TBase) {
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
    #ref?: NteDemoViewerElement;

    mixinMethod() {
      /**
       * Demonstration on mixin classes
       */
    }

    render(content?: unknown) {
      return html`
        <nte-demo-viewer ${(el: NteDemoViewerElement) => (this.#ref = el)}> ${content || ''} </nte-demo-viewer>
      `;
    }
  }

  return MixinClass;
}
