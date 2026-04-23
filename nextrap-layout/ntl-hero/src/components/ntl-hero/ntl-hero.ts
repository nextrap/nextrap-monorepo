import { LoggingMixin, sleep, SlotVisibilityMixin } from '@trunkjs/browser-utils';
import { SubLayoutApplyMixin } from '@trunkjs/content-pane';
import { html, LitElement, PropertyValues, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';

// Styles for the light DOM
import { resetStyle } from '@nextrap/style-reset';

// Styles for your component's shadow DOM
import style from './ntl-hero.scss?inline';

@customElement('ntl-hero')
export class NtlHero extends SlotVisibilityMixin(SubLayoutApplyMixin(LoggingMixin(LitElement))) {
  static override styles = [unsafeCSS(style), unsafeCSS(resetStyle)];

  protected override async updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    await sleep(1000);
    this.style.setProperty('--height-offset', `${this.offsetTop}px`);
  }

  protected override render(): unknown {
    return html`
      <div part="root" id="root">
        <div id="background">
          <slot name="bg"></slot>
        </div>

        <div id="wrapper">
          <div id="top-title" part="top-title">
            <slot name="top-title"></slot>
          </div>

          <div id="title" part="title">
            <slot name="title"></slot>
          </div>

          <div id="content" part="content">
            <slot></slot>
          </div>

          <div id="footer" part="footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    `;
  }
}
