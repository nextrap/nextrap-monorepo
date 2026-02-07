import { isBiggerThanBreakpoint } from '@nextrap/nt-framework';
import { nextrap_layout } from '@nextrap/ntl-core';
import { html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import style from './ntl-2col.scss?inline';

@customElement('ntl-2col')
export class Ntl2Col extends nextrap_layout({
  breakpoints: true,
  subLayoutApplyMixin: true,
  slotVisibility: true,
  eventBinding: false,
}) {
  static override styles = [unsafeCSS(style)];

  @property({ type: String, reflect: true })
  breakAt = 'md';

  @property({ type: Number, reflect: true })
  cols = 6;

  override connectedCallback() {
    super.connectedCallback();
  }

  protected override render(): unknown {
    const isBigger = isBiggerThanBreakpoint(this.breakAt);

    return html`
      <section part="section" style="--cols: ${this.cols};">
        <div part="top">
          <slot name="top" data-query=":scope > .top"></slot>
        </div>
        <div id="row" class="${isBigger ? 'row' : 'col'}">
          <div part="main">
            <slot></slot>
          </div>
          <div part="aside" >
            <slot name="aside" data-query=":scope > aside | :scope > p:has(img)"></slot>
          </div>
        </div>
        <div part="bottom">
          <slot name="bottom" data-query=":scope > .bottom"></slot>
        </div>
      </section>
    `;
  }
}
