import { EventBindingsMixin, Listen, LoggingMixin } from '@trunkjs/browser-utils';
import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

// Styles for the light DOM
import { resetStyle } from '@nextrap/style-reset';

// Styles for your component's shadow DOM
import style from './nte-demo-viewer.scss?inline';

@customElement('nte-demo-viewer')
export class NteDemoViewerElement extends EventBindingsMixin(LoggingMixin(LitElement)) {
  static override styles = [unsafeCSS(style), unsafeCSS(resetStyle)];

  @state()
  private accessor _count = 0;

  @property({ type: String, reflect: true })
  public accessor name = 'nte-demo-viewer';

  // Example of listening to window scroll events
  @Listen('scroll', { target: 'window', options: { passive: true } })
  private onScroll(e: Event) {
    this._log('info', 'Window scrolled', e);
  }

  override render() {
    return html`
      <div>
        <h1>Hello, nte-demo-viewer!</h1>
        <p>Count: ${this._count}</p>
        <button @click="${this._increment}">Increment</button>
      </div>
    `;
  }

  private _increment() {
    this._count++;
  }
}
