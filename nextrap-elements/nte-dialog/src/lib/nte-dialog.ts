import '@nextrap/nte-burger';
import { nextrap_element } from '@nextrap/nte-core';
import '@nextrap/style-base';
import { sleep } from '@trunkjs/browser-utils';
import { html, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import style from './nte-dialog.scss?inline';

@customElement('nte-dialog')
export class NteDialog extends nextrap_element({ slotVisibility: true }) {
  static override styles = [unsafeCSS(style)];

  @query('dialog')
  private accessor dialogEl: HTMLDialogElement | null = null;

  @property({ type: String, reflect: true })
  accessor mode: 'closed' | 'open' = 'closed';

  private _isClosing = false;

  override firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);

    if (this.mode === 'open') {
      this.dialogEl?.showModal();
    }
  }

  protected override render() {
    return html`
      <dialog
        ?open="${this.mode === 'open'}"
        @cancel="${this.onDialogCancel}"
        @close="${this.onDialogClose}"
        @click="${this.onDialogClick}"
      >
        <div id="header" part="header">
          <slot name="title"></slot>
          <slot name="closeButton" @click="${this.close}">
            <nte-burger open></nte-burger>
          </slot>
        </div>
        <div id="content" part="content">
          <slot></slot>
        </div>
        <div id="footer" part="footer">
          <slot name="footer"></slot>
        </div>
      </dialog>
    `;
  }

  show() {
    this.dialogEl?.classList.remove('closing');
    this.mode = 'open';
    this.dialogEl?.show();
  }

  showModal() {
    this.dialogEl?.classList.remove('closing');
    this.mode = 'open';
    this.dialogEl?.showModal();
  }

  /**
   * ESC in einem <dialog> triggert ein `cancel`-Event und (wenn nicht verhindert)
   * ein sofortiges Schließen. Wir verhindern das native Schließen und spielen
   * stattdessen die Close-Animation ab.
   */
  private onDialogCancel(e: Event) {
    e.preventDefault();

    void this.close();
  }

  /**
   * Wird aufgerufen, nachdem das Dialog wirklich geschlossen wurde.
   * Hält den State am Custom Element synchron.
   */
  private onDialogClose() {
    this.mode = 'closed';
    this.dialogEl?.classList.remove('closing');
    this.dispatchEvent(new CustomEvent('closed', { bubbles: true, composed: true }));
  }

  async close() {
    if (this._isClosing) return;
    this._isClosing = true;

    const el = this.dialogEl;
    if (!el) {
      this.mode = 'closed';
      this._isClosing = false;
      return;
    }

    // Wenn es ohnehin nicht offen ist, nichts animieren.
    if (!el.open) {
      this.mode = 'closed';
      el.classList.remove('closing');
      this._isClosing = false;
      return;
    }
    el.classList.add('closing');
    await sleep(200); // sollte zur CSS-Dauer von modalFadeOut/backdropFadeOut passen

    el.close();

    // `onDialogClose` setzt mode/cleanup.
    this._isClosing = false;
  }

  /**
   * Klick auf den Backdrop (outside click) soll NICHT schließen, sondern das Fenster schütteln.
   *
   * Native <dialog> dispatcht den click auf das <dialog> Element. Wir erkennen einen Outside-Click,
   * indem wir prüfen ob die Click-Position außerhalb des getBoundingClientRect liegt.
   */
  private onDialogClick(e: MouseEvent) {
    const el = this.dialogEl;
    if (!el) return;

    // Nur relevant, wenn wirklich offen.
    if (!el.open) return;

    const rect = el.getBoundingClientRect();
    const clickedOutside =
      e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom;

    if (clickedOutside) {
      e.preventDefault();
      this.shake();
    }
  }

  private shake() {
    const el = this.dialogEl;
    if (!el) return;

    // Restart animation
    el.classList.remove('shake');
    // force reflow
    void el.offsetWidth;
    el.classList.add('shake');

    window.setTimeout(() => el.classList.remove('shake'), 350);
  }
}
