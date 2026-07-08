import { LitElement } from 'lit';

export type Constructor<T = object> = abstract new (...args: any[]) => T;

export interface SetDefaultStyleMixinInterface {
  ensureDefaultStyleClass(): void;
}

export function SetDefaultStyleMixin<TBase extends Constructor<LitElement>>(
  Base: TBase,
): TBase & Constructor<SetDefaultStyleMixinInterface> {
  abstract class SetDefaultStyleMixinClass extends Base implements SetDefaultStyleMixinInterface {
    #styleClassObserver?: MutationObserver;

    override connectedCallback(): void {
      super.connectedCallback();
      this.ensureDefaultStyleClass();
      this.#observeStyleClassChanges();
    }

    override disconnectedCallback(): void {
      this.#styleClassObserver?.disconnect();
      this.#styleClassObserver = undefined;
      super.disconnectedCallback();
    }

    ensureDefaultStyleClass(): void {
      const hasStyleClass = Array.from(this.classList).some((className) => className.startsWith('style-'));

      if (!hasStyleClass) {
        this.classList.add('style-default');
      }
    }

    #observeStyleClassChanges(): void {
      if (this.#styleClassObserver !== undefined) {
        return;
      }

      this.#styleClassObserver = new MutationObserver(() => this.ensureDefaultStyleClass());
      this.#styleClassObserver.observe(this, {
        attributes: true,
        attributeFilter: ['class'],
      });
    }
  }

  return SetDefaultStyleMixinClass;
}
