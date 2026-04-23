import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { NteThemeSwitcherElement } from '../components/nte-theme-switcher/nte-theme-switcher';

type Constructor<T = object> = abstract new (...args: any[]) => T;

// @ts-ignore
export function NteThemeSwitcherMixin<TBase extends Constructor<object>>(Base: TBase) {
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
    #ref?: NteThemeSwitcherElement;

    mixinMethod() {
      /**
       * Demonstration on mixin classes
       */
    }

    render(content?: unknown) {
      return html`
        <nte-theme-switcher ${(el: NteThemeSwitcherElement) => (this.#ref = el)}> ${content || ''} </nte-theme-switcher>
      `;
    }
  }

  return MixinClass;
}
