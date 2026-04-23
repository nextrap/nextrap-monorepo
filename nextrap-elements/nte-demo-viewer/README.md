# nte-demo-viewer

A component for viewing and switching between multiple demo files with live code editing support. Ideal for component documentation and interactive demos.

## Features

- **Demo Switching** - FAB button with menu to switch between multiple demos
- **Code Viewer** - View the Markdown source of the current demo
- **Live Editing** - Edit Markdown code with live preview (500ms debounce)
- **Responsive** - Split view on desktop, stacked on mobile
- **Theming** - Fully customizable via CSS Custom Properties

## Installation

```typescript
import '@nextrap/nte-demo-viewer';
```

## Basic Usage

```html
<nte-demo-viewer>
  <demo title="Basic Demo" src="/demo/basic.md"></demo>
  <demo title="Advanced Demo" src="/demo/advanced.md"></demo>
</nte-demo-viewer>
```

## Demo Element Attributes

| Attribute     | Type   | Description                          | Required |
| ------------- | ------ | ------------------------------------ | -------- |
| `title`       | string | Display title in the menu            | Yes      |
| `src`         | string | Path to the Markdown demo file       | Yes      |
| `description` | string | Optional description shown in menu   | No       |

## Example with Descriptions

```html
<nte-demo-viewer>
  <demo 
    title="Allgemeine Demo" 
    description="Grundlegende Accordion-Funktionalität" 
    src="/demo/base.md">
  </demo>
  <demo 
    title="Exclusive Accordion" 
    description="Nur ein Element kann geöffnet werden" 
    src="/demo/base2.md">
  </demo>
</nte-demo-viewer>
```

## Events

| Event         | Detail                              | Description                        |
| ------------- | ----------------------------------- | ---------------------------------- |
| `demo-change` | `{ index: number, demo: DemoConfig }` | Fired when selected demo changes |
| `code-change` | `{ content: string }`               | Fired when code is edited          |

## CSS Custom Properties

All styling can be customized via CSS Custom Properties on `nte-demo-viewer`:

### FAB (Floating Action Button)

| Property              | Default                 | Description              |
| --------------------- | ----------------------- | ------------------------ |
| `--nte-fab-size`      | `56px`                  | Size of the FAB          |
| `--nte-fab-bg`        | `var(--nt-primary)`     | Background color         |
| `--nte-fab-bg-hover`  | `var(--nt-primary-emphasis)` | Hover background    |
| `--nte-fab-color`     | `var(--text-on-primary)`| Text/icon color          |
| `--nte-fab-shadow`    | `0 4px 12px rgba(...)`  | Box shadow               |
| `--nte-fab-z-index`   | `10000`                 | Z-index                  |

### Menu

| Property                      | Default                      | Description              |
| ----------------------------- | ---------------------------- | ------------------------ |
| `--nte-menu-width`            | `300px`                      | Menu width               |
| `--nte-menu-bg`               | `var(--nt-light)`            | Background color         |
| `--nte-menu-border`           | `var(--nt-light-emphasis)`   | Border color             |
| `--nte-menu-border-radius`    | `12px`                       | Border radius            |
| `--nte-menu-item-color`       | `var(--nt-secondary-emphasis)` | Item text color        |
| `--nte-menu-item-hover-bg`    | `var(--nt-primary-subtle)`   | Item hover background    |
| `--nte-menu-item-active-bg`   | `var(--nt-primary)`          | Active item background   |
| `--nte-menu-item-active-color`| `var(--nt-text-on-primary)`  | Active item text color   |

### Badge

| Property           | Default                  | Description              |
| ------------------ | ------------------------ | ------------------------ |
| `--nte-badge-bg`   | `var(--nt-warning)`      | Badge background         |
| `--nte-badge-color`| `var(--nt-text-on-warning)` | Badge text color      |

### Code Editor

| Property              | Default                      | Description              |
| --------------------- | ---------------------------- | ------------------------ |
| `--nte-code-bg`       | `var(--nt-dark)`             | Editor background        |
| `--nte-code-color`    | `var(--nt-text-on-dark)`     | Editor text color        |
| `--nte-code-header-bg`| `var(--nt-dark-emphasis)`    | Header background        |
| `--nte-code-border`   | `var(--nt-dark-emphasis)`    | Border color             |
| `--nte-code-font`     | `Consolas, Monaco, monospace`| Editor font family       |

## Requirements

This component requires:

- `@trunkjs/content-pane` - For rendering Markdown content
- `@trunkjs/markdown-loader` - For loading Markdown files
- `@nextrap/style-base` - For base styling variables

```typescript
import '@nextrap/style-base';
import '@trunkjs/content-pane';
import '@trunkjs/markdown-loader';
import '@nextrap/nte-demo-viewer';
```

## Notes

- The component uses **Light DOM** rendering (not Shadow DOM) to allow `tj-markdown-loader` to find `tj-content-pane`
- Demo files should be valid Markdown with Kramdown-style layout annotations
- The code editor provides live preview with a 500ms debounce to avoid excessive re-renders
