# NTE Burger

`<nte-burger>` is a native disclosure button for opening and closing navigation. `text` provides its accessible name, while `aria-controls` references the controlled menu.

<div class="nte-burger-demo">
  <div class="nte-burger-demo__row">
    <nte-burger text="Open main navigation" aria-controls="overview-menu"></nte-burger>
    <nte-burger text="Close main navigation" aria-controls="overview-menu" open></nte-burger>
    <nte-burger text="Navigation unavailable" disabled></nte-burger>
  </div>
  <div class="nte-burger-demo__row">
    <nte-burger text="Open compact navigation" style="--size: 2.25rem"></nte-burger>
    <nte-burger text="Open external navigation" aria-controls="overview-menu" static-state></nte-burger>
    <nte-burger text="Open large navigation" style="--size: 4rem"></nte-burger>
  </div>
</div>

`static-state` is useful when an external offcanvas or dialog is controlled by the burger's click event. The burger remains closed and keeps `aria-expanded="false"` while the external component changes its own state.

The host remains at least 44 × 44 CSS pixels even when `--size` is smaller. Keyboard activation, focus indication, `aria-expanded`, disabled state, high-contrast colors, and reduced-motion preferences are handled by the component.
