# @nextrap/nte-multiselect

A flexible multi-selection Web Component built with Lit that provides radio button and checkbox functionality with customizable card layouts.

## Features

- **Radio & Checkbox Support** - Single or multiple selection modes
- **Multiple Layouts** - Rows, columns, or responsive grid
- **Fully Customizable** - CSS custom properties and parts for styling
- **Accessible** - Keyboard navigation and ARIA attributes
- **Responsive** - Mobile-friendly with adaptive layouts
- **Flexible Slots** - Customizable content areas for icons, titles, values, and descriptions

## Installation

```bash
npm install @nextrap/nte-multiselect
```

## Usage

### Basic Example

```html
<script type="module">
    import '@nextrap/nte-multiselect';
</script>

<nte-multiselect layout="grid">
    <nte-multiselect-item type="radio" name="plan" value="basic" checked>
        <span slot="title">Basic Plan</span>
        <span slot="value">$9/mo</span>
        <span slot="description">Perfect for individuals</span>
    </nte-multiselect-item>

    <nte-multiselect-item type="radio" name="plan" value="pro">
        <span slot="title">Pro Plan</span>
        <span slot="value">$29/mo</span>
        <span slot="description">For professionals and teams</span>
    </nte-multiselect-item>
</nte-multiselect>
```

### Checkbox Example

```html
<nte-multiselect layout="rows">
    <nte-multiselect-item type="checkbox" name="features" value="ssl">
        <span slot="leading">🔒</span>
        <span slot="title">SSL Certificate</span>
        <span slot="description">Secure your website with HTTPS</span>
    </nte-multiselect-item>

    <nte-multiselect-item type="checkbox" name="features" value="backup">
        <span slot="leading">💾</span>
        <span slot="title">Daily Backups</span>
        <span slot="description">Automatic daily backups of your data</span>
    </nte-multiselect-item>
</nte-multiselect>
```

## API Reference

### `<nte-multiselect>`

The container component that manages the layout and selection behavior.

#### Properties

| Property | Type                            | Default  | Description               |
| -------- | ------------------------------- | -------- | ------------------------- |
| `layout` | `'rows' \| 'columns' \| 'grid'` | `'rows'` | Layout mode for the items |

#### Methods

| Method                                | Returns                    | Description                                   |
| ------------------------------------- | -------------------------- | --------------------------------------------- |
| `getSelectedValues()`                 | `string[]`                 | Returns array of selected values              |
| `getSelectedValuesByGroup()`          | `Record<string, string[]>` | Returns selected values grouped by name       |
| `setSelectedValues(values: string[])` | `void`                     | Programmatically set selected values          |
| `clearSelection()`                    | `void`                     | Clear all selections                          |
| `selectAll()`                         | `void`                     | Select all checkbox items                     |
| `toggleValue(value: string)`          | `void`                     | Toggle selection of a specific value          |
| `isValueSelected(value: string)`      | `boolean`                  | Check if a value is selected                  |
| `validate(requiredGroups?: string[])` | `boolean`                  | Validate that required groups have selections |

#### Events

| Event    | Detail                    | Description                  |
| -------- | ------------------------- | ---------------------------- |
| `change` | `MultiselectChangeDetail` | Fired when selection changes |

```typescript
interface MultiselectChangeDetail {
    values: Array<{ name: string; value: string; checked: boolean }>;
    checkedValues: string[];
}
```

### `<nte-multiselect-item>`

Individual selectable item component.

#### Properties

| Property           | Type                                                           | Default          | Description                     |
| ------------------ | -------------------------------------------------------------- | ---------------- | ------------------------------- |
| `type`             | `'radio' \| 'checkbox'`                                        | `'radio'`        | Selection type                  |
| `name`             | `string`                                                       | `''`             | Group name for radio buttons    |
| `value`            | `string`                                                       | `''`             | Value when selected             |
| `checked`          | `boolean`                                                      | `false`          | Whether item is selected        |
| `disabled`         | `boolean`                                                      | `false`          | Whether item is disabled        |
| `control-position` | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | `'bottom-right'` | Position of the control element |

#### Slots

| Slot          | Description                  |
| ------------- | ---------------------------- |
| `leading`     | Icon or element at the start |
| `title`       | Main title content           |
| `value`       | Value or price display       |
| `description` | Descriptive text             |
| `trailing`    | Element at the end           |

#### Methods

| Method                         | Returns | Description                        |
| ------------------------------ | ------- | ---------------------------------- |
| `setChecked(checked: boolean)` | `void`  | Programmatically set checked state |

## Styling

### CSS Custom Properties

#### Container (`nte-multiselect`)

```css
nte-multiselect {
    --gap: 16px; /* Gap between items */
    --grid-min-width: 250px; /* Minimum width for grid items */
}
```

#### Item (`nte-multiselect-item`)

```css
nte-multiselect-item {
    --card-background: #ffffff;
    --card-background-checked: #f0f7ff;
    --card-border-color: #e0e0e0;
    --card-border-color-checked: #1976d2;
    --card-border-color-focused: #2196f3;
    --card-border-width: 2px;
    --card-border-radius: 8px;
    --card-padding: 16px;
    --card-transition: all 0.2s ease;
    --control-size: 20px;
    --text-color: #333333;
    --text-color-disabled: #999999;
    --value-color: #1976d2;
    --description-color: #666666;
}
```

### CSS Parts

Parts allow you to style internal elements:

```css
/* Style the card container */
nte-multiselect-item::part(card) {
    background: linear-gradient(to right, #f0f0f0, #ffffff);
}

/* Style individual sections */
nte-multiselect-item::part(title) {
    font-weight: bold;
}

nte-multiselect-item::part(description) {
    font-style: italic;
}
```

Available parts:

- `card` - The main card container
- `leading` - Leading slot container
- `content` - Main content area
- `title` - Title slot container
- `value` - Value slot container
- `description` - Description slot container
- `trailing` - Trailing slot container
- `control` - Radio/checkbox control container

## Advanced Examples

### Programmatic Control

```javascript
const multiselect = document.querySelector('nte-multiselect');

// Listen for changes
multiselect.addEventListener('change', (e) => {
    console.log('Selected values:', e.detail.checkedValues);
});

// Set values programmatically
multiselect.setSelectedValues(['option1', 'option2']);

// Get selected values
const selected = multiselect.getSelectedValues();

// Validate required groups
const isValid = multiselect.validate(['plan', 'payment']);
```

### Custom Styling

```css
/* Dark theme example */
nte-multiselect-item {
    --card-background: #1e1e1e;
    --card-background-checked: #2a3f5f;
    --card-border-color: #404040;
    --card-border-color-checked: #4dabf7;
    --text-color: #ffffff;
    --description-color: #b0b0b0;
}

/* Compact layout */
nte-multiselect {
    --gap: 8px;
}

nte-multiselect-item {
    --card-padding: 12px;
    --control-size: 16px;
}
```

## Accessibility

- Full keyboard navigation support
- ARIA attributes for screen readers
- Focus indicators
- High contrast mode support
- Reduced motion support

## Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+
- All modern mobile browsers

## License

MIT
