# NTE Dialog examples

The examples below are intended to work in Markdown/HTML content without application code.

## Launcher / opener

```html
<nte-dialog class="size-lg with-shadow">
  <button class="launcher btn btn-primary">Open details</button>
  <h2>Product details</h2>
  <p>This content is only visible while the dialog is open.</p>
  <div class="footer">Additional footer content</div>
</nte-dialog>
```

Explicit slots are also supported:

```html
<nte-dialog>
  <button slot="launcher">Open dialog</button>
  <span slot="title">Explicit title slot</span>
  <p>Default content.</p>
  <div slot="footer">Explicit footer slot</div>
</nte-dialog>
```

## Remote content

A dialog with `src` loads its fragment lazily when the dialog becomes visible. The include unwraps after loading, so remote headings and footers become normal direct dialog content.

```html
<nte-dialog src="/dialogs/privacy.html">
  <button class="launcher">Privacy</button>
</nte-dialog>
```

`/dialogs/privacy.html`:

```html
<h2>Privacy</h2>
<p>This body was loaded only when the dialog opened.</p>
<div class="footer">Remote footer</div>
```

The default loading text is inherited from `tj-include` and can be configured through CSS:

```css
nte-dialog {
  --tj-include-loader-text: 'Loading dialog…';
}
```

## Anchor opener using the element id

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

Remote content and anchors can be combined:

```html
<a href="#modal:privacy">Privacy</a>
<nte-dialog anchor="privacy" src="/dialogs/privacy.html"></nte-dialog>
```

## Dismiss behavior

```html
<nte-dialog no-dismiss>
  <button class="launcher">Open required dialog</button>
  <h2>Required action</h2>
  <p>This dialog must be closed programmatically.</p>
</nte-dialog>
```

```html
<nte-dialog hide-close-button no-escape backdrop-action="dismiss">
  <button class="launcher">Open backdrop-dismissible dialog</button>
  <h2>Backdrop dismiss</h2>
  <p>There is no close button and Escape is disabled, but the backdrop dismisses the dialog.</p>
</nte-dialog>
```

`backdrop-action` accepts `ignore`, `shake` (default), or `dismiss`.

## Styling presets and modifiers

```html
<nte-dialog class="style-highlighted size-xl without-shadow">
  <button class="launcher">Open highlighted dialog</button>
  <h2>Highlighted dialog</h2>
  <p>This uses the same visual API that is also available as Sass mixins.</p>
</nte-dialog>
```

```scss
@use '@nextrap/nte-dialog' as dialog;

.product-dialog {
  @include dialog.style-default();
  @include dialog.size-lg();
  @include dialog.with-shadow();
}
```
