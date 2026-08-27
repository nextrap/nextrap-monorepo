# @nextrap/nte-dialog-component

Typed programmatic dialog components for applications and SPAs.

This package builds on [`@nextrap/nte-dialog`](../nte-dialog/README.md). Use `@nextrap/nte-dialog` directly for Markdown, CMS content, static/declarative HTML, launcher slots and URL-anchor dialogs.

## User edit dialog

```ts
import { NteDialogComponent } from '@nextrap/nte-dialog-component';
import { html } from 'lit';
import { customElement } from 'lit/decorators.js';

interface UserEditInput {
  userId: string;
}

interface User {
  id: string;
  name: string;
}

@customElement('user-edit-dialog')
class UserEditDialog extends NteDialogComponent<UserEditInput, User> {
  protected override dialogOptions = {
    dialogClass: ['size-lg', 'with-shadow'],
    dismiss: {
      closeButton: true,
      escape: true,
      backdrop: 'shake' as const,
    },
  };

  protected override renderTitle() {
    return html`Edit user`;
  }

  protected override renderDialog() {
    return html`<user-editor .userId=${this.input.userId}></user-editor>`;
  }

  protected override renderFooter() {
    return html`
      <button @click=${this.abort}>Cancel</button>
      <button @click=${() => this.submit({ id: this.input.userId, name: 'Updated' })}>Save</button>
    `;
  }
}

const result = await UserEditDialog.show({ userId: '123' });
if (result.submitted) {
  console.log(result.data);
}
```

## Confirmation dialog without input/result data

`void` is the default for both generic parameters, so simple dialogs require no dummy values:

```ts
@customElement('delete-confirm-dialog')
class DeleteConfirmDialog extends NteDialogComponent {
  protected override renderTitle() {
    return 'Delete item?';
  }

  protected override renderDialog() {
    return html`This action cannot be undone.`;
  }

  protected override renderFooter() {
    return html`
      <button @click=${this.abort}>Cancel</button>
      <button @click=${this.submit}>Delete</button>
    `;
  }
}

const result = await DeleteConfirmDialog.show();
if (result.submitted) {
  // confirmed
}
```

## Input with no result payload

```ts
class ResetUserDialog extends NteDialogComponent<{ userId: string }> {
  protected override renderDialog() {
    return html`Reset user ${this.input.userId}?`;
  }

  protected override renderFooter() {
    return html`<button @click=${this.submit}>Reset</button>`;
  }
}

const result = await ResetUserDialog.show({ userId: '123' });
```

## Result contract

```ts
type NteDialogComponentResult<T> =
  | { submitted: true; data: T }
  | { submitted: false };
```

Call `submit(data)` for successful completion and `abort()` for cancellation. For `TResult = void`, call `submit()` without a value.

## Rendering contract

Derived classes override `renderDialog()` and optionally `renderTitle()` and `renderFooter()`. Do not override the base `render()` unless you intentionally replace the dialog wrapper lifecycle.

`dialogOptions` controls wrapper behavior and classes. For `dismiss.backdrop`, use `shake` (default) to keep the dialog open or `cancel` to run the normal abort/cancel flow. Visual appearance remains CSS/Sass-driven through the classes and mixins exported by `@nextrap/nte-dialog`.
