import { nextrap_layout } from '@nextrap/ntl-core';
import { resetStyle } from '@nextrap/style-reset';
import { html, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import style from './ntl-accordion-item.scss?inline';

@customElement('ntl-accordion-item')
export class NtlAccordionItemElement extends nextrap_layout({
  subLayoutApply: true,
  slotVisibility: false,
  eventBinding: false,
}) {
  static override styles = [unsafeCSS(resetStyle), unsafeCSS(style)];

  @property({ type: Boolean, reflect: true })
  public accessor open = false;

  @property({ type: String, reflect: true, attribute: 'marker-position' })
  public accessor markerPosition: 'start' | 'end' = 'end';

  @property({ type: String, reflect: true, attribute: 'marker-icon' })
  public accessor markerIcon: 'chevron' | 'plus' | null = null;

  private _detailsElement: HTMLDetailsElement | null = null;
  private _contentWrapElement: HTMLDivElement | null = null;
  private _transitionEndHandler: ((e: TransitionEvent) => void) | null = null;
  private _animationFrame = 0;
  private _isReady = false;

  override firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    this._detailsElement = this.shadowRoot?.querySelector('#details') ?? null;
    this._contentWrapElement = this.shadowRoot?.querySelector('#content-wrap') ?? null;
    this._isReady = true;
    this._applyOpenState(false);
  }

  override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has('open') && this._isReady) {
      this._applyOpenState(true);
      this._dispatchToggle();
    }
  }

  override disconnectedCallback() {
    this._clearAnimationState();
    super.disconnectedCallback();
  }

  private _onSummaryClick(e: Event) {
    e.preventDefault();
    this.open = !this.open;
  }

  private _applyOpenState(animate: boolean) {
    if (this.open) {
      this._expandContent(animate);
      return;
    }

    this._collapseContent(animate);
  }

  private _expandContent(animate: boolean) {
    if (!this._detailsElement || !this._contentWrapElement) return;

    const details = this._detailsElement;
    const wrap = this._contentWrapElement;

    this._clearAnimationState();
    details.open = true;

    if (!animate) {
      wrap.style.height = 'auto';
      return;
    }

    const startHeight = wrap.getBoundingClientRect().height;
    wrap.style.height = `${startHeight}px`;
    void wrap.offsetHeight;

    const targetHeight = wrap.scrollHeight;
    if (Math.abs(targetHeight - startHeight) < 1) {
      wrap.style.height = 'auto';
      return;
    }

    this._animationFrame = requestAnimationFrame(() => {
      wrap.style.height = `${targetHeight}px`;
    });

    this._transitionEndHandler = (event: TransitionEvent) => {
      if (event.target !== wrap || event.propertyName !== 'height') return;

      this._clearAnimationState();
      wrap.style.height = 'auto';
    };

    wrap.addEventListener('transitionend', this._transitionEndHandler);
  }

  private _collapseContent(animate: boolean) {
    if (!this._detailsElement || !this._contentWrapElement) return;

    const details = this._detailsElement;
    const wrap = this._contentWrapElement;

    this._clearAnimationState();

    if (!animate) {
      details.open = false;
      wrap.style.height = '0px';
      return;
    }

    if (!details.open) {
      wrap.style.height = '0px';
      return;
    }

    const startHeight = wrap.getBoundingClientRect().height || wrap.scrollHeight;
    wrap.style.height = `${startHeight}px`;
    void wrap.offsetHeight;

    this._animationFrame = requestAnimationFrame(() => {
      wrap.style.height = '0px';
    });

    this._transitionEndHandler = (event: TransitionEvent) => {
      if (event.target !== wrap || event.propertyName !== 'height') return;

      this._clearAnimationState();
      details.open = false;
      wrap.style.height = '0px';
    };

    wrap.addEventListener('transitionend', this._transitionEndHandler);
  }

  private _clearAnimationState() {
    if (this._animationFrame) {
      cancelAnimationFrame(this._animationFrame);
      this._animationFrame = 0;
    }

    if (this._contentWrapElement && this._transitionEndHandler) {
      this._contentWrapElement.removeEventListener('transitionend', this._transitionEndHandler);
      this._transitionEndHandler = null;
    }
  }

  private _dispatchToggle() {
    this.dispatchEvent(
      new CustomEvent('accordion-toggle', {
        detail: { open: this.open },
        bubbles: true,
        composed: true,
      }),
    );
  }

  override render() {
    return html`
      <details id="details" part="details">
        <summary id="summary" part="summary" @click=${this._onSummaryClick}>
          <span id="title" part="title">
            <slot
              name="title"
              data-query=":scope > h1,:scope > h2,:scope > h3,:scope > h4,:scope > h5,:scope > h6"
            ></slot>
          </span>
          <span id="marker" part="marker"></span>
        </summary>
        <div id="content-wrap">
          <div id="content" part="content">
            <slot></slot>
          </div>
        </div>
      </details>
    `;
  }
}
