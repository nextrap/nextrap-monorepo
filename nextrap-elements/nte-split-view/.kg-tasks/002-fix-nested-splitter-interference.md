---
slugName: fix-nested-splitter-interference
includeFiles:
    - ./src/components/nte-split-view/nte-split-view.ts
    - ./src/components/nte-split-view/nte-split-view.scss
    - ./src/components/nte-split-view/nte-split-view.spec.ts
    - ./demo/split-view.html
    - ./README.md
editFiles:
    - ./src/components/nte-split-view/nte-split-view.ts
    - ./src/components/nte-split-view/nte-split-view.scss
    - ./src/components/nte-split-view/nte-split-view.spec.ts
    - ./README.md
original_prompt: In dem Beispiel mit verschachtelten Split views verändert das skalieren
    des horizontalen inneren Split views die position des vertikalen äusseren split
    views. Der Splitter div ist ausserhalb der trennung zwischen den divs. bitte beheben.
---

# Prepare Fix nested split-view interference (splitter overlap)

Horizontal inner splitter drags were moving the outer vertical splitter in the nested demo. Cause: the outer splitter was absolutely positioned on top of slotted content, so it could intercept pointer events at the intersection point. Fix by moving the splitter into the flex flow between two named slots (primary and secondary). This removes the overlay and prevents cross-component pointer interference.

## Assumptions

- Backward compatibility: users still provide two children in the default slot. Internally we re-slot them to named slots "primary" and "secondary".
- It’s acceptable for the splitter to consume its own thickness in layout (default 3px) instead of overlaying.
- Percent-based sizes may now be interpreted against (container size - splitter thickness). For typical sizes, this is negligible and yields expected behavior.
- Demo markup remains valid; no user-facing API changes required.

## Missing Information

- None

## Tasks

- refactor-layout Use named slots and put splitter between panes to avoid overlay
- update-events Adjust sizing math to subtract splitter thickness
- slotting-logic Re-slot first two default children to named slots; warn on extras
- tests Update unit tests to new slot structure
- docs Update README with note about nested behavior and splitter position

## Overview: File changes

- src/components/nte-split-view/nte-split-view.ts Refactor template to named slots + in-flow splitter; re-slot logic; adjust pointer math
- src/components/nte-split-view/nte-split-view.scss Rewrite layout to flex with splitter as flex item; remove absolute positioning
- src/components/nte-split-view/nte-split-view.spec.ts Replace “single unnamed slot” test with re-slotting test; keep others
- README.md Document change: splitter is between panes; nested split-views no longer interfere

## Detail changes

### src/components/nte-split-view/nte-split-view.ts

Referenced Tasks

- refactor-layout Render two named slots with splitter in between; keep hidden collector slot
- update-events Compute main-axis size minus splitter thickness; keep min/max logic
- slotting-logic Move first two default children into named slots; warn on extras

Replace

```ts
...original content...
```

by

