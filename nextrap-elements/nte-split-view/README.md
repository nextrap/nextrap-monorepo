# nte-split-view

A lightweight split-view web component (Lit) that displays two panels (primary = first child, secondary = second child) either side-by-side or stacked, with an optional resizable divider.

- [Demo in Spectrum Components](https://opensource.adobe.com/spectrum-web-components/components/split-view/)

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
