import { BreakPointMixin, LoggingMixin } from '@trunkjs/browser-utils';
import { SubLayoutApplyMixin } from '@trunkjs/content-pane';
import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

// Styles for the light DOM

// Styles for your component's shadow DOM
//import style from './ntl-card-row.scss?inline';

@customElement('ntl-card-row-element')
export class NtlCardRowElementElement extends BreakPointMixin(SubLayoutApplyMixin(LoggingMixin(LitElement))) {
  //  static override styles = [unsafeCSS(style), unsafeCSS(resetStyle)];

  @state()
  private accessor _count = 0;

  @property({ type: String, reflect: true })
  public accessor name = 'ntl-card-row';

  override render() {
    return html`
      <nte-card>
        <slot slot="header" name="header" data-query=":scope > .header | :scope > h2,h3:not(.keep),h4,h5,h6:not(.keep)"
        <slot slot="image" name="image" data-query=":scope > .image | :scope > img:not(.keep)"></slot>
        <slot></slot>
      </nte-card>
    `;
  }

  private _increment() {
    this._count++;
  }
}
