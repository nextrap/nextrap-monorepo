import '@nextrap/nt-style-base';
import '@nextrap/nte-burger';
import { html, LitElement, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import style from './nte-dialog.scss?inline';

@customElement('nte-dialog')
export class NteDialog extends LitElement {
  static override styles = [unsafeCSS(style)];

  @query('dialog')
  private dialogEl?: HTMLDialogElement;

  @property({ type: String, reflect: true })
  mode: 'closed' | 'open' | 'modal' = 'closed';

  protected override firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);

    if (this.mode === 'modal') {
      this.showModal();
    }
  }

  protected override render() {
    return html`
      <dialog ?open="${this.mode === 'open'}">
        <div id="dialog-header">
          <slot name="title"></slot>
          <slot name="closeButton" @click="${this.close}">
            <nte-burger open></nte-burger>
          </slot>
        </div>
        <slot></slot>
        <slot name="footer"></slot>
      </dialog>
    `;
  }

  show() {
    this.dialogEl?.show();
  }

  showModal() {
    this.dialogEl?.showModal();
  }

  close() {
    this.dialogEl?.close();
  }
}
