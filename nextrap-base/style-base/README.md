# style-base

CSS logic relevant to `nextrap` at large live in this folder.
Understand the larger context by checking out the project's main `README`.


## Notes

**Important**: This package must not be included in the shadow DOM of components. Add it to
the main document's style only once.

## Structure

- `_variables.scss` - Core design tokens and defaults
- `src/root.scss` - CSS custom properties and color calculations
- `src/container.scss` - Responsive container widths
- `src/spacing.scss` - Base spacing variables
- `src/typography.scss` - Typography system
- `src/colors-utils.scss` - Color utility classes

See [HOW_TO_USE.md](./HOW_TO_USE.md) for customization options.

## Development

- Please try to keep the [how-to-use documentation](./HOW_TO_USE.md) up to date if you change the available variables.