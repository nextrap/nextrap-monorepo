import { nextrap_element } from '@nextrap/nt-core';
import { resetStyle } from '@nextrap/style-reset';
import { html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import style from './nte-card.scss?inline';

@customElement('nte-card')
export class NteCardElement extends nextrap_element({
  breakpoints: true,
  eventBinding: true,
  slotVisibility: true,
  subLayoutApply: true,
}) {
  static override styles = [unsafeCSS(style), unsafeCSS(resetStyle)];

  @state()
  private accessor _count = 0;

  @property({ type: String, reflect: true })
  public accessor name = 'nte-card';

  private accessor _linkAnchor: HTMLAnchorElement | null = null;

  private findAnchorWithHref(root: Element): HTMLAnchorElement | null {
    if (root instanceof HTMLAnchorElement && root.hasAttribute('href')) return root;
    const a = root.querySelector('a[href]');
    return a instanceof HTMLAnchorElement ? a : null;
  }

  private updateClickableFromLinkSlot(slot?: HTMLSlotElement | null) {
    const linkSlot = slot ?? (this.shadowRoot?.querySelector('slot[name="link"]') as HTMLSlotElement | null);
    if (!linkSlot) {
      this._linkAnchor = null;
      this.classList.remove('clickable');
      return;
    }

    const assigned = linkSlot.assignedElements({ flatten: true });
    let anchor: HTMLAnchorElement | null = null;
    for (const el of assigned) {
      anchor = this.findAnchorWithHref(el);
      if (anchor) break;
    }

    this._linkAnchor = anchor;
    this.classList.toggle('clickable', !!this._linkAnchor);
    this.requestUpdate();
  }

  override firstUpdated(_changedProperties: any) {
    super.firstUpdated(_changedProperties);
    this.updateClickableFromLinkSlot();
  }

  private onLinkSlotChange = (e: Event) => {
    this.updateClickableFromLinkSlot(e.target as HTMLSlotElement);
  };

  override render() {
    const wrapper = html`
      <div part="wrapper" id="wrapper">
        <div part="header" id="header"><slot name="header" data-query=":scope > .header"></slot></div>
        <div part="image" id="image">
          <slot
            id="image-slot"
            name="image"
            data-query=":scope > .image | :scope > img:not(.keep) | :scope > p:has(img:not(.keep))"
          ></slot>
          <div part="gradient" id="gradient"></div>
        </div>
        <div part="content" id="content"><slot></slot></div>
        <div part="footer" id="footer"><slot name="footer" data-query=":scope > .footer"></slot></div>
        <div hidden>
          <slot
            name="link"
            data-query=":scope > p:has(a[href]:empty) | :scope > p:has(a[href].link)"
            @slotchange=${this.onLinkSlotChange}
          ></slot>
        </div>
      </div>
    `;

    const href = this._linkAnchor?.getAttribute('href') || undefined;
    if (href) return html`<a part="link" id="link" href=${href}>${wrapper}</a>`;
    return wrapper;
  }
}
