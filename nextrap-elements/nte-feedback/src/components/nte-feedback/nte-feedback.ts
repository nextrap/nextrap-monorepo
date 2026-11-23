import { nextrap_element, type NteFeatures } from '@nextrap/nt-core';
import '@nextrap/nte-spinner';
import { resetStyle } from '@nextrap/style-reset';
import { Listen } from '@trunkjs/browser-utils';
import type { PropertyValues } from 'lit';
import { html, nothing, unsafeCSS } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { keyed } from 'lit/directives/keyed.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import {
  NTE_FEEDBACK_DEFAULT_AUTO_CLOSE_MS,
  type NextrapConfirmAction,
  type NextrapConfirmDetail,
  type NextrapFailDetail,
  type NextrapInfoDetail,
  type NextrapLoadingDetail,
  type NextrapProgressDetail,
  type NextrapSuccessDetail,
  type NteFeedbackStatus,
} from '../../lib/types';
import style from './nte-feedback.scss?inline';

const features: NteFeatures = { eventBinding: true };

@customElement('nte-feedback')
export class NteFeedback extends nextrap_element(features) {
  static override styles = [unsafeCSS(style), unsafeCSS(resetStyle)];

  @query('#dialog') private accessor _dialogElement: HTMLDialogElement | null = null;
  @query('#mini-loader') private accessor _miniLoaderElement: HTMLDivElement | null = null;
  @state() private accessor _open = false;
  @state() private accessor _status: NteFeedbackStatus = 'idle';
  @state() private accessor _title = '';
  @state() private accessor _message = '';
  @state() private accessor _details = '';
  @state() private accessor _progress = 0;
  @state() private accessor _confirmHtml = '';
  @state() private accessor _actions: NextrapConfirmAction[] = [];
  @state() private accessor _referenceLabel = '';
  @state() private accessor _cancelable = false;

  // Der Mini-Loader teilt den Feedback-Lifecycle, aber weder Dialog noch Fokus.
  @state() private accessor _loadingVariant: NonNullable<NextrapLoadingDetail['variant']> = 'dialog';
  @state() private accessor _miniReady = false;
  private _miniLoadId = 0;

  private _abortCallback?: () => void;
  private _infoConfirmCallback?: () => void;
  private _autoCloseTimer: number | null = null;
  private _shakeTimer: number | null = null;
  private _mockMessageTimer: number | null = null;
  private _mockAnimationFrame: number | null = null;

  // Entfernen beendet einen Mini-Loader samt Promise; ein Reconnect startet ihn nicht neu.
  override disconnectedCallback() {
    if (this._isMiniLoader()) this.close();
    this._clearAutoCloseTimer();
    this._clearMockProgress();
    this._clearShakeTimer();
    this._syncDialogState(false);
    super.disconnectedCallback();
  }

  // Erst gerenderte, verbundene Elemente dürfen in den Top Layer aufgenommen werden.
  override updated(_changedProperties: PropertyValues<this>) {
    super.updated(_changedProperties);
    if (!this.isConnected) return;
    this._syncDialogState(this._open && !this._isMiniLoader());
    this._syncMiniLoaderState(this._isMiniLoader());
    if (this._miniReady) this._finishMiniLoader();
  }

