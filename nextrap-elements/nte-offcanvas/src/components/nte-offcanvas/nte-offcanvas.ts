import { nextrap_element } from '@nextrap/nt-core';
import { resetStyle } from '@nextrap/style-reset';
import { Listen, waitForReady } from '@trunkjs/browser-utils';
import { html, nothing, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import style from './nte-offcanvas.scss?inline';

export type NteOffcanvasPlacement = 'left' | 'right' | 'top' | 'bottom' | 'fullscreen';
export type NteOffcanvasMode = 'overlay' | 'push';
export type NteOffcanvasState = 'closed' | 'opening' | 'open' | 'closing';
export type NteOffcanvasContent = TemplateResult | HTMLElement | null | undefined;

export interface NteOffcanvasOptions {
  content?: NteOffcanvasContent;
  openGroup?: string;
  opened?: boolean;
  backdrop?: boolean;
}

export interface NteOffcanvasEventDetail {
  id: string;
  placement: NteOffcanvasPlacement;
  mode: NteOffcanvasMode;
  openGroup: string;
  modal: boolean;
  size: string;
  duration: string;
  easing: string;
  waitUntil?: (promise: Promise<unknown>) => void;
}

export const NTE_OFFCANVAS_EVENTS = {
  opening: 'nte-offcanvas:opening',
  opened: 'nte-offcanvas:opened',
  closing: 'nte-offcanvas:closing',
  closed: 'nte-offcanvas:closed',
} as const;

interface EffectivePresentation {
  placement: NteOffcanvasPlacement;
  mode: NteOffcanvasMode;
  modal: boolean;
  size: string;
  duration: string;
  easing: string;
}

const PLACEMENTS: ReadonlyArray<NteOffcanvasPlacement> = ['left', 'right', 'top', 'bottom', 'fullscreen'];
const MODES: ReadonlyArray<NteOffcanvasMode> = ['overlay', 'push'];

@customElement('nte-offcanvas')
export class NteOffcanvas extends nextrap_element({
  eventBinding: true,
  slotVisibility: true,
}) {
  static override styles = [unsafeCSS(resetStyle), unsafeCSS(style)];

  private static instanceCounter = 0;

  static get is() {
    return 'nte-offcanvas';
  }

  @property({ type: Boolean, reflect: true })
  public accessor backdrop = true;

  @property({ type: Boolean, reflect: true })
  public accessor opened = false;

  @property({ type: String, attribute: 'open-group' })
  public accessor openGroup = '';

  /** @deprecated use open-group */
  @property({ type: String, attribute: 'data-group-name' })
  private accessor legacyGroupName = '';

  @state()
  protected accessor lifecycle: NteOffcanvasState = 'closed';

  @state()
  protected accessor visualState: NteOffcanvasState = 'closed';

  @state()
  private accessor programmaticContent: NteOffcanvasContent = undefined;

  private readonly instanceId = `nte-offcanvas-${++NteOffcanvas.instanceCounter}`;
  private presentation: EffectivePresentation = {
    placement: 'right',
    mode: 'overlay',
    modal: true,
    size: 'var(--nte-offcanvas-width, var(--width, 33vw))',
    duration: 'var(--nte-offcanvas-transition-duration, var(--transition-duration, 240ms))',
    easing: 'var(--nte-offcanvas-transition-easing, ease-in-out)',
  };
  private activePresentation: EffectivePresentation | null = null;
  private ready = false;
  private mutationObserver?: MutationObserver;
  private openPromise?: Promise<void>;
  private closePromise?: Promise<void>;

  public constructor(options: NteOffcanvasOptions = {}) {
    super();
    if ('content' in options) {
      this.programmaticContent = options.content;
    }
    if (options.openGroup !== undefined) {
      this.openGroup = options.openGroup;
    }
    if (options.opened !== undefined) {
      this.opened = options.opened;
    }
    if (options.backdrop !== undefined) {
      this.backdrop = options.backdrop;
    }
  }

  public get content(): NteOffcanvasContent {
    return this.programmaticContent;
  }

  public set content(value: NteOffcanvasContent) {
    this.programmaticContent = value;
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    this.mutationObserver = new MutationObserver(() => this.onPresentationMutation());
    this.mutationObserver.observe(this, {
      attributes: true,
      attributeFilter: ['class', 'style'],
    });
  }

  public override disconnectedCallback(): void {
    this.mutationObserver?.disconnect();
    this.mutationObserver = undefined;
    super.disconnectedCallback();
  }

  protected override async firstUpdated(): Promise<void> {
    this.presentation = this.readPresentation();
    this.requestUpdate();

    await waitForReady();
    this.ready = true;

    if (this.opened) {
      await this.open();
    }
  }

  protected override updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);

    if (!this.ready || !changedProperties.has('opened')) {
      return;
    }

    if (this.opened && this.lifecycle === 'closed') {
      void this.open();
    } else if (!this.opened && (this.lifecycle === 'open' || this.lifecycle === 'opening')) {
      void this.close();
    }
  }

  public open(): Promise<void> {
    if (!this.isConnected && document.body !== null) {
      document.body.append(this);
    }

    if (this.lifecycle === 'open') {
      return Promise.resolve();
    }
    if (this.lifecycle === 'opening' && this.openPromise !== undefined) {
      return this.openPromise;
    }
    if (this.lifecycle === 'closing' && this.closePromise !== undefined) {
      return this.closePromise.then(() => this.open());
    }

    this.opened = true;
    this.openPromise = this.performOpen().finally(() => {
      this.openPromise = undefined;
    });
    return this.openPromise;
  }

  public close(): Promise<void> {
    if (this.lifecycle === 'closed') {
      this.opened = false;
      return Promise.resolve();
    }
    if (this.lifecycle === 'closing' && this.closePromise !== undefined) {
      return this.closePromise;
    }

    this.opened = false;
    this.closePromise = this.performClose().finally(() => {
      this.closePromise = undefined;
    });
    return this.closePromise;
  }

  public toggle(): Promise<void> {
    return this.opened ? this.close() : this.open();
  }

  @Listen(NTE_OFFCANVAS_EVENTS.opening, { target: 'window' })
  protected onOtherOpening(event: Event): void {
    const customEvent = event as CustomEvent<NteOffcanvasEventDetail>;
    const detail = customEvent.detail;

    if (detail.id === this.instanceId || (this.lifecycle !== 'open' && this.lifecycle !== 'opening')) {
      return;
    }

    const active = this.activePresentation ?? this.presentation;
    const samePlacement = active.placement === detail.placement;
    const sameGroup = this.groupName !== '' && detail.openGroup !== '' && this.groupName === detail.openGroup;
    const modalConflict = active.modal && detail.modal;

    if (!samePlacement && !sameGroup && !modalConflict) {
      return;
    }

    const closing = this.close();
    detail.waitUntil?.(closing);
  }

  @Listen('click', { target: 'host' })
  protected onHostClick(event: Event): void {
    if (!(event.target instanceof HTMLElement)) {
      return;
    }

    if (event.target.closest("[data-nt-dismiss='offcanvas']") !== null) {
      void this.close();
    }
  }

  private get groupName(): string {
    return this.openGroup || this.legacyGroupName;
  }

  private get dialog(): HTMLDialogElement | null {
    return this.renderRoot.querySelector<HTMLDialogElement>('#dialog');
  }

  private async performOpen(): Promise<void> {
    await this.updateComplete;

    this.presentation = this.readPresentation();
    this.activePresentation = this.presentation;
    this.lifecycle = 'opening';
    this.visualState = 'closed';
    this.requestUpdate();

    const waits = this.dispatchState(NTE_OFFCANVAS_EVENTS.opening, this.activePresentation, true);
    await Promise.allSettled(waits);

    if (!this.opened || this.lifecycle !== 'opening') {
      return;
    }

    const dialog = this.dialog;
    if (dialog === null) {
      this.lifecycle = 'closed';
      this.visualState = 'closed';
      return;
    }

    if (!dialog.open) {
      if (this.activePresentation.modal) {
        dialog.showModal();
      } else {
        dialog.show();
      }
    }

    this.visualState = 'opening';
    this.requestUpdate();
    await this.waitForVisualTransition(dialog);

    if (!this.opened || this.lifecycle !== 'opening') {
      return;
    }

    this.lifecycle = 'open';
    this.visualState = 'open';
    this.requestUpdate();
    this.dispatchState(NTE_OFFCANVAS_EVENTS.opened, this.activePresentation);
  }

  private async performClose(): Promise<void> {
    const presentation = this.activePresentation ?? this.presentation;
    const dialog = this.dialog;

    this.lifecycle = 'closing';
    this.visualState = dialog?.open ? 'closing' : 'closed';
    this.requestUpdate();
    this.dispatchState(NTE_OFFCANVAS_EVENTS.closing, presentation);

    if (dialog?.open) {
      await this.waitForVisualTransition(dialog);
      if (dialog.open) {
        dialog.close();
      }
    }

    this.lifecycle = 'closed';
    this.visualState = 'closed';
    this.activePresentation = null;
    this.presentation = this.readPresentation();
    this.requestUpdate();
    this.dispatchState(NTE_OFFCANVAS_EVENTS.closed, presentation);
  }

  private dispatchState(
    name: (typeof NTE_OFFCANVAS_EVENTS)[keyof typeof NTE_OFFCANVAS_EVENTS],
    presentation: EffectivePresentation,
    collectWaits = false,
  ): Array<Promise<unknown>> {
    const waits: Array<Promise<unknown>> = [];
    const detail: NteOffcanvasEventDetail = {
      id: this.instanceId,
      placement: presentation.placement,
      mode: presentation.mode,
      openGroup: this.groupName,
      modal: presentation.modal,
      size: presentation.size,
      duration: presentation.duration,
      easing: presentation.easing,
    };

    if (collectWaits) {
      detail.waitUntil = (promise: Promise<unknown>) => waits.push(Promise.resolve(promise));
    }

    window.dispatchEvent(new CustomEvent<NteOffcanvasEventDetail>(name, { detail }));
    return waits;
  }

  private onPresentationMutation(): void {
    const next = this.readPresentation();

    if (this.lifecycle === 'closed') {
      this.presentation = next;
      this.requestUpdate();
      return;
    }

    if (this.activePresentation === null) {
      return;
    }

    // Placement and modality stay stable for the current open/close cycle.
    this.activePresentation = {
      ...next,
      placement: this.activePresentation.placement,
      modal: this.activePresentation.modal,
    };
    this.presentation = this.activePresentation;
    this.requestUpdate();

    if (this.lifecycle === 'open') {
      this.dispatchState(NTE_OFFCANVAS_EVENTS.opened, this.activePresentation);
    }
  }

  private readPresentation(): EffectivePresentation {
    const computed = getComputedStyle(this);
    const css = (name: string, fallback: string): string => computed.getPropertyValue(name).trim() || fallback;

    const placementValue = css('--nte-offcanvas-placement', 'right');
    const placement = PLACEMENTS.includes(placementValue as NteOffcanvasPlacement)
      ? (placementValue as NteOffcanvasPlacement)
      : 'right';

    const modeValue = css('--nte-offcanvas-mode', 'overlay');
    const mode = MODES.includes(modeValue as NteOffcanvasMode) ? (modeValue as NteOffcanvasMode) : 'overlay';
    const modal = this.parseCssBoolean(css('--nte-offcanvas-modal', '1'), true);
    const duration = css('--nte-offcanvas-transition-duration', css('--transition-duration', '240ms'));
    const easing = css('--nte-offcanvas-transition-easing', 'ease-in-out');

    let size: string;
    if (placement === 'left' || placement === 'right') {
      size = css('--nte-offcanvas-width', css('--width', '33vw'));
    } else if (placement === 'top' || placement === 'bottom') {
      size = css('--nte-offcanvas-height', 'auto');
      if (size === 'auto') {
        const measured = this.dialog?.getBoundingClientRect().height ?? 0;
        size = measured > 0 ? `${measured}px` : '0px';
      }
    } else {
      size = '100%';
    }

    return { placement, mode, modal, size, duration, easing };
  }

  private parseCssBoolean(value: string, fallback: boolean): boolean {
    const normalized = value.trim().toLowerCase();
    if (['1', 'true', 'yes', 'on'].includes(normalized)) {
      return true;
    }
    if (['0', 'false', 'no', 'off'].includes(normalized)) {
      return false;
    }
    return fallback;
  }

  private async waitForVisualTransition(element: HTMLElement): Promise<void> {
    await this.updateComplete;
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    const animations = element.getAnimations();
    if (animations.length === 0) {
      return;
    }
    await Promise.allSettled(animations.map((animation) => animation.finished));
  }

  private onDialogCancel(event: Event): void {
    event.preventDefault();
    void this.close();
  }

  private onDialogBackdropClick(event: MouseEvent): void {
    if (!this.backdrop || event.target !== event.currentTarget) {
      return;
    }

    const dialog = this.dialog;
    if (dialog === null) {
      return;
    }

    const rect = dialog.getBoundingClientRect();
    const outside =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom;

    if (outside) {
      void this.close();
    }
  }

  override render() {
    const presentation = this.activePresentation ?? this.presentation;
    const label = this.getAttribute('aria-label') ?? 'Offcanvas';

    return html`
      <dialog
        id="dialog"
        part="offcanvas dialog"
        aria-label=${label}
        data-placement=${presentation.placement}
        data-mode=${presentation.mode}
        data-state=${this.visualState}
        data-backdrop=${this.backdrop ? 'visible' : 'hidden'}
        @cancel=${this.onDialogCancel}
        @click=${this.onDialogBackdropClick}
      >
        <div id="header" part="header">
          <slot name="header"></slot>
          <div id="close" part="close">
            <slot name="close">
              <button
                id="default-close"
                type="button"
                aria-label="Close"
                data-nt-dismiss="offcanvas"
                part="close-button"
              >
                <span aria-hidden="true"></span>
              </button>
            </slot>
          </div>
        </div>

        <div id="main" part="main">
          ${this.programmaticContent === undefined
            ? html`<slot></slot>`
            : this.programmaticContent === null
              ? nothing
              : this.programmaticContent}
        </div>

        <div id="footer" part="footer">
          <slot name="footer"></slot>
        </div>
      </dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nte-offcanvas': NteOffcanvas;
  }
}
