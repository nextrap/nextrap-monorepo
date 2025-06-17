# How to Use style-base

Quick guide on what settings you may want to set if you import `style-base` in a project using nextrap.

## Quick Start
```scss
// 1. Create a _custom-variables.scss file
$primary: #your-color;
$accent: #your-color;
$font-family-base: 'Your Font', sans-serif;

// 2. Import style-base AFTER your variables
@use '@nextrap/style-base';
```

## Available Customizations

### Colors

```scss
$primary: #your-color;    // Main brand color
$accent: #your-color;     // Accent color
$success: #your-color;    // Success state color
$info: #your-color;       // Info state color
$warning: #your-color;    // Warning state color
$danger: #your-color;     // Error/danger state color
$light: #your-color;      // Light background color
$dark: #your-color;       // Dark background color
```

### Typography

```scss
$font-family-base: 'Your Font', sans-serif;  // Base font
$font-size-base: 1rem;                       // Base font size
$font-family-header: 'Your Font', sans-serif; // Header font
```

### Spacing

```scss
$base-space: 1rem;  // Base spacing unit
```

### Container Widths

Override via CSS:
```css
:root {
  --nt-container-width: 1200px;  // Default container width
}
```

### Soft Colors

```scss
$lighten-factor: 40% !default;  // How much to lighten colors for soft variants
```

## Available Utility Classes

- `.bg-{color}` - Background colors (e.g., `.bg-primary`)
- `.text-{color}` - Text colors (e.g., `.text-accent`)
- `.border-{color}` - Border colors (e.g., `.border-success`)
- `.bg-soft-{color}` - Soft background colors (e.g., `.bg-soft-primary`)
