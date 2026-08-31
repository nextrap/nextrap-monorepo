import { nextrap_element } from '@nextrap/nt-core';
import { html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import style from './nte-navbar.scss?inline';

@customElement('nte-navbar')
export class NteNavbar extends nextrap_element({}) {
  static get is() {
    return 'nte-navbar';
  }

  static override styles = [unsafeCSS(style)];

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
    this.classList.toggle('is-scrolled', window.scrollY > 1);
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
