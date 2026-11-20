// Die Nextrap-Basis übernimmt Registrierungskontext und automatische style-default-Klasse.
import { nextrap_element } from '@nextrap/nt-core';
import { html, nothing, unsafeCSS, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { keyed } from 'lit/directives/keyed.js';
import { loadBootstrapIconFont } from '../../lib/bootstrap-icon-font';
import style from './nte-icon.scss?inline';

// Benannte Größen folgen der relativen Font-Awesome-Skala; die Standardgröße erbt den Text.
export type NteIconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
  | 's' | 'm' | 'l' | 'small' | 'medium' | 'large' | '2xl';
export type NteIconLoadState = 'empty' | 'loading' | 'loaded' | 'error';
export interface NteIconEventDetail {
  source: 'image' | 'font';
  error?: unknown;
}

// Entfernte HTML-Attribute werden zu leeren Strings statt zu Lits standardmäßigem null.
const textAttribute = { fromAttribute: (value: string | null) => value ?? '' };

/** Quadratisches Bild- oder Bootstrap-Font-Icon mit dokumentweit verzögertem Font-Laden. */
@customElement('nte-icon')
export class NteIcon extends nextrap_element() {
  static override styles = [unsafeCSS(style)];

  // Eine Bildquelle hat Vorrang vor Klassen und löst selbst keinen Font-Download aus.
  @property({ converter: textAttribute }) accessor src = '';
  @property({ attribute: 'class', converter: textAttribute }) accessor iconClass = '';
  @property({ reflect: true }) accessor size: NteIconSize = 'md';
  @property({ converter: textAttribute }) accessor height = '';
  @property({ converter: textAttribute }) accessor placeholder = '…';
  @property({ converter: textAttribute }) accessor label = '';

  // Autorenseitige ARIA-Attribute bleiben gegenüber den Element-Defaults maßgeblich.
  @property({ attribute: 'aria-label', converter: textAttribute }) accessor ariaLabelText = '';
  @property({ attribute: 'aria-labelledby', converter: textAttribute }) accessor ariaLabelledByText = '';

  // Ein Versionszähler verhindert, dass alte Downloads eine neue Quelle überschreiben.
  @state() private accessor status: NteIconLoadState = 'empty';
  private readonly internals = this.attachInternals();
  private sourceKey = '';
  private requestVersion = 0;

  /** Aktueller, auch am Attribut loading-state sichtbarer Zustand. */
  get loadingState(): NteIconLoadState {
    return this.status;
  }

  // Reconnects verwenden den globalen Font-Cache, prüfen aber den lokalen Zustand erneut.
  override connectedCallback(): void {
    super.connectedCallback();
    this.sourceKey = '';
    this.requestUpdate();
  }

  // Ein getrenntes Element darf keine späteren Load-/Error-Events mehr senden.
  override disconnectedCallback(): void {
    this.requestVersion++;
    super.disconnectedCallback();
  }

  // Alle Zustände werden vor dem Rendern gesetzt, damit kein veraltetes Glyph sichtbar wird.
  protected override willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    this.updateAccessibility();
    if (changed.has('height')) {
      this.updateHeight();
    }
    if (this.isConnected) {
      this.updateSource();
    }
  }

  // Bereits gecachte Bilder können beim Reconnect ohne neues load-Event bereitstehen.
  protected override updated(changed: PropertyValues): void {
    super.updated(changed);
    const image = this.renderRoot.querySelector('img');
    if (this.isConnected && this.src.trim() && image?.complete && this.status === 'loading') {
      void this.finish(this.requestVersion, 'image', image.naturalWidth > 0
        ? undefined
        : new Error(`nte-icon: Bild konnte nicht geladen werden: ${this.src}`));
    }
  }

  // Interne Inhalte sind dekorativ; der Host erhält bei label eine einzige Bild-Semantik.
  private updateAccessibility(): void {
    this.internals.role = 'img';
    this.internals.ariaLabel = this.label.trim() || null;
    this.internals.ariaHidden = this.label.trim() || this.ariaLabelText.trim()
      || this.ariaLabelledByText.trim() ? 'false' : 'true';
  }

  // Die öffentliche Höhe steuert die em-Box, ohne autorenseitige font-size-Styles zu ersetzen.
  private updateHeight(): void {
    const probe = this.ownerDocument.createElement('span').style;
    probe.fontSize = this.height.trim();
    if (probe.fontSize) {
      this.style.setProperty('--_nte-icon-height', probe.fontSize);
    } else {
      this.style.removeProperty('--_nte-icon-height');
    }
  }

  // Andere Host-Klassen wie style-default verändern weder Icon-Auswahl noch Ladezustand.
  private get bootstrapClass(): string {
    return this.iconClass.split(/\s+/).find((name) => /^bi-[a-z0-9-]+$/.test(name)) ?? '';
  }

  // Bild, Font und leere Instanz sind getrennte Quellen; src gewinnt ausdrücklich.
  private updateSource(): void {
    const source = this.src.trim();
    const icon = this.bootstrapClass;
    const key = source ? `image:${source}` : icon ? `font:${icon}` : 'empty';
    if (key === this.sourceKey) {
      return;
    }
    this.sourceKey = key;
    const version = ++this.requestVersion;
    this.setStatus(key === 'empty' ? 'empty' : 'loading');
    if (!source && icon) {
      void this.loadFont(version);
    }
  }

  // Nur der Font-Modus ruft den gemeinsamen Loader auf; Fehler werden als Zustand behandelt.
  private async loadFont(version: number): Promise<void> {
    try {
      await loadBootstrapIconFont(this.ownerDocument);
      await this.finish(version, 'font');
    } catch (error) {
      await this.finish(version, 'font', error);
    }
  }

  // Events folgen dem gerenderten Zustand und werden je aktiver Quelle genau einmal ausgelöst.
  private async finish(version: number, source: 'image' | 'font', error?: unknown): Promise<void> {
    if (!this.isConnected || version !== this.requestVersion || this.status !== 'loading') {
      return;
    }
    this.setStatus(error === undefined ? 'loaded' : 'error');
    await this.updateComplete;
    if (this.isConnected && version === this.requestVersion) {
      this.dispatchEvent(new CustomEvent<NteIconEventDetail>(
        error === undefined ? 'nte-icon-load' : 'nte-icon-error',
        { detail: { source, ...(error === undefined ? {} : { error }) }, bubbles: true, composed: true },
      ));
    }
  }

  // Ein öffentliches Attribut macht Lade- und Fehlerzustände auch für Theme-CSS nutzbar.
  private setStatus(status: NteIconLoadState): void {
    this.status = status;
    this.setAttribute('loading-state', status);
    this.internals.ariaBusy = status === 'loading' ? 'true' : 'false';
  }

  // Die Bildquelle lädt unsichtbar; Font-Glyphen erscheinen erst nach erfolgreichem FontFace.load().
  override render() {
    const version = this.requestVersion;
    return html`
      ${super.render()}
      ${this.src.trim() ? keyed(version, html`
        <img part="image" src=${this.src.trim()} alt="" aria-hidden="true" draggable="false"
          ?hidden=${this.status !== 'loaded'}
          @load=${() => this.finish(version, 'image')}
          @error=${() => this.finish(version, 'image', new Error(`nte-icon: Bild konnte nicht geladen werden: ${this.src}`))}>
      `) : this.status === 'loaded' ? html`
        <span part="icon" class=${`glyph ${this.bootstrapClass}`} aria-hidden="true"></span>
      ` : nothing}
      ${this.placeholder && (this.status === 'loading' || this.status === 'error') ? html`
        <span part="placeholder" aria-hidden="true">${this.placeholder}</span>
      ` : nothing}
      <slot NO-DEFAULT-SLOT></slot>
    `;
  }
}

// Typisierte DOM-Abfragen liefern direkt die öffentliche Komponenten-API.
declare global {
  interface HTMLElementTagNameMap {
    'nte-icon': NteIcon;
  }
}
