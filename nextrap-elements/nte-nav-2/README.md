# @nextrap/nte-nav-2

Working draft for the future Nextrap navigation component. The existing `@nextrap/nte-nav` package remains unchanged; a future navbar is explicitly out of scope.

## Import

```ts
import '@nextrap/nte-nav-2';
```

```scss
@use '@nextrap/nte-nav-2' as nav;

header nte-nav-2.style-default {
  @include nav.default-style();
  @include nav.horizontal();
  @include nav.size-medium();
}

aside nte-nav-2.style-default {
  @include nav.sub-navigation();
  @include nav.vertical();
}
```

`SetDefaultStyleMixin` adds `style-default` when no other `style-*` class is present. The component's Shadow DOM only contains functional layout, disclosure, positioning and transition CSS. Visual styling is supplied by the public mixins.

## Basic API

```html
<nte-nav-2 aria-label="Hauptnavigation">
  <nte-nav-item href="/leistungen">
    <svg slot="icon" aria-hidden="true"><!-- … --></svg>
    Leistungen

    <nte-nav-item href="/leistungen/beratung">Beratung</nte-nav-item>
    <nte-nav-item href="/leistungen/entwicklung">Entwicklung</nte-nav-item>
  </nte-nav-item>

  <nte-nav-item href="/ueber-uns" current="page">Über uns</nte-nav-item>
</nte-nav-2>
```

Direct nested `nte-nav-item` children are automatically assigned to the private `submenu` slot. Consumer markup no longer contains a `ul/li/ul` tree. Each item owns its anchor, disclosure control, submenu container and CSS positioning inside its Shadow DOM.

## Attributes

### `nte-nav-2`

| Attribute | Type | Purpose |
|---|---|---|
| `aria-label` | string | Accessible name forwarded to the internal `nav` landmark. Recommended whenever multiple navigation landmarks exist. |

### `nte-nav-item`

| Attribute | Type | Purpose |
|---|---|---|
| `href` | string | Renders the item's internal anchor. If omitted on an item with children, the label itself becomes the disclosure button. |
| `target` | string | Forwarded to the internal anchor. |
| `rel` | string | Forwarded to the internal anchor. |
| `download` | string | Forwarded to the internal anchor. |
| `current` | ARIA current token | Forwarded as `aria-current` to the internal anchor. |
| `order` | number | Sets the host's Flexbox `order`. Use sparingly because visual order does not change DOM or keyboard order. |
| `submenu-label` | string | Prefix for the submenu disclosure's accessible name. Default: `Untermenü`. |

## Slots

| Component | Slot | Purpose |
|---|---|---|
| `nte-nav-2` | default | Top-level `nte-nav-item` elements. |
| `nte-nav-item` | default | Visible rich-text label. |
| `nte-nav-item` | `icon` | Optional icon rendered in the dedicated `icon` part. Decorative SVGs should use `aria-hidden="true"`. |
| `nte-nav-item` | `submenu` | Internal target slot for nested items. Direct nested `nte-nav-item` elements are assigned automatically. |

## Parts

- `nte-nav-2`: `nav`, `list`
- `nte-nav-item`: `item`, `link`, `text`, `disclosure`, `toggle`, `icon`, `label`, `indicator`, `submenu`

## Public mixins

- `default-style()` – full default visual baseline
- `main-navigation()` – complete, large main-navigation variant
- `sub-navigation()` – complete, compact sub-navigation variant
- `horizontal($justify, $gap)` – horizontal functional orientation
- `vertical($gap)` – vertical functional orientation
- `responsive($breakpoint, $horizontal-justify)` – vertical below and horizontal above a breakpoint
- `size-small()`, `size-medium()`, `size-large()` – size presets that only set component variables

## Accessibility and no-custom-JS disclosure

This is ordinary website navigation, not an application menu. It intentionally uses a `nav` landmark, list/listitem semantics, links and disclosure buttons rather than ARIA `menu`/`menubar` roles.

Submenus use the platform's `button[popovertarget]` + `[popover="auto"]` behavior. The browser owns activation, light dismiss, close requests (including Escape) and focus restoration. CSS owns placement, transitions and the `:popover-open` visual state. CSS `:hover` and `:focus-within` can supplement visual feedback but are not used as the persistent open state.

CSS Anchor Positioning is part of this draft's browser baseline. It positions each popover against its invoking button and supplies block/inline flipping. A legacy positioning fallback is deliberately not included yet; decide the supported browser matrix before publishing the package as stable.

## Deliberately deferred

- Navbar, sticky header and brand layout
- Burger/offcanvas content transfer from the legacy package
- Optional arrow-key navigation beyond normal Tab/Shift+Tab behavior
- Public imperative `showSubmenu()` / `hideSubmenu()` methods
- SPA-router adapters and prefetch behavior
- A documented legacy fallback for browsers without Popover + Anchor Positioning
