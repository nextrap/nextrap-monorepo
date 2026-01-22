import { EventBindingsMixin, Listen, LoggingMixin } from '@trunkjs/browser-utils';
import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

// Styles for the light DOM
import { resetStyle } from '@nextrap/style-reset';

// Styles for your component's shadow DOM
import { SubLayoutApplyMixin } from '@trunkjs/content-pane';
import style from './ntl-card.scss?inline';

@customElement('ntl-card')
export class NtlCardElement extends SubLayoutApplyMixin(EventBindingsMixin(LoggingMixin(LitElement))) {
  static override styles = [unsafeCSS(style), unsafeCSS(resetStyle)];

  @state()
  private accessor _count = 0;

  @property({ type: String, reflect: true })
  public accessor name = 'ntl-card';

  // Example of listening to window scroll events
  @Listen('scroll', { target: 'window', options: { passive: true } })
  private onScroll(e: Event) {
    this.log('info', 'Window scrolled', e);
  }

  override render() {
    return html`
      <div part="wrapper">
       <div part="header">
          <slot name="header" data-query=":scope > .header | :scope > h1:not(.keep),h2:not(.keep),h3:not(.keep),h4:not(.keep),h5:not(.keep),h6:not(.keep)""></slot>
       </div>
        <div part="image">
          <slot id="image" name="image" data-query=":scope > .image | :scope > img:not(.keep) | :scope > p:has(img:not(.keep))"></slot>
        </div>
        <div part="content">
          <slot></slot>
        </div>
      </div>
    `;
  }
}
