# nte-image

A versatile image display component built with Lit that supports slideshow functionality, fullscreen viewing, image cropping, and advanced positioning. Perfect for galleries, hero sections, and dynamic image displays.

## Demos

Den zentralen Demo-Viewer im Repository starten:

```bash
npm run demo
```

Unter **NTE Image** stehen [Stabile Bildfläche](demo/01-stable-frame.demo.ts) und [Navigation](demo/02-navigation.demo.ts) bereit. Beide verwenden Markdown mit Content Pane und die vorgegebenen Leuffen-CDN-Bilder.

## Basic Usage

Simple image with fullscreen capability:

```html
<nte-image style="--nte-image-features: fullsize;">
    <img src="image.jpg" alt="Description" />
</nte-image>
```

Image with rounded corners:

```html
<nte-image style="--nte-image-features: fullsize round-borders;">
    <img src="image.jpg" alt="Description" />
</nte-image>
```

## Slideshow Features

Auto-detected slideshow (`auto` enables slideshow, arrows and indicators for multiple images):

```html
<nte-image style="--nte-image-features: auto fullsize;">
    <img src="slide1.jpg" alt="Slide 1" />
    <img src="slide2.jpg" alt="Slide 2" />
    <img src="slide3.jpg" alt="Slide 3" />
</nte-image>
```

Full-featured slideshow with navigation and captions:

```html
<nte-image style="--nte-image-features: slideshow arrows indicators fullsize round-borders; --nte-image-interval: 4000ms;">
    <img src="slide1.jpg" alt="Slide 1" data-caption="First slide caption" />
    <img src="slide2.jpg" alt="Slide 2" data-caption="Second slide caption" />
    <img src="slide3.jpg" alt="Slide 3" data-caption="Third slide caption" />
</nte-image>
```

Fast slideshow with custom interval:

```html
<nte-image style="--nte-image-features: slideshow arrows indicators; --nte-image-interval: 2000ms;">
    <img src="image1.jpg" alt="Fast slide 1" />
    <img src="image2.jpg" alt="Fast slide 2" />
</nte-image>
```

## Image Cropping & Positioning

Global crop applied to all images:

```html
<nte-image style="--nte-image-features: fullsize;" data-crop="top: 10%; bottom: 10%; left: 5%; right: 5%">
    <img src="image.jpg" alt="Cropped image" />
</nte-image>
```

Individual crop settings per image:

```html
<nte-image style="--nte-image-features: slideshow arrows;">
    <img src="image1.jpg" alt="Portrait" data-crop="top: 20%; bottom: 20%" />
    <img src="image2.jpg" alt="Landscape" data-crop="left: 15%; right: 15%" />
</nte-image>
```

Focus point control with object-position:

```html
<nte-image style="--nte-image-features: slideshow indicators;">
    <img src="image1.jpg" alt="Focus top" style="object-position: center top" data-caption="Top focus" />
    <img src="image2.jpg" alt="Focus center" style="object-position: center center" data-caption="Center focus" />
    <img src="image3.jpg" alt="Focus bottom" style="object-position: center bottom" data-caption="Bottom focus" />
</nte-image>
```

Mixed units (pixels and percentages):

```html
<nte-image data-crop="top: 30px; bottom: 20%; left: 10%; right: 50px">
    <img src="image.jpg" alt="Precise crop" style="object-position: 30% 70%" />
</nte-image>
```

## Advanced Features

Debug mode for development:

```html
<nte-image style="--nte-image-features: slideshow indicators;" debug>
    <img src="image1.jpg" alt="Debug slide 1" />
    <img src="image2.jpg" alt="Debug slide 2" />
</nte-image>
```

Slideshow that doesn't pause on hover:

```html
<nte-image style="--nte-image-features: slideshow arrows dont-pause-on-hover;">
    <img src="image1.jpg" alt="Continuous slide 1" />
    <img src="image2.jpg" alt="Continuous slide 2" />
</nte-image>
```

## Features (`--nte-image-features`)

- **slideshow** - Enables slideshow functionality
- **fullsize** - Enables fullscreen view on click
- **arrows** - Shows navigation arrows for slideshow
- **indicators** - Shows indicator dots for slideshow
- **round-borders** - Applies rounded corners to the component
- **blend** - Uses the blend animation for the active slide
- **dont-pause-on-hover** - Prevents slideshow from pausing on hover

## Attributes

- **data-crop** (string): Global crop settings in CSS format (e.g., "top: 10%; left: 5%")
- **debug** (boolean): Enables debug mode with detailed console logging

## Image Attributes

Each `<img>` element can have:

- **data-caption** (string): Text caption for the image (displayed below slideshow)
- **data-crop** (string): Individual crop settings (overrides global settings)
- **style="object-position: X Y"** (CSS): Controls the focus point of the image

## CSS Parts

- **image-container** - The container for the images
- **caption-container** - The container for the caption
- **indicators** - The container for the slideshow indicators
- **navigation-arrows** - The container for the navigation arrows

## CSS-Konfiguration und dynamische Änderungen

