---
name: nte-navbar-usage
description: "Use @nextrap/nte-navbar to compose multi-line site headers with start, center and end regions. Covers CSS-driven static/sticky/fixed placement, scroll collapse/shrink behavior and responsive composition with Nav 2, Burger, Offcanvas and @trunkjs/element-relocator."
---

# NTE Navbar usage

`<nte-navbar>` is the header wrapper and `<nte-navbar-line>` provides the `start`, `center` and `end` regions. Keep navigation content as normal light-DOM children assigned to these slots.

## Style-base tokens

Load `@nextrap/style-base` in the application and use its CSS custom properties as the source for global layout, color, typography and spacing values. Do not invent parallel global variables or hardcode values that are provided by `style-base`; prefer the corresponding `--nt-*` token.

`container-width` must always come from `style-base`: the navbar resolves its container width from `--nt-container-width`. Do not set `--container-width` locally on `<nte-navbar>` or `<nte-navbar-line>`. Component-specific configuration such as `--nte-navbar-position`, `--nte-navbar-scroll-threshold`, `--height` and `--height-scrolled` remains part of the navbar API and may be set locally.

```ts
import '@nextrap/style-base';
import '@nextrap/nte-navbar';
```

## Placement and scroll behavior

Presentation and layout configuration is CSS-driven. Use `--nte-navbar-position: static|sticky|fixed` for placement and `--nte-navbar-scroll-threshold` for the scroll distance after which the host receives `is-below-threshold`. Do not duplicate these values as HTML attributes.

The component reads JavaScript-relevant CSS configuration from its effective computed style. Changes to the host `class` or `style` attributes automatically trigger a style refresh; `refreshComponentStyle()` is available when an application changes inherited theme values without modifying the host itself.

Lines opt into scroll effects independently:

- `with-collapse-on-scroll` slides and collapses a complete optional line to zero height as soon as the parent navbar is scrolled.
- `with-shrink-on-scroll` switches from `--height` to `--height-scrolled` after the threshold.
- `hide-on-scroll` collapses a line below the configured threshold.

```html
<nte-navbar
  class="with-transparent-at-top with-shadow-on-scroll"
  style="--nte-navbar-position: sticky; --nte-navbar-scroll-threshold: 12"
>
  <nte-navbar-line class="with-collapse-on-scroll" style="--height: 2.25rem">
    <span slot="start">Service & Support</span>
  </nte-navbar-line>
  <nte-navbar-line class="with-shrink-on-scroll" style="--height: 5.5rem; --height-scrolled: 4rem">
    ...
  </nte-navbar-line>
</nte-navbar>
```

`with-transparent-at-top` removes the navbar background and shadow until the scroll threshold is crossed. `with-shadow-on-scroll` adds elevation below the threshold; `with-shadow` keeps it permanently. `with-overlay-at-top` can be combined with `--nte-navbar-overlay-offset` when the top state must overlap following content.

The host receives both state classes:

- `is-scrolled` as soon as `window.scrollY` is greater than zero.
- `is-below-threshold` once `window.scrollY` is greater than `--nte-navbar-scroll-threshold`.

Use the navbar package's default stylesheet when using the optional helper classes described below. Continue to take global values such as container width, colors and spacing from `style-base`:

```scss
@use '@nextrap/nte-navbar' as *;
```

## Logo and interactive controls

Use `brand-logo` for a logo wrapper. It fills the line height, keeps the image proportional with `object-fit: contain`, and aligns automatically according to its slot. The default aspect ratio is `3 / 1`; override it with `--nt-navbar-brand-logo-aspect-ratio` when necessary.

Use `navbar-control` for interactive navigation content such as links, menus and buttons. It gives controls the local interaction layer inside the navbar line without changing the start/center/end geometry. The line uses an isolated stacking context, so controls remain above normal content while staying below global overlays.

```html
<nte-navbar>
  <nte-navbar-line style="--height: 5.5rem; --height-scrolled: 4rem">
    <a slot="start" class="brand-logo" href="/" aria-label="Startseite">
      <img src="/assets/logo.svg" alt="" />
    </a>
    <nav slot="center" class="navbar-control" aria-label="Hauptnavigation">
      <a href="/produkte">Produkte</a>
      <a href="/unternehmen">Unternehmen</a>
    </nav>
    <a slot="end" class="navbar-control" href="/kontakt">Kontakt</a>
  </nte-navbar-line>
</nte-navbar>
```

The package's default stylesheet also defines `--background` and `--text-color` for each line. Set them inline when a line needs its own background or text color, for example `style="--height: 2.25rem; --background: #111827; --text-color: #fff"`.

## Responsive navigation and off-canvas

Navbar itself must not own breakpoint listeners, media queries, automatic mobile relocation or off-canvas transfer logic. When navigation belongs in the navbar on desktop but in an off-canvas element on mobile, compose the navbar with `@trunkjs/element-relocator` and `@trunkjs/responsive`.

Author one horizontal `nte-nav` in the navbar line and one vertical `nte-nav` in the off-canvas. Put the relocator at the off-canvas destination, select both navigations with the `source` and `target` CSS selectors, and let TrunkJS Responsive add/remove the relocator's `relocate` class. While relocated, the element-relocator moves the source navigation items into the target, leaving the navbar navigation empty; when `relocate` is removed, the items move back to the source. Use responsive `style-*` directives to configure the two Nav 2 flows instead of `matchMedia` or component media queries.

```html
<tj-responsive>
  <nte-navbar style="--nte-navbar-position: sticky">
    <nte-navbar-line>
      <div slot="start" class="brand-logo">...</div>
      <nte-nav
        id="main-navigation-horizontal"
        slot="end"
        style="--nte-nav-flow: row"
      >...</nte-nav>
      <nte-burger slot="end" aria-controls="site-menu" style="display:block" style-lg="display:none"></nte-burger>
    </nte-navbar-line>
  </nte-navbar>

  <nte-offcanvas id="site-menu">
    <nte-nav id="main-navigation-vertical" style="--nte-nav-flow: column"></nte-nav>
    <tj-element-relocator
      source="#main-navigation-horizontal"
      target="#main-navigation-vertical"
      class="-lg:relocate"
    ></tj-element-relocator>
  </nte-offcanvas>
</tj-responsive>
```

The burger is only the trigger; connect it to the off-canvas in application code and keep its state synchronized when the off-canvas closes or opens through another interaction:

```ts
burger.addEventListener('click', () => void offcanvas.toggle());
offcanvas.addEventListener('nte-offcanvas:opened', () => {
  burger.open = true;
});
offcanvas.addEventListener('nte-offcanvas:closed', () => {
  burger.open = false;
});
```

For this composition, use `source` and `target` with separate horizontal and vertical `nte-nav` elements. The element-relocator moves the `nte-nav-item` children and does not move or re-slot either navigation element. `placement` is not supported.

This separation is intentional:

- `@nextrap/nte-navbar` owns header geometry, lines, slots, scroll state and navbar presentation.
- `@nextrap/nte-nav` owns navigation semantics and submenu behavior.
- `@trunkjs/element-relocator` owns synchronizing navigation items from the source `nte-nav` to the target `nte-nav`.
- `@trunkjs/responsive` owns breakpoint-driven classes and styles.
- The off-canvas component owns overlay/disclosure behavior.

Render separate horizontal and vertical navigation instances for this composition. The relocator keeps their item trees synchronized; it does not preserve submenu state between the independent copies.
