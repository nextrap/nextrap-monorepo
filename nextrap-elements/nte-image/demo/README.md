# nte-image Component Demos

This folder contains comprehensive demonstrations of the `nte-image` component's features and capabilities.

## Demo Files

### 📋 [base.html](./base.html) - Main Component Showcase

The primary demo file featuring:

- **Basic Image Display** - Simple images with fullscreen capability
- **Slideshow Gallery** - Interactive slideshows with navigation and indicators
- **Image Cropping & Focus** - Advanced cropping and positioning techniques
- **Advanced Features** - Custom intervals, debug mode, and special behaviors
- **Usage Examples** - Code snippets showing implementation

### 🎨 [gallery.html](./gallery.html) - Gallery Showcase

A portfolio-style gallery demonstration:

- Hero slideshow with multiple images
- Grid layout with various slideshow configurations
- Portfolio-style presentation
- Different image aspect ratios and compositions

### ⚡ [advanced.html](./advanced.html) - Advanced Features & Performance

Technical demonstrations including:

- **Performance Testing** - High-speed slideshows and stress tests
- **Precision Cropping** - Pixel-perfect cropping with mixed units
- **Event Handling** - JavaScript integration and event monitoring
- **Edge Cases** - Error handling and invalid input scenarios
- **Real-time Metrics** - Performance monitoring and debugging

### 📱 [mobile.html](./mobile.html) - Mobile Touch Experience

Mobile-optimized demonstrations:

- Touch gesture support (swipe, tap, pinch)
- Mobile-friendly UI elements
- Story format with quick transitions
- Portrait and landscape orientations
- Mobile device detection and optimization

## Features Demonstrated

### Core Features

- ✅ **Fullscreen View** - Click any image to view in fullscreen
- ✅ **Slideshow** - Automatic image transitions
- ✅ **Navigation** - Arrow buttons and indicator dots
- ✅ **Captions** - Text overlays with image descriptions
- ✅ **Rounded Borders** - Stylish rounded corner styling

### Advanced Features

- ✅ **Image Cropping** - Global and individual crop settings
- ✅ **Focus Point Control** - object-position styling
- ✅ **Custom Intervals** - Configurable transition timing
- ✅ **Pause Behavior** - Control hover pause functionality
- ✅ **Debug Mode** - Detailed console logging
- ✅ **Touch Gestures** - Mobile swipe and tap support
- ✅ **Event Handling** - Custom events and callbacks
- ✅ **Error Handling** - Graceful degradation

### Supported Attributes

#### data-features

Space-separated list of features:

- `slideshow` - Enable automatic slideshow
- `arrows` - Show navigation arrows
- `indicators` - Show indicator dots
- `fullsize` - Enable fullscreen on click
- `round-borders` - Apply rounded corners
- `dont-pause-on-hover` - Prevent pause on hover

#### Other Attributes

- `interval` - Slideshow interval in milliseconds
- `data-crop` - Global crop settings
- `debug` - Enable debug mode
- `data-caption` - Individual image captions (on img elements)
- `data-crop` - Individual image crop settings (on img elements)

## Usage Examples

### Basic Image

```html
<nte-image data-features="fullsize round-borders">
    <img src="image.jpg" alt="Description" />
</nte-image>
```

### Full Slideshow

```html
<nte-image data-features="slideshow arrows indicators fullsize" interval="4000">
    <img src="slide1.jpg" alt="Slide 1" data-caption="First slide" />
    <img src="slide2.jpg" alt="Slide 2" data-caption="Second slide" />
    <img src="slide3.jpg" alt="Slide 3" data-caption="Third slide" />
</nte-image>
```

### Cropped Image

```html
<nte-image data-features="fullsize" data-crop="top: 10%; bottom: 10%">
    <img src="image.jpg" alt="Cropped" style="object-position: center top" />
</nte-image>
```

## Running the Demos

1. Start the development server for the nte-image component
2. Navigate to any of the demo HTML files
3. Interact with the components to test features
4. Open browser DevTools to see debug output (when debug mode is enabled)

## Browser Support

The component works in all modern browsers with support for:

- Web Components / Custom Elements
- CSS Grid and Flexbox
- Touch Events (mobile)
- Intersection Observer (for performance)
- ResizeObserver (for responsive behavior)

## Performance Notes

- Images are loaded lazily for better performance
- Touch gestures are optimized for mobile devices
- Debug mode provides detailed performance metrics
- Component handles large image sets efficiently
