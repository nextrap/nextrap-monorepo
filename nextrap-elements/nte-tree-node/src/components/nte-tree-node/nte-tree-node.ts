import { LoggingMixin } from '@trunkjs/browser-utils';
import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

// Styles for the light DOM
import { resetStyle } from '@nextrap/style-reset';

// Styles for your component's shadow DOM
import style from './nte-tree-node.scss?inline';

@customElement('nte-tree-node')
export class NteTreeNodeElement extends LoggingMixin(LitElement) {
  static override styles = [unsafeCSS(style), unsafeCSS(resetStyle)];

  @state()
  private accessor _count = 0;

  @property({ type: String, reflect: true })
  public accessor name = 'nte-tree-node';

  override render() {
    return html`
      <div>
        <h1>Hello, nte-tree-node!</h1>
        <p>Count: ${this._count}</p>
        <button @click="${this._increment}">Increment</button>
      </div>
    `;
  }

  private _increment() {
    this._count++;
  }
}
