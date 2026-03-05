# Basic Usage

## Minimal Setup

The simplest way to use `nte-demo-viewer` is to add `<demo>` child elements with a `title` and `src`:

```html
<nte-demo-viewer>
  <demo title="My First Demo" src="/demo/example.md"></demo>
  <demo title="My Second Demo" src="/demo/example2.md"></demo>
</nte-demo-viewer>
```

## Demo Element Attributes

Each `<demo>` element supports the following attributes:

| Attribute       | Type     | Required | Description                             |
| --------------- | -------- | -------- | --------------------------------------- |
| `title`         | `string` | Yes      | Display title shown in card and menu    |
| `src`           | `string` | Yes      | Path to the demo file (.md or .html)    |
| `description`   | `string` | No       | Optional description shown below title  |

## With Descriptions

Adding descriptions makes the demo cards more informative:

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
    src="/demo/exclusive.md">
  </demo>
</nte-demo-viewer>
```

## Component Properties

| Property        | Attribute        | Type     | Default             | Description                          |
| --------------- | ---------------- | -------- | ------------------- | ------------------------------------ |
| `welcomeTitle`  | `welcome-title`  | `string` | `"Component Demos"` | Title shown on the welcome screen    |
| `readme`        | `readme`         | `string` | `""`                | Path to README.md for README view    |

### Example with all properties

```html
<nte-demo-viewer 
  welcome-title="My Component" 
  readme="/README.md">
  <demo title="Demo 1" src="/demo/demo1.md"></demo>
</nte-demo-viewer>
```
