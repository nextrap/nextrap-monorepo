
import styleNavbar from './style-navbar.scss?inline';
import {NtSimpleElement} from '@nextrap/framework';
import {customElement, html, CSSResult, unsafeCSS} from '@nextrap/framework';

const tpl = html`
<div id="wrapper">
  <div id="navbar">
    
  </div>
  <div id="spacer"></div>
</div>
`;


@customElement('nt-element-navbar')
class NtElementNavbar extends NtSimpleElement {
  override get html(): string {
    throw new Error('Method not implemented.');
  }
  override get css(): CSSResult | CSSResult[] {
    return unsafeCSS(styleNavbar)
  }

  constructor() {
    super();

    const shadowRoot = this.createRenderRoot();
  }

  static get is() {
    return 'nx-element-navbar';
  }

  override connectedCallback() {
    super.connectedCallback();
    this.shadowRoot!.adoptedStyleSheets = [
      unsafeCSS(styleNavbar).styleSheet as CSSStyleSheet,
    ];
  }
}

