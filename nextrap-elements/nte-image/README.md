# nte-image

A versatile image display component built with Lit that supports slideshow functionality, fullscreen viewing, image cropping, and advanced positioning. Perfect for galleries, hero sections, and dynamic image displays.

## Visual Demo

```bash
nx dev nte-image
# Open http://localhost:4000/demo/base.html for basic features
# Open http://localhost:4000/demo/advanced.html for advanced features
# Open http://localhost:4000/demo/gallery.html for gallery examples
# Open http://localhost:4000/demo/mobile.html for mobile-optimized demos
```

## Basic Usage

Simple image with fullscreen capability:

```html
<nte-image data-features="fullsize">
    <img src="image.jpg" alt="Description" />
</nte-image>
```

Image with rounded corners:

```html
<nte-image data-features="fullsize round-borders">
    <img src="image.jpg" alt="Description" />
</nte-image>
```

## Slideshow Features

Auto-detected slideshow (multiple images automatically enable slideshow):

```html
<nte-image data-features="fullsize">
    <img src="slide1.jpg" alt="Slide 1" />
    <img src="slide2.jpg" alt="Slide 2" />
    <img src="slide3.jpg" alt="Slide 3" />
</nte-image>
```

Full-featured slideshow with navigation and captions:

```html
<nte-image data-features="slideshow arrows indicators fullsize round-borders" interval="4000">
    <img src="slide1.jpg" alt="Slide 1" data-caption="First slide caption" />
    <img src="slide2.jpg" alt="Slide 2" data-caption="Second slide caption" />
    <img src="slide3.jpg" alt="Slide 3" data-caption="Third slide caption" />
</nte-image>
```

Fast slideshow with custom interval:

```html
<nte-image data-features="slideshow arrows indicators" interval="2000">
    <img src="image1.jpg" alt="Fast slide 1" />
    <img src="image2.jpg" alt="Fast slide 2" />
</nte-image>
```

## Image Cropping & Positioning

Global crop applied to all images:

```html
<nte-image data-features="fullsize" data-crop="top: 10%; bottom: 10%; left: 5%; right: 5%">
    <img src="image.jpg" alt="Cropped image" />
</nte-image>
```

Individual crop settings per image:

```html
<nte-image data-features="slideshow arrows">
    <img src="image1.jpg" alt="Portrait" data-crop="top: 20%; bottom: 20%" />
    <img src="image2.jpg" alt="Landscape" data-crop="left: 15%; right: 15%" />
</nte-image>
```

Focus point control with object-position:

```html
<nte-image data-features="slideshow indicators">
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
<nte-image data-features="slideshow indicators" debug>
    <img src="image1.jpg" alt="Debug slide 1" />
    <img src="image2.jpg" alt="Debug slide 2" />
</nte-image>
```

Slideshow that doesn't pause on hover:

```html
<nte-image data-features="slideshow arrows dont-pause-on-hover">
    <img src="image1.jpg" alt="Continuous slide 1" />
    <img src="image2.jpg" alt="Continuous slide 2" />
</nte-image>
```

## Features (data-features attribute)

- **slideshow** - Enables slideshow functionality (auto-enabled with multiple images)
- **fullsize** - Enables fullscreen view on click
- **arrows** - Shows navigation arrows for slideshow
- **indicators** - Shows indicator dots for slideshow
- **round-borders** - Applies rounded corners to the component
- **blend** - Uses blend transition effect for slideshow (TODO: Not implemented yet)
- **dont-pause-on-hover** - Prevents slideshow from pausing on hover

## Attributes

- **data-features** (string): Space-separated list of features to enable
- **data-crop** (string): Global crop settings in CSS format (e.g., "top: 10%; left: 5%")
- **interval** (number): Custom interval for slideshow transitions in milliseconds (default: 5000)
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

## CSS Custom Properties

- **--nte-image-border-radius** - Border radius for rounded corners (default: 12px)

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
