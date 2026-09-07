import { nextrap_element } from '@nextrap/nt-core';
import { html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import style from './nte-navbar.scss?inline';

interface NteNavbarComponentStyle {
  scrollThreshold: number;
}

@customElement('nte-navbar')
export class NteNavbar extends nextrap_element({}) {
  static get is() {
    return 'nte-navbar';
  }

  static override styles = [unsafeCSS(style)];

  private scrollThreshold = 1;
  private readonly styleObserver = new MutationObserver(() => this.refreshComponentStyle());
  private readonly _onScroll = () => this.updateScrollState();
  private readonly _onSlotChange = () => this.updateScrollState();

  override connectedCallback() {
    super.connectedCallback();
    this.styleObserver.observe(this, { attributes: true, attributeFilter: ['class', 'style'] });
    window.addEventListener('scroll', this._onScroll, { passive: true });
    this.refreshComponentStyle();
  }

  override disconnectedCallback() {
    this.styleObserver.disconnect();
    window.removeEventListener('scroll', this._onScroll);
    super.disconnectedCallback();
  }

  public refreshComponentStyle(): void {
    const componentStyle = this.getComponentStyle();
    this.scrollThreshold = componentStyle.scrollThreshold;
    this.updateScrollState();
  }

  private getComponentStyle(): NteNavbarComponentStyle {
    const computed = getComputedStyle(this);
    const rawThreshold = computed.getPropertyValue('--nte-navbar-scroll-threshold').trim();
    const parsedThreshold = Number.parseFloat(rawThreshold);

    return {
      scrollThreshold: Number.isFinite(parsedThreshold) ? Math.max(0, parsedThreshold) : 1,
    };
  }

  private updateScrollState() {
    const scrollY = Math.max(0, window.scrollY);
    const isScrolled = scrollY > 0;
    const isBelowThreshold = scrollY > this.scrollThreshold;
    this.classList.toggle('is-scrolled', isScrolled);
    this.classList.toggle('is-below-threshold', isBelowThreshold);
    this.syncLineScrollState(isScrolled, isBelowThreshold);
  }

  private syncLineScrollState(isScrolled: boolean, isBelowThreshold: boolean): void {
    // Mirror the navbar state to line hosts so line Shadow DOM does not depend on ancestor selectors.
    for (const line of Array.from(this.querySelectorAll<HTMLElement>('nte-navbar-line'))) {
      line.classList.toggle('is-navbar-scrolled', isScrolled);
      line.classList.toggle('is-navbar-below-threshold', isBelowThreshold);
    }
  }

  override render() {
    return html`<div id="navbar" part="navbar"><slot @slotchange=${this._onSlotChange}></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nte-navbar': NteNavbar;
  }
}
