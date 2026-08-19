# @nextrap/nte-dialog

`NteDialog` is the reusable dialog UI primitive for Markdown, CMS content, static/declarative HTML and direct DOM usage.

For typed application/SPAs that create dialogs from TypeScript and await Promise results, use [`@nextrap/nte-dialog-component`](../nte-dialog-component/README.md).

See [`demo/base.md`](./demo/base.md) for copyable Markdown/HTML examples.

## Inline launcher / opener

The launcher lives in the `NteDialog` light DOM but is rendered through a slot outside the native `<dialog>`. It remains visible while the dialog itself is closed.

```html
<nte-dialog class="size-lg with-shadow">
  <button class="launcher">Open details</button>
  <h2>Details</h2>
  <p>Dialog content.</p>
  <div class="footer">Footer content</div>
</nte-dialog>
```

Automatic slot assignment:

- `.launcher` / `[data-dialog-launcher]` -> launcher
- `h1` ... `h5` -> title
- `.footer` / `[data-dialog-footer]` -> footer
- all remaining nodes -> default content slot

Explicit `slot="launcher"`, `slot="title"`, and `slot="footer"` assignments also work.

## Anchor / hash opener

`anchor` enables hash routing. A boolean anchor uses the element `id`:

```html
<a href="#modal:details">Open details</a>

<nte-dialog id="details" anchor>
  <h2>Details</h2>
  <p>Dialog content.</p>
</nte-dialog>
```

An explicit anchor string takes precedence over `id`:

```html
<a href="#modal:public-details">Open details</a>

<nte-dialog id="internal-id" anchor="public-details">
  <h2>Details</h2>
</nte-dialog>
```

Opening the hash opens the dialog. Navigating away from the matching hash closes an anchor-opened dialog. Closing the dialog removes its active modal hash.

A launcher on an anchor-enabled dialog uses the same hash route, so browser navigation and dialog state stay synchronized.

## Direct DOM API

A dialog already present in the DOM can be opened directly:

```ts
import { NteDialog } from '@nextrap/nte-dialog';

const dialog = document.getElementById('details') as NteDialog;
dialog.showModal();

// Later:
await dialog.close();
```

This is still direct element usage. If the caller needs typed input, `submit()` / `abort()`, Promise results and automatic mounting/cleanup, use `@nextrap/nte-dialog-component`.

## Dismiss behavior

```html
<nte-dialog no-dismiss>...</nte-dialog>
<nte-dialog hide-close-button no-escape backdrop-action="dismiss">...</nte-dialog>
```

`backdrop-action` accepts `ignore`, `shake` (default), or `dismiss`. `no-dismiss` disables all user-initiated dismiss actions. The `dismiss` event is cancelable and includes the reason (`close-button`, `escape`, or `backdrop`).

## Styling

Visual configuration is CSS/Sass based. The package exports mixins whose names match the provided modifier classes:

- `style-default()` / `.style-default`
- `style-highlighted()` / `.style-highlighted`
- `size-sm()`, `size-md()`, `size-lg()`, `size-xl()`, `size-fullscreen()`
- `with-shadow()`, `without-shadow()`, `with-floating-header()`

Custom semantic styles can reuse the same mixins:

```scss
@use '@nextrap/nte-dialog' as dialog;

.user-edit-dialog {
  @include dialog.style-default();
  @include dialog.size-lg();
  @include dialog.with-shadow();
}
```

The visual internals are exposed as `dialog`, `header`, `content`, `footer`, and `close-button` parts.

## Markdown examples

[`demo/base.md`](./demo/base.md) contains Markdown/HTML-ready examples for launcher/opener dialogs, explicit slots, anchors, dismiss configuration and Sass styling.

## Building

Run `nx build nte-dialog` to build the library.
