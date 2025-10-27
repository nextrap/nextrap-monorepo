# NTE Data Table

A powerful, customizable table component built with Lit that provides enhanced functionality while maintaining the familiar HTML table structure.

## Features

- **Semantic HTML Structure**: Uses proper `<thead>`, `<tbody>`, and `<tfoot>` elements
- **Fixed Header & Footer**: Sticky positioning for better data viewing
- **Resizable Columns**: Drag to resize columns with visual feedback
- **Local Storage Persistence**: Automatically saves and restores column widths
- **Cell Overflow Handling**: Automatic text truncation with ellipsis
- **Light DOM Styling**: CSS is applied directly to the component
- **Native Table Behavior**: Works exactly like a standard HTML table
- **Responsive Design**: Adapts to different screen sizes
- **Customizable**: Configurable column widths, resize behavior, and styling

## Installation

```bash
npm install @nextrap/nte-data-table
```

## Basic Usage

The `nte-data-table` component works exactly like a native HTML table, but with enhanced functionality:

```html
<nte-data-table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>John Doe</td>
            <td>john@example.com</td>
            <td>Active</td>
        </tr>
        <tr>
            <td>Jane Smith</td>
            <td>jane@example.com</td>
            <td>Inactive</td>
        </tr>
    </tbody>
</nte-data-table>
```

## Advanced Usage with Configuration

```html
<nte-data-table
    localStorage-key="my-table-config"
    default-column-width="150"
    min-column-width="80"
    max-column-width="400"
    enable-column-resize="true"
>
    <thead>
        <tr>
            <th>ID</th>
            <th>Project Name</th>
            <th>Assignee</th>
            <th>Status</th>
            <th>Due Date</th>
        </tr>
    </thead>

    <tbody>
        <tr>
            <td>001</td>
            <td>Website Redesign</td>
            <td>John Doe</td>
            <td>In Progress</td>
            <td>2024-12-31</td>
        </tr>
    </tbody>

    <tfoot>
        <tr>
            <td colspan="5">Total: 1 project</td>
        </tr>
    </tfoot>
</nte-data-table>
```

## Properties

| Property             | Type    | Default                    | Description                                          |
| -------------------- | ------- | -------------------------- | ---------------------------------------------------- |
| `localStorageKey`    | String  | `'nte-data-table-columns'` | Key for storing column configuration in localStorage |
| `defaultColumnWidth` | Number  | `150`                      | Default width for columns in pixels                  |
| `minColumnWidth`     | Number  | `80`                       | Minimum allowed column width in pixels               |
| `maxColumnWidth`     | Number  | `400`                      | Maximum allowed column width in pixels               |
| `enableColumnResize` | Boolean | `true`                     | Whether columns can be resized by dragging           |

## Methods

### `getColumnWidth(columnKey: string): number`

Returns the current width of a specific column.

### `setColumnWidth(columnKey: string, width: number): void`

Sets the width of a specific column. The width will be constrained to the min/max limits.

### `resetColumnWidths(): void`

Resets all columns to their default width.

## Column Resizing

Columns can be resized by dragging the resize handle that appears on the right edge of each header cell. The resize handle becomes visible when hovering over the header.

- **Drag to resize**: Click and drag the resize handle to adjust column width
- **Automatic persistence**: Column widths are automatically saved to localStorage
- **Constraints**: Column widths are constrained between min and max values
- **Visual feedback**: The resize handle changes color during resize operations

## Styling

The component uses Light DOM styling, which means CSS is applied directly to the component without Shadow DOM encapsulation. This allows for easy customization and integration with existing CSS frameworks.

### Custom CSS Classes

You can apply custom CSS classes to override default styles:

```css
/* Custom header styling */
.nte-data-table thead th {
    background: #e3f2fd !important;
    color: #1976d2 !important;
}

/* Custom row hover effects */
.nte-data-table tbody tr:hover {
    background-color: #f5f5f5 !important;
}

/* Custom cell styling */
.nte-data-table td {
    padding: 12px 16px !important;
}
```

## Local Storage

Column configurations are automatically saved to localStorage using the specified `localStorageKey`. The stored data includes:

- Column keys
- Column widths
- Timestamp of last modification

### Storage Format

```json
[
    {
        "key": "name",
        "width": 200
    },
    {
        "key": "email",
        "width": 250
    }
]
```

## Browser Support

- Chrome 67+
- Firefox 63+
- Safari 11.1+
- Edge 79+

## Examples

### Project Management Table

```html
<nte-data-table localStorage-key="projects-table">
    <thead>
        <tr>
            <th>ID</th>
            <th>Project Name</th>
            <th>Assignee</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Due Date</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>001</td>
            <td>Website Redesign</td>
            <td>
                <div class="avatar">JD</div>
                John Doe
            </td>
            <td><span class="status-badge active">Active</span></td>
            <td><span class="priority high">High</span></td>
            <td>2024-12-31</td>
        </tr>
    </tbody>
</nte-data-table>
```

### Data Table with Actions

```html
<nte-data-table localStorage-key="users-table">
    <thead>
        <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>John Doe</td>
            <td>john@example.com</td>
            <td>Admin</td>
            <td>
                <button onclick="editUser(1)">Edit</button>
                <button onclick="deleteUser(1)">Delete</button>
            </td>
        </tr>
    </tbody>
</nte-data-table>
```

## Best Practices

1. **Use semantic HTML**: Always use proper `<thead>`, `<tbody>`, and `<tfoot>` elements
2. **Provide meaningful column headers**: Clear headers improve usability
3. **Set appropriate column widths**: Consider content length when setting default widths
4. **Use consistent localStorage keys**: Use unique keys for different tables
5. **Handle responsive design**: Consider mobile users when setting minimum column widths

## Troubleshooting

### Columns not resizing

- Ensure `enableColumnResize` is set to `true`
- Check that the column has content (empty columns may not show resize handles)
- Verify that CSS isn't interfering with pointer events

### Column widths not persisting

- Check that localStorage is available in the browser
- Verify the `localStorageKey` is unique and valid
- Check browser console for any JavaScript errors

### Styling issues

- Use `!important` for CSS overrides when necessary
- Ensure CSS selectors are specific enough
- Check that the component is properly loaded

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

This project is licensed under the MIT License.
