import { nextrap_element } from '@nextrap/nt-core';
import { Listen } from '@trunkjs/browser-utils';
import { html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { NTE_OFFCANVAS_EVENTS, NteOffcanvasEventDetail, NteOffcanvasPlacement } from '../nte-offcanvas/nte-offcanvas';
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

  @property({ type: String, attribute: 'layout-group' })
  public accessor layoutGroup = '';

  private readonly active = new Map<EdgePlacement, Map<string, ActiveInset>>();

  @Listen(NTE_OFFCANVAS_EVENTS.opening, { target: 'window' })
  @Listen(NTE_OFFCANVAS_EVENTS.opened, { target: 'window' })
  protected onOffcanvasActive(event: Event): void {
    const detail = (event as CustomEvent<NteOffcanvasEventDetail>).detail;
    if (detail.placement === 'fullscreen') return;

    const activeAtPlacement = this.getActiveAtPlacement(detail.placement);
    activeAtPlacement.delete(detail.id);

    if (detail.mode === 'push' && this.accepts(detail.layoutGroup)) {
      // Reinsert updated surfaces so closing the latest one restores the previously active inset on that edge.
      activeAtPlacement.set(detail.id, {
        id: detail.id,
        size: detail.size,
        duration: detail.duration,
        easing: detail.easing,
      });
    }

    this.applyInset(detail.placement, detail.duration, detail.easing);
  }

  @Listen(NTE_OFFCANVAS_EVENTS.closed, { target: 'window' })
  protected onOffcanvasClosed(event: Event): void {
    const detail = (event as CustomEvent<NteOffcanvasEventDetail>).detail;
    if (detail.placement === 'fullscreen') return;

    const activeAtPlacement = this.active.get(detail.placement);
    if (!activeAtPlacement?.delete(detail.id)) return;

    this.applyInset(detail.placement, detail.duration, detail.easing);
  }

  private accepts(layoutGroup: string): boolean {
    if (layoutGroup === '') return false;
    return this.layoutGroup.split(/\s+/u).includes(layoutGroup);
  }

  private getActiveAtPlacement(placement: EdgePlacement): Map<string, ActiveInset> {
    let activeAtPlacement = this.active.get(placement);
    if (activeAtPlacement === undefined) {
      activeAtPlacement = new Map();
      this.active.set(placement, activeAtPlacement);
    }
    return activeAtPlacement;
  }

  private applyInset(placement: EdgePlacement, duration?: string, easing?: string): void {
    const activeAtPlacement = this.active.get(placement);
    const activeInsets = activeAtPlacement === undefined ? [] : Array.from(activeAtPlacement.values());
    const active = activeInsets[activeInsets.length - 1];
    this.style.setProperty(`--nte-offcanvas-pane-${placement}`, active?.size ?? '0px');
    this.style.setProperty(
      '--nte-offcanvas-pane-transition-duration',
      active?.duration ?? duration ?? 'var(--nte-offcanvas-transition-duration, 240ms)',
    );
    this.style.setProperty(
      '--nte-offcanvas-pane-transition-easing',
      active?.easing ?? easing ?? 'var(--nte-offcanvas-transition-easing, ease-in-out)',
    );
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
