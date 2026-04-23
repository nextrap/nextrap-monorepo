# CSS Customization

## Overview

All visual aspects of `nte-demo-viewer` can be customized via CSS Custom Properties. Set them on the `nte-demo-viewer` element to override defaults.

```html
<nte-demo-viewer style="
  --nte-fab-bg: #e91e63;
  --nte-fab-bg-hover: #c2185b;
  --nte-menu-item-active-bg: #e91e63;
">
  ...
</nte-demo-viewer>
```

---

## FAB (Floating Action Button)

| Property              | Default                          | Description              |
| --------------------- | -------------------------------- | ------------------------ |
| `--nte-fab-size`      | `56px`                           | Size of the FAB          |
| `--nte-fab-bg`        | `#0d6efd`                        | Background color         |
| `--nte-fab-bg-hover`  | `#0a58ca`                        | Hover background         |
| `--nte-fab-color`     | `#ffffff`                        | Text/icon color          |
| `--nte-fab-shadow`    | `0 4px 12px rgba(0,0,0,0.15)`   | Box shadow               |
| `--nte-fab-z-index`   | `10000`                          | Z-index                  |

---

## Menu

| Property                        | Default                        | Description              |
| ------------------------------- | ------------------------------ | ------------------------ |
| `--nte-menu-width`              | `300px`                        | Menu width               |
| `--nte-menu-bg`                 | `#f8f9fa`                      | Background color         |
| `--nte-menu-border`             | `#e9ecef`                      | Border color             |
| `--nte-menu-border-radius`      | `12px`                         | Border radius            |
| `--nte-menu-item-color`         | `#495057`                      | Item text color          |
| `--nte-menu-item-hover-bg`      | `rgba(13,110,253,0.08)`        | Item hover background    |
| `--nte-menu-item-active-bg`     | `#0d6efd`                      | Active item background   |
| `--nte-menu-item-active-color`  | `#ffffff`                       | Active item text color   |

---

## Badge

| Property             | Default    | Description              |
| -------------------- | ---------- | ------------------------ |
| `--nte-badge-bg`     | `#ffc107`  | Badge background         |
| `--nte-badge-color`  | `#000000`  | Badge text color         |

---

## Code Editor

| Property                | Default                              | Description              |
| ----------------------- | ------------------------------------ | ------------------------ |
| `--nte-code-bg`         | `#212529`                            | Editor background        |
| `--nte-code-color`      | `#f8f9fa`                            | Editor text color        |
| `--nte-code-header-bg`  | `#343a40`                            | Header background        |
| `--nte-code-border`     | `#343a40`                            | Border color             |
| `--nte-code-font`       | `Consolas, Monaco, Courier New, monospace` | Editor font family |

---

## Backdrop

| Property              | Default                | Description              |
| --------------------- | ---------------------- | ------------------------ |
| `--nte-backdrop-bg`   | `rgba(0,0,0,0.1)`     | Backdrop overlay color   |
