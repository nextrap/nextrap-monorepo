import { BreakPointMixin, EventBindingsMixin, Listen, LoggingMixin, SlotVisibilityMixin } from '@trunkjs/browser-utils';
import { SubLayoutApplyMixin } from '@trunkjs/content-pane';
import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

// Styles for the light DOM
import { resetStyle } from '@nextrap/style-reset';

// Styles for your component's shadow DOM
import style from './ntl-card-grid.scss?inline';

@customElement('ntl-card-grid')
export class NtlCardGridElement extends SlotVisibilityMixin(
  BreakPointMixin(SubLayoutApplyMixin(EventBindingsMixin(LoggingMixin(LitElement)))),
) {
  static override styles = [unsafeCSS(style), unsafeCSS(resetStyle)];

  @property({ type: String, reflect: true })
  public accessor childLayout = 'ntl-card';

  @property({ type: String, reflect: true })
  public accessor name = 'ntl-card-grid';

  // Example of listening to window scroll events
  @Listen('scroll', { target: 'window', options: { passive: true } })
  private onScroll(e: Event) {
    this.log('info', 'Window scrolled', e);
  }

  override render() {
    return html`
      <div part="wrapper" id="wrapper">
        <div part="header" id="header">
          <slot
            name="header"
            data-query=":scope > .header | :scope > h1:not(.keep),:scope > h2:not(.keep),:scope > h3:not(.keep),:scope > h4:not(.keep),:scope > h5:not(.keep),:scope > h6:not(.keep)"
          ></slot>
        </div>
        <div part="content-wrapper" id="content-wrapper">
          <div part="main" id="main">
            <slot data-query=":scope > section:not(.aside)" data-set-attribute-layout="${this.childLayout}"></slot>
          </div>
          <div part="aside" id="aside">
            <slot name="aside" data-query=".aside"></slot>
          </div>
        </div>
        <div part="footer" id="footer">
          <slot name="footer" data-query=":scope > .footer"></slot>
        </div>
      </div>
    `;
  }
}
