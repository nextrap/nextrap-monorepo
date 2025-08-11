import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';

// Styles for the light DOM
import { resetStyle } from '@nextrap/style-reset';

// Styles for your component's shadow DOM
import style from './ntl-card-row.scss?inline';

@customElement('ntl-card-row')
export class NtlCardRow extends LitElement {
  @state()
  private _count = 0;

  static override styles = [unsafeCSS(style), unsafeCSS(resetStyle)];

  beforeLayoutCallback(origElement: HTMLElement, instance: this, children: Element[]): void | boolean {
    let hi = 3;
    if (isSectionTreeElement(origElement)) {
      hi = origElement.__IT.hi ?? 3; // Default to 3 if not defined
    }
    attrAssign(origElement, `:scope > section`, { layout: 'sub-component' });
  }

  render() {
    return html`
      <div>
        <h1>Hello, card-row!</h1>
        <p>Count: ${this._count}</p>
        <button @click="${this._increment}">Increment</button>
      </div>
    `;
  }

  private _increment() {
    this._count++;
  }
}
