import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';

// Styles for the light DOM
import { resetStyle } from '@nextrap/style-reset';

// Styles for your component's shadow DOM
import style from './ntl-demo.scss?inline';

@customElement('ntl-demo')
export class NtlDemoElement extends LitElement {
  @state()
  private _count = 0;

  static override styles = [unsafeCSS(style), unsafeCSS(resetStyle)];

  override render() {
    return html`
      <div>
        <h1>Hello, ntl-demo!</h1>
        <p>Count: ${this._count}</p>
        <button @click="${this._increment}">Increment</button>
      </div>
    `;
  }

  private _increment() {
    this._count++;
  }
}
