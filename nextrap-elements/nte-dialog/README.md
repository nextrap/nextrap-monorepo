# nte-dialog

`NteDialog` is the reusable dialog UI primitive. `NteModalComponent<TInput, TResult>` adds the programmatic application lifecycle on top.

See [`demo/base.md`](./demo/base.md) for copyable Markdown/HTML examples and [`src/examples`](./src/examples) for TypeScript examples.

## Opening patterns

There are three independent ways to open a dialog.

### 1. Inline launcher / opener

The launcher lives in the `NteDialog` light DOM but is rendered through a slot outside the native `<dialog>`. It therefore remains visible while the dialog itself is closed.

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

### 2. Anchor / hash opener

`anchor` enables hash routing. A boolean anchor uses the element `id`:

```html
<a href="#modal:details">Open details</a>

<nte-dialog id="details" anchor>
  <h2>Details</h2>
  <p>Dialog content.</p>
</nte-dialog>
```

An explicit anchor string uses that value and takes precedence over `id`:

```html
<a href="#modal:public-details">Open details</a>

<nte-dialog id="internal-id" anchor="public-details">
  <h2>Details</h2>
</nte-dialog>
```

Opening the hash opens the dialog. Navigating away from the hash closes an anchor-opened dialog. Closing the dialog removes its active modal hash.

### 3. Existing element from TypeScript

A dialog already present in the DOM can always be opened directly:

```ts
const dialog = document.getElementById('details') as NteDialog;
dialog.showModal();

// Later:
await dialog.close();
```

See [`src/examples/direct-dialog.ts`](./src/examples/direct-dialog.ts).

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

Custom styles can reuse the same mixins:

```scss
@use '@nextrap/nte-dialog' as dialog;

.user-edit-dialog {
  @include dialog.style-default();
  @include dialog.size-lg();
  @include dialog.with-shadow();
}
```

The visual internals are exposed as `dialog`, `header`, `content`, `footer`, and `close-button` parts. `NteModalComponent` re-exports those parts through its nested `nte-dialog`.

## Programmatic application modal

Use `NteModalComponent<TInput, TResult>` when the caller should create a temporary modal, pass typed input, await typed output and have the element cleaned up automatically.

```ts
@customElement('user-edit-dialog')
class UserEditDialog extends NteModalComponent<{ userId: string }, User> {
  protected override modalOptions = {
    dialogClass: ['size-lg', 'with-shadow'],
    dismiss: {
      closeButton: true,
      escape: true,
      backdrop: 'shake',
    },
  };

  protected override renderTitle() {
    return html`Edit user`;
  }

  protected override renderModal() {
    return html`...`;
  }

  protected override renderFooter() {
    return html`
      <button @click=${() => this.abort()}>Cancel</button>
      <button @click=${() => this.submit(user)}>Save</button>
    `;
  }
}

const result = await UserEditDialog.show({ userId: '123' });

if (result.submitted) {
  console.log(result.data);
}
```

`abort()` resolves with `{ submitted: false }`; `submit(data)` resolves with `{ submitted: true, data }`. `show(input)` creates the component, assigns its input, mounts it in `document.body`, opens the nested dialog, waits for completion, closes it and removes the component.

A complete example is available in [`src/examples/user-edit-dialog.ts`](./src/examples/user-edit-dialog.ts).

## Markdown examples

[`demo/base.md`](./demo/base.md) contains Markdown/HTML-ready examples for:

- launcher/opener dialogs
- explicit slots
- boolean `anchor` using `id`
- named `anchor` overriding `id`
- dismiss configuration
- built-in style/size modifiers
- custom Sass composition

## Building

Run `nx build nte-dialog` to build the library.

## Running unit tests

Run `nx test nte-dialog` to execute the unit tests via Vitest.
