import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';

import { resetStyle } from '@nextrap/style-reset';
import style from './nte-split-view.scss?inline';

@customElement('nte-split-view')
export class NteSplitViewElement extends LitElement {
  static override styles = [unsafeCSS(style), unsafeCSS(resetStyle)];

  // Resizing enabled/disabled
  @property({ type: Boolean, reflect: true }) resizable = false;

  // Accessibility label for the resizer handle
  @property({ type: String }) label: string = 'Resize the panels';

  @query('slot') private _slotEl!: HTMLSlotElement;

  @state() private _resizing = false;
  private _pointerId: number | null = null;
  private _startCoord = 0;
  private _startPrimarySize = 0;

  override render() {
    const ariaOrientation = this._isVertical() ? 'vertical' : 'horizontal';
    const tabIndex = this.resizable ? 0 : -1;

    return html`
      <div class="container">
        <slot @slotchange=${this._onSlotChange}></slot>
        <div
          id="splitter"
          role="separator"
          aria-orientation=${ariaOrientation}
          aria-label=${this.label || 'Resize the panels'}
          tabindex=${tabIndex}
          @pointerdown=${this._onPointerDown}
          @keydown=${this._onKeyDown}
        >
          <div id="gripper"></div>
        </div>
      </div>
    `;
  }

  private _onSlotChange = () => {
    const assigned = this._assignedElements();
    if (assigned.length > 2) {
      console.warn('nte-split-view: more than 2 elements in default slot. Only the first two are used.');
    }
  };

  private _assignedElements(): HTMLElement[] {
    if (!this._slotEl) return [];
    return this._slotEl.assignedElements({ flatten: true }) as HTMLElement[];
  }

  private _isVertical(): boolean {
    return this.classList.contains('vertical');
  }

  private _isReverse(): boolean {
    return this.classList.contains('reverse');
  }

  private _onPointerDown(e: PointerEvent) {
    if (!this.resizable) return;

    const assigned = this._assignedElements();
    if (assigned.length < 2) return;

    const splitter = e.currentTarget as HTMLElement;
    splitter.setPointerCapture(e.pointerId);
    this._pointerId = e.pointerId;

    const primary = assigned[0];
    const rect = primary.getBoundingClientRect();

    this._startCoord = this._isVertical() ? e.clientY : e.clientX;
    this._startPrimarySize = this._isVertical() ? rect.height : rect.width;

    this._resizing = true;
    window.addEventListener('pointermove', this._onPointerMove);
    window.addEventListener('pointerup', this._onPointerUp);
    window.addEventListener('pointercancel', this._onPointerUp);
    e.preventDefault();
  }

  private _onPointerMove = (e: PointerEvent) => {
    if (!this._resizing || this._pointerId === null) return;

    const containerRect = this.getBoundingClientRect();
    const total = this._isVertical() ? containerRect.height : containerRect.width;

    const current = this._isVertical() ? e.clientY : e.clientX;
    const reverse = this._isReverse();

    const delta = reverse ? this._startCoord - current : current - this._startCoord;
    const raw = this._startPrimarySize + delta;

    const { min, max } = this._getMinMax(total);
    const clamped = Math.max(min, Math.min(max, raw));
    this.style.setProperty('--primary-size', `${Math.round(clamped)}px`);
  };

  private _onPointerUp = (e: PointerEvent) => {
    if (this._pointerId !== e.pointerId) return;
    this._pointerId = null;
    this._resizing = false;
    window.removeEventListener('pointermove', this._onPointerMove);
    window.removeEventListener('pointerup', this._onPointerUp);
    window.removeEventListener('pointercancel', this._onPointerUp);
  };

  private _onKeyDown = (e: KeyboardEvent) => {
    if (!this.resizable) return;

    const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    if (!keys.includes(e.key)) return;

    const containerRect = this.getBoundingClientRect();
    const total = this._isVertical() ? containerRect.height : containerRect.width;

    const cs = getComputedStyle(this);
    const sizeVar = (cs.getPropertyValue('--primary-size') || '').trim();
    let currentPx = this._parseSize(sizeVar, total);
    if (!Number.isFinite(currentPx)) {
      // fallback: measure current primary
      const assigned = this._assignedElements();
      if (assigned.length >= 1) {
        const r = assigned[0].getBoundingClientRect();
        currentPx = this._isVertical() ? r.height : r.width;
      } else {
        currentPx = total / 2;
      }
    }

    const stepBase = 10;
    const step = e.shiftKey ? stepBase * 3 : stepBase;
    const reverse = this._isReverse();
    const vertical = this._isVertical();

    let delta = 0;
    if (!vertical) {
      if (e.key === 'ArrowLeft') delta = reverse ? step : -step;
      if (e.key === 'ArrowRight') delta = reverse ? -step : step;
    } else {
      if (e.key === 'ArrowUp') delta = reverse ? step : -step;
      if (e.key === 'ArrowDown') delta = reverse ? -step : step;
    }

    const { min, max } = this._getMinMax(total);
    const next = Math.max(min, Math.min(max, currentPx + delta));
    this.style.setProperty('--primary-size', `${Math.round(next)}px`);
    e.preventDefault();
  };

  private _getMinMax(total: number): { min: number; max: number } {
    const cs = getComputedStyle(this);
    const minVar = (cs.getPropertyValue('--primary-min-size') || '').trim();
    const maxVar = (cs.getPropertyValue('--primary-max-size') || '').trim();
    const sizeVar = (cs.getPropertyValue('--primary-size') || '').trim();

    const minDefined = !!minVar;
    const maxDefined = !!maxVar;

    // Defaults:
    // - if resizable and no min/max: [0, 100%]
    // - else fixed size fallback to --primary-size
    let min = this._parseSize(minVar, total);
    let max = this._parseSize(maxVar, total);

    if (!minDefined && !maxDefined) {
      if (this.resizable) {
        min = 0;
        max = total;
      } else {
        const fixed = this._parseSize(sizeVar || '50%', total);
        min = fixed;
        max = fixed;
      }
    } else {
      if (!minDefined) min = 0;
      if (!maxDefined) max = total;
    }

    // Guard rails
    if (!Number.isFinite(min)) min = 0;
    if (!Number.isFinite(max)) max = total;
    if (min > max) {
      // swap if input is invalid
      const t = min;
      min = max;
      max = t;
    }
    return { min, max };
  }

  private _parseSize(val: string, total: number): number {
    if (!val) return NaN;
    const v = val.trim();
    if (v.endsWith('%')) {
      const p = parseFloat(v);
      return (p / 100) * total;
    }
    if (v.endsWith('px')) {
      return parseFloat(v);
    }
    const n = parseFloat(v);
    return Number.isNaN(n) ? NaN : n;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nte-split-view': NteSplitViewElement;
  }
}
