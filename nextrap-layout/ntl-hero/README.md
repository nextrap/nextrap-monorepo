# ntl-hero

A layout-focused hero web component with support for:

- a **background layer** (e.g. parallax image),
- a **top navigation bar**,
- **centered headline/content**, and
- a **framed slider card** that is bottom‑aligned and can visually overlap the page below.

It is implemented with Lit and the Shadow DOM, and is designed to be reusable across different hero designs by composing content via slots and CSS custom properties.

## Features

- **Slot-based architecture**: `nav`, `bg`, default, and `slider` slots for flexible composition.
- **Layered layout**: Background, content, and slider are stacked with proper z‑index handling.
- **Viewport-aware height**: Defaults to `100vh` and can be reduced via a height offset.
- **Themed via CSS variables**: Adjust spacing, radii, heights, and offsets without touching the component code.
- **Responsive**: Adapts padding and slider sizing on smaller screens.

## Slots

| Slot name   | Required | Description                                                                              | Typical content                      |
| ----------- | -------- | ---------------------------------------------------------------------------------------- | ------------------------------------ |
| `nav`       | no       | Navigation bar at the very top of the hero.                                              | Navigation component, logo + menu    |
| `bg`        | no       | Background layer behind everything else. If omitted, the hero falls back to `--nt-body`. | `ntl-parallax-bg`, decorative images |
| _(default)_ | no       | Main hero content, centered between nav and slider.                                      | Headings, copy, buttons, badges      |
| `slider`    | no       | Slider/card content in the framed area at the bottom of the hero.                        | Carousel / slideshow components      |

> The component is resilient: you can use just a background + content, content + slider, or all four slots together.

## Layout behavior

- The hero height is `min-height: calc(100vh - var(--ntl-hero-height-offset))`, so by default it fills the viewport.
- The **nav** (if present) sits at the top, the **slider** is bottom‑aligned, and the **content** is vertically centered in the remaining space between them.
- The slider is wrapped in a **card frame** with its own background and border radius; it can be moved further down using `--ntl-hero-slider-offset` so that it visually overlaps the section that follows.
- If no `bg` slot is provided, the hero uses `--nt-body` (or `--ntl-hero-bg-color`) as its background color.

## Example: Hero with nav, parallax background, centered content and slider

```html
<ntl-hero
    style="
    --ntl-hero-height-offset: 10vh;
    --ntl-hero-bg-color: #E4E6EF;
    --ntl-hero-slider-offset: 3rem;
  "
>
    <!-- Top navigation bar -->
    <div slot="nav">
        <nte-nav
            class="nav-horizontal"
            mode="master"
            data-group-name="nav1"
            breakpoint="1008px"
            transfer-to="#navSidebar"
        >
            <span slot="menu-text">Menü</span>
            <ul>
                <li><a href="#" class="active">Home</a></li>
                <li><a href="#">Magazin</a></li>
                <li><a href="#">Über uns</a></li>
                <li><a href="#">Kontakt</a></li>
            </ul>
        </nte-nav>
    </div>

    <!-- Background layer (optional). If omitted, bg color comes from --ntl-hero-bg-color / --nt-body -->
    <div slot="bg">
        <ntl-parallax-bg image="header-bg.svg"></ntl-parallax-bg>
    </div>

    <!-- Centered hero text -->
    <div>
        <h6>
            <span style="color: var(--nt-primary); text-transform: uppercase;">EPRAXIS.DIGITAL</span>
            – DAS MAGAZIN FÜR DIE DIGITALISIERUNG IN DER GESUNDHEITSBRANCHE
        </h6>
        <h1>Digitale Transformation im Gesundheitswesen – verständlich, unabhängig, praxisnah.</h1>
    </div>

    <!-- Slider in framed card at the bottom -->
    <div slot="slider">
        <nte-image data-features="slideshow arrows indicators fullsize round-borders" interval="4000">
            <img src="slide1.jpg" alt="Slide 1" />
            <img src="slide2.jpg" alt="Slide 2" />
            <img src="slide3.jpg" alt="Slide 3" />
        </nte-image>
    </div>
</ntl-hero>
```

