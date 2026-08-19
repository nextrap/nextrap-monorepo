# nte-dialog

`NteDialog` is the reusable dialog UI primitive. `NteModalComponent<TInput, TResult>` adds the programmatic application lifecycle on top.

## Inline dialog

```html
<nte-dialog id="details" anchor class="size-lg with-shadow">
  <button class="launcher">Open details</button>
  <h2>Details</h2>
  <p>Dialog content.</p>
  <div class="footer">Footer content</div>
</nte-dialog>
```

Automatic slot assignment:

- `.launcher` / `[data-dialog-launcher]` -> launcher (rendered outside the native dialog)
- `h1` ... `h5` -> title
- `.footer` / `[data-dialog-footer]` -> footer
- all remaining nodes -> default content slot

The dialog can always be opened directly with `dialog.showModal()`.

### Anchor routing

`anchor` enables hash routing. A boolean anchor uses the element `id`; a string anchor uses that value and takes precedence over `id`.

```html
<nte-dialog id="details" anchor>...</nte-dialog>
<!-- #modal:details -->

<nte-dialog id="internal-id" anchor="public-details">...</nte-dialog>
<!-- #modal:public-details -->
```

Opening the hash opens the dialog. Navigating away from the hash closes an anchor-opened dialog. Closing the dialog removes its active modal hash.

### Dismiss behavior

```html
<nte-dialog no-dismiss>...</nte-dialog>
<nte-dialog hide-close-button no-escape backdrop-action="dismiss">...</nte-dialog>
```

`backdrop-action` accepts `ignore`, `shake` (default), or `dismiss`.

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

## Programmatic modal components

```ts
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
    return 'Edit user';
  }

  protected override renderModal() {
    return html`...`;
  }

  private save(user: User) {
    this.submit(user);
  }
}

const result = await UserEditDialog.show({ userId: '123' });
if (result.submitted) {
  console.log(result.data);
}
```

`abort()` resolves with `{ submitted: false }`; `submit(data)` resolves with `{ submitted: true, data }`. The static `show()` method mounts the component in `document.body`, opens it, waits for the result, and removes it afterwards.

## Building

Run `nx build nte-dialog` to build the library.

## Running unit tests

Run `nx test nte-dialog` to execute the unit tests via Vitest.
