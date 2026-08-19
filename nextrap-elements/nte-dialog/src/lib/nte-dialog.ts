import '@nextrap/nte-burger';
import { nextrap_element } from '@nextrap/nte-core';
import { resetStyle } from '@nextrap/style-reset';
import { sleep } from '@trunkjs/browser-utils';
import { SubLayoutApplyMixin } from '@trunkjs/content-pane';
import { html, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import style from './nte-dialog.scss?inline';

export type NteDialogBackdropAction = 'ignore' | 'shake' | 'dismiss';
export type NteDialogDismissReason = 'close-button' | 'escape' | 'backdrop';

const anchorConverter = {
  fromAttribute(value: string | null): boolean | string {
    if (value === null) return false;
    if (value === '') return true;
    return value;
  },
  toAttribute(value: boolean | string): string | null {
    if (value === false) return null;
    if (value === true) return '';
    return value;
  },
};

@customElement('nte-dialog')
export class NteDialog extends SubLayoutApplyMixin(nextrap_element({ slotVisibility: true })) {
  static override styles = [unsafeCSS(style), unsafeCSS(resetStyle)];

  @query('dialog')
  private accessor dialogEl: HTMLDialogElement | null = null;

  @property({ type: String, reflect: true })
  accessor mode: 'closed' | 'open' = 'closed';

  /**
   * Enables URL hash integration. `anchor` uses the element id, while
   * `anchor="name"` uses the explicit name and takes precedence over id.
   */
  @property({ attribute: 'anchor', reflect: true, converter: anchorConverter })
  accessor anchor: boolean | string = false;

  /** Prevent all user initiated dismiss actions (close button, ESC, backdrop). */
  @property({ type: Boolean, attribute: 'no-dismiss', reflect: true })
  accessor noDismiss = false;

  @property({ type: Boolean, attribute: 'hide-close-button', reflect: true })
  accessor hideCloseButton = false;

  @property({ type: Boolean, attribute: 'no-escape', reflect: true })
  accessor noEscape = false;

  @property({ type: String, attribute: 'backdrop-action', reflect: true })
  accessor backdropAction: NteDialogBackdropAction = 'shake';

  private _isClosing = false;
  private _openedByAnchor = false;

  private readonly onHashChange = () => {
    void this.syncWithAnchor();
  };

  override connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('hashchange', this.onHashChange);
    void this.updateComplete.then(() => this.syncWithAnchor());
  }

  override disconnectedCallback(): void {
    window.removeEventListener('hashchange', this.onHashChange);
    super.disconnectedCallback();
  }

  override updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    if (changedProperties.has('anchor') || changedProperties.has('id')) {
      void this.syncWithAnchor();
    }
  }

  protected override render() {
    const showCloseButton = !this.noDismiss && !this.hideCloseButton;

    return html`
      <slot
        name="launcher"
        data-query=":scope > .launcher | :scope > [data-dialog-launcher]"
        @click=${this.onLauncherClick}
      ></slot>

      <dialog
        part="dialog"
        @cancel=${this.onDialogCancel}
        @close=${this.onDialogClose}
        @click=${this.onDialogClick}
      >
        <div id="header" part="header">
          <slot
            name="title"
            data-query=":scope > h1 | :scope > h2 | :scope > h3 | :scope > h4 | :scope > h5"
          ></slot>
          ${showCloseButton
            ? html`<button part="close-button" id="close-button" type="button" @click=${this.onCloseButtonClick}>
                <slot name="closeButton"><nte-burger open></nte-burger></slot>
              </button>`
            : null}
        </div>
        <div id="content" part="content">
          <slot></slot>
        </div>
        <div id="footer" part="footer">
          <slot name="footer" data-query=":scope > .footer | :scope > [data-dialog-footer]"></slot>
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

  async close() {
    if (this._isClosing) return;
    this._isClosing = true;

    const el = this.dialogEl;
    if (!el) {
      this.mode = 'closed';
      this._isClosing = false;
      return;
    }

    if (!el.open) {
      this.mode = 'closed';
      el.classList.remove('closing');
      this._isClosing = false;
      return;
    }

    el.classList.add('closing');
    await sleep(200);
    el.close();
    this._isClosing = false;
  }

  private get anchorName(): string | null {
    if (typeof this.anchor === 'string' && this.anchor.length > 0) {
      return this.anchor;
    }
    if (this.anchor === true) {
      return this.id || null;
    }
    return null;
  }

  private get anchorHash(): string | null {
    const name = this.anchorName;
    return name ? `#modal:${name}` : null;
  }

  private async syncWithAnchor(): Promise<void> {
    const hash = this.anchorHash;
    if (!hash) return;

    await this.updateComplete;
    const matches = window.location.hash === hash;

    if (matches && this.mode !== 'open') {
      this._openedByAnchor = true;
      this.showModal();
      return;
    }

    if (!matches && this._openedByAnchor && this.mode === 'open') {
      this._openedByAnchor = false;
      await this.close();
    }
  }

  private clearAnchorHash(): void {
    const hash = this.anchorHash;
    if (!hash || window.location.hash !== hash) return;

    const url = `${window.location.pathname}${window.location.search}`;
    window.history.replaceState(window.history.state, '', url);
  }

  private onLauncherClick() {
    this.showModal();
  }

  private onCloseButtonClick() {
    this.requestDismiss('close-button');
  }

  private onDialogCancel(e: Event) {
    e.preventDefault();

    if (this.noDismiss || this.noEscape) {
      this.shake();
      return;
    }

    this.requestDismiss('escape');
  }

  private onDialogClose() {
    this.mode = 'closed';
    this.dialogEl?.classList.remove('closing');

    if (this._openedByAnchor || window.location.hash === this.anchorHash) {
      this._openedByAnchor = false;
      this.clearAnchorHash();
    }

    this.dispatchEvent(new CustomEvent('closed', { bubbles: true, composed: true }));
  }

  private onDialogClick(e: MouseEvent) {
    const el = this.dialogEl;
    if (!el?.open) return;

    const rect = el.getBoundingClientRect();
    const clickedOutside =
      e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom;

    if (!clickedOutside) return;

    e.preventDefault();

    if (this.noDismiss || this.backdropAction === 'shake') {
      this.shake();
      return;
    }

    if (this.backdropAction === 'dismiss') {
      this.requestDismiss('backdrop');
    }
  }

  private requestDismiss(reason: NteDialogDismissReason) {
    if (this.noDismiss) {
      this.shake();
      return;
    }

    const event = new CustomEvent<{ reason: NteDialogDismissReason }>('dismiss', {
      detail: { reason },
      bubbles: true,
      composed: true,
      cancelable: true,
    });

    const shouldClose = this.dispatchEvent(event);
    if (shouldClose) {
      void this.close();
    }
  }

  private shake() {
    const el = this.dialogEl;
    if (!el) return;

    el.classList.remove('shake');
    void el.offsetWidth;
    el.classList.add('shake');
    window.setTimeout(() => el.classList.remove('shake'), 350);
  }
}
