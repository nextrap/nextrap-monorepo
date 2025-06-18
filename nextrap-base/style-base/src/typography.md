# Typography System Implementation

## Core Concepts

The typography system implements a responsive type scale using modern CSS features. It's designed to maintain proper proportions and readability across all screen sizes while providing a consistent visual hierarchy.

The system is based on [this approach](https://typescale.net/responsive-typography.html) and uses a naming scheme similar to [Bootstrap classes](https://bootstrap-cheatsheet.themeselection.com/). 

## Technical Implementation

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

The system uses CSS custom properties to make the type scale dynamic and responsive. For now, fixed rem values are used for the type scale, and fluid scaling is not active:

```scss
:root {
  --fs-6: 0.75rem;    // Extra small
  --fs-5: 0.875rem;   // Small
  --fs-4: 1rem;       // Base
  --fs-3: 1.125rem;   // Large
  --fs-2: 1.25rem;    // Extra large
  --fs-1: 1.5rem;     // 2x large
  --display-4: 1.875rem; // Display 4
  --display-3: 2.25rem;  // Display 3
  --display-2: 3rem;     // Display 2
  --display-1: 3.75rem;  // Display 1
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

For older browsers, consider providing fallback values or using a polyfill.
