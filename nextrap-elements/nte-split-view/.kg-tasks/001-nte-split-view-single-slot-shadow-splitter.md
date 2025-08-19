---
slugName: nte-split-view-single-slot-shadow-splitter
includeFiles:
    - src/auftrag.txt
    - src/components/nte-split-view/nte-split-view.ts
    - src/components/nte-split-view/nte-split-view.scss
    - src/components/nte-split-view/nte-split-view.spec.ts
    - demo/split-view.html
    - demo/main.ts
    - README.md
    - web-types.json
    - src/styles/index.scss
editFiles:
    - src/components/nte-split-view/nte-split-view.ts
    - src/components/nte-split-view/nte-split-view.scss
    - demo/split-view.html
    - web-types.json
    - README.md
    - src/components/nte-split-view/nte-split-view.spec.ts
original_prompt: passe die Komponente nach Maßgabe von src/auftrag.txt an. Es darf
    nur einen slot geben. Der Splitter liegt im shadow dom. Das resize passiert aus
    dem shadow dom über slotted selektoren.
---

# Prepare Anpassung nte-split-view gemäß src/auftrag.txt

Implementiere die Split View Komponente gemäß Anforderung: genau ein Slot, Splitter im Shadow DOM, Styling/Resize via Shadow DOM mit ::slotted Selektoren. Primary = erstes Kindelement, Secondary = zweites Kindelement.

## Assumptions

- Orientation und Reihenfolge werden über Host-Klassen gesteuert:
    - .vertical für vertikale Aufteilung
    - .reverse kehrt die visuelle Reihenfolge um
- Es gibt nur folgende public Attributes:
    - resizable (boolean), label (string). Attribute vertical/reverse werden entfernt (stattdessen Klassen).
- CSS Variablen für Primary:
    - --primary-size (Pflicht für feste Größe oder Default 50% wenn nicht gesetzt)
    - --primary-min-size, --primary-max-size (optional)
- Wenn weder --primary-min-size noch --primary-max-size gesetzt:
    - Ist resizable: min=0, max=100%
    - Ist nicht resizable: Größe ist fix (--primary-size)
- Splitter ist 3px breit/hoch, absolut positioniert, nimmt keinen eigenen Platz ein, wird nur bei Hover/Fokus sichtbar; Cursor col-resize/row-resize.
- Warnung (console.warn), wenn mehr als 2 Elemente im default Slot. Nur die ersten 2 werden verwendet.
- Slotted Selektoren aus Shadow DOM:
    - ::slotted(:first-child:not(:last-child)) = Primary
    - ::slotted(:nth-child(2)) = Secondary

## Missing Information

- Defaultwert für --primary-size wurde nicht explizit vorgegeben. Annahme: 50%.
- Gewünschte optische Gestaltung des Splitters (Farbe). Annahme: dezentes rgba(0,0,0,0.12) bei Hover/Fokus.

Beispiele für Klarstellungen:

- Sollen Tastatur-Resizes (Pfeiltasten) unterstützt werden? Annahme: Ja, wie bestehender Code.
- Sollen ARIA-Attribute (role="separator") weiterhin gesetzt werden? Annahme: Ja.

## Tasks

- refactor-component-api Entferne vertical/reverse-Attribute, nutze Host-Klassen; nutze nur einen default Slot
- shadow-splitter-implementation Implementiere Splitter im Shadow DOM (absolute 3px), Hover sichtbarkeit, Cursor
- slotted-styling Primary/Secondary via ::slotted selektoren; Flex-Layout mit .vertical/.reverse
- resize-logic Aus Shadow DOM per Splitter Pointer/Keyboard Resize; setze --primary-size; beachte min/max
- warnings-overflow Ausgabe von Warnung wenn >2 Child-Elemente im default Slot
- update-demos Demo neu: erst IDE-Layout (verschachtelt), danach je 1 vertikal/horizontal Beispiel
- update-web-types Entferne named slot und vertical/reverse Attribute aus web-types.json
- update-docs README auf neuen API-Stand (Klassen, Variablen, Beispiele)
- update-tests Unit-Tests für Slot-Anzahl, Splitter Accessibility, Warnung >2 Kinder

## Overview: File changes

- src/components/nte-split-view/nte-split-view.ts Komponente komplett neu: Single Slot, Splitter/Resize, Warnungen, Keyboard
- src/components/nte-split-view/nte-split-view.scss Shadow DOM CSS: Flex-Layout, ::slotted, Splitter-Overlay
- demo/split-view.html Demos überarbeiten: kein named slot, Klassen für Ausrichtung, IDE-Beispiel zuerst
- web-types.json Entferne second slot und vertical/reverse Attribute
- README.md Dokumentation anpassen: API, Beispiele, CSS Variablen
- src/components/nte-split-view/nte-split-view.spec.ts Tests ergänzen: Warnung, Splitter-Tabindex, Slot-Anzahl

## Detail changes

### src/components/nte-split-view/nte-split-view.ts

Referenced Tasks

- refactor-component-api
- shadow-splitter-implementation
- slotted-styling
- resize-logic
- warnings-overflow

Replace entire file with the following content:

```typescript
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
```

### src/components/nte-split-view/nte-split-view.scss

Referenced Tasks

- shadow-splitter-implementation
- slotted-styling

Replace entire file with the following content:

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

/* Slotted children styling:
   Primary: first element (only if at least 2 children exist)
   Secondary: second element
*/

::slotted(:first-child:not(:last-child)) {
    /* Primary pane controlled by --primary-size, bounded by min/max if provided */
    /* Clamp ensures primary honors min/max while using --primary-size for basis */
    flex: 0 0
        clamp(
            var(--primary-min-size, var(--primary-size, 50%)),
            var(--primary-size, 50%),
            var(--primary-max-size, var(--primary-size, 50%))
        );
    min-inline-size: 0;
    min-block-size: 0;
}

::slotted(:nth-child(2)) {
    /* Secondary fills remaining space */
    flex: 1 1 auto;
    min-inline-size: 0;
    min-block-size: 0;
}

/* Splitter: lives in Shadow DOM, overlays between the two panes, no layout impact */
#splitter {
    position: absolute;
    z-index: 1;
    background: transparent;
    outline: none;
    /* disabled by default; enabled only if [resizable] */
    pointer-events: none;
}

/* Enable interaction only when resizable */
:host([resizable]) #splitter {
    pointer-events: auto;
}

/* Horizontal, normal order: handle at left = primary-size */
:host(:not(.vertical):not(.reverse)) #splitter {
    left: calc(var(--primary-size, 50%) - var(--splitter-size) / 2);
    top: 0;
    width: var(--splitter-size);
    height: 100%;
    cursor: col-resize;
}

/* Horizontal, reverse order: handle from right */
:host(:not(.vertical).reverse) #splitter {
    right: calc(var(--primary-size, 50%) - var(--splitter-size) / 2);
    top: 0;
    width: var(--splitter-size);
    height: 100%;
    cursor: col-resize;
}

/* Vertical, normal order: handle at top = primary-size */
:host(.vertical:not(.reverse)) #splitter {
    top: calc(var(--primary-size, 50%) - var(--splitter-size) / 2);
    left: 0;
    width: 100%;
    height: var(--splitter-size);
    cursor: row-resize;
}

/* Vertical, reverse order: handle from bottom */
:host(.vertical.reverse) #splitter {
    bottom: calc(var(--primary-size, 50%) - var(--splitter-size) / 2);
    left: 0;
    width: 100%;
    height: var(--splitter-size);
    cursor: row-resize;
}

/* Visualize on hover/focus only */
:host([resizable]) #splitter:hover,
:host([resizable]) #splitter:focus {
    background: var(--splitter-hover-bg);
}

/* Gripper can be used for hit-area expansion/future styling if needed */
#gripper {
    width: 100%;
    height: 100%;
}
```

### demo/split-view.html

Referenced Tasks

- update-demos

Replace entire file with the following content:

```html
<!doctype html>
<html>
    <head>
        <meta charset="UTF-8" />
        <title>nte-split-view Demo</title>
        <script type="module" src="/demo/main"></script>
        <style>
            :root {
                color-scheme: light dark;
            }
            body {
                margin: 0;
                padding: 16px;
                font-family: system-ui, sans-serif;
            }
            .demo {
                border: 1px solid #ddd;
                height: 480px;
                margin-bottom: 24px;
            }
            .tall {
                height: 560px;
            }
            .panel {
                padding: 8px;
                box-sizing: border-box;
            }
            .nav {
                background: #fff5f5;
            }
            .editor {
                background: #f5faff;
            }
            .sidebar {
                background: #f5fff0;
            }
            .terminal {
                background: #f7f7f7;
            }
            .main {
                background: #fafafa;
            }
            .side {
                background: #f0f6ff;
            }
        </style>
    </head>
    <body>
        <h1>nte-split-view Demo</h1>

        <h2>Verschachteltes Beispiel (IDE: Navigation, Editor, Sidebar, Terminal)</h2>
        <nte-split-view class="vertical demo tall" resizable style="--primary-size: 70%;">
            <!-- Primary (top): 70% Höhe -->
            <nte-split-view resizable style="--primary-size: 240px;">
                <!-- Primary (links): Navigation -->
                <div class="panel nav">Navigation</div>

                <!-- Secondary (rechts): Editor + Sidebar -->
                <nte-split-view resizable reverse style="--primary-size: 320px;">
                    <!-- Primary (links, da reverse): Editor -->
                    <div class="panel editor">Editor</div>
                    <!-- Secondary (rechts): Sidebar -->
                    <div class="panel sidebar">Sidebar</div>
                </nte-split-view>
            </nte-split-view>

            <!-- Secondary (unten): Terminal -->
            <div class="panel terminal">Terminal</div>
        </nte-split-view>

        <h2>Horizontal (Standard)</h2>
        <nte-split-view
            class="demo"
            resizable
            style="--primary-size: 30%; --primary-min-size: 20%; --primary-max-size: 60%;"
        >
            <div class="panel main">Main content</div>
            <div class="panel side">Side content</div>
        </nte-split-view>

        <h2>Vertikal</h2>
        <nte-split-view class="demo vertical" resizable style="--primary-size: 40%;">
            <div class="panel main">Main content</div>
            <div class="panel side">Side content</div>
        </nte-split-view>
    </body>