  // Beide Darstellungen nutzen denselben Zustand; Mini öffnet keinen modalen Dialog.
  protected override render() {
    return html`
      ${super.render()}
      ${this._isMiniLoader() ? keyed(this._miniLoadId, html`
        <div id="mini-loader" part="mini-loader" popover="manual"
          role="progressbar" aria-label=${this._title} aria-valuetext=${this._message}
          aria-busy=${this._miniReady ? 'false' : 'true'}
          aria-valuenow=${this._miniReady ? '100' : nothing}
          @animationend=${this._onMiniAnimationEnd}>
          <span id="mini-loader-value" part="mini-loader-value"></span>
        </div>`) : nothing}
      <dialog id="dialog" part="dialog" aria-labelledby="headline" aria-describedby="assistive-context message"
        aria-modal="true" aria-busy=${this._isBusy() ? 'true' : 'false'} role=${this._getRole()}
        @cancel=${this._onDialogCancel} @click=${this._onDialogClick}>
        ${this._open && this._status !== 'idle' && !this._isMiniLoader() ? html`
          <div id="panel" part="panel">
            <div id="assistive-context" part="assistive-context">${this._getAssistiveContext()}</div>
            <div id="header" part="header">
              <div id="headline" part="headline">${this._getTitle()}</div>
              ${this._cancelable ? html`<button id="close" part="close-button" type="button" aria-label="Dialog schließen" @click=${this._onDismissClick}></button>` : nothing}
            </div>
            ${this._showsSpinner() ? html`<nte-spinner id="spinner" part="spinner" class=${this._getSpinnerClass()} style=${this._getSpinnerStyle()}></nte-spinner>` : nothing}
            <div id="content" part="content">
              <div id="message" part="message">${this._message}</div>
              ${this._referenceLabel ? html`<div id="reference" part="reference">${this._referenceLabel}</div>` : nothing}
              ${this._status === 'fail' && this._details ? html`<details id="details" part="details"><summary id="details-summary" part="details-summary">Details anzeigen</summary><pre id="details-content" part="details-content">${this._details}</pre></details>` : nothing}
              ${this._status === 'confirm' && this._confirmHtml ? html`<div id="html" part="html">${unsafeHTML(this._confirmHtml)}</div>` : nothing}
            </div>
            ${this._hasActions() ? html`<div id="actions" part="actions">${this._renderActions()}</div>` : nothing}
          </div>` : nothing}
      </dialog>`;
  }

  // Explizites Schließen bleibt synchron, damit neue Feedback-Promises nicht vorzeitig enden.
  close() {
    const wasOpen = this._open;
    this._clearMiniLoader();
    this._clearAutoCloseTimer();
    this._clearMockProgress();
    this._clearShakeTimer();
    this._dialogElement?.classList.remove('shake');
    this._syncDialogState(false);
    this._open = false;
    this._status = 'idle';
    this._title = '';
    this._message = '';
    this._details = '';
    this._progress = 0;
    this._confirmHtml = '';
    this._actions = [];
    this._referenceLabel = '';
    this._cancelable = false;
    this._abortCallback = undefined;
    this._infoConfirmCallback = undefined;
    if (wasOpen) window.dispatchEvent(new CustomEvent('nextrap:feedback-closed'));
  }

  @Listen('nextrap:feedback-close', { target: 'window' })
  private _handleClose() { this.close(); }

  @Listen('nextrap:loading', { target: 'window' })
  private _handleLoading(event: Event) {
    const detail = (event as CustomEvent<NextrapLoadingDetail>).detail ?? {};
    this._openState('loading', detail.title, detail.message, detail.reference, detail.cancelable ?? !!detail.onAbort);
    this._abortCallback = detail.onAbort;
    this._progress = 0;
    this._loadingVariant = detail.variant ?? 'dialog';
    if (this._isMiniLoader()) {
      this._clearMockProgress();
      // Ein frisches Element startet die CSS-Animation auch bei erneutem Loading.
      this._miniLoadId++;
    }
  }

  // Ready beendet ausschließlich Loading; wiederholte Events starten den Abschluss nicht neu.
  @Listen('nextrap:ready', { target: 'window' })
  private _handleReady() {
    if (!this._open || this._status !== 'loading') return;
    if (!this._isMiniLoader()) {
      this.close();
      return;
    }
    this._miniReady = true;
  }

  @Listen('nextrap:progress', { target: 'window' })
  private _handleProgress(event: Event) {
    const detail = (event as CustomEvent<NextrapProgressDetail>).detail;
    if (!detail) return;
    this._openState('progress', detail.title, detail.message, detail.reference, detail.cancelable ?? !!detail.onAbort);
    this._abortCallback = detail.onAbort;
    this._progress = this._clampProgress(detail.progress);
    this._startMockProgress(detail);
    if (this._progress >= 100) this._scheduleAutoClose(true);
  }

  @Listen('nextrap:success', { target: 'window' })
  private _handleSuccess(event: Event) {
    const detail = (event as CustomEvent<NextrapSuccessDetail>).detail ?? {};
    this._openState('success', detail.title, detail.message, undefined, detail.cancelable ?? true);
    this._scheduleAutoClose(detail.autoClose ?? true);
  }

