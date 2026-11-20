import { nextrap_element } from '@nextrap/nt-core';
import { html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import type { TreeNode } from '../tree-model';
import styles from './nte-treeview-item.scss?inline';

/** Entspricht den nativen aria-current-Werten für verlinkte Knoten. */
export type TreeItemCurrent = 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | '';

/** Ein Baumknoten trennt Unterbaum, Link und zusätzliche Zellen; Beispiele: ../../examples/README.md. */
@customElement('nte-treeview-item')
export class NteTreeViewItem extends nextrap_element() {
  // Nur funktionales Layout; alle visuellen Defaults kommen aus dem öffentlichen Sass-Mixin.
  static override styles = unsafeCSS(styles);

  // Link und Unterbaum sind voneinander unabhängig konfigurierbar.
  @property({ reflect: true }) public accessor href = '';
  @property({ reflect: true }) public accessor target = '';
  @property({ reflect: true }) public accessor rel = '';
  @property({ reflect: true }) public accessor current: TreeItemCurrent = '';
  @property({ type: Boolean, reflect: true }) public accessor selected = false;
  @property({ type: Boolean, reflect: true }) public accessor expanded = false;
  @property({ attribute: 'toggle-label' }) public accessor toggleLabel = 'Unterbaum';
  @state() private accessor _hasChildren = false;
  @state() private accessor _labelText = '';

  /** @internal Der Renderer bindet den beobachtbaren Knoten für die Auswahl im TreeView. */
  public _modelNode: TreeNode | null = null;

  // Erkennt den Wechsel zwischen Blatt und Elternknoten auch bei dynamischem Light DOM.
  private readonly _observer = new MutationObserver(() => this._assignChildren());

  /** Ordnet deklarative Kinder zu und aktiviert die Beobachtung erst im Dokument. */
  override connectedCallback(): void {
    super.connectedCallback();
    if (!this.hasAttribute('role')) this.setAttribute('role', 'listitem');
    this._assignChildren();
    this._observer.observe(this, { childList: true });
  }

  /** Entfernte Knoten halten keine DOM-Beobachtung aktiv. */
  override disconnectedCallback(): void {
    this._observer.disconnect();
    super.disconnectedCallback();
  }

  /** Nur unmittelbare Baumknoten werden als Unterbaum einsortiert; Zusatz-Slots bleiben erhalten. */
  private _assignChildren(): void {
    const children = Array.from(this.children).filter((child) => child.matches('nte-treeview-item'));
    children.forEach((child) => child.setAttribute('slot', 'children'));
    this._hasChildren = children.length > 0;
  }

  /** Der Name des Pfeils folgt der Beschriftung, ohne Zusatz-Zellen einzubeziehen. */
  private _onLabelChange(event: Event): void {
    this._assignChildren();
    this._labelText = (event.currentTarget as HTMLSlotElement)
      .assignedNodes({ flatten: true })
      .filter((node) => !(node instanceof HTMLElement && node.matches('nte-treeview-item')))
      .map((node) => node.textContent?.trim() ?? '')
      .filter(Boolean)
      .join(' ');
  }

  /** Schreibt Disclosure synchron zurück, bevor eine Auswahl das Datenmodell neu rendert. */
  private _setExpanded(open: boolean): void {
    if (this.expanded === open) return;
    this.expanded = open;
    this.dispatchEvent(new CustomEvent<boolean>('expanded-change', { detail: open }));
  }

  /** Native Pfeilaktionen verwenden denselben Zustandswechsel wie ein unverlinkter Ordnername. */
  private _onToggle(event: Event): void {
    this._setExpanded((event.currentTarget as HTMLDetailsElement).open);
  }

  /** Nur die eigene Beschriftung reagiert; eigenständige Slot-Aktionen behalten ihre Events. */
  private _isLabelAction(event: MouseEvent): boolean {
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return false;
    const path = event.composedPath();
    const contentPath = path.slice(0, path.indexOf(event.currentTarget!));
    return !contentPath.some((node) => node instanceof Element && node.matches(
      'a, button, input, select, textarea, summary, [contenteditable], [tabindex], [role="button"], [role="link"], [role="combobox"], [role="checkbox"], [role="switch"], [role="slider"]',
    ));
  }

  /** Öffentliche Label-Events schließen Icon und Tastatur ein, ohne leere Zellen zu aktivieren. */
  private _dispatchLabelEvent(type: 'label-click' | 'label-dblclick', originalEvent: MouseEvent): boolean {
    return this.dispatchEvent(new CustomEvent<{ item: NteTreeViewItem; originalEvent: MouseEvent }>(type, {
      detail: { item: this, originalEvent },
      bubbles: true,
      composed: true,
      cancelable: true,
    }));
  }

  /** Verlinkte Ordner werden im Baum zuerst ausgewählt; eigene Aktionen dürfen die Navigation ersetzen. */
  private _onLabelClick(event: MouseEvent): void {
    if (!this._isLabelAction(event)) return;
    const selectOnly = this._hasChildren && Boolean(this.href) && !this.selected
      && this.closest('nte-treeview') !== null;
    const activate = this._dispatchLabelEvent('label-click', event);
    if (!activate || event.defaultPrevented || selectOnly) event.preventDefault();
    else if (this._hasChildren && !this.href) this._setExpanded(!this.expanded);

    this.dispatchEvent(new CustomEvent<NteTreeViewItem>('selection-request', {
      detail: this,
      bubbles: true,
      composed: true,
    }));
  }

  /** Doppelklick bleibt ein natives Ereignis nach zwei Klicks; die Komponente verzögert nichts. */
  private _onLabelDoubleClick(event: MouseEvent): void {
    if (!this._isLabelAction(event)) return;
    if (!this._dispatchLabelEvent('label-dblclick', event)) event.preventDefault();
  }

  /** Link, Pfeil und Zellen sind Geschwister: Ein Dropdown-Klick kann den Unterbaum nicht umschalten. */
  protected override render() {
    super.render();
    // Ordner erhalten ein Theme-Icon als Slot-Fallback; Blätter reservieren keinen Symbolplatz.
    const label = html`<slot name="icon">${this._hasChildren
      ? html`<span part="folder-icon" aria-hidden="true"></span>`
      : undefined}</slot><slot @slotchange=${this._onLabelChange}></slot>`;
    return html`<div id="row" part="row">
      ${
        this._hasChildren
          ? html`<details id="details" part="details" .open=${this.expanded} @toggle=${this._onToggle}>
              <summary
                id="toggle"
                part="toggle"
                aria-label=${this._labelText ? `${this.toggleLabel}: ${this._labelText}` : this.toggleLabel}
              >
                <svg id="indicator" part="indicator" aria-hidden="true" viewBox="0 0 16 16">
                  <path d="m3 6 5 5 5-5" fill="none" stroke="currentColor" stroke-width="2" />
                </svg>
              </summary>
              <div id="children" part="children" role="list">
                <slot name="children" @slotchange=${this._assignChildren}></slot>
              </div>
            </details>`
          : undefined
      }
      ${
        this.href
          ? html`<a
              id="label"
              part="label link"
              @click=${this._onLabelClick}
              @dblclick=${this._onLabelDoubleClick}
              href=${this.href}
              target=${ifDefined(this.target || undefined)}
              rel=${ifDefined(this.rel || undefined)}
              aria-current=${ifDefined(this.current || undefined)}
              aria-description=${ifDefined(this.selected ? 'Ausgewählt' : undefined)}
              >${label}</a
            >`
          : html`<button
              id="label"
              part="label text"
              type="button"
              aria-pressed=${this.selected}
              aria-expanded=${ifDefined(this._hasChildren ? String(this.expanded) : undefined)}
              aria-controls=${ifDefined(this._hasChildren ? 'children' : undefined)}
              @click=${this._onLabelClick}
              @dblclick=${this._onLabelDoubleClick}
              >${label}</button
            >`
      }
      <div id="center" part="center"><slot name="center"></slot></div>
      <div id="end" part="end"><slot name="end"></slot></div>
    </div>`;
  }
}

// Registriert den Knotentyp für typisierte DOM-Abfragen.
declare global {
  interface HTMLElementTagNameMap {
    'nte-treeview-item': NteTreeViewItem;
  }
}
