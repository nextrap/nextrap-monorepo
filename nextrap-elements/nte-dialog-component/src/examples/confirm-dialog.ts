import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { NteDialogComponent } from '../lib/nte-dialog-component';

@customElement('confirm-dialog-example')
export class ConfirmDialogExample extends NteDialogComponent {
  protected override renderTitle() {
    return 'Confirm action';
  }

  protected override renderDialog() {
    return html`<p>Do you want to continue?</p>`;
  }

  protected override renderFooter() {
    return html`
      <button @click=${this.abort}>Cancel</button>
      <button @click=${this.submit}>Continue</button>
    `;
  }
}

export async function confirmAction(): Promise<boolean> {
  const result = await ConfirmDialogExample.show();
  return result.submitted;
}