## Simpler variants

### Only background + content

```html
<ntl-hero>
    <ntl-parallax-bg slot="bg" image="hero-background.jpg"></ntl-parallax-bg>

    <div>
        <h1>Your Headline Here</h1>
        <p>Your description text</p>
    </div>
</ntl-hero>
```

### Background + content + slider (no nav)

```html
<ntl-hero style="--ntl-hero-bg-color: #f0f0f5;">
    <div slot="bg" style="background: #f0f0f5; width: 100%; height: 100%;"></div>

    <div>
        <h2>Digital Transformation</h2>
        <p>Effizient, präzise, patientenorientiert</p>
    </div>

    <div slot="slider">
        <!-- Your slider implementation -->
    </div>
</ntl-hero>
```

## CSS custom properties

You can tune the layout and visual appearance using CSS variables on the host element:

| Property                       | Default                              | Description                                                                       |
| ------------------------------ | ------------------------------------ | --------------------------------------------------------------------------------- |
| `--ntl-hero-bg-color`          | `var(--nt-body, #e4e6ef)`            | Background color when no `bg` slot content is provided.                           |
| `--ntl-hero-max-height`        | `950px`                              | Maximum height of the hero container.                                             |
| `--ntl-hero-shell-max-width`   | `1200px`                             | Max width of the inner shell (nav + content + slider).                            |
| `--ntl-hero-content-max-width` | `940px`                              | Max width of the centered content block.                                          |
| `--ntl-hero-slider-max-height` | `auto` (overridden in media queries) | Max height of the slider frame.                                                   |
| `--ntl-hero-outer-radius`      | `30px`                               | Border radius of the outer slider wrapper/card.                                   |
| `--ntl-hero-inner-radius`      | `20px`                               | Border radius of the inner slider frame.                                          |
| `--ntl-hero-height-offset`     | `0px`                                | Value subtracted from `100vh` to reduce hero height (e.g. `80px`, `10vh`).        |
| `--ntl-hero-slider-offset`     | `3rem`                               | Vertical translation applied to the slider card from its bottom‑aligned position. |
| `--ntl-hero-padding-inline`    | `1.5rem`                             | Horizontal padding of the hero root.                                              |
| `--ntl-hero-padding-top`       | `3rem`                               | Top padding of the hero root.                                                     |
| `--ntl-hero-padding-bottom`    | `0rem`                               | Bottom padding of the hero root.                                                  |
| `--ntl-hero-gap`               | `0rem`                               | Vertical gap between content and slider inside the shell.                         |

Example customization:

```css
ntl-hero.hero-large {
    --ntl-hero-height-offset: 8vh;
    --ntl-hero-slider-offset: 4rem;
    --ntl-hero-content-max-width: 880px;
}
```

## Parts

You can style internal parts using `::part()`:

| Part           | Description                             |
| -------------- | --------------------------------------- |
| `section`      | Root `<section>` element of the hero    |
| `nav`          | Wrapper around the navigation slot      |
| `content`      | Wrapper around the default content slot |
| `slider-frame` | Outer card frame around the slider      |
| `slider`       | Inner slider container                  |

```css
ntl-hero::part(content) {
    padding: 0 2rem;
}

ntl-hero::part(slider-frame) {
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.15);
}
```

## Styling slotted content

Slotted elements (`nav`, `bg`, default, `slider`) are authored in the light DOM, so you can style them normally:

```css
.hero-heading h1 {
    font-size: clamp(2.2rem, 3vw, 3.2rem);
    margin-bottom: 0.75rem;
}

.hero-heading p {
    margin: 0;
    color: var(--nt-text-muted);
}
```

## Browser support

Works in all modern browsers that support:

- Web Components
- Shadow DOM
- CSS Custom Properties

## Accessibility

- Ensure headings in the default slot follow a proper hierarchy (`<h1>`, `<h2>`, …).
- Provide visible focus styles and appropriate ARIA labels inside the `nav` and `slider` content.
- Ensure sufficient color contrast for text over images.
- Provide `alt` text for all images in the `bg` and `slider` slots.
