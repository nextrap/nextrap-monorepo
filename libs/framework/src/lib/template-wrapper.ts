// template-wrapper.ts
// Lazy, IntelliSense-friendly HTML wrapper with DocumentFragment access

// --- Helpers mixed into every element ---
export type Extra = {
  show(this: HTMLElement): void;
  hide(this: HTMLElement): void;
};

const extraImpl: Extra = {
  show() {
    this.style.display = "";
  },
  hide() {
    this.style.display = "none";
  }

};

export type AugmentedEl = HTMLElement & Extra;

// Helper for compile‑time type: all ids + "fragment" property
export type Wrapper<IDs extends readonly string[]> = Record<IDs[number], AugmentedEl> & {
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
export function tpl<const IDs extends readonly string[]>(
  html: string,
  ids: IDs
): Wrapper<IDs> {
  let parsed = false;
  let frag: DocumentFragment;
  let map: Record<IDs[number], AugmentedEl>;

  const init = () => {
    if (parsed) return;
    parsed = true;
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    frag = t.content.cloneNode(true) as DocumentFragment;
    map = Object.create(null);
    ids.forEach(id => {
      const el = frag.querySelector<HTMLElement>(`#${id}`);
      if (!el) {
        throw new Error(
          `❌ ID '${id}' not found.\nKnown: [${ids.join(", ")}]\nHTML:\n${html}`
        );
      }
      Object.assign(el, extraImpl);
      (map as any)[id] = el as AugmentedEl;
    });
  };

  // Proxy providing lazy parsing + rich errors
  return new Proxy({} as Wrapper<IDs>, {
    get(_, prop: string | symbol) {
      if (prop === "fragment") {
        init();
        return frag;
      }
      if (typeof prop === "string") {
        if (!ids.includes(prop as any)) {
          throw new Error(
            `❌ Unknown id '${prop}'.\nKnown: [${ids.join(", ")}]`
          );
        }
        init();
        return map[prop as keyof typeof map];
      }
      return undefined;
    }
  });
}