  @Listen('nextrap:fail', { target: 'window' })
  private _handleFail(event: Event) {
    const detail = (event as CustomEvent<NextrapFailDetail>).detail ?? {};
    this._openState('fail', detail.title, detail.message, undefined, detail.cancelable ?? true);
    this._details = detail.details ?? '';
    this._scheduleAutoClose(detail.autoClose ?? true);
  }

  @Listen('nextrap:info', { target: 'window' })
  private _handleInfo(event: Event) {
    const detail = (event as CustomEvent<NextrapInfoDetail>).detail ?? {};
    this._openState('info', detail.title, detail.message, undefined, detail.cancelable ?? true);
    this._infoConfirmCallback = detail.onConfirm;
  }

  @Listen('nextrap:confirm', { target: 'window' })
  private _handleConfirm(event: Event) {
    const detail = (event as CustomEvent<NextrapConfirmDetail>).detail ?? {};
    this._openState('confirm', detail.title, detail.message, undefined, detail.cancelable ?? true);
    this._confirmHtml = detail.html ?? '';
    this._actions = detail.actions?.length ? detail.actions : [{ label: 'OK', variant: 'primary' }];
  }

  // Ein neuer Zustand übernimmt die zentrale Feedback-Fläche und verwirft alte Mini-Animationen.
  private _openState(status: Exclude<NteFeedbackStatus, 'idle'>, title?: string, message?: string, reference?: string | HTMLElement, cancelable = false) {
    this._clearMiniLoader();
    this._clearAutoCloseTimer();
    // Neu einreihen statt einen offenen Dialog hinter später geöffneten Modals zu behalten.
    // Internes Schließen beendet weder den Feedback-Zustand noch dessen Promise.
    this._syncDialogState(false);
    this._open = true;
    this._status = status;
    this._title = title?.trim() || this._getDefaultTitle(status);
    this._message = message?.trim() || this._getDefaultMessage(status);
    this._details = '';
    this._confirmHtml = '';
    this._actions = [];
    this._referenceLabel = this._getReferenceLabel(reference);
    this._cancelable = cancelable;
    this._abortCallback = undefined;
    this._infoConfirmCallback = undefined;
  }

  // Statusdialoge bieten nur dann eine Schließen-Aktion an, wenn sie abbrechbar sind.
  private _renderActions() {
    switch (this._status) {
      case 'loading':
      case 'progress':
        return this._abortCallback ? html`<button class="btn" part=${this._getButtonPart('secondary')} @click=${this._onAbortClick}>Abort</button>` : nothing;
      case 'success':
      case 'fail':
        return this._cancelable ? html`<button class="btn" part=${this._getButtonPart('primary')} @click=${() => this.close()}>Close</button>` : nothing;
      case 'info':
        return html`<button class="btn" part=${this._getButtonPart('primary')} @click=${this._onInfoConfirm}>OK</button>`;
      case 'confirm':
        return this._actions.map((action) => html`<button class="btn" part=${this._getButtonPart(action.variant ?? 'secondary')} @click=${() => this._onConfirmAction(action)}>${action.label}</button>`);
      default:
        return nothing;
    }
  }

  // Ohne erlaubte Aktion bleibt auch der zugehörige Aktionsbereich ausgeblendet.
  private _hasActions() {
    if (this._status === 'loading' || this._status === 'progress') return !!this._abortCallback;
    if (this._status === 'success' || this._status === 'fail') return this._cancelable;
    if (this._status === 'info') return true;
    return this._status === 'confirm' && this._actions.length > 0;
  }

  private _showsSpinner() { return this._status !== 'confirm'; }
  private _isBusy() { return this._status === 'loading' || this._status === 'progress'; }
  private _getTitle() { return this._title || this._getDefaultTitle(this._status); }

  private _getDefaultTitle(status: NteFeedbackStatus) {
    switch (status) {
      case 'loading': return 'Loading';
      case 'progress': return 'Progress';
      case 'success': return 'Success';
      case 'fail': return 'Error';
      case 'info': return 'Information';
      case 'confirm': return 'Confirmation';
      default: return '';
    }
  }

