import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { NteModalComponent } from '../lib/nte-modal-component';

interface UserEditInput {
  userId: string;
}

interface User {
  id: string;
  name: string;
}

@customElement('example-user-edit-dialog')
export class UserEditDialog extends NteModalComponent<UserEditInput, User> {
  protected override modalOptions = {
    dialogClass: ['size-lg', 'with-shadow'],
    dismiss: {
      closeButton: true,
      escape: true,
      backdrop: 'shake' as const,
    },
  };

  protected override renderTitle() {
    return html`Edit user ${this.input.userId}`;
  }

  protected override renderModal() {
    return html`
      <p>Edit the user here.</p>
      <label>
        Name
        <input id="name" value="Example user" />
      </label>
    `;
  }

  protected override renderFooter() {
    return html`
      <button type="button" @click=${() => this.abort()}>Cancel</button>
      <button type="button" @click=${this.save}>Save</button>
    `;
  }

  private readonly save = () => {
    const name = this.renderRoot.querySelector<HTMLInputElement>('#name')?.value ?? '';
    this.submit({ id: this.input.userId, name });
  };
}

// Can be called from anywhere after the custom element has been registered.
export async function editUser(userId: string): Promise<User | undefined> {
  const result = await UserEditDialog.show({ userId });

  if (!result.submitted) {
    return undefined;
  }

  return result.data;
}
