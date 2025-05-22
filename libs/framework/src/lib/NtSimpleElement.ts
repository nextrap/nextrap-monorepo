import { CSSResult, ReactiveElement, unsafeCSS } from 'lit';
import { wrap, Wrapper } from './template-wrapper';


export abstract class NtSimpleElement<const IDs extends readonly string[]> extends ReactiveElement {

  abstract get css(): CSSResult[] | CSSResult;

  public readonly $: Wrapper<IDs>;

  constructor(html: string) {
    super();
    const shadowRoot = this.createRenderRoot();
    this.$ = wrap<IDs>(html, shadowRoot as ShadowRoot);

  }


  override connectedCallback() {
    super.connectedCallback();
    let css = this.css;
    if (!Array.isArray(css)) {
      css = [css];
    }
    const cssStyleSheets = css.map((item) => {
      if (item instanceof CSSResult) {
        return item.styleSheet;
      } else {
        return unsafeCSS(item).styleSheet;
      }
    });
    this.shadowRoot!.adoptedStyleSheets = cssStyleSheets as CSSStyleSheet[];
  }
}