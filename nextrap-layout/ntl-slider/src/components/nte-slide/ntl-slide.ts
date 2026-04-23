import { EventBindingsMixin, LoggingMixin, SlotVisibilityMixin } from '@trunkjs/browser-utils';
import { SubLayoutApplyMixin } from '@trunkjs/content-pane';
import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

// Styles for the light DOM
import { resetStyle } from '@nextrap/style-reset';

// Styles for your component's shadow DOM
import style from './ntl-slide.scss?inline';

@customElement('ntl-slide')
export class NtlSlideElement extends SlotVisibilityMixin(
  SubLayoutApplyMixin(EventBindingsMixin(LoggingMixin(LitElement))),
) {
  static override styles = [unsafeCSS(style), unsafeCSS(resetStyle)];

  @property({ type: String, reflect: true })
  public accessor name = 'ntl-slide';

  override render() {
    return html`
      <div part="wrapper" id="wrapper">
        <div part="image" id="image">
          <slot name="image" data-query=":scope > img:not(.keep) | :scope > p:has(img:not(.keep))"></slot>
        </div>
        <div part="gradient" id="gradient"></div>
        <div part="content" id="content">
          <slot></slot>
        </div>
      </div>
    `;
  }
}
