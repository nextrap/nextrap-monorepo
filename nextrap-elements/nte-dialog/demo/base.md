# NTE Dialog examples

The examples below are intended to work in Markdown/HTML content without application code.

## Launcher / opener

The launcher is rendered outside the native modal dialog. Clicking it opens the dialog. Headings, footer content and the remaining body content are assigned automatically.

```html
<nte-dialog class="size-lg with-shadow">
  <button class="launcher btn btn-primary">Open details</button>

  <h2>Product details</h2>

  <p>This content is only visible while the dialog is open.</p>

  <div class="footer">
    <span>Additional footer content</span>
  </div>
</nte-dialog>
```

The explicit slot form is also supported:

```html
<nte-dialog>
  <button slot="launcher">Open dialog</button>
  <span slot="title">Explicit title slot</span>
  <p>Default content.</p>
  <div slot="footer">Explicit footer slot</div>
</nte-dialog>
```

## Anchor opener using the element id

A boolean `anchor` uses the element `id`. Opening `#modal:contact` opens the dialog. Closing the dialog removes the modal hash again.

```html
<a href="#modal:contact">Open contact dialog</a>

<nte-dialog id="contact" anchor class="size-md">
  <h2>Contact</h2>
  <p>Contact information goes here.</p>
</nte-dialog>
```

## Anchor opener with a public anchor name

An explicit anchor string takes precedence over `id`.

```html
<a href="#modal:pricing">Show pricing details</a>

<nte-dialog id="internal-pricing-dialog" anchor="pricing" class="size-lg">
  <h2>Pricing</h2>
  <p>The public URL uses <code>#modal:pricing</code>, not the element id.</p>
</nte-dialog>
```

## Dismiss behavior

A dialog can prevent all user-initiated dismiss actions:

```html
<nte-dialog no-dismiss>
  <button class="launcher">Open required dialog</button>
  <h2>Required action</h2>
  <p>This dialog must be closed programmatically.</p>
</nte-dialog>
```

Or configure the available dismiss mechanisms individually:

```html
<nte-dialog hide-close-button no-escape backdrop-action="dismiss">
  <button class="launcher">Open backdrop-dismissible dialog</button>
  <h2>Backdrop dismiss</h2>
  <p>There is no close button and Escape is disabled, but the backdrop dismisses the dialog.</p>
</nte-dialog>
```

`backdrop-action` accepts `ignore`, `shake` (default), or `dismiss`.

## Styling presets and modifiers

Style, size and feature classes are independent and composable:

```html
<nte-dialog class="style-highlighted size-xl without-shadow">
  <button class="launcher">Open highlighted dialog</button>
  <h2>Highlighted dialog</h2>
  <p>This uses the same visual API that is also available as Sass mixins.</p>
</nte-dialog>
```

Custom semantic classes can apply the Sass mixins instead of using the built-in classes directly:

```scss
@use '@nextrap/nte-dialog' as dialog;

.product-dialog {
  @include dialog.style-default();
  @include dialog.size-lg();
  @include dialog.with-shadow();
}
```

```html
<nte-dialog class="product-dialog">
  <button class="launcher">Open custom-styled dialog</button>
  <h2>Custom styled</h2>
  <p>The component markup stays semantic while the theme owns the visual composition.</p>
</nte-dialog>
```