`--nte-image-features` enthält unquotierte, durch Leerzeichen getrennte Feature-Namen. Ohne Wert oder mit `auto` werden bei mehreren Bildern Slideshow, Pfeile und Indikatoren aktiviert. Eine explizite Liste aktiviert nur die genannten Features; `none` deaktiviert alle und zeigt das erste Bild. `--nte-image-interval` akzeptiert positive Millisekundenwerte oder CSS-Zeiten wie `2s` und `2000ms`; fehlende oder ungültige Werte ergeben `5000ms`.

```css
/* Das Theme steuert dieselbe API wie ein Inline-Style. */
nte-image.gallery {
  --nte-image-features: slideshow arrows indicators fullsize;
  --nte-image-interval: 4s;
}
```

Änderungen an `class` und `style` des Hosts werden automatisch ausgewertet, einschließlich Navigation, Timer und Hover-Pause. Bei nachträglich geänderten geerbten Variablen oder Stylesheets ruft die Anwendung `element.refreshStyles()` auf. Es gibt keine parallele Feature-/Intervall-Konfiguration als Attribut oder JavaScript-Property. Datenbezogene Bildausschnitte (`data-crop`), Beschriftungen und Debug-Zustand bleiben erhalten.

### Migration

| Old | New |
|---|---|
| `data-features="slideshow arrows"` / `dataFeatures` | `style="--nte-image-features: slideshow arrows;"` |
| `interval="2000"` / `interval` | `style="--nte-image-interval: 2s;"` |
| `fullSize` / `roundBorders` als Konfiguration | `fullsize` / `round-borders` in `--nte-image-features` |

Die alten Feature- und Intervall-Attribute werden nicht mehr ausgewertet. Die Demos verwenden ausschließlich die CSS-API.

## CSS Custom Properties

- **--nte-image-features** - Feature-Liste, `auto` oder `none`
- **--nte-image-interval** - Wechselintervall (Standard: `5000ms`)

- **--nte-image-border-radius** - Border radius for rounded corners (default: 12px)

## Stabile Bildfläche und Navigation

Die Komponente reserviert ihre Fläche vor dem Laden der Bilder. Standardmäßig gilt eine Breite von `100%` und ein Seitenverhältnis von `16 / 9`; wechselnde Bildformate verändern die Rahmenhöhe nicht. Alle direkten Bilder füllen diese Fläche mit `object-fit: cover`. `object-position` steuert den sichtbaren Ausschnitt.

| Variable | Standard | Zweck |
|---|---|---|
| `--nte-image-width` | `100%` | Breite des Rahmens |
| `--nte-image-height` | `auto` | Explizite Höhe; bei `auto` aus dem Seitenverhältnis |
| `--nte-image-aspect-ratio` | `16 / 9` | Verhältnis bei automatisch berechneter Höhe |

Direkte CSS-Werte für `width`, `height` und `aspect-ratio` sind ebenfalls möglich. Die Komponente schreibt keine Inline-Standardmaße mehr. Für `height: 100%` muss der Elterncontainer eine definierte Höhe besitzen.

```scss
// Reserviert eine quadratische Fläche unabhängig von den geladenen Bildformaten.
nte-image.square {
  --nte-image-aspect-ratio: 1 / 1;
}

// Begrenzt die Breite und setzt eine feste Höhe für einen Banner.
nte-image.banner {
  width: min(100%, 640px);
  height: 320px;
}
```

Mit `style="--nte-image-features: slideshow arrows;"` sind Vor-/Zurück-Buttons dauerhaft sichtbar, auch auf Touch-Geräten. Sie sind per Tastatur erreichbar und lösen in Formularen kein Submit aus. Über `::part(previous-button)` und `::part(next-button)` können Themes die Buttons anpassen; die übrigen dokumentierten Parts sind ebenfalls verfügbar.

`import '@nextrap/nte-image'` benötigt keinen Default-Style-Import und exportiert kein Light-DOM-SCSS. Die Slideshow verwendet ihre funktionalen Shadow-DOM-Regeln und injiziert keine globalen Styles. Die separate bestehende Vollbildansicht bleibt unverändert.

Die neuen Demos `demo/01-stable-frame.demo.ts` und `demo/02-navigation.demo.ts` zeigen wechselnde Hoch-/Querformate, Seitenverhältnisse, feste Maße und Navigation im zentralen Demo-Viewer.

## Events

- **nte-image-fullsize-open** - Fired when fullsize view is opened
- **nte-image-fullsize-close** - Fired when fullsize view is closed
- **nte-image-slide-change** - Fired when the active slide changes

## JavaScript Callbacks

The component supports several callback properties for advanced integration:

- **onSlideChange** - Called when the active slide changes
- **onFullscreenEnter** - Called when entering fullscreen mode
- **onFullscreenExit** - Called when exiting fullscreen mode
- **onSlideshowPause** - Called when the slideshow is paused
- **onSlideshowResume** - Called when the slideshow is resumed
- **onImageClick** - Called when an image is clicked

## Mobile Support

- Touch/swipe gestures for slideshow navigation
- Automatic mobile device detection
- Responsive design with mobile-optimized controls
- Touch-friendly fullscreen mode

## Performance Features

- Automatic memory management
- Optimized rendering with ResizeObserver
- Efficient event handling
- Debug mode for performance monitoring
- Support for high-speed slideshows (tested down to 100ms intervals)

## Browser Compatibility

- Modern browsers supporting Web Components
- Lit-based implementation
- Progressive enhancement for older browsers
