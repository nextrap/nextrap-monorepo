import { CSSResult, ReactiveElement, unsafeCSS } from 'lit';
import { Wrapper } from './template-wrapper';


export abstract class NtSimpleElement extends ReactiveElement {
  static tpl: Wrapper<any>;
  abstract get css(): CSSResult[] | CSSResult;

  constructor(html: Wrapper<any>) {
    super();
    const shadowRoot = this.createRenderRoot();
    shadowRoot.append(html.fragment);

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