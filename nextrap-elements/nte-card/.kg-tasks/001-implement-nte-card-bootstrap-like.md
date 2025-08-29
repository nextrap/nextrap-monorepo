---
slugName: implement-nte-card-bootstrap-like
includeFiles:
    - ./src/components/nte-card/nte-card.ts
    - ./src/components/nte-card/nte-card.scss
    - ./src/styles/index.scss
    - ./src/components/nte-card/nte-card.spec.ts
    - ./demo/base.html
    - ./demo/main.ts
    - ./README.md
    - ./web-types.json
editFiles:
    - ./src/components/nte-card/nte-card.ts
    - ./src/components/nte-card/nte-card.scss
    - ./src/styles/index.scss
    - ./src/components/nte-card/nte-card.spec.ts
    - ./README.md
    - ./web-types.json
original_prompt: implement the nte-card component and scss styles. the card should
    look and work like the bootstrap card. it should have a wrapper to allow it optional
    go to 100% height by expanding the main slot. Take the demo/base.html as demo on
    how the implementation should work
---

# Prepare Implement nte-card component and SCSS styles (Bootstrap-like)

Implement a Lit-based web component `<nte-card>` that looks and behaves like a Bootstrap card:

- Supports header, image, body (default slot), and footer.
- Optional “fill” wrapper mode to allow 100% height by expanding the main content slot.
- Works with images provided either directly as <img slot="image"> or wrapped in <p slot="image"><img ...></p>.
- Demo file demo/base.html already shows expected usage patterns.

Assumptions

- Attribute name for full-height mode: fill (boolean, reflected). When present: card becomes a flex column with .card-body flexing to fill remaining space.
- Styles mimic Bootstrap card defaults but kept minimal and overridable via CSS custom properties.
- Web-types should describe the new slots and fill attribute for editor tooling.
- We will not implement all Bootstrap variants (e.g., card-group); only the base card.

## Tasks

- Implement component structure Use named slots and wrappers to match Bootstrap (.card, .card-header, .card-img-top, .card-body, .card-footer)
- Implement fill behavior Make card-body flex-grow on [fill] and ensure 100% height
- Image slot handling Support <img slot="image"> and <p slot="image"><img></p>; normalize via slotchange to set width/margins
- SCSS shadow styles Create Bootstrap-like look; expose CSS vars; style slotted image and wrapper behavior
- Light DOM utility styles Minimal, mostly not needed; remove if unnecessary; ensure no conflicts
- Update unit tests Test rendering structure, slots detection, and fill attribute reflection
- Update web-types Add fill attribute and slot metadata
- Update README Add quick usage and fill example

## Overview: File changes

- ./src/components/nte-card/nte-card.ts Replace with real implementation: properties, slots, slotchange handlers, and template
- ./src/components/nte-card/nte-card.scss Add Bootstrap-like card styles, CSS variables and [fill] handling; ::slotted rules for image/header/footer
- ./src/styles/index.scss Optional light DOM refinements for slotted p[slot=image] margin reset
- ./src/components/nte-card/nte-card.spec.ts Update tests to assert structure and slot-fallback behavior; test fill attribute reflection
- ./README.md Add description, examples, CSS vars, and fill behavior documentation
- ./web-types.json Update slots and attributes description (header, image, footer, fill)

## Detail changes

### ./src/components/nte-card/nte-card.ts

Referenced Tasks

- Implement component structure
- Implement fill behavior
- Image slot handling

Replace entire file with:

