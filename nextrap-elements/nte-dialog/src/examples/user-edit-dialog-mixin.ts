import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { DialogMixin } from '../mixins/DialogMixin';

@customElement('user-edit-dialog2')
export class UserEditDialog2 extends DialogMixin(LitElement) {
  override render() {
    this.hide();

    return super.render(html`
      <input name="username" type="text" placeholder="wurst" />
      test
      <button>Save</button>
    `);
  }
}