  private _getAssistiveContext() {
    switch (this._status) {
      case 'loading':
      case 'progress': return 'Wartedialog geöffnet. Bitte warten, der Vorgang wird ausgeführt.';
      case 'confirm': return 'Nachfragedialog geöffnet. Bitte treffen Sie eine Auswahl.';
      case 'fail': return 'Fehlerdialog geöffnet.';
      case 'success': return 'Erfolgsdialog geöffnet.';
      case 'info': return 'Informationsdialog geöffnet.';
      default: return '';
    }
  }

  private _getDefaultMessage(status: Exclude<NteFeedbackStatus, 'idle'>) {
    switch (status) {
      case 'loading': return 'Please wait...';
      case 'progress': return 'The process is running...';
      case 'success': return 'The operation was completed successfully.';
      case 'fail': return 'The operation could not be completed.';
      case 'info': return 'Information';
      case 'confirm': return 'Please confirm the next step.';
    }
  }

  private _getSpinnerClass() {
    switch (this._status) {
      case 'progress': return 'progress';
      case 'success': return 'checked';
      case 'fail': return 'cross';
      case 'info': return 'info';
      default: return '';
    }
  }

  private _getSpinnerStyle() { return this._status === 'progress' ? `--percentage: ${this._progress}; --percentage-txt: '${Math.round(this._progress)}%';` : nothing; }
  private _getRole() { return this._status === 'confirm' || this._status === 'fail' ? 'alertdialog' : 'dialog'; }

  private _getReferenceLabel(reference?: string | HTMLElement) {
    if (typeof reference === 'string') return reference;
    if (reference instanceof HTMLElement) return reference.id ? `#${reference.id}` : reference.tagName.toLowerCase();
    return '';
  }

  private _clampProgress(progress: number) { return Math.min(100, Math.max(0, Number.isFinite(progress) ? progress : 0)); }
  private _getButtonPart(variant: NonNullable<NextrapConfirmAction['variant']>) { return `button button-${variant}`; }

  private _scheduleAutoClose(enabled: boolean, delay = NTE_FEEDBACK_DEFAULT_AUTO_CLOSE_MS) {
    this._clearAutoCloseTimer();
    if (enabled) this._autoCloseTimer = window.setTimeout(() => this.close(), delay);
  }

  private _clearAutoCloseTimer() {
    if (this._autoCloseTimer === null) return;
    window.clearTimeout(this._autoCloseTimer);
    this._autoCloseTimer = null;
  }

  // Der Balken ist eine Variante des bestehenden Loading-Zustands, kein eigener Feedback-Kanal.
  private _isMiniLoader() {
    return this._open && this._status === 'loading' && this._loadingVariant === 'mini';
  }

  // Ready übernimmt einmalig die sichtbare CSS-Position; Transition und Fade laufen in CSS.
  private _finishMiniLoader() {
    const loader = this._miniLoaderElement;
    const value = loader?.firstElementChild as HTMLElement | null;
    if (!loader || !value || loader.classList.contains('ready')) return;
    value.style.transform = getComputedStyle(value).transform;
    value.style.animation = 'none';
    // Der Style-Flush hält den aktuellen Stand als Startwert der Abschluss-Transition fest.
    void value.offsetWidth;
    value.style.transform = 'scaleX(1)';
    loader.classList.add('ready');
  }

  // Nur das Ausblenden des aktuellen Balkens beendet Loading, nicht dessen Ladeanimation.
  private _onMiniAnimationEnd(event: AnimationEvent) {
    if (event.target === this._miniLoaderElement && event.animationName === 'mini-loader-finish' && this._miniReady) this.close();
  }

  // Schließen oder Ersetzen entfernt die CSS-Animation zusammen mit ihrem Element.
  private _clearMiniLoader() {
    this._syncMiniLoaderState(false);
    this._loadingVariant = 'dialog';
    this._miniReady = false;
  }

  // Ein manuelles Popover liegt ohne Fokus- oder Klicksperre über normalem Seiteninhalt.
  // Ohne Popover-API bleibt die feste Positionierung aus dem Shadow-SCSS wirksam.
  private _syncMiniLoaderState(open: boolean) {
    const loader = this._miniLoaderElement;
    if (!loader?.isConnected || typeof loader.showPopover !== 'function') return;
    const shown = loader.matches(':popover-open');
    if (open && !shown) loader.showPopover();
    if (!open && shown) loader.hidePopover();
  }

