import '@nextrap/nte-burger';
import { nextrap_element } from '@nextrap/nt-core';
import { resetStyle } from '@nextrap/style-reset';
import { SubLayoutApplyMixin } from '@trunkjs/content-pane';
import '@trunkjs/prolit-elements';
import { html, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import style from './nte-dialog.scss?inline';

export type NteDialogBackdropAction = 'ignore' | 'shake' | 'cancel' | 'dismiss';
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

  private static modalScrollLockCount = 0;
  private static previousBodyOverflow = '';
  private static previousDocumentOverflow = '';

  @query('dialog')
  private accessor dialogEl: HTMLDialogElement | null = null;

  @property({ type: String, reflect: true })
  accessor mode: 'closed' | 'open' = 'closed';

  @property({ attribute: 'anchor', reflect: true, converter: anchorConverter })
  accessor anchor: boolean | string = false;

  /** Remote HTML fragment. Dialog src is always loaded lazily on first visibility. */
  @property({ type: String, reflect: true })
  accessor src = '';

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
  private _srcInclude: HTMLElement | null = null;
  private _scrollLockActive = false;

  private readonly onHashChange = () => void this.syncWithAnchor();

  override connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('hashchange', this.onHashChange);
    this.syncSrcInclude();
    void this.updateComplete.then(() => this.syncWithAnchor());
  }

  override disconnectedCallback(): void {
    window.removeEventListener('hashchange', this.onHashChange);
    this.unlockBackgroundScroll();
    super.disconnectedCallback();
  }

  override updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    if (changedProperties.has('anchor') || changedProperties.has('id')) {
      void this.syncWithAnchor();
    }
    if (changedProperties.has('src')) {
      this.syncSrcInclude();
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

      <dialog part="dialog" @cancel=${this.onDialogCancel} @close=${this.onDialogClose} @click=${this.onDialogClick}>
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
        <div id="content" part="content"><slot></slot></div>
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
    const dialogEl = this.dialogEl;
    if (!dialogEl) return;
    if (dialogEl.open) return;

    dialogEl.classList.remove('closing');
    this.mode = 'open';
    dialogEl.showModal();
    this.lockBackgroundScroll();
  }

  async close() {
    if (this._isClosing) return;
    this._isClosing = true;

    const el = this.dialogEl;
    if (!el) {
      this.mode = 'closed';
      this.unlockBackgroundScroll();
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
    await this.waitForCloseTransition(el);
    if (el.open) el.close();
    this._isClosing = false;
  }

  private syncSrcInclude(): void {
    if (!this.src) {
      this._srcInclude?.remove();
      this._srcInclude = null;
      return;
    }

    if (!this._srcInclude?.isConnected) {
      const include = document.createElement('tj-include');
      include.setAttribute('data-nte-dialog-src', '');
      include.setAttribute('lazy', '');
      include.setAttribute('unwrap', '');
      this._srcInclude = include;
      this.append(include);
    }

    this._srcInclude.setAttribute('src', this.src);
  }

  private async waitForCloseTransition(el: HTMLDialogElement): Promise<void> {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const style = getComputedStyle(el);
    const durations = style.transitionDuration.split(',').map((value) => this.cssTimeToMs(value.trim()));
    const delays = style.transitionDelay.split(',').map((value) => this.cssTimeToMs(value.trim()));
    const count = Math.max(durations.length, delays.length);
    let maxTotal = 0;

    for (let index = 0; index < count; index += 1) {
      const duration = durations[index % durations.length] ?? 0;
      const delay = delays[index % delays.length] ?? 0;
      maxTotal = Math.max(maxTotal, duration + delay);
    }

    if (maxTotal <= 0) return;

    await new Promise<void>((resolve) => {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        el.removeEventListener('transitionend', onTransitionEnd);
        el.removeEventListener('transitioncancel', finish);
        window.clearTimeout(fallback);
        resolve();
      };
      const onTransitionEnd = (event: TransitionEvent) => {
        if (event.target === el && event.propertyName === 'opacity') finish();
      };
      const fallback = window.setTimeout(finish, maxTotal + 50);

      el.addEventListener('transitionend', onTransitionEnd);
      el.addEventListener('transitioncancel', finish);
    });
  }

  private cssTimeToMs(value: string): number {
    if (value.endsWith('ms')) return Number.parseFloat(value) || 0;
    if (value.endsWith('s')) return (Number.parseFloat(value) || 0) * 1000;
    return 0;
  }

  private get anchorName(): string | null {
    if (typeof this.anchor === 'string' && this.anchor.length > 0) return this.anchor;
    if (this.anchor === true) return this.id || null;
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
    window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}`);
  }

  private onLauncherClick() {
    const hash = this.anchorHash;
    if (hash) {
      if (window.location.hash === hash) {
        void this.syncWithAnchor();
      } else {
        window.location.hash = hash;
      }
      return;
    }
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
    this.unlockBackgroundScroll();
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
    if (this.backdropAction === 'cancel' || this.backdropAction === 'dismiss') {
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

    if (this.dispatchEvent(event)) void this.close();
  }

  private shake() {
    const el = this.dialogEl;
    if (!el) return;
    el.classList.remove('shake');
    void el.offsetWidth;
    el.classList.add('shake');
    window.setTimeout(() => el.classList.remove('shake'), 350);
  }

  private lockBackgroundScroll() {
    if (this._scrollLockActive) return;

    const { body, documentElement } = document;
    if (NteDialog.modalScrollLockCount === 0) {
      NteDialog.previousBodyOverflow = body.style.overflow;
      NteDialog.previousDocumentOverflow = documentElement.style.overflow;
      body.style.overflow = 'hidden';
      documentElement.style.overflow = 'hidden';
    }

    NteDialog.modalScrollLockCount += 1;
    this._scrollLockActive = true;
  }

  private unlockBackgroundScroll() {
    if (!this._scrollLockActive) return;

    const { body, documentElement } = document;
    NteDialog.modalScrollLockCount = Math.max(0, NteDialog.modalScrollLockCount - 1);

    if (NteDialog.modalScrollLockCount === 0) {
      body.style.overflow = NteDialog.previousBodyOverflow;
      documentElement.style.overflow = NteDialog.previousDocumentOverflow;
    }

    this._scrollLockActive = false;
  }
}
