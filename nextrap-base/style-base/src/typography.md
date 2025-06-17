# Typography System Implementation

## Core Concepts

The typography system implements a fluid, responsive type scale using modern CSS features. It's designed to maintain proper proportions and readability across all screen sizes while providing a consistent visual hierarchy.

The system is based on [this approach](https://typescale.net/responsive-typography.html) and uses a naming scheme similar to [Bootstrap classes](https://bootstrap-cheatsheet.themeselection.com/). 

## Technical Implementation

### Fluid Typography Calculation

The system uses a combination of `clamp()` and viewport units to create fluid typography. The calculation is based on a linear interpolation between minimum and maximum sizes:

```scss
@function fluid-type($min-size, $max-size, $min-width: 320px, $max-width: 1200px) {
  $slope: calc(($max-size - $min-size) / ($max-width - $min-width));
  $slope-vw: calc($slope * 100);
  $intercept-rem: calc($min-size - $slope * $min-width);
  @return clamp($min-size, $intercept-rem + $slope-vw, $max-size);
}
```

This creates a smooth transition between sizes while maintaining minimum and maximum bounds for readability.

### Type Scale

The type scale is calculated using a modular scale approach:

```scss
@function type-scale($level, $base-size: $font-size-base, $ratio: $type-scale-ratio) {
  @return calc($base-size * pow($ratio, $level));
}
```

The scale uses different ratios for different viewport sizes:
- Mobile: 1.1 (tighter scale)
- Desktop: 1.25 (more dramatic scale)
- Default: 1.2 (balanced scale)

### CSS Custom Properties

The system uses CSS custom properties to make the type scale dynamic and responsive:

```scss
:root {
  --fs-6: #{fluid-type(0.75rem, 0.875rem)};    // Extra small
  --fs-5: #{fluid-type(0.875rem, 1rem)};       // Small
  --fs-4: #{fluid-type(1rem, 1.125rem)};       // Base
  --fs-3: #{fluid-type(1.125rem, 1.25rem)};    // Large
  --fs-2: #{fluid-type(1.25rem, 1.5rem)};      // Extra large
  --fs-1: #{fluid-type(1.5rem, 1.875rem)};     // 2x large
  --display-4: #{fluid-type(1.875rem, 2.25rem)}; // Display 4
  --display-3: #{fluid-type(2.25rem, 3rem)};     // Display 3
  --display-2: #{fluid-type(3rem, 3.75rem)};     // Display 2
  --display-1: #{fluid-type(3.75rem, 4.5rem)};   // Display 1
}
```

### Responsive Adjustments

The system adjusts the type scale ratio based on viewport size:

```scss
@media (max-width: 768px) {
  :root {
    --type-scale-ratio: var(--type-scale-ratio-mobile);
  }
}

@media (min-width: 1200px) {
  :root {
    --type-scale-ratio: var(--type-scale-ratio-desktop);
  }
}
```

## Design Decisions

1. **Minimum Sizes**
   - Base text never goes below 16px (1rem)
   - Display text has larger minimum sizes to maintain hierarchy

2. **Maximum Sizes**
   - Prevents text from becoming too large on big screens
   - Maintains comfortable reading experience

3. **Scale Ratios**
   - Mobile: Tighter scale (1.1) for better space usage
   - Desktop: More dramatic scale (1.25) for visual impact
   - Default: Balanced scale (1.2) for general use

4. **Line Heights**
   - Base: 1.5 for optimal readability
   - Headings: 1.2 for tighter, more impactful display
   - Additional options: 1.25 (small) and 1.75 (large)

## Browser Support

The system uses modern CSS features that are supported in all modern browsers:
- CSS Custom Properties (variables)
- `clamp()` function
- `calc()` function

For older browsers, consider providing fallback values or using a polyfill.
