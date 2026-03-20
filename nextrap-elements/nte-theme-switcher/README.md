# nte-theme-switcher

A lightweight Lit Web Component for switching themes via CSS classes on the `<body>` element.

## Installation

```bash
npm install @nextrap/nte-theme-switcher
```

## Usage

```html
<nte-theme-switcher themes="light, dark, high-contrast"></nte-theme-switcher>
```

The component adds a `theme-{name}` class to the `<body>` element when a theme is selected.

## Properties

| Property | Type   | Default | Description                                                    |
| -------- | ------ | ------- | -------------------------------------------------------------- |
| themes   | string | `""`    | Comma-separated list of theme names (prefixed with `theme-`)  |

## Styling

Use the theme classes in your CSS:

```css
/* Default styles */
.my-element { background: white; color: black; }

/* Dark theme */
.theme-dark .my-element { background: #1a1a1a; color: white; }

/* High contrast theme */
.theme-high-contrast .my-element { background: black; color: yellow; }
```

## Features

- **CSS Class Based** — Sets `theme-{name}` class on `<body>` for easy CSS styling
- **URL Sync** — Theme persists via `?theme=...` URL parameter
- **Default Option** — "Default / System" removes the class and cleans the URL
- **Shadow DOM** — Component styles are encapsulated