</html>
```

### web-types.json

Referenced Tasks

- update-web-types

Replace content with the following (attributes vertical/reverse removed; only default slot remains):

```json
{
    "name": "@nextrap/nte-split-view",
    "version": "1.0.0",
    "contributions": {
        "html": {
            "tags": [
                {
                    "name": "nte-split-view",
                    "description": "A lightweight split-view web component that displays two panels (primary = first child, secondary = second child) with an optional resizable divider. Orientation and order via host classes: .vertical, .reverse.",
                    "attributes": [
                        {
                            "name": "resizable",
                            "description": "Enable pointer and keyboard resizing.",
                            "value": { "type": "boolean" }
                        },
                        {
                            "name": "label",
                            "description": "ARIA label for the resizer handle.",
                            "value": { "type": "string" }
                        }
                    ],
                    "slots": [
                        {
                            "name": "default",
                            "description": "Provide exactly two elements. The first is primary, the second is secondary."
                        }
                    ]
                }
            ]
        }
    }
}
```

### README.md

Referenced Tasks

- update-docs

Update content by replacing with the following minimal but complete overview:

````markdown
# nte-split-view

A lightweight split-view web component (Lit) that displays two panels (primary = first child, secondary = second child) either side-by-side or stacked, with an optional resizable divider.

- 100% width and 100% height by default
- Orientation via host classes: `.vertical` (top/bottom), default is horizontal (left/right)
- Order via host class: `.reverse` (swap visual order)
- `resizable` attribute enables pointer and keyboard resizing
- Splitter lives in shadow DOM; panes live in light DOM (single unnamed slot)
- Accessible separator handle with ARIA; use `label` to set aria-label
- CSS variables control primary size:
    - `--primary-size` (e.g. `240px` or `30%`)
    - `--primary-min-size` (optional)
    - `--primary-max-size` (optional)

## Install

```bash
npm i @nextrap/nte-split-view
```
````

## Basic usage

Horizontal (default):

```html
<nte-split-view resizable style="--primary-size: 30%; --primary-min-size: 20%; --primary-max-size: 60%;">
    <div>Primary</div>
    <div>Secondary</div>
</nte-split-view>
```

Vertical:

```html
<nte-split-view class="vertical" resizable style="--primary-size: 40%;">
    <div>Top (primary)</div>
    <div>Bottom (secondary)</div>
</nte-split-view>
```

Notes:

- Only provide two elements in the default slot. A warning is logged if more than two are present.
- If neither `--primary-min-size` nor `--primary-max-size` is set:
    - With `resizable`, primary can vary between 0% and 100%.
    - Without `resizable`, `--primary-size` is treated as fixed.

````

### src/components/nte-split-view/nte-split-view.spec.ts

Referenced Tasks
- update-tests

Replace content with:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { create_element } from '@trunkjs/browser-utils';
import { NteSplitViewElement } from './nte-split-view';

describe('nte-split-view', () => {
  beforeEach(() => {
    // ensure custom element is defined (import side-effect)
    customElements.get('nte-split-view') || customElements.define('nte-split-view', NteSplitViewElement);
  });

  it('uses a single, unnamed slot', async () => {
    const el = document.createElement('nte-split-view') as NteSplitViewElement;
    document.body.appendChild(el);
    await el.updateComplete;

    const slots = el.shadowRoot!.querySelectorAll('slot');
    expect(slots.length).toBe(1);
    expect(slots[0].getAttribute('name')).toBe(null);
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
````

## Notes for Implementation

- Ensure no references to slot="main" or slot="side" remain anywhere (demos, docs, code).
- The component must not depend on named slots. Only order determines primary/secondary.
- Keep pointer/keyboard resize logic in the component (shadow DOM), while pane sizes are reflected via CSS variables to the light DOM panes (via ::slotted rules).

## Example prompts to clarify future requests

- Bitte bestätigen: Sollen `vertical`/`reverse` ausschließlich als Host-Klassen verwendet werden? (Aktuell so umgesetzt.)
- Sollen Tastatur-Resizes mit Pfeiltasten unterstützt werden? Schrittweite ok (10px / 30px mit Shift)?
- Gibt es Designvorgaben für die Splitter-Farbe im Hover/Fokus? (Aktuell rgba(0,0,0,0.12))
