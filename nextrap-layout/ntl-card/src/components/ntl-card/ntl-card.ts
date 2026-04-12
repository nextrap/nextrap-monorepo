import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

// Styles for the light DOM
import { resetStyle } from '@nextrap/style-reset';

// Styles for your component's shadow DOM
import { SubLayoutApplyMixin } from '@trunkjs/content-pane';
import { Listen } from '@trunkjs/browser-utils';
import style from './ntl-card.scss?inline';
import { nextrap_layout } from '@nextrap/ntl-core';

@customElement('ntl-card')
export class NtlCardElement extends nextrap_layout({
  breakpoints: true,
  subLayoutApply: true,
  eventBinding: true,
  slotVisibility: true
}) {
  static override styles = [unsafeCSS(style), unsafeCSS(resetStyle)];

  @state()
  private accessor _count = 0;

  @property({ type: String, reflect: true })
  public accessor name = 'ntl-card';

  private accessor _linkAnchor: HTMLAnchorElement | null = null;

  private findAnchorWithHref(root: Element): HTMLAnchorElement | null {
    if (root instanceof HTMLAnchorElement && root.hasAttribute('href')) {
      return root;
    }
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

    // wichtig: wenn sich Link/href ändert, muss gerendert werden (outer <a href=...>)
    this.requestUpdate();
  }

  override firstUpdated(_changedProperties: any) {
    super.firstUpdated(_changedProperties);
    // Initiale Ermittlung (falls kein slotchange feuert oder Content bereits da ist)
    this.updateClickableFromLinkSlot();
  }

  private onLinkSlotChange = (e: Event) => {
    this.updateClickableFromLinkSlot(e.target as HTMLSlotElement);
  };


  override render() {
    const wrapper = html`
      <div part="wrapper" id="wrapper">
        <div part="header" id="header">
          <slot name="header" data-query=":scope > .header"></slot>
        </div>
        <div part="image" id="image">
          <slot
            id="image-slot"
            name="image"
            data-query=":scope > .image | :scope > img:not(.keep) | :scope > p:has(img:not(.keep))"
          ></slot>
          <div part="gradient" id="gradient"></div>
        </div>
        <div part="content" id="content">
          <slot></slot>
        </div>
        <div part="footer" id="footer">
          <slot name="footer" data-query=":scope > .footer"></slot>
        </div>
        <div hidden>
          <slot name="link" data-query=":scope > p:has(a[href]:empty)" @slotchange=${this.onLinkSlotChange}></slot>
        </div>
      </div>
    `;

    const href = this._linkAnchor?.getAttribute('href') || undefined;

    // Wenn ein Link gesetzt ist, wrapper komplett als <a> klickbar machen.
    // Das geslottete <a> selbst bleibt hidden im Slot, wir übernehmen nur das href.
    if (href) {
      return html`<a part="link" id="link" href=${href}>${wrapper}</a>`;
    }

    return wrapper;
  }
}