  // Animates mock progress without reaching 100% before the real operation reports completion.
  private _startMockProgress(detail: NextrapProgressDetail) {
    this._clearMockProgress();
    if (!detail.mock) return;

    const duration = Math.max(1, detail.mockDuration ?? 10_000);
    const messages = detail.mockMessages?.filter(Boolean) ?? [];
    const startedAt = performance.now();
    const target = Math.min(95, this._progress || 0);

    if (messages.length > 0) {
      this._message = messages[0];
      const step = duration / messages.length;
      this._mockMessageTimer = window.setInterval(() => {
        const index = Math.min(messages.length - 1, Math.floor((performance.now() - startedAt) / step));
        this._message = messages[index];
      }, Math.max(50, step));
    }

    const animate = (now: number) => {
      const elapsed = Math.min(duration, now - startedAt);
      const ratio = elapsed / duration;
      const eased = 1 - Math.pow(1 - ratio, 2);
      this._progress = target + (95 - target) * eased;
      if (elapsed < duration && this._status === 'progress') {
        this._mockAnimationFrame = window.requestAnimationFrame(animate);
      }
    };
    this._mockAnimationFrame = window.requestAnimationFrame(animate);
  }

  private _clearMockProgress() {
    if (this._mockMessageTimer !== null) {
      window.clearInterval(this._mockMessageTimer);
      this._mockMessageTimer = null;
    }
    if (this._mockAnimationFrame !== null) {
      window.cancelAnimationFrame(this._mockAnimationFrame);
      this._mockAnimationFrame = null;
    }
  }

  private _clearShakeTimer() {
    if (this._shakeTimer === null) return;
    window.clearTimeout(this._shakeTimer);
    this._shakeTimer = null;
  }

  // Nicht abbrechbare Dialoge dürfen auch durch Hintergrundklicks nicht verschwinden.
  private _requiresExplicitInteraction() {
    if (!this._cancelable) return true;
    if (this._status === 'confirm') return true;
    return this._status === 'info' && !!this._infoConfirmCallback;
  }

  private _shake() {
    const dialog = this._dialogElement;
    if (!dialog) return;
    this._clearShakeTimer();
    dialog.classList.remove('shake');
    void dialog.offsetWidth;
    dialog.classList.add('shake');
    this._shakeTimer = window.setTimeout(() => { dialog.classList.remove('shake'); this._shakeTimer = null; }, 350);
  }

  private _syncDialogState(open: boolean) {
    const dialog = this._dialogElement;
    if (!dialog) return;
    if (open) {
      if (dialog.open) return;
      if (typeof dialog.showModal === 'function') { dialog.showModal(); return; }
      dialog.setAttribute('open', '');
      return;
    }
    if (!dialog.open) { dialog.removeAttribute('open'); return; }
    if (typeof dialog.close === 'function') { dialog.close(); return; }
    dialog.removeAttribute('open');
  }

  private _dismiss() {
    if ((this._status === 'loading' || this._status === 'progress') && this._abortCallback) {
      const callback = this._abortCallback;
      callback();
      this.close();
      return;
    }
    this.close();
  }

  private readonly _onAbortClick = () => this._dismiss();
  private readonly _onDismissClick = () => this._dismiss();

  private readonly _onInfoConfirm = () => {
    const callback = this._infoConfirmCallback;
    callback?.();
    this.close();
  };

  private readonly _onDialogCancel = (event: Event) => {
    event.preventDefault();
    if (this._cancelable) this._dismiss();
  };

  private readonly _onDialogClick = (event: MouseEvent) => {
    const dialog = this._dialogElement;
    if (!dialog?.open) return;
    const rect = dialog.getBoundingClientRect();
    const clickedBackdrop = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    if (!clickedBackdrop) return;
    event.preventDefault();
    if (this._requiresExplicitInteraction()) { this._shake(); return; }
    this._dismiss();
  };

  private _onConfirmAction(action: NextrapConfirmAction) {
    action.callback?.();
    this.close();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nte-feedback': NteFeedback;
  }
}
