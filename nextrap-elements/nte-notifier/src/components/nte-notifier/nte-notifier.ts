import { nextrap_element, type NteFeatures } from '@nextrap/nte-core';
import '@nextrap/nte-spinner';
import '@nextrap/style-base';
import { resetStyle } from '@nextrap/style-reset';
import { Listen } from '@trunkjs/browser-utils';
import type { PropertyValues } from 'lit';
import { html, nothing, unsafeCSS } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import {
  NTE_NOTIFIER_DEFAULT_AUTO_CLOSE_MS,
  type NextrapConfirmAction,
  type NextrapConfirmDetail,
  type NextrapFailDetail,
  type NextrapInfoDetail,
  type NextrapLoadingDetail,
  type NextrapProgressDetail,
  type NextrapSuccessDetail,
  type NteNotifierStatus,
} from '../../lib/types';
import style from './nte-notifier.scss?inline';

const features: NteFeatures = {
  eventBinding: true,
};

@customElement('nte-notifier')
export class NteNotifier extends nextrap_element(features) {
  static override styles = [unsafeCSS(style), unsafeCSS(resetStyle)];

  @query('#dialog')
  private accessor _dialogElement: HTMLDialogElement | null = null;

  @state() private accessor _open = false;
  @state() private accessor _status: NteNotifierStatus = 'idle';
  @state() private accessor _title = '';
  @state() private accessor _message = '';
  @state() private accessor _details = '';
  @state() private accessor _progress = 0;
  @state() private accessor _confirmHtml = '';
  @state() private accessor _actions: NextrapConfirmAction[] = [];
  @state() private accessor _referenceLabel = '';
  @state() private accessor _cancelable = false;

  private _abortCallback?: () => void;
  private _infoConfirmCallback?: () => void;
  private _autoCloseTimer: number | null = null;

  override disconnectedCallback() {
    this._clearAutoCloseTimer();
    this._syncDialogState(false);
    super.disconnectedCallback();
  }

  override updated(_changedProperties: PropertyValues<this>) {
    super.updated(_changedProperties);
    this._syncDialogState(this._open);
  }

  protected override render() {
    return html`
      <dialog
        id="dialog"
        part="dialog"
        aria-labelledby="headline"
        aria-describedby="assistive-context message"
        aria-modal="true"
        aria-busy=${this._isBusy() ? 'true' : 'false'}
        role=${this._getRole()}
        @cancel=${this._onDialogCancel}
      >
        ${this._open && this._status !== 'idle'
          ? html`
              <div id="panel" part="panel">
                <div id="assistive-context" part="assistive-context">${this._getAssistiveContext()}</div>

                <div id="header" part="header">
                  <div id="headline" part="headline">${this._getTitle()}</div>

                  ${this._cancelable
                    ? html`
                        <button
                          id="close"
                          part="close-button"
                          type="button"
                          aria-label="Dialog schließen"
                          @click=${this._onDismissClick}
                        >
                          <span aria-hidden="true">×</span>
                        </button>
                      `
                    : nothing}
                </div>

                ${this._showsSpinner()
                  ? html`
                      <nte-spinner
                        id="spinner"
                        part="spinner"
                        class=${this._getSpinnerClass()}
                        style=${this._getSpinnerStyle()}
                      ></nte-spinner>
                    `
                  : nothing}

                <div id="content" part="content">
                  <div id="message" part="message">${this._message}</div>

                  ${this._referenceLabel
                    ? html`<div id="reference" part="reference">${this._referenceLabel}</div>`
                    : nothing}
                  ${this._status === 'progress'
                    ? html`
                        <div id="progress" part="progress">
                          <div id="progress-meta" part="progress-meta">
                            <span part="progress-label">Fortschritt</span>
                            <span part="progress-percent">${Math.round(this._progress)}%</span>
                          </div>
                          <div id="progress-bar" part="progress-bar">
                            <div id="progress-value" part="progress-value" style="width: ${this._progress}%"></div>
                          </div>
                        </div>
                      `
                    : nothing}
                  ${this._status === 'fail' && this._details
                    ? html`
                        <details id="details" part="details">
                          <summary id="details-summary" part="details-summary">Details anzeigen</summary>
                          <pre id="details-content" part="details-content">${this._details}</pre>
                        </details>
                      `
                    : nothing}
                  ${this._status === 'confirm' && this._confirmHtml
                    ? html`<div id="html" part="html">${unsafeHTML(this._confirmHtml)}</div>`
                    : nothing}
                </div>

                ${this._hasActions() ? html`<div id="actions" part="actions">${this._renderActions()}</div>` : nothing}
              </div>
            `
          : nothing}
      </dialog>
    `;
  }

