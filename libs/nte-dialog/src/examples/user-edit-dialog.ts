import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { NteModalElement } from '../lib/nte-modal';

@customElement('user-edit-dialog')
export class UserEditDialog extends NteModalElement<
  {
    user: string;
  },
  {
    updated?: boolean;
  }
> {
  constructor() {
    super('Edit User');
  }

  protected override render(): unknown {
    return html`
      <input name="username" type="text" placeholder="Username" />
      <button
        @click="${() =>
          this.close({
            updated: true,
          })}"
      >
        Save
      </button>
    `;
  }
}