```ts
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

    // Collector for default slot children (hidden). We re-slot them into named slots.
    @query('slot#collector') private _collectorSlot!: HTMLSlotElement;
    @query('slot[name=primary]') private _primarySlot!: HTMLSlotElement;
    @query('slot[name=secondary]') private _secondarySlot!: HTMLSlotElement;
    @query('#splitter') private _splitterEl!: HTMLElement;

    @state() private _resizing = false;
    private _pointerId: number | null = null;
    private _startCoord = 0;
    private _startPrimarySize = 0;

    override render() {
        const ariaOrientation = this._isVertical() ? 'vertical' : 'horizontal';
        const tabIndex = this.resizable ? 0 : -1;

        return html`
            <!-- Hidden collector for default-slot children -->
            <slot id="collector" @slotchange=${this._onCollectorSlotChange}></slot>

            <div class="container">
                <slot name="primary" id="slot-primary"></slot>

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

                <slot name="secondary" id="slot-secondary"></slot>
            </div>
        `;
    }

    private _onCollectorSlotChange = () => {
        // Move first two default-slot elements to named slots (primary/secondary).
        if (!this._collectorSlot) return;
        const assigned = this._collectorSlot.assignedElements({ flatten: true }) as HTMLElement[];

        // Elements that already have explicit slots are ignored.
        // Only assign unnamed elements.
        const unnamed = assigned.filter((el) => !el.hasAttribute('slot'));

        if (unnamed.length > 0) {
            const first = unnamed[0];
            if (first) first.setAttribute('slot', 'primary');
        }
        if (unnamed.length > 1) {
            const second = unnamed[1];
            if (second) second.setAttribute('slot', 'secondary');
        }
        if (assigned.length > 2) {
            console.warn('nte-split-view: more than 2 elements in default slot. Only the first two are used.');
        }
    };

    private _isVertical(): boolean {
        return this.classList.contains('vertical');
    }

    private _isReverse(): boolean {
        return this.classList.contains('reverse');
    }

    private _getPrimaryEl(): HTMLElement | null {
        if (!this._primarySlot) return null;
        const arr = this._primarySlot.assignedElements({ flatten: true }) as HTMLElement[];
        return arr[0] ?? null;
    }

    private _getMainAxisTotal(): number {
        // Total available for panes, excluding the splitter thickness.
        const cr = this.getBoundingClientRect();
        const splitterRect = this._splitterEl?.getBoundingClientRect();
        const splitterThickness = this._isVertical() ? (splitterRect?.height ?? 0) : (splitterRect?.width ?? 0);
        const full = this._isVertical() ? cr.height : cr.width;
        return Math.max(0, full - splitterThickness);
    }

    private _onPointerDown(e: PointerEvent) {
        if (!this.resizable) return;

        const primary = this._getPrimaryEl();
        if (!primary) return;

        const splitter = e.currentTarget as HTMLElement;
        splitter.setPointerCapture(e.pointerId);
        this._pointerId = e.pointerId;

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

        const total = this._getMainAxisTotal();
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

        const total = this._getMainAxisTotal();

        const cs = getComputedStyle(this);
        const sizeVar = (cs.getPropertyValue('--primary-size') || '').trim();
        let currentPx = this._parseSize(sizeVar, total);
        if (!Number.isFinite(currentPx)) {
            // fallback: measure current primary
            const primary = this._getPrimaryEl();
            if (primary) {
                const r = primary.getBoundingClientRect();
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
```

### src/components/nte-split-view/nte-split-view.scss

Referenced Tasks

- refactor-layout Flex layout with in-flow splitter
- update-events Orientation-specific hit areas and cursors
- slotting-logic Hide collector slot

Replace

```scss
...original content...
```

by

```scss
/* ShadowDOM Styles */

:host {
    display: block;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    --primary-size: 50%;
    --primary-min-size: initial;
    --primary-max-size: initial;
    --splitter-size: 3px;
    --splitter-hover-bg: rgba(0, 0, 0, 0.12);
    position: relative;
}

/* Hide collector slot (default slot). We re-slot children to named slots. */
#collector {
    display: none !important;
}

.container {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: row;
}

:host(.vertical) .container {
    flex-direction: column;
}

:host(.reverse):not(.vertical) .container {
    flex-direction: row-reverse;
}

:host(.vertical.reverse) .container {
    flex-direction: column-reverse;
}

/* Primary and secondary as named slots; the slot itself is the flex item */
#slot-primary {
    /* Primary pane controlled by --primary-size, bounded by min/max if provided */
    flex: 0 0
        clamp(
            var(--primary-min-size, var(--primary-size, 50%)),
            var(--primary-size, 50%),
            var(--primary-max-size, var(--primary-size, 50%))
        );
    min-inline-size: 0;
    min-block-size: 0;
}

#slot-secondary {
    /* Secondary fills remaining space */
    flex: 1 1 auto;
    min-inline-size: 0;
    min-block-size: 0;
}

/* Splitter: IN-FLOW between the two panes, no overlay across other components */
#splitter {
    flex: 0 0 var(--splitter-size);
    background: transparent;
    outline: none;
    /* disabled by default; enabled only if [resizable] */
    pointer-events: none;
    display: block;
}

/* Enable interaction only when resizable */
:host([resizable]) #splitter {
    pointer-events: auto;
}

/* Horizontal */
:host(:not(.vertical)) #splitter {
    width: var(--splitter-size);
    height: 100%;
    cursor: col-resize;
}

/* Vertical */
:host(.vertical) #splitter {
    width: 100%;
    height: var(--splitter-size);
    cursor: row-resize;
}

/* Visualize on hover/focus only */
:host([resizable]) #splitter:hover,
:host([resizable]) #splitter:focus {
    background: var(--splitter-hover-bg);
}

/* Gripper placeholder */
#gripper {
    width: 100%;
    height: 100%;
}
```

