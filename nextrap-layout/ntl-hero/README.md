# ntl-hero

A hero section web component with support for background images, sliders, and overlay content. Perfect for creating engaging landing page headers with parallax effects and dynamic content.

## Features

- **Slot-based architecture**: Flexible content composition through named slots
- **Shadow DOM styling**: Encapsulated styles that don't leak to the document
- **No dependencies**: Uses only web standards and Lit
- **Responsive**: Mobile-first design with responsive breakpoints
- **Layered content**: Proper z-index management for background, slider, and content layers

## Slots

| Slot Name    | Description                                            | Example Elements           |
| ------------ | ------------------------------------------------------ | -------------------------- |
| `background` | Background layer (parallax images, gradients, etc.)    | `ntl-parallax-bg`, `<div>` |
| `slider`     | Middle layer for image sliders/carousels               | Custom slider, images      |
| `content`    | Top layer for text content and call-to-action elements | Text, buttons, headings    |

## Example Usage

### Basic Hero with Gradient Background

```html
<ntl-hero style="min-height: 500px;">
    <div
        slot="background"
        style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); width: 100%; height: 100%;"
    ></div>

    <div slot="content">
        <h1>Your Headline Here</h1>
        <p>Your description text</p>
        <a href="#" class="cta-button">Call to Action</a>
    </div>
</ntl-hero>
```

### Hero with Parallax Background

```html
<ntl-hero style="min-height: 600px;">
    <ntl-parallax-bg slot="background" image="hero-background.jpg" height="100%"> </ntl-parallax-bg>

    <div slot="content">
        <h1>Hero with Parallax Effect</h1>
    </div>
</ntl-hero>
```

### Complete Hero with Slider

```html
<ntl-hero style="min-height: 600px;">
    <div slot="background" style="background: #f0f0f0; width: 100%; height: 100%;"></div>

    <div slot="slider" class="image-slider">
        <!-- Your slider implementation -->
        <img src="slide1.jpg" alt="Slide 1" />
    </div>

    <div slot="content" style="text-align: center; color: white;">
        <h2>Digital Transformation</h2>
        <p>Efficient, precise, patient-oriented</p>
        <button>Learn More</button>
    </div>
</ntl-hero>
```

## Styling

The component uses Shadow DOM, so styles are encapsulated. You can style slotted content from the light DOM:

```css
/* Style your content before slotting it */
.hero-text {
    max-width: 800px;
    text-align: center;
    color: white;
}

.hero-cta {
    background-color: #ff6b35;
    padding: 1rem 2rem;
    border-radius: 2rem;
}
```

## CSS Custom Properties

The component respects standard CSS properties on the host element:

```css
ntl-hero {
    min-height: 600px; /* Control hero height */
    max-height: 100vh; /* Limit maximum height */
}
```

## Parts

You can style internal parts using `::part()`:

| Part         | Description                 |
| ------------ | --------------------------- |
| `background` | The background slot wrapper |
| `slider`     | The slider slot wrapper     |
| `content`    | The content slot wrapper    |

```css
ntl-hero::part(content) {
    padding: 3rem;
}
```

## Browser Support

Works in all modern browsers that support:

- Web Components
- Shadow DOM
- CSS Custom Properties

## Accessibility

- Ensure content in the `content` slot has proper heading hierarchy
- Add appropriate ARIA labels to interactive elements
- Ensure sufficient color contrast for text over images
- Provide alt text for images in the slider slot
