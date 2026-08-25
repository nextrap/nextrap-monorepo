import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { NteDialogComponent } from '../lib/nte-dialog-component';

interface UserEditInput {
  userId: string;
}

interface User {
  id: string;
  name: string;
}

@customElement('user-edit-dialog-example')
export class UserEditDialogExample extends NteDialogComponent<UserEditInput, User> {
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
    return html`<p>Editing user ${this.input.userId}</p>`;
  }

  protected override renderFooter() {
    return html`
      <button @click=${this.abort}>Cancel</button>
      <button @click=${this.save}>Save</button>
    `;
  }

  private save = () => {
    this.submit({ id: this.input.userId, name: 'Updated user' });
  };
}

export async function openUserEditDialog(userId: string) {
  const result = await UserEditDialogExample.show({ userId });
  if (result.submitted) {
    return result.data;
  }
  return null;
}