### src/components/nte-split-view/nte-split-view.spec.ts

Referenced Tasks

- tests Align tests with new slotting approach

Replace content by

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { create_element } from '@trunkjs-utils';
import { NteSplitViewElement } from './nte-split-view';

describe('nte-split-view', () => {
    beforeEach(() => {
        // ensure custom element is defined (import side-effect)
        customElements.get('nte-split-view') || customElements.define('nte-split-view', NteSplitViewElement);
    });

    it('re-slots the first two default children into primary/secondary named slots', async () => {
        const el = document.createElement('nte-split-view') as NteSplitViewElement;

        const a = create_element('div', {}, 'A');
        const b = create_element('div', {}, 'B');
        el.appendChild(a);
        el.appendChild(b);

        document.body.appendChild(el);
        await el.updateComplete;
        // Allow slotchange to run
        await Promise.resolve();

        expect(a.getAttribute('slot')).toBe('primary');
        expect(b.getAttribute('slot')).toBe('secondary');
    });

    it('warns if more than two children are provided', async () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const el = document.createElement('nte-split-view') as NteSplitViewElement;

        // 3 children
        el.appendChild(create_element('div', {}, 'A'));
        el.appendChild(create_element('div', {}, 'B'));
        el.appendChild(create_element('div', {}, 'C'));

        document.body.appendChild(el);
        await el.updateComplete;

        // slotchange occurs on append; allow microtask
        await Promise.resolve();
        expect(warn).toHaveBeenCalled();
        warn.mockRestore();
    });

    it('splitter is focusable only when resizable', async () => {
        const el = document.createElement('nte-split-view') as NteSplitViewElement;
        el.appendChild(create_element('div', {}, 'A'));
        el.appendChild(create_element('div', {}, 'B'));
        document.body.appendChild(el);
        await el.updateComplete;

        let splitter = el.shadowRoot!.getElementById('splitter')!;
        expect(splitter.getAttribute('tabindex')).toBe('-1');

        el.setAttribute('resizable', '');
        await el.updateComplete;
        splitter = el.shadowRoot!.getElementById('splitter')!;
        expect(splitter.getAttribute('tabindex')).toBe('0');
    });
});
```

### README.md

Referenced Tasks

- docs Note behavioral fix (splitter placement) and nested split-views

Update section “Notes” at the end by appending:

```md
- Since v1.0.1 the splitter is placed between the panes (in-flow) to avoid pointer overlaps in nested scenarios.
  This fixes an issue where dragging a nested horizontal splitter could move an outer vertical splitter.
  No API changes are required; keep providing two children in the default slot.
```

## Example prompts to improve the original request

- Please confirm it’s acceptable that the splitter consumes its own thickness (default 3px) between panes instead of overlaying them.
- Do you rely on percentage sizes to be measured against the full container or the space excluding the splitter? If the former, we can keep using full container math.
