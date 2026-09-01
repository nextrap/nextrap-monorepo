import { nextrap_element } from '@nextrap/nt-core';
import { Listen } from '@trunkjs/browser-utils';
import { html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import {
  NTE_OFFCANVAS_EVENTS,
  NteOffcanvasEventDetail,
  NteOffcanvasPlacement,
} from '../nte-offcanvas/nte-offcanvas';
import style from './nte-offcanvas-pane.scss?inline';

type EdgePlacement = Exclude<NteOffcanvasPlacement, 'fullscreen'>;

interface ActiveInset {
  id: string;
  size: string;
  duration: string;
  easing: string;
}

@customElement('nte-offcanvas-pane')
export class NteOffcanvasPane extends nextrap_element({ eventBinding: true }) {
  static override styles = [unsafeCSS(style)];

  private readonly active = new Map<EdgePlacement, ActiveInset>();

  @Listen(NTE_OFFCANVAS_EVENTS.opening, { target: 'window' })
  @Listen(NTE_OFFCANVAS_EVENTS.opened, { target: 'window' })
  protected onOffcanvasActive(event: Event): void {
    const detail = (event as CustomEvent<NteOffcanvasEventDetail>).detail;
    if (detail.mode !== 'push' || detail.placement === 'fullscreen') {
      return;
    }

    this.active.set(detail.placement, {
      id: detail.id,
      size: detail.size,
      duration: detail.duration,
      easing: detail.easing,
    });
    this.applyInset(detail.placement);
  }

  @Listen(NTE_OFFCANVAS_EVENTS.closed, { target: 'window' })
  protected onOffcanvasClosed(event: Event): void {
    const detail = (event as CustomEvent<NteOffcanvasEventDetail>).detail;
    if (detail.placement === 'fullscreen') {
      return;
    }

    const active = this.active.get(detail.placement);
    if (active?.id !== detail.id) {
      return;
    }

    this.active.delete(detail.placement);
    this.applyInset(detail.placement, detail.duration, detail.easing);
  }

  private applyInset(placement: EdgePlacement, duration?: string, easing?: string): void {
    const active = this.active.get(placement);
    const size = active?.size ?? '0px';
    const transitionDuration = active?.duration ?? duration ?? 'var(--nte-offcanvas-transition-duration, 240ms)';
    const transitionEasing = active?.easing ?? easing ?? 'var(--nte-offcanvas-transition-easing, ease-in-out)';

    this.style.setProperty(`--nte-offcanvas-pane-${placement}`, size);
    this.style.setProperty('--nte-offcanvas-pane-transition-duration', transitionDuration);
    this.style.setProperty('--nte-offcanvas-pane-transition-easing', transitionEasing);
  }

  override render() {
    return html`<div id="pane" part="pane"><slot></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nte-offcanvas-pane': NteOffcanvasPane;
  }
}