```ts
import { LoggingMixin } from '@trunkjs/browser-utils';
import { html, LitElement, nothing, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

// Styles for the light DOM
import { resetStyle } from '@nextrap/style-reset';

// Styles for your component's shadow DOM
import style from './nte-card.scss?inline';

@customElement('nte-card')
export class NteCardElement extends LoggingMixin(LitElement) {
    static override styles = [unsafeCSS(style), unsafeCSS(resetStyle)];

    /**
     * When true, the card will stretch to available height and its body will expand
     * to fill the remaining space (flex layout).
     */
    @property({ type: Boolean, reflect: true })
    public accessor fill = false;

    @state() private accessor _hasHeader = false;
    @state() private accessor _hasImage = false;
    @state() private accessor _hasFooter = false;

    override render() {
        return html`
            <div class="card" part="card">
                <div class="card-header" part="header" ?hidden=${!this._hasHeader}>
                    <slot name="header" @slotchange=${this.#onHeaderSlot}></slot>
                </div>

                <div class="card-img-top" part="image" ?hidden=${!this._hasImage}>
                    <slot name="image" @slotchange=${this.#onImageSlot}></slot>
                </div>

                <div class="card-body" part="body">
                    <slot></slot>
                </div>

                <div class="card-footer" part="footer" ?hidden=${!this._hasFooter}>
                    <slot name="footer" @slotchange=${this.#onFooterSlot}></slot>
                </div>
            </div>
        `;
    }

    #onHeaderSlot = (e: Event) => {
        const slot = e.target as HTMLSlotElement;
        const assigned = slot.assignedNodes({ flatten: true }).filter((n) => this.#isRenderableNode(n));
        this._hasHeader = assigned.length > 0;
        // Optional: normalize header spacing if needed (handled by styles).
    };

    #onFooterSlot = (e: Event) => {
        const slot = e.target as HTMLSlotElement;
        const assigned = slot.assignedNodes({ flatten: true }).filter((n) => this.#isRenderableNode(n));
        this._hasFooter = assigned.length > 0;
    };

    #onImageSlot = (e: Event) => {
        const slot = e.target as HTMLSlotElement;
        const assigned = slot.assignedElements({ flatten: true });
        this._hasImage = assigned.length > 0;

        // Normalize images whether they are directly <img slot="image"> or wrapped in <p slot="image"><img .../></p>
        for (const el of assigned) {
            try {
                // Remove margins if the wrapper is a paragraph.
                if (el instanceof HTMLParagraphElement) {
                    if (!el.dataset.nteProcessed) {
                        el.style.margin = '0';
                        el.dataset.nteProcessed = '1';
                    }
                    // Expand inner images to full width, if present
                    const imgs = el.querySelectorAll('img');
                    imgs.forEach((img) => {
                        if (!(img as HTMLImageElement).dataset.nteProcessed) {
                            (img as HTMLImageElement).style.display = 'block';
                            (img as HTMLImageElement).style.width = '100%';
                            (img as HTMLImageElement).dataset.nteProcessed = '1';
                        }
                    });
                }

                // Direct <img slot="image">
                if (el instanceof HTMLImageElement) {
                    if (!el.dataset.nteProcessed) {
                        el.style.display = 'block';
                        el.style.width = '100%';
                        el.dataset.nteProcessed = '1';
                    }
                }
            } catch {
                // ignore styling failures on foreign elements
            }
        }
    };

    #isRenderableNode(n: Node): boolean {
        if (n.nodeType === Node.TEXT_NODE) {
            return (n.textContent || '').trim().length > 0;
        }
        return n.nodeType === Node.ELEMENT_NODE;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'nte-card': NteCardElement;
    }
}
```

### ./src/components/nte-card/nte-card.scss

Referenced Tasks

- SCSS shadow styles
- Implement fill behavior

Replace entire file with:

```scss
/* The ShadowDOM Styles */

:host {
    display: block;

    /* Customizable variables (Bootstrap-ish defaults) */
    --card-bg: #fff;
    --card-color: #212529;
    --card-border-color: rgba(0, 0, 0, 0.125);
    --card-border-radius: 0.25rem;
    --card-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

    --card-spacer-x: 1rem;
    --card-spacer-y: 1rem;

    /* container width hint for consistency */
    --container-width: var(--nt-container-width);
}

/* Full-height mode */
:host([fill]) {
    height: 100%;
}

.card {
    position: relative;
    display: block;
    background-color: var(--card-bg);
    color: var(--card-color);
    border: 1px solid var(--card-border-color);
    border-radius: var(--card-border-radius);
    box-shadow: var(--card-box-shadow);
    overflow: hidden; /* ensure rounded corners clip child content */
}

/* Make the card a flex column in fill-mode so body can stretch */
:host([fill]) .card {
    display: flex;
    flex-direction: column;
    height: 100%;
}

/* Sections */
.card-header,
.card-footer {
    padding: var(--card-spacer-y) var(--card-spacer-x);
    background-color: rgba(0, 0, 0, 0.03);
}

.card-header {
    border-bottom: 1px solid var(--card-border-color);
}

.card-footer {
    border-top: 1px solid var(--card-border-color);
}

.card-body {
    padding: var(--card-spacer-y) var(--card-spacer-x);
}

/* Let body expand only in fill mode */
:host([fill]) .card-body {
    flex: 1 1 auto;
    min-height: 0; /* avoid overflowing flex children */
}

/* Image section (top) */
.card-img-top {
    display: block;
    /* Ensure top corners stay rounded */
    border-top-left-radius: var(--card-border-radius);
    border-top-right-radius: var(--card-border-radius);
}

/* Normalize slotted image items */
.card-img-top slot::slotted(img) {
    display: block;
    width: 100%;
}

.card-img-top slot::slotted(p) {
    margin: 0; /* when image is wrapped in a paragraph */
}

/* hide wrappers when not used */
[hidden] {
    display: none !important;
}
```

### ./src/styles/index.scss

Referenced Tasks

- Light DOM utility styles

Replace entire file with:

```scss
/**
 * This file contains LightDOM Styles
 * Keep minimal; card visuals live in the component shadow.
 */

nte-card {
    /* No-op: visual styles are in shadow DOM.
     Add project-level layout spacing here if needed. */
}
```

### ./src/components/nte-card/nte-card.spec.ts

Referenced Tasks

- Update unit tests

Replace entire file with:

```ts
import { expect } from 'vitest';
import { NteCardElement } from './nte-card';

describe('nte-card', () => {
    it('should create an element', () => {
        const el = new NteCardElement();
        expect(el).toBeInstanceOf(NteCardElement);
    });

    it('renders basic structure', async () => {
        const el = new NteCardElement();
        document.body.appendChild(el);
        await el.updateComplete;

        const sr = el.shadowRoot!;
        expect(!!sr.querySelector('.card')).toBe(true);
        expect(!!sr.querySelector('.card-body')).toBe(true);
        // Header and footer should be hidden by default
        const header = sr.querySelector('.card-header') as HTMLElement;
        const footer = sr.querySelector('.card-footer') as HTMLElement;
        expect(header.hasAttribute('hidden')).toBe(true);
        expect(footer.hasAttribute('hidden')).toBe(true);
    });

    it('detects header/footer slots', async () => {
        const el = new NteCardElement();
        el.innerHTML = `
      <h2 slot="header">Header</h2>
      <p>Main</p>
      <div slot="footer">Footer</div>
    `;
        document.body.appendChild(el);
        await el.updateComplete;

        const sr = el.shadowRoot!;
        const header = sr.querySelector('.card-header') as HTMLElement;
        const footer = sr.querySelector('.card-footer') as HTMLElement;
        expect(header.hasAttribute('hidden')).toBe(false);
        expect(footer.hasAttribute('hidden')).toBe(false);
    });

    it('normalizes image slot (direct img)', async () => {
        const el = new NteCardElement();
        const img = document.createElement('img');
        img.slot = 'image';
        el.appendChild(img);
        document.body.appendChild(el);
        await el.updateComplete;

        const sr = el.shadowRoot!;
        const imgWrap = sr.querySelector('.card-img-top') as HTMLElement;
        expect(imgWrap.hasAttribute('hidden')).toBe(false);
    });

    it('reflects fill attribute', async () => {
        const el = new NteCardElement();
        el.fill = true;
        document.body.appendChild(el);
        await el.updateComplete;
        expect(el.hasAttribute('fill')).toBe(true);
    });
});
```

### ./README.md

Referenced Tasks

- Update README

Replace entire file with:

````md
# nte-card

Bootstrap-like card web component built with Lit. Supports header, image, body, and footer slots. Optional full-height mode lets the card body expand to fill available space.

## Visual Demo

```bash
nx dev nte-card
# open http://localhost:4000/demo/base.html
```
````

## Usage

Basic:

```html
<nte-card>
    <h3 slot="header">Card Header</h3>
    <p>Some main content</p>
    <div slot="footer">Card Footer</div>
</nte-card>
```

With image:

```html
<nte-card>
    <h3 slot="header">Card Header</h3>
    <img slot="image" src="https://placehold.co/600x400" alt="Placeholder" />
    <p>Some main content</p>
    <div slot="footer">Card Footer</div>
</nte-card>
```

Image wrapped in a paragraph (Static generators):

```html
<nte-card>
    <h3 slot="header">Card Header</h3>
    <p slot="image">
        <img src="https://placehold.co/600x400" alt="Placeholder" />
    </p>
    <p>Some main content</p>
    <div slot="footer">Card Footer</div>
</nte-card>
```

Full height fill:

```html
<section style="height: 300px; border: 1px dashed #ccc;">
    <nte-card fill style="height: 100%;">
        <h3 slot="header">Full-height Card</h3>
        <p>This card body grows to fill the available height.</p>
        <div slot="footer">Footer</div>
    </nte-card>
</section>
```

## Slots

- header: Content for the card header.
- image: Top image area. Accepts <img> or any markup; <p> wrappers are normalized.
- default: Main content (card body).
- footer: Footer content.

## Attributes

- fill (boolean): When present, the card uses flexbox to expand its body to fill available height.

## Styling (CSS custom properties)

- --card-bg
- --card-color
- --card-border-color
- --card-border-radius
- --card-box-shadow
- --card-spacer-x
- --card-spacer-y

Example:

```css
nte-card {
    --card-border-radius: 0.5rem;
    --card-box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}
```

````

### ./web-types.json

Referenced Tasks
- Update web-types

Replace entire file with:

```json
{
  "name": "nte-card",
  "version": "1.0.0",
  "contributions": {
    "html": {
      "elements": [
        {
          "name": "nte-card",
          "description": "Bootstrap-like card component with header, image, body and footer slots.",
          "slots": [
            { "name": "header", "description": "Card header content" },
            { "name": "image", "description": "Top image area (accepts <img> or markup; <p> wrappers supported)" },
            { "name": "default", "description": "Card body content" },
            { "name": "footer", "description": "Card footer content" }
          ],
          "events": [],
          "attributes": [
            {
              "name": "fill",
              "type": "boolean",
              "description": "Enable full-height mode. Card body expands to fill remaining space."
            }
          ]
        }
      ]
    },
    "css": {
      "classes": [],
      "scopes": []
    }
  }
}
````
