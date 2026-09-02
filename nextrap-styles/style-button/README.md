# style-button

Reusable button, dropdown and interaction styles for Nextrap themes.

## Hover button

Use `.btn-hover` when the control should reserve the normal button space but
remain text-like until the pointer enters it:

```html
<button class="btn btn-hover" type="button">Language</button>
```

The default state is transparent with a light text/button treatment on hover.
The variant can be combined with `.dropdown-toggle` and the native Popover API.

## Building

Run `nx build style-button` to build the library.

## Running unit tests

Run `nx test style-button` to execute the unit tests via [Vitest](https://vitest.dev/).
