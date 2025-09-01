# nte-scrollspy

| Version | Status |
| ------- | ------ |
| 0.0.1   | alpha  |

## Description

A versatile and lightweight scrollspy component that dynamically updates navigation menus based on scroll position. This web component tracks visible sections on a page and automatically highlights the corresponding navigation items, providing users with visual feedback about their current location within the content.

## Features

- **Dynamic Navigation Highlighting**: Automatically highlights the current section in the navigation menu
- **Progress Tracking**: Option to mark previously viewed sections for better user orientation
- **Smooth Scrolling**: Click navigation items to smoothly scroll to the corresponding section
- **Responsive Design**: Works with both vertical and horizontal layouts
- **Customizable Styling**: Extensive CSS custom properties and shadow parts for styling
- **Accessibility**: ARIA attributes for better screen reader support

## Installation & Usage

### Installation

```bash
npm install @nextrap/nte-scrollspy
```

### dev-mode

```bash
npx nx dev nte-scrollspy
```

### prod-mode

```bash
npx nx build nte-scrollspy
```

### HTML Implementation

The following example will watch global (document.body) and search for elements with a "data-title"-attribute. Those will be used as navigation items.

```html
<!-- Basic Implementation with global spy -->
<nte-scrollspy></nte-scrollspy>
```

This example will watch inside the element with the id "basic-example" and search for elements with a "data-title"-attribute. Those will be used as navigation items.

```html
<!-- Basic Implementation with target container to watch -->
<nte-scrollspy data-target="#basic-example"></nte-scrollspy>
<section id="#basic-example">
    <div data-title="First Section"></div>
    <div data-title="Second Section"></div>
    <div data-title="Third Section"></div>
    <div data-title="Fourth Section"></div>
</section>
```

This example will watch inside the element with the id "basic-example" and search for elements with a "data-title"-attribute. Those will be used as navigation items. A custom configuration is applied to the scrollspy element. The navigation items will be styled with the classes "custom-scrollspy-class" and "with-highlights". The navigation items will be horizontal and will not be linked to the sections.

```html
<!-- Basic Implementation with custom configuration for target container -->
<nte-scrollspy id="custom-spy" data-target="#basic-example"></nte-scrollspy>
<section id="#basic-example">
    <div data-title="First Section"></div>
    <div data-title="Second Section"></div>
    <div data-title="Third Section"></div>
    <div data-title="Fourth Section"></div>
</section>

<script>
    const customSpy = document.getElementById('custom-spy');
    customSpy.config = {
        classes: ['custom-scrollspy-class', 'with-highlights'],
        trackProgress: false,
        orientation: 'horizontal',
        linkItems: false,
        data: [
            { id: 'section-1-1', label: 'First Section' },
            { id: 'section-1-2', label: 'Second Section' },
            { id: 'section-1-3', label: 'Third Section' },
            { id: 'section-1-4', label: 'Fourth Section' },
        ],
    };
</script>
```

## Configuration Options

| Property             | Type    | Default    | Description                                     |
| -------------------- | ------- | ---------- | ----------------------------------------------- |
| config               | Object  | {}         | Main configuration object                       |
| config.trackProgress | Boolean | false      | When true, tracks visited sections              |
| config.linkItems     | Boolean | true       | When true, renders navigation items as links    |
| config.data          | Array   | []         | Custom navigation items                         |
| orientation          | String  | 'vertical' | Layout orientation ('vertical' or 'horizontal') |

## Events

| Event           | Description                               |
| --------------- | ----------------------------------------- |
| active-changed  | Fired when the active section changes     |
| section-visible | Fired when a section becomes visible      |
| section-hidden  | Fired when a section is no longer visible |

## Customization

The component exposes several shadow parts for styling:

- scrollspy-item: The navigation item container
- scrollspy-link: The navigation link element
- scrollspy-decorator: Visual indicator element
- scrollspy-list: The list of navigation items

## Example styling:

```css
nte-scrollspy::part(scrollspy-item) {
    padding: 8px;
    margin: 4px 0;
}

nte-scrollspy::part(active-item) {
    background-color: rgba(0, 123, 255, 0.1);
    border-left: 3px solid blue;
}
```
