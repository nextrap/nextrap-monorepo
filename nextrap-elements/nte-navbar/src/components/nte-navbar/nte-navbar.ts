import { nextrap_element } from '@nextrap/nt-core';
import { html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import style from './nte-navbar.scss?inline';

export type NteNavbarPosition = 'static' | 'sticky' | 'fixed';

@customElement('nte-navbar')
export class NteNavbar extends nextrap_element({}) {
  static get is() {
    return 'nte-navbar';
  }

  static override styles = [unsafeCSS(style)];

  @property({ type: String, reflect: true })
  public accessor position: NteNavbarPosition = 'static';

  @property({ type: Number, attribute: 'scroll-threshold' })
  public accessor scrollThreshold = 1;

  private readonly _onScroll = () => this.updateScrollState();

  override connectedCallback() {
    super.connectedCallback();
    window.addEventListener('scroll', this._onScroll, { passive: true });
    this.updateScrollState();
  }

  override disconnectedCallback() {
    window.removeEventListener('scroll', this._onScroll);
    super.disconnectedCallback();
  }

  private updateScrollState() {
    const scrollY = Math.max(0, window.scrollY);
    this.classList.toggle('is-scrolled', scrollY > 0);
    this.classList.toggle('is-below-threshold', scrollY > Math.max(0, this.scrollThreshold));
  }

  override render() {
    return html`<div id="navbar" part="navbar"><slot></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nte-navbar': NteNavbar;
  }
}
