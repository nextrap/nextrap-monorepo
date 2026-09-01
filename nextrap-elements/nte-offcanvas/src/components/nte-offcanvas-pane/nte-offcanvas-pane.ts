import { nextrap_element } from '@nextrap/nt-core';
import { Listen } from '@trunkjs/browser-utils';
import { html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import { NTE_OFFCANVAS_EVENTS, NteOffcanvasEventDetail, NteOffcanvasPlacement } from '../nte-offcanvas/nte-offcanvas';
import style from './nte-offcanvas-pane.scss?inline';

type EdgePlacement = Exclude<NteOffcanvasPlacement, 'fullscreen'>;
interface ActiveInset { id: string; size: string; duration: string; easing: string; }

@customElement('nte-offcanvas-pane')
export class NteOffcanvasPane extends nextrap_element({ eventBinding: true }) {
  static override styles = [unsafeCSS(style)];
  private readonly active = new Map<EdgePlacement, ActiveInset>();

  @Listen(NTE_OFFCANVAS_EVENTS.opening, { target: 'window' })
  @Listen(NTE_OFFCANVAS_EVENTS.opened, { target: 'window' })
  protected onOffcanvasActive(event: Event): void {
    const detail = (event as CustomEvent<NteOffcanvasEventDetail>).detail;
    if (detail.placement === 'fullscreen') return;
    if (detail.mode !== 'push') {
      if (this.active.get(detail.placement)?.id === detail.id) {
        this.active.delete(detail.placement);
        this.applyInset(detail.placement, detail.duration, detail.easing);
      }
      return;
    }
    this.active.set(detail.placement, { id: detail.id, size: detail.size, duration: detail.duration, easing: detail.easing });
    this.applyInset(detail.placement);
  }

  @Listen(NTE_OFFCANVAS_EVENTS.closed, { target: 'window' })
  protected onOffcanvasClosed(event: Event): void {
    const detail = (event as CustomEvent<NteOffcanvasEventDetail>).detail;
    if (detail.placement === 'fullscreen' || this.active.get(detail.placement)?.id !== detail.id) return;
    this.active.delete(detail.placement);
    this.applyInset(detail.placement, detail.duration, detail.easing);
  }

  private applyInset(placement: EdgePlacement, duration?: string, easing?: string): void {
    const active = this.active.get(placement);
    this.style.setProperty(`--nte-offcanvas-pane-${placement}`, active?.size ?? '0px');
    this.style.setProperty('--nte-offcanvas-pane-transition-duration', active?.duration ?? duration ?? 'var(--nte-offcanvas-transition-duration, 240ms)');
    this.style.setProperty('--nte-offcanvas-pane-transition-easing', active?.easing ?? easing ?? 'var(--nte-offcanvas-transition-easing, ease-in-out)');
  }

  override render() { return html`<div id="pane" part="pane"><slot></slot></div>`; }
}

declare global { interface HTMLElementTagNameMap { 'nte-offcanvas-pane': NteOffcanvasPane; } }
