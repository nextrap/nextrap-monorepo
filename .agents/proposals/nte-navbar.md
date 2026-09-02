# `@nextrap/nte-navbar` proposal

**Status:** Draft for review. Do not implement before this proposal is approved.

**Related work:** [`@nextrap/nte-nav` API draft](../../docs/nte-nav-2-api-draft.md) and [PR #121](https://github.com/nextrap/nextrap-monorepo/pull/121).

## Decision summary

- Create a separate `@nextrap/nte-navbar` package. Its MVP contains exactly two elements: `nte-navbar` and `nte-navbar-line`.
- Keep navigation semantics in `@nextrap/nte-nav`. Navbar owns the page-header shell, placement, scroll state, line composition and mobile-sidebar orchestration.
- Allow any number of lines. Every line exposes the logical regions `start`, `center` and `end` and can use the Nextrap container width or the full available width.
- Support `static`, `sticky` and `fixed` placement. `static` is the safe default; `sticky` is the recommended persistent mode; `fixed` exists for legacy parity.
- In fixed mode render a configurable Spacer. Its default `initial` mode reserves the fully expanded initial Navbar height and does not shrink when lines collapse. `current` and `none` are explicit alternatives.
- Calculate scroll state once in `nte-navbar`. Lines never register their own global scroll listeners. Visual effects consume stable state classes and remain SCSS concerns.
- Reuse an external sidebar such as `nte-offcanvas`. The Navbar exposes `openSidebar()`, `closeSidebar()` and `toggleSidebar()` instead of implementing a second drawer/dialog.
- Support an external-sidebar mode that only opens the target and an optional compatibility mode that moves one complete `nte-nav-2` host at the responsive breakpoint. Never move individual nav items and never clone a navigation.
- Do not make Navbar a router. Native links remain the website default. SPA integration is an optional adapter/commit hook after the MVP.
- A separate Relocator element is not required for the common case: a sticky Navbar authored at the desired content position already starts there and docks when reached. A sentinel-based `nte-navbar-relocator` can be evaluated as a later, separate component.

## Why a new package

The legacy `@nextrap/nte-nav` combines three responsibilities:

1. menu item and submenu behavior;
2. multi-line Navbar layout and scroll behavior;
3. responsive Burger/Offcanvas transfer.

`@nextrap/nte-nav` already isolates the first responsibility. The Navbar replacement should complete that separation rather than reintroduce menu behavior into the shell.

| Component | Owns | Does not own |
|---|---|---|
| `nte-navbar` | stack placement, one shared scroll state, responsive mode, sidebar delegation, fixed Spacer | links, submenus, search, language selection, router behavior, drawer internals |
| `nte-navbar-line` | inner width and `start`/`center`/`end` layout | its own scroll listener, navigation semantics, hard-coded content types |
| `nte-nav-2` / `nte-nav-item` | navigation landmark, links, current state, disclosures, nested navigation | Header placement, Brand layout, sticky/fixed behavior, Sidebar shell |
| `nte-offcanvas` or another target | overlay/panel, backdrop, focus behavior, Escape, open state | Navbar layout and nav-item semantics |

Search, telephone links, language selection, account actions, CTAs and a Brand are ordinary slotted content. Mega menus remain an `nte-nav-2` concern.

## Legacy baseline and replacement scope

The MVP must replace the useful behavior of the current Navbar without copying its implementation defects.

| Area | Legacy behavior | Proposed behavior |
|---|---|---|
| Multiple lines | supported | supported without limit |
| Normal page flow | Navbar scrolls away | `position="static"` |
| Persistent Header | `.fixed` | `position="sticky"` recommended; `position="fixed"` for parity |
| Fixed Spacer | manual height despite intended auto measurement | `spacer="initial|current|none"`; measured and stable by default |
| Scroll state | `is-scrolled`, `is-below-threshold`, `is-scrolling-up` | centralized `is-scrolled`, `is-below-threshold`, `is-pinned`, `is-unpinned` |
| Effects | border, shadow, autohide | `with-*` SCSS modifiers driven by the shared state |
| Top Line | `.hide-on-scroll` | `.with-collapse-on-scroll` on the selected line |
| Line regions | Brand plus one default region | logical `start`, `center`, `end` slots |
| Width | custom variable, outer `100vw` | full-width background plus contained/fluid inner region; no `100vw` overflow |
| Mobile menu | move every legacy menu child to a slave nav | open external Sidebar, optionally move one `nte-nav-2` host and restore it at its placeholder |
| Brand relocator | fixed Ghost image animation only | not reused for Navbar relocation |

Known legacy issues that must not be ported include unremoved global listeners per line, an unused Debouncer and spacer refs, polling/sleeps for responsive transfer, fixed pixel assumptions, and autohide logic that fails to reveal the Header while scrolling upward far below the threshold.

## Research summary

No single Navbar system covers the desired combination. The following official sources provide the most useful patterns.

| Reference | Relevant lesson for Nextrap |
|---|---|
| [Bootstrap Navbar](https://getbootstrap.com/docs/5.3/components/navbar/) | Clear static/fixed/sticky placement, constrained/fluid content, breakpoint collapse and external Offcanvas integration form a good MVP baseline. |
| [Foundation Top Bar](https://get.foundation/sites/docs/top-bar.html), [Sticky](https://get.foundation/sites/docs/sticky.html) and [Off-canvas](https://get.foundation/sites/docs/off-canvas.html) | Start/end regions, a separate responsive title bar, and a sticky element that can begin deeper in the document support the proposed composition and Relocator direction. |
| [USWDS Header](https://designsystem.digital.gov/components/header/) | Basic versus extended Headers show why Branding/secondary actions and primary navigation may occupy separate lines. Search, CTA and language controls are optional content, not Navbar core behavior. |
| [GOV.UK Header and Service Navigation](https://design-system.service.gov.uk/patterns/navigate-a-service/) | Global Brand and service navigation are deliberately separate layers. This is the strongest model for multiple ordered `nte-navbar-line` elements. |
| [Carbon UI Shell Header](https://carbondesignsystem.com/components/UI-shell-header/usage/) | Product identity, navigation and global actions map naturally to logical `start`, `center` and `end` regions; deeper mobile navigation moves to a side panel. |
| [Material 3 App Bars](https://developer.android.com/develop/ui/compose/components/app-bars) | `pinned`, `enterAlways` and `exitUntilCollapsed` provide useful vocabulary for later scroll policies, but the app-specific component is not a website Header model. |
| [Headroom.js](https://wicky.nillia.ms/headroom.js/) | Scroll logic should publish stable `top`, `pinned` and `unpinned` states while CSS owns slide/fade/elevation effects. Offset and direction tolerance are later options. |
| [Spectrum Top Nav](https://opensource.adobe.com/spectrum-web-components/components/top-nav/) | URL-based current-link matching and options to ignore query/hash are useful for a future Nav 2 SPA adapter, not Navbar core. |
| [Tailwind Plus Headers](https://tailwindcss.com/plus/ui-blocks/marketing/elements/headers) | Its commercial catalogue is useful only as a taxonomy of centered Brands, CTAs and flyouts. The [license](https://tailwindcss.com/plus/license) prohibits deriving a redistributable UI library from its component code. |
| [WAI Disclosure Navigation](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/) | Ordinary site navigation uses links and Disclosure controls, not ARIA `menu`/`menubar`. This contract already belongs to Nav 2. |

## Scope

### MVP

- new package with `nte-navbar` and `nte-navbar-line`;
- composition with `nte-nav-2` without changing its public menu API;
- any number of lines;
- `start`, `center`, `end` slots on every line;
- contained or fluid line content;
- `static`, `sticky` and `fixed` placement;
- fixed Spacer modes `initial`, `current` and `none`;
- one central scroll observer/state calculation;
- threshold, direction and pin/unpin state;
- hide/reveal, background, border and shadow hooks as SCSS modifiers;
- independently collapsible Top Line;
- existing Nextrap breakpoint mode for structural mobile/desktop changes;
- open/close/toggle delegation to an external Sidebar target;
- optional whole-`nte-nav-2` host transfer for legacy parity;
- Parts, public CSS properties, `style-default`, Usage/Theming skills, `.ai-usage-info.md` and `web-types.json` when implementation is approved.

### Non-goals

- reimplementing `nte-nav-item`, disclosures, Mega menus or active-link semantics;
- shipping built-in Logo, Search, Telephone, Language, Account or CTA variants;
- implementing a new Offcanvas/Dialog inside Navbar;
- intercepting links or owning History/Navigation API state;
- hover-only menus;
- moving or cloning Navbar/nav content during scrolling;
- supporting a custom scroll container in the MVP;
- replacing `@nextrap/nte-nav` with its eventual final package name.

## Proposed author API

The page owns the semantic `<header>` landmark. `nte-navbar-line` is layout only; each `nte-nav-2` owns and labels its own navigation landmark.

```html
<header>
  <nte-navbar
    id="site-navbar"
    position="fixed"
    spacer="initial"
    scroll-threshold="24"
    sidebar-target="site-menu"
    sidebar-nav="primary-nav"
    class="with-shadow-on-scroll"
  >
    <nte-navbar-line fluid class="with-collapse-on-scroll">
      <a slot="start" href="tel:+49123456789">+49 123 456789</a>

      <nte-nav-2 slot="end" aria-label="Service-Navigation">
        <nte-nav-item href="/de" current="page">DE</nte-nav-item>
        <nte-nav-item href="/en">EN</nte-nav-item>
      </nte-nav-2>
    </nte-navbar-line>

    <nte-navbar-line>
      <a slot="start" href="/" aria-label="Startseite">
        <img src="/logo.svg" alt="Example GmbH" />
      </a>

      <nte-nav-2 id="primary-nav" slot="center" aria-label="Hauptnavigation">
        <nte-nav-item href="/">Start</nte-nav-item>
        <nte-nav-item>
          Leistungen
          <nte-nav-item href="/beratung">Beratung</nte-nav-item>
          <nte-nav-item href="/entwicklung">Entwicklung</nte-nav-item>
        </nte-nav-item>
      </nte-nav-2>

      <button
        slot="end"
        type="button"
        data-nt-navbar-toggle
        aria-controls="site-menu"
        aria-expanded="false"
      >
        Menü
      </button>
    </nte-navbar-line>
  </nte-navbar>
</header>

<nte-offcanvas id="site-menu" aria-label="Mobile Hauptnavigation"></nte-offcanvas>
```

`nte-burger` may replace the native button after its Button/ARIA contract has been verified. A native Button is the normative example because the trigger must expose `type="button"`, `aria-controls` and a synchronized `aria-expanded` value.

If `sidebar-nav` is omitted, Navbar only delegates opening/closing and the external Sidebar owns its content. If `sidebar-nav` is present, Navbar moves that one complete element to the Sidebar in mobile mode and restores it at an inert placeholder in desktop mode. It never copies the element or moves individual `nte-nav-item` children.

## `nte-navbar`

### Attributes and properties

| Attribute | Property | Type / default | Purpose |
|---|---|---|---|
| `position` | `position` | `"static" \| "sticky" \| "fixed"`, default `"static"` | Placement of the complete multi-line stack. |
| `spacer` | `spacer` | `"initial" \| "current" \| "none"`, default `"initial"` | Fixed-mode layout reservation. Ignored in static/sticky modes because those remain in flow. |
| `scroll-threshold` | `scrollThreshold` | number, default `1` | Distance after which `is-below-threshold` is set. |
| `sidebar-target` | `sidebarTarget` | ID string, default empty | Element implementing `open()`, `close()` and `toggle()`; initially `nte-offcanvas`. Use an ID, not an arbitrary selector. |
| `sidebar-nav` | `sidebarNav` | ID string, default empty | Optional complete navigation host moved at the responsive breakpoint. Empty means delegation-only mode. |

The component uses `nextrap_element({ eventBinding: true, breakpoints: true })`. The shared breakpoint feature and its reflected `mode` remain the source of structural responsive state. The project-standard `--breakpoint` configuration is preferred over a second ad-hoc media-query API.

The following values are read-only public state:

```ts
interface NteNavbarState {
  scrolled: boolean;
  belowThreshold: boolean;
  direction: 'none' | 'up' | 'down';
  pinned: boolean;
  blockSize: number;
  initialBlockSize: number;
  spacerBlockSize: number;
}
```

The host reflects state through classes rather than style attributes:

- `is-scrolled`;
- `is-below-threshold`;
- `is-pinned`;
- `is-unpinned`.

These classes are component-owned and read-only. Author-controlled features use `with-*` classes.

### Methods

```ts
interface NteNavbarElement extends HTMLElement {
  openSidebar(trigger?: HTMLElement | null): Promise<void>;
  closeSidebar(options?: { restoreFocus?: boolean }): Promise<void>;
  toggleSidebar(trigger?: HTMLElement | null): Promise<void>;
  refresh(options?: { recaptureSpacer?: boolean }): void;
}
```

`refresh({ recaptureSpacer: true })` intentionally discards the stored expanded baseline and captures it again. This is for an application that replaces the Brand or line content after startup; normal scroll effects must not call it.

The Sidebar target is resolved lazily so a panel rendered later still works. A direct element property may be added for application code, but the declarative ID contract remains the baseline. Missing or incompatible targets warn through the Nextrap logging feature and keep the Header usable; they do not throw during rendering.

### Events

| Event | Detail | Notes |
|---|---|---|
| `nte-navbar-state-change` | `{ previous, current }` | Bubbles and is composed. Fires only when a public state changes, never for every scroll pixel. |
| `nte-navbar-height-change` | `{ blockSize, initialBlockSize, spacerBlockSize }` | Bubbles and is composed. Fires after an observed or recaptured size changes. |

Sidebar lifecycle events remain owned by the Sidebar target. Navbar must not emit duplicate open/close lifecycle events with competing cancellation behavior.

### Parts

- `wrapper` — normal-flow wrapper and Spacer owner;
- `surface` — the complete visual stack that becomes sticky/fixed;
- `lines` — slot container for `nte-navbar-line` children;
- `spacer` — fixed-mode layout compensation, hidden in static/sticky modes.

## `nte-navbar-line`

`nte-navbar-line` uses `nextrap_element({ slotVisibility: true })` and has no Window-level event listeners.

### Attribute

| Attribute | Property | Type / default | Purpose |
|---|---|---|---|
| `fluid` | `fluid` | boolean, default `false` | Use the full available inline size instead of the Nextrap container maximum. The line background always spans the full Navbar width. |

Custom container sizes are theme configuration, not arbitrary per-instance attribute strings.

### Slots

| Slot | Purpose |
|---|---|
| `start` | Brand, primary identity or logical leading actions. |
| `center` | Truly centered Brand or main navigation. |
| `end` | Secondary navigation, CTA, Search, account actions or Sidebar trigger. |

Logical names are used instead of `left`/`right` so the public API remains valid for RTL layouts. DOM and focus order stays `start`, `center`, `end`. The center region must use Grid rather than absolute positioning so unequal outer content does not silently overlap it.

### Parts

- `line` — full-width outer row/background;
- `container` — constrained or fluid inner layout;
- `start`;
- `center`;
- `end`.

Empty regions are removed from layout through the standard `.slot-empty` mechanism.

## Position, Spacer and scroll behavior

### Static

`position="static"` stays in normal document flow and scrolls away. It is the default and the no-surprise fallback. No Spacer is rendered.

### Sticky

`position="sticky"` uses CSS `position: sticky` on the complete line stack with a logical block-start offset. It remains in flow, needs no Spacer and starts at the exact DOM position where it is authored. All lines stick as one unit; individual lines must never be independent sticky elements because they can overlap.

Sticky is constrained by its scroll container and containing block. Documentation must call out short ancestors, `overflow` scroll containers, Grid/Flex stretching and stacking contexts.

### Fixed and Spacer policy

`position="fixed"` takes the Surface out of flow. The Spacer is therefore a functional layout reservation, not a visual effect.

#### `spacer="initial"` — default and recommended

The Spacer reserves the expanded Navbar height captured for the current responsive mode. It deliberately does **not** shrink when a Top Line collapses, the Header hides/reveals, or a visual effect condenses the fixed Surface.

This has four benefits:

1. page content does not jump when scroll-driven states change;
2. changing the layout height cannot feed back into the scroll threshold and oscillate;
3. the browser's scroll position remains stable while a line is visually removed;
4. the page starts below the same fully expanded Header footprint that the user initially saw.

`initial` means the expanded baseline, not necessarily the first animation frame. The implementation must:

- capture the full stack before applying an initial scroll-collapse state, including a restored/deep scroll position;
- observe late font, image and slot-content growth and only increase the stored baseline while the same responsive mode remains active;
- keep the baseline frozen when a line becomes smaller because of Navbar scroll state;
- capture a new expanded baseline when the shared responsive `mode` changes;
- allow deliberate content removal/replacement to opt into a fresh baseline through `refresh({ recaptureSpacer: true })`.

Maintaining one baseline per responsive mode is acceptable if it avoids repeated measurement when switching between known modes. Polling, fixed delays and a cloned hidden Navbar are not acceptable measurement strategies.

#### `spacer="current"` — explicit opt-in

The Spacer follows the current measured Surface height. This can be useful when an application intentionally wants content to move upward as a fixed Header becomes smaller. It is not the default because a scroll-driven collapse then causes page reflow and can visibly move content or interact with scroll thresholds.

#### `spacer="none"` — overlay/integrated layouts

No space is reserved. This is useful when the fixed Header intentionally overlays a Hero, an application shell already reserves the Header area, or the consumer manages its own offset. The consumer is then responsible for content and focus not being obscured.

#### Measurement and public values

`ResizeObserver` measures the complete Navbar stack. No manual `--spacer-height`, fixed `80px`/`100px` assumption or wait/sleep loop is allowed.

The component publishes three distinct values:

- `blockSize` — current visible Surface height;
- `initialBlockSize` — expanded baseline for the current responsive mode;
- `spacerBlockSize` — the height actually reserved by the selected Spacer mode.

Keeping these values distinct is important: a collapsing line may change `blockSize` while `initialBlockSize` and `spacerBlockSize` remain stable.

The implementation uses `inline-size: 100%`, logical insets and a public z-index hook. It must not use `100vw`, which can introduce horizontal overflow when a vertical scrollbar exists.

### Central state calculation

- Bind one passive scroll listener through `eventBinding` / `@Listen` so disconnect cleanup is automatic.
- Batch direction calculations to at most one update per animation frame.
- Read `window` only after connection; module evaluation and construction remain SSR-safe.
- Never hide the Navbar while focus is inside it, a submenu is open or its Sidebar is open.
- `focusin` pins/reveals the Header immediately.
- Normalize open/focus state before a responsive breakpoint hides the currently focused content.

## Styling contract

Shadow DOM CSS contains only functional layout, positioning and visibility required by the components. The visual baseline and all effects are exported SCSS mixins applied through Parts.

Each element receives one complete `.style-default` baseline through `SetDefaultStyleMixin`. Additional full visual variants use one `style-*` class. Independently composable behavior/effect modifiers use `with-*` names.

Initial modifiers:

- `with-background-on-scroll`;
- `with-border-on-scroll`;
- `with-shadow-on-scroll`;
- `with-hide-reveal` on `nte-navbar`;
- `with-collapse-on-scroll` on a selected `nte-navbar-line`.

Later modifiers can provide `fade`, `slide`, `condense`, `elevate` or `transparent-to-solid` effects without adding new TypeScript state machines. Effects consume the same public state and are enabled only inside `prefers-reduced-motion: no-preference`; reduced-motion mode changes state immediately without slide/scale movement.

Potential public CSS properties, to be finalized during implementation review:

```css
--nte-navbar-offset
--nte-navbar-z-index
--nte-navbar-container-max-width
--nte-navbar-line-min-block-size
--nte-navbar-gap
--nte-navbar-transition-duration
--nte-navbar-transition-easing
--nte-navbar-block-size          /* read-only measured value */
--nte-navbar-initial-block-size  /* read-only expanded baseline */
--nte-navbar-spacer-block-size   /* read-only reserved value */
```

Nextrap `--nt-*` design tokens remain the default value source. The implementation proposal must explicitly review these properties before adding them to Shadow DOM, as required by the repository skill.

## Responsive Sidebar contract

The Navbar is an orchestrator, not a Drawer implementation.

```ts
interface NteNavbarSidebarTarget extends HTMLElement {
  readonly opened?: boolean;
  open(): void | Promise<void>;
  close(): void | Promise<void>;
  toggle(): void | Promise<void>;
}
```

- A descendant control marked `data-nt-navbar-toggle` calls `toggleSidebar()`.
- Navbar synchronizes the trigger's `aria-expanded` with the actual target state where that state is observable.
- Overlay Sidebars must provide Dialog-grade focus entry, focus containment, Escape, inert background and focus restoration.
- Non-modal push/reveal Sidebars must not trap focus.
- The current `nte-offcanvas` is the first target, but its focus/Escape/scroll-lock behavior must be verified before the Navbar MVP can claim an accessible mobile overlay.
- `nte-navbar` must not duplicate Offcanvas backdrop, panel placement or animation APIs.

When `sidebar-nav` is configured, responsive transfer follows these rules:

1. store an inert placeholder at the original element position;
2. move the complete host once when entering mobile mode;
3. keep the same element instance and IDs;
4. restore it at the placeholder before leaving mobile mode or disconnecting;
5. never clone it and never move its child items separately;
6. keep the external-only mode available for applications that render Sidebar content independently.

## Relocator direction (post-MVP)

The requested effect — begin without a top Navbar, encounter it in the content, then keep it at the viewport top — is already the native behavior of a sticky Navbar placed at that content position:

```html
<section class="hero"><!-- ... --></section>
<nte-navbar position="sticky"><!-- ... --></nte-navbar>
<main><!-- ... --></main>
```

This should be the documented first choice. It preserves SSR output, reading order, focus order and layout without JavaScript.

If a reusable state/offset boundary is needed later, evaluate a separate `nte-navbar-relocator` whose direct child is the one Navbar instance:

```html
<nte-navbar-relocator>
  <nte-navbar><!-- ... --></nte-navbar>
</nte-navbar-relocator>
```

Its proposed implementation is:

- CSS sticky performs all visible positioning;
- one non-focusable sentinel outside the sticky host plus `IntersectionObserver` publishes `at-origin` / `docked` state;
- `ResizeObserver` publishes the complete obstruction height;
- `nte-navbar-dock-change` fires only on state changes;
- no DOM move occurs while scrolling;
- no clone or second navigation landmark exists.

A future `for="id"` form may move an existing Navbar once during connection, but is not an MVP requirement. Custom scroll roots, an end boundary, fixed fallback and automatic `scroll-padding` management are also later work.

## Accessibility requirements

- The page-level `<header>` supplies the Banner landmark; `nte-navbar` must not create a duplicate Banner when nested there.
- Each `nte-nav-2` uses an appropriate accessible label when more than one navigation landmark exists.
- Website navigation remains links plus native Disclosure controls; no `menu`, `menubar` or `menuitem` roles.
- Link and Disclosure Toggle stay separate when a parent item is also a destination.
- The Sidebar trigger is a real Button with `aria-controls` and synchronized `aria-expanded`.
- Keyboard baseline is Tab/Shift+Tab plus Enter/Space activation and Escape dismissal. Arrow/Home/End keys remain optional Nav 2 work.
- DOM/focus order must not be changed through visual `order` values.
- A hidden/collapsed line cannot contain focus. Focus in the Navbar forces it visible.
- Sticky/fixed content must not obscure focused elements or fragment targets. Navbar publishes its measured block size so the application/theme can set `scroll-padding-block-start` or target `scroll-margin-block-start`.
- All non-essential motion respects `prefers-reduced-motion`.
- No feature may create two focusable copies of the same Navbar or navigation.

Reference: [WAI Disclosure Navigation](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/), [WCAG Focus Not Obscured technique](https://www.w3.org/WAI/WCAG22/Techniques/css/C43), [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion).

## Website and SPA behavior

Website navigation is the baseline:

- preserve real `href`, target, download, fragment and modifier-click behavior;
- do not prevent link clicks in Navbar core;
- server markup determines the initial current link;
- full-page navigation needs no Router adapter.

The existing `nte-nav-2` API already forwards native link attributes and `current` to `aria-current`. Future SPA support should therefore be a Nav 2/router concern plus one stable Navbar method: close the Sidebar after a successful navigation commit.

For a later adapter:

- subscribe to committed route changes, not clicks;
- update `aria-current` only after successful commit;
- allow exact/path-prefix/manual/ignore matching, with exact taking precedence over the longest segment-boundary prefix;
- optionally ignore query and hash, as Spectrum does;
- close the Sidebar after commit;
- never monkey-patch `history.pushState()` / `replaceState()`;
- feature-detect the modern [Navigation API](https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API) or require an explicit framework-router commit hook;
- leave new-view title, focus and live-region announcements to the Router/Page Shell.

`popstate` alone is insufficient because it fires for History traversal, not for the immediate `pushState()` call. Navbar must not pretend that listening to it provides a complete generic SPA adapter.

## Migration

| Old | New |
|---|---|
| `import '@nextrap/nte-nav'` for Navbar and menu | `import '@nextrap/nte-navbar'` plus `import '@nextrap/nte-nav'` |
| legacy `nte-nav` with `ul/li/ul` | `nte-nav-2` with nested `nte-nav-item` |
| `.active` link | `current="page"` on `nte-nav-item` |
| `slot="brand"` | `slot="start"` or `slot="center"` |
| Line default slot | explicit `slot="center"` or `slot="end"` |
| `.fixed` | `position="fixed"` |
| manual/static `--spacer-height` | `spacer="initial"` with automatic expanded-height capture |
| intentionally overlaying fixed Header | `spacer="none"` |
| no Sticky option | `position="sticky"` |
| `.autohide` | `.with-hide-reveal` |
| `.autoborder` | `.with-border-on-scroll` |
| `.autoshadow` | `.with-shadow-on-scroll` |
| Line `.hide-on-scroll` | Line `.with-collapse-on-scroll` |
| `.brand-center` | Brand in `slot="center"` |
| `.zoom-brand` | theme-defined `with-*` effect after MVP review |
| `mode="master" breakpoint="..." transfer-to="#menu"` on legacy Nav | `sidebar-target="menu"` and optional `sidebar-nav="primary-nav"` on Navbar; shared breakpoint mode |
| move every menu item to a slave Nav | move at most the one complete `nte-nav-2` host |

## Delivery phases

### Phase 1 — replacement MVP

Implement the Scope/MVP list, migrate the existing Navbar demos to Nav 2 composition and verify static/sticky/fixed, all three Spacer modes, two-line collapse, centered Brand, fluid/container content and both Sidebar modes.

### Phase 2 — scroll and Relocator extensions

- direction tolerance and separate up/down thresholds;
- public `pin()`, `unpin()` and `freeze()` only if a real integration needs them;
- Relocator wrapper/sentinel and dock event;
- custom scroll root;
- `fade`, `slide`, `condense`, `elevate` and transparent-to-solid mixins;
- stable layout footprint for a collapsing multi-line Sticky Header;
- Mega-menu alignment hooks for line/container/viewport while the menu itself remains in Nav 2.

### Phase 3 — SPA and application-shell extensions

- optional Router/location adapter owned with Nav 2;
- current-link matching and route-commit Sidebar closing;
- optional prefetch hooks;
- action overflow and context-sensitive application Header patterns;
- Sidebar `overlay`, `push` and `reveal` targets if the external panel component supports them.

## Open decisions

| Decision | Recommendation | Alternative |
|---|---|---|
| Package and tag names | `@nextrap/nte-navbar` with `nte-navbar` / `nte-navbar-line`; old and new packages must never be loaded together | temporary `nte-navbar-2` tags avoid registry collision but require a second later migration |
| Horizontal slot names | `start`, `center`, `end` | `left`, `center`, `right` are simpler but not RTL-safe |
| Default placement | `static` | `sticky` is convenient but changes existing page behavior by default |
| Fixed Spacer | `initial` by default, with explicit `current` and `none` | always-live Spacer causes scroll-driven reflow; always-none shifts layout ownership to every consumer |
| Mobile ownership | external Sidebar target; optional whole-host transfer for parity | Navbar-owned Drawer duplicates `nte-offcanvas`/Dialog responsibilities |
| Fixed mode | include for legacy parity, recommend Sticky in new sites | defer Fixed and intentionally drop exact parity |
| Relocator | document in-flow Sticky now; build a separate wrapper only after an integration needs dock state | ship a third element in the initial package |
| SPA API | keep Navbar router-neutral; add a Nav 2 adapter after a concrete Router integration | generic interception in Navbar core risks breaking native link behavior |

The tag-name decision must be made before implementation because Custom Elements cannot redefine `nte-navbar` or `nte-navbar-line` if the legacy package has already registered them.

## Acceptance criteria

- The MVP package contains only `nte-navbar` and `nte-navbar-line` and composes the existing Nav 2 package.
- A two-line Header can place service links/telephone/language in the first line and Brand/main navigation/actions in the second.
- Every line supports logical start/center/end content without absolute-position overlap and with deterministic DOM/focus order.
- Contained and fluid examples work without horizontal overflow.
- Static scrolls away; Sticky begins at its authored position; Fixed reserves space according to `initial`, `current` or `none`.
- `spacer="initial"` remains at the expanded baseline while lines collapse and therefore causes no scroll-driven Content Shift.
- Late content growth and responsive-mode changes update the correct expanded baseline; line hiding never lowers it; explicit recapture handles intentional content replacement/removal.
- Scroll state is calculated once regardless of line count, cleans up on disconnect and is SSR-safe at module/constructor time.
- Hide/reveal works while far down the page and never hides focused/open navigation.
- Only the selected Top Line collapses; the main line stays available.
- Effects are SCSS modifiers over public state and disappear/reduce under `prefers-reduced-motion`.
- Sidebar methods safely delegate to the configured target. Missing targets warn and do not throw.
- Both external-only and optional whole-host transfer modes preserve one navigation instance, IDs and state.
- Overlay Sidebar integration passes focus entry/trap, Escape, inert background and trigger-focus restoration checks before being documented as accessible.
- Native links, modifier clicks, `_blank`, downloads and fragments remain native.
- Multiple navigation landmarks are distinctly named and no duplicate Banner/navigation landmark is introduced.
- The migration guide explicitly states that legacy and replacement Navbar tags cannot be registered together.
- Implementation is not started until the package/tag, Sidebar-transfer, Spacer and Relocator-scope decisions above are reviewed.
