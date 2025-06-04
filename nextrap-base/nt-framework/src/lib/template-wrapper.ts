// template-wrapper.ts
// Lazy, IntelliSense-friendly HTML wrapper with DocumentFragment access

// --- Helpers mixed into every element ---
export type Extra = {
  show(this: HTMLElement): void;
  hide(this: HTMLElement): void;
};

export type AugmentedEl =
  | HTMLElement
  | HTMLSlotElement
  | HTMLTemplateElement
  | HTMLStyleElement
  | HTMLScriptElement
  | HTMLLinkElement
  | (Element & { [key: string]: any });

// Helper for compile‑time type: all ids + "fragment" property
export type Wrapper<IDs extends readonly string[]> = Record<
  IDs[number],
  AugmentedEl
> & {
  fragment: DocumentFragment;
};

/**
 * Create a lazy HTML wrapper. Parsing is **deferred** until the first access
 * (an id or the `fragment` property).
 *
 * @example
 * const html = `<div id="foo"></div><span id="bar"></span>`;
 * const w = tpl(html, ["foo", "bar"] as const);
 * w.foo.show();    // parses now
 * w.fragment;      // DocumentFragment with the cloned nodes
 */
export function wrap<const IDs extends readonly string[]>(
  html: string,
  shadowRoot: ShadowRoot,
): Wrapper<IDs> {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  shadowRoot.append(t.content.cloneNode(true));

  // Proxy providing lazy parsing + rich errors
  return new Proxy({} as Wrapper<IDs>, {
    get(_, prop: string | symbol) {
      if (prop === 'fragment') {
        return shadowRoot;
      }
      if (typeof prop === 'string') {
        const e = shadowRoot.getElementById(prop);
        if (!e) {
          throw new Error(`❌ Unknown id '${prop}'.`);
        }
        return e as AugmentedEl;
      }
      return undefined;
    },
  });
}