  close() {
    this._clearAutoCloseTimer();
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
  }

  @Listen('nextrap:loading', { target: 'window' })
  private _handleLoading(event: Event) {
    const detail = (event as CustomEvent<NextrapLoadingDetail>).detail ?? {};

    this._openState('loading', detail.title, detail.message, detail.reference, detail.cancelable ?? !!detail.onAbort);
    this._abortCallback = detail.onAbort;
    this._progress = 0;
  }

  @Listen('nextrap:progress', { target: 'window' })
  private _handleProgress(event: Event) {
    const detail = (event as CustomEvent<NextrapProgressDetail>).detail;
    if (!detail) {
      return;
    }

    this._openState('progress', detail.title, detail.message, detail.reference, detail.cancelable ?? !!detail.onAbort);
    this._abortCallback = detail.onAbort;
    this._progress = this._clampProgress(detail.progress);

    if (this._progress >= 100) {
      this._scheduleAutoClose(true);
    }
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
    this._actions = detail.actions?.length
      ? detail.actions
      : [
          {
            label: 'OK',
            variant: 'primary',
          },
        ];
  }

  private _openState(
    status: Exclude<NteNotifierStatus, 'idle'>,
    title?: string,
    message?: string,
    reference?: string | HTMLElement,
    cancelable = false,
  ) {
    this._clearAutoCloseTimer();
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

  private _renderActions() {
    switch (this._status) {
      case 'loading':
      case 'progress':
        return this._abortCallback
          ? html`
              <button class="btn" part=${this._getButtonPart('secondary')} @click=${this._onAbortClick}>Abort</button>
            `
          : nothing;
      case 'success':
      case 'fail':
        return html`<button class="btn" part=${this._getButtonPart('primary')} @click=${() => this.close()}>
          Close
        </button>`;
      case 'info':
        return html`<button class="btn" part=${this._getButtonPart('primary')} @click=${this._onInfoConfirm}>
          OK
        </button>`;
      case 'confirm':
        return this._actions.map((action) => {
          const variant = action.variant ?? 'secondary';

          return html`
            <button class="btn" part=${this._getButtonPart(variant)} @click=${() => this._onConfirmAction(action)}>
              ${action.label}
            </button>
          `;
        });
      default:
        return nothing;
    }
  }

  private _hasActions() {
    switch (this._status) {
      case 'loading':
      case 'progress':
        return !!this._abortCallback;
      case 'success':
      case 'fail':
      case 'info':
        return true;
      case 'confirm':
        return this._actions.length > 0;
      default:
        return false;
    }
  }

  private _showsSpinner() {
    return this._status !== 'confirm';
  }

  private _isBusy() {
    return this._status === 'loading' || this._status === 'progress';
  }

  private _getTitle() {
    return this._title || this._getDefaultTitle(this._status);
  }

  private _getDefaultTitle(status: NteNotifierStatus) {
    switch (status) {
      case 'loading':
        return 'Loading';
      case 'progress':
        return 'Progress';
      case 'success':
        return 'Success';
      case 'fail':
        return 'Error';
      case 'info':
        return 'Information';
      case 'confirm':
        return 'Confirmation';
      default:
        return '';
    }
  }

  private _getAssistiveContext() {
    switch (this._status) {
      case 'loading':
      case 'progress':
        return 'Wartedialog geöffnet. Bitte warten, der Vorgang wird ausgeführt.';
      case 'confirm':
        return 'Nachfragedialog geöffnet. Bitte treffen Sie eine Auswahl.';
      case 'fail':
        return 'Fehlerdialog geöffnet.';
      case 'success':
        return 'Erfolgsdialog geöffnet.';
      case 'info':
        return 'Informationsdialog geöffnet.';
      default:
        return '';
    }
  }

  private _getDefaultMessage(status: Exclude<NteNotifierStatus, 'idle'>) {
    switch (status) {
      case 'loading':
        return 'Please wait...';
      case 'progress':
        return 'The process is running...';
      case 'success':
        return 'The operation was completed successfully.';
      case 'fail':
        return 'The operation could not be completed.';
      case 'info':
        return 'Information';
      case 'confirm':
        return 'Please confirm the next step.';
    }
  }

  private _getSpinnerClass() {
    switch (this._status) {
      case 'progress':
        return 'progress';
      case 'success':
        return 'checked';
      case 'fail':
        return 'cross';
      case 'info':
        return 'info';
      default:
        return '';
    }
  }

  private _getSpinnerStyle() {
    return this._status === 'progress'
      ? `--percentage: ${this._progress}; --percentage-txt: '${Math.round(this._progress)}%';`
      : nothing;
  }

  private _getRole() {
    switch (this._status) {
      case 'confirm':
      case 'fail':
        return 'alertdialog';
      default:
        return 'dialog';
    }
  }

  private _getReferenceLabel(reference?: string | HTMLElement) {
    if (typeof reference === 'string') {
      return reference;
    }

    if (reference instanceof HTMLElement) {
      if (reference.id) {
        return `#${reference.id}`;
      }

      return reference.tagName.toLowerCase();
    }

    return '';
  }

  private _clampProgress(progress: number) {
    return Math.min(100, Math.max(0, Number.isFinite(progress) ? progress : 0));
  }

  private _getButtonPart(variant: NonNullable<NextrapConfirmAction['variant']>) {
    return `button button-${variant}`;
  }

  private _scheduleAutoClose(enabled: boolean, delay = NTE_NOTIFIER_DEFAULT_AUTO_CLOSE_MS) {
    this._clearAutoCloseTimer();

    if (!enabled) {
      return;
    }

    this._autoCloseTimer = window.setTimeout(() => this.close(), delay);
  }

  private _clearAutoCloseTimer() {
    if (this._autoCloseTimer === null) {
      return;
    }

    window.clearTimeout(this._autoCloseTimer);
    this._autoCloseTimer = null;
  }

  private _syncDialogState(open: boolean) {
    const dialog = this._dialogElement;

    if (!dialog) {
      return;
    }

    if (open) {
      if (dialog.open) {
        return;
      }

      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
        return;
      }

      dialog.setAttribute('open', '');
      return;
    }

    if (!dialog.open) {
      dialog.removeAttribute('open');
      return;
    }

    if (typeof dialog.close === 'function') {
      dialog.close();
      return;
    }

    dialog.removeAttribute('open');
  }

  private _dismiss() {
    if ((this._status === 'loading' || this._status === 'progress') && this._abortCallback) {
      this._abortCallback();
      return;
    }

    this.close();
  }

  private readonly _onAbortClick = () => {
    this._abortCallback?.();
  };

  private readonly _onDismissClick = () => {
    this._dismiss();
  };

  private readonly _onInfoConfirm = () => {
    const callback = this._infoConfirmCallback;
    this.close();
    callback?.();
  };

  private readonly _onDialogCancel = (event: Event) => {
    event.preventDefault();

    if (!this._cancelable) {
      return;
    }

    this._dismiss();
  };

  private _onConfirmAction(action: NextrapConfirmAction) {
    this.close();
    action.callback?.();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nte-notifier': NteNotifier;
  }
}
