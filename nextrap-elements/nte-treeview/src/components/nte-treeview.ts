import { nextrap_element } from '@nextrap/nt-core';
import { css, html, render, type PropertyValues, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { repeat } from 'lit/directives/repeat.js';

import { TreeModel, type TreeNode } from '../tree-model';
import { NteTreeViewItem } from './nte-treeview-item';

/** Rendert zusätzliche Zellinhalte; siehe examples/README.md. */
export type TreeCellRenderer = (node: TreeNode) => unknown;

/** Repräsentiert im Datenbetrieb einen Modellknoten und im HTML-Betrieb ein eigenes Item. */
export type TreeViewElement = TreeNode | NteTreeViewItem;

/** Liefert eine Momentaufnahme der gespeicherten Auswahl und des Aufklappzustands. */
export interface TreeViewState {
  selected: boolean;
  expanded: boolean;
}

/** Label-Aktionen behalten den ursprünglichen Modellknoten und das abbrechbare Browserereignis. */
export interface TreeViewActionDetail {
  node: TreeNode | null;
  item: NteTreeViewItem;
  originalEvent: MouseEvent;
}

/** Eine gelöschte Auswahl enthält null/null; vor dem Rendern kann auch nur das Item fehlen. */
export interface TreeViewSelectionDetail {
  node: TreeNode | null;
  item: NteTreeViewItem | null;
}

/** Eigenständiger Baum mit deklarativen Knoten oder reaktivem TreeModel. */
@customElement('nte-treeview')
export class NteTreeView extends nextrap_element() {
  static readonly formAssociated = true;

  /** Ergänzt native Formularattribute um die von Lit verwalteten Komponentenattribute. */
  static override get observedAttributes(): string[] {
    return [...super.observedAttributes, 'name', 'disabled'];
  }

  static override styles = css`
    /* Der Baum bleibt auch ohne Theme im normalen Dokumentfluss. */
    :host {
      display: block;
      min-inline-size: 0;
    }
  `;

  /** Zugänglicher Name der hierarchischen Liste. */
  @property({ type: String, reflect: true, attribute: 'aria-label' })
  public override accessor ariaLabel = '';

  /** Optionale Zellrenderer gelten nur für den Datenbetrieb und erzeugen benannte Slots. */
  @property({ attribute: false }) public accessor renderCenter: TreeCellRenderer | undefined;
  @property({ attribute: false }) public accessor renderEnd: TreeCellRenderer | undefined;

  /** Läuft vor Navigation, Disclosure und Auswahl; originalEvent.preventDefault() ersetzt die Aktion. */
  public onClick?: (detail: TreeViewActionDetail) => void;
  /** Erhält das native Doppelklickereignis ohne Verzögerung der beiden vorherigen Klicks. */
  public onDoubleClick?: (detail: TreeViewActionDetail) => void;
  /** Meldet tatsächliche Benutzer- und API-Auswahlwechsel nach der Synchronisierung. */
  public onSelected?: (detail: TreeViewSelectionDetail) => void;

  // Ohne setData bleibt das vom Aufrufer geschriebene Light DOM vollständig erhalten.
  private _data?: TreeModel;
  private _unsubscribe?: () => void;
  private readonly _internals = typeof this.attachInternals === 'function' ? this.attachInternals() : undefined;
  private _formDisabled = false;
  private _initialSelection: TreeViewElement | null = null;
  private _initialSelectionCaptured = false;

  // Deklarative und modellgesteuerte Bäume teilen dieselbe sichtbare Zeilenfolge.
  private readonly _rowsObserver = new MutationObserver(() => {
    this._updateRows();
    this._syncFormValue();
  });

  /** Der Formularname folgt wie bei nativen Controls sofort dem gleichnamigen Attribut. */
  public get name(): string {
    return this.getAttribute('name') ?? '';
  }
  public set name(value: string) {
    this.setAttribute('name', value);
  }

  /** Deaktivierte Controls bleiben per API steuerbar, nehmen aber nicht an der Formabgabe teil. */
  public get disabled(): boolean {
    return this.hasAttribute('disabled');
  }
  public set disabled(value: boolean) {
    this.toggleAttribute('disabled', value);
  }

  /** Die native Formzuordnung berücksichtigt auch das form-Attribut und äußere Fieldsets. */
  public get form(): HTMLFormElement | null {
    return this._internals?.form ?? null;
  }

  /** Die eindeutige ausgewählte ID; null löscht die Auswahl, Zuweisungen erzeugen kein change. */
  public get value(): string | null {
    const element = this.selectedElement;
    if (!element) return null;
    const id = this._elementId(element);
    if (id === null) throw new RangeError('Das ausgewählte HTML-Item benötigt eine ID.');
    this.getNodeById(id);
    return id;
  }
  public set value(id: string | null) {
    if (id === null) {
      this.selectedElement = null;
      return;
    }
    const element = this.getNodeById(id);
    if (!element) throw new RangeError(`Die ID "${id}" gehört nicht zur aktiven TreeView.`);
    this.selectedElement = element;
  }

  /** Sucht über alle Ebenen; mehrdeutige IDs werden niemals durch den ersten Treffer aufgelöst. */
  public getNodeById(id: string): TreeViewElement | null {
    if (typeof id !== 'string') throw new TypeError('Eine TreeView-ID muss ein String sein.');
    const elements: TreeViewElement[] = this._data ? this._modelNodes() : this._ownItems();
    const matches = elements.filter((element) => this._elementId(element) === id);
    if (matches.length > 1) throw new RangeError(`Die ID "${id}" ist in dieser TreeView nicht eindeutig.`);
    return matches[0] ?? null;
  }

  /** Vollständige Referenz; Modellzustände sind auch vor dem nächsten DOM-Render unmittelbar lesbar. */
  public get selectedElement(): TreeViewElement | null {
    return this._data
      ? this._modelNodes().find((node) => node.data?.selected) ?? null
      : this._ownItems().find((item) => item.selected) ?? null;
  }
  public set selectedElement(element: TreeViewElement | null) {
    this._setSelection(element);
  }

  /** Fragt nur Mitglieder der aktiven Ansicht ab; gleichnamige IDs ersetzen keine Objektidentität. */
  public getState(element: TreeViewElement): TreeViewState {
    const { node, item } = this._resolveElement(element);
    return node
      ? { selected: Boolean(node.data?.selected), expanded: Boolean(node.data?.expanded) }
      : { selected: item!.selected, expanded: item!.expanded };
  }

  /** Liefert denselben gespeicherten Aufklappzustand wie getState, auch für geschlossene Vorfahren. */
  public getOpenState(element: TreeViewElement): boolean {
    return this.getState(element).expanded;
  }

  /** Übernimmt ab dem ersten Aufruf das gesamte Light DOM für die Datenansicht. */
  public setData(data: TreeModel): void {
    if (!(data instanceof TreeModel)) {
      throw new TypeError('setData erwartet ein TreeModel.');
    }
    this._unsubscribe?.();
    if (!this._data) this.replaceChildren();
    this._data = data;
    this._initialSelection = this.selectedElement;
    this._initialSelectionCaptured = true;
    this._subscribeToData();
    this._syncFormValue();
    this.requestUpdate();
  }

  /** Holt nach einem erneuten Einhängen auch zwischenzeitliche Datenänderungen nach. */
  override connectedCallback(): void {
    super.connectedCallback();
    this._subscribeToData();
    this._rowsObserver.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['expanded', 'hidden', 'selected', 'id'],
    });
    this._updateRows();
    this._syncFormValue();
    if (this._data) this.requestUpdate();
  }

  /** Attribut- und Property-Zugriffe aktualisieren den nativen Formwert ohne Renderverzögerung. */
  override attributeChangedCallback(name: string, previous: string | null, value: string | null): void {
    super.attributeChangedCallback(name, previous, value);
    if (name === 'name' || name === 'disabled') {
      this._syncFormValue();
      this._syncDisabledState();
    }
  }

  /** Eine Zuordnung über form="…" arbeitet genauso wie ein umschließendes Formular. */
  public formAssociatedCallback(): void {
    this._syncFormValue();
  }

  /** Der Browser meldet auch die Deaktivierung durch ein übergeordnetes Fieldset. */
  public formDisabledCallback(disabled: boolean): void {
    this._formDisabled = disabled;
    this._syncDisabledState();
  }

  /** Reset stellt den Anfangswert der aktuellen Datenquelle wieder her, soweit er noch existiert. */
  public formResetCallback(): void {
    this._captureInitialSelection();
    const initial = this._initialSelection;
    const elements: TreeViewElement[] = this._data ? this._modelNodes() : this._ownItems();
    this._setSelection(initial && elements.includes(initial) ? initial : null);
  }

  /** Nicht mehr vorhandene oder mehrdeutige Browserzustände verändern die Auswahl nicht. */
  public formStateRestoreCallback(state: string | File | FormData | null): void {
    if (typeof state !== 'string') return;
    const elements: TreeViewElement[] = this._data ? this._modelNodes() : this._ownItems();
    const matches = elements.filter((element) => this._elementId(element) === state);
    if (matches.length === 1) this._setSelection(matches[0]!);
  }

  /** Verhindert, dass ein langlebiges Modell entfernte TreeViews festhält. */
  override disconnectedCallback(): void {
    this._rowsObserver.disconnect();
    this._unsubscribe?.();
    this._unsubscribe = undefined;
    super.disconnectedCallback();
  }

  /** Hängt pro verbundener TreeView genau einen Listener an das aktuelle Modell. */
  private _subscribeToData(): void {
    this._unsubscribe?.();
    this._unsubscribe = this.isConnected ? this._data?.subscribe(() => {
      this._syncFormValue();
      this.requestUpdate();
    }) : undefined;
  }

  /** Ohne Namen bleibt auch ein Legacy-Baum ohne eindeutige IDs vollständig benutzbar. */
  private _syncFormValue(): void {
    let value: string | null = null;
    let error = '';
    try {
      value = this.value;
    } catch (cause) {
      if (!(cause instanceof RangeError)) throw cause;
      error = cause.message;
    }
    this._internals?.setFormValue?.(value);
    this._internals?.setValidity?.(this.name && error ? { customError: true } : {}, this.name ? error : '');
  }

  /** Inert umfasst den sichtbaren Control-Inhalt einschließlich seiner Zusatz-Zellen. */
  private _syncDisabledState(): void {
    this.renderRoot?.querySelector('[part="list"]')?.toggleAttribute('inert', this._isDisabled());
    this.requestUpdate();
  }

  /** Eigene Deaktivierung und native Fieldset-Vererbung wirken gemeinsam auf die Bedienung. */
  private _isDisabled(): boolean {
    return this.disabled || this._formDisabled;
  }

  /** Der erste vollständige HTML-Zustand bleibt als Reset-Ziel erhalten. */
  private _captureInitialSelection(): void {
    if (this._initialSelectionCaptured) return;
    this._initialSelection = this.selectedElement;
    this._initialSelectionCaptured = true;
  }

  /** Modellschlüssel und explizite HTML-IDs bilden dieselbe Formularwert-Schnittstelle. */
  private _elementId(element: TreeViewElement): string | null {
    return element instanceof NteTreeViewItem ? element.id || null : element.id;
  }

  /** Ordnet nur eigene Knoten nach sichtbarer Baumreihenfolge; geschlossene Zweige zählen nicht mit. */
  private _updateRows(): void {
    const visibility = new Map<NteTreeViewItem, boolean>();
    let visibleIndex = 0;
    for (const item of Array.from(this.querySelectorAll('nte-treeview-item'))) {
      if (item.closest('nte-treeview') !== this) continue;

      // Ein aus einem Unterbaum an die Wurzel verschobener Knoten nutzt wieder den Standard-Slot.
      if (item.parentElement === this && item.slot === 'children') item.removeAttribute('slot');
      const parent = item.parentElement?.closest('nte-treeview-item');
      const parentVisible = parent ? visibility.get(parent) : undefined;
      const visible = !item.hidden && (parentVisible === undefined || (parentVisible && parent?.expanded === true));
      visibility.set(item, visible);

      // Geschlossene und versteckte Zweige verschieben die Streifen der folgenden Zeilen nicht.
      item.toggleAttribute('data-treeview-stripe', visible && ++visibleIndex % 2 === 0);
    }
  }

  /** Nur Benutzeraktionen erzeugen zusätzlich die kompatible selection-change- und native change-Meldung. */
  private _selectItem(event: CustomEvent<NteTreeViewItem>): void {
    const selected = event.detail;
    if (selected.closest('nte-treeview') !== this) return;
    event.stopPropagation();
    if (this._isDisabled()) return;
    const element = this._data ? selected._modelNode : selected;
    // Ein Label-Handler darf seinen Knoten bereits vor der anschließenden Auswahl entfernen.
    if (!element || (this._data && !this._modelNodes().includes(element as TreeNode))) return;
    this._setSelection(element, true);
  }

  /** Eigene Modell- und DOM-Zustände werden synchron gesetzt, bevor Anwendungshandler sie abfragen. */
  private _setSelection(element: TreeViewElement | null, fromUser = false): void {
    const detail = element === null ? { node: null, item: null } : this._resolveElement(element);
    this._captureInitialSelection();
    const items = this._ownItems();
    const nodes = this._modelNodes();
    const changed = this._data
      ? nodes.some((node) => Boolean(node.data?.selected) !== (node === detail.node))
      : items.some((item) => item.selected !== (item === detail.item));

    // Die DOM-Properties folgen sofort; das ist auch für einen unmittelbar folgenden Link-Klick nötig.
    for (const item of items) {
      item.selected = element !== null && (this._data ? item._modelNode === detail.node : item === detail.item);
    }
    for (const node of nodes) {
      if (node === detail.node) (node.data ??= {}).selected = true;
      else if (node.data?.selected) node.data.selected = false;
    }
    this._syncFormValue();
    if (this._data) this.requestUpdate();
    if (!changed) return;

    // Bestehende DOM-Consumer erhalten weiterhin das ausgewählte Item als Event-detail.
    if (fromUser && detail.item) {
      this.dispatchEvent(new CustomEvent<NteTreeViewItem>('selection-change', {
        detail: detail.item, bubbles: true, composed: true,
      }));
    }
    this.onSelected?.(detail);
    if (fromUser) this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }

  /** Programmatische Handler erhalten ausschließlich Aktionen aus dieser Ansicht, nicht aus inneren Bäumen. */
  private _onItemAction(event: CustomEvent<Omit<TreeViewActionDetail, 'node'>>, doubleClick = false): void {
    const { item, originalEvent } = event.detail;
    if (item.closest('nte-treeview') !== this) return;
    if (this._isDisabled()) {
      event.preventDefault();
      originalEvent.preventDefault();
      return;
    }
    const detail: TreeViewActionDetail = { item, originalEvent, node: this._data ? item._modelNode : null };
    if (this._data) {
      if (!detail.node || !this._modelNodes().includes(detail.node)) return;
    }
    if (doubleClick) this.onDoubleClick?.(detail);
    else this.onClick?.(detail);
  }

  /** Fremde, entfernte und nur anhand einer ID ähnliche Referenzen verändern keine bestehende Auswahl. */
  private _resolveElement(element: TreeViewElement): TreeViewSelectionDetail {
    if (this._data) {
      if (element instanceof NteTreeViewItem) {
        throw new TypeError('Im Datenbetrieb wird ein TreeNode aus TreeModel.children erwartet.');
      }
      if (!this._modelNodes().includes(element)) {
        throw new RangeError('Der Knoten gehört nicht zum aktiven TreeModel.');
      }
      return { node: element, item: this._ownItems().find((item) => item._modelNode === element) ?? null };
    }
    if (!(element instanceof NteTreeViewItem)) {
      throw new TypeError('Im HTML-Betrieb wird ein NteTreeViewItem dieser Ansicht erwartet.');
    }
    if (element.closest('nte-treeview') !== this) {
      throw new RangeError('Das Item gehört nicht zu dieser TreeView.');
    }
    return { node: null, item: element };
  }

  /** Die Datenreihenfolge wird über echte Knotenreferenzen gelesen; IDs bleiben geschwisterlokal. */
  private _modelNodes(nodes: TreeNode[] = this._data?.children ?? []): TreeNode[] {
    const result: TreeNode[] = [];
    for (const node of nodes) {
      // Array-Proxy-Mutationen können während ihrer synchronen Meldungen kurzzeitig Lücken enthalten.
      if (!node) continue;
      result.push(node);
      if (node.children) result.push(...this._modelNodes(node.children));
    }
    return result;
  }

  /** Eigenständige innere TreeViews behalten ihre Auswahl und ihre Event-Zuständigkeit. */
  private _ownItems(): NteTreeViewItem[] {
    return Array.from(this.querySelectorAll('nte-treeview-item'))
      .filter((item) => item.closest('nte-treeview') === this);
  }

  /** Rendert zusätzlich zum Shadow DOM nur im ausdrücklich aktivierten Datenbetrieb. */
  protected override updated(changed: PropertyValues): void {
    super.updated(changed);
    if (this._data) render(this._renderItems(this._data.children), this);
    this._captureInitialSelection();
    this._syncFormValue();
  }

  /** Behält vorhandene Geschwister anhand ihrer IDs und erzeugt echte Light-DOM-Kinder. */
  private _renderItems(items: TreeNode[], nested = false): TemplateResult {
    return html`${repeat(
      items,
      (item) => item.id,
      (item) => html`
        <nte-treeview-item
          data-tree-id=${item.id}
          ._modelNode=${item}
          slot=${ifDefined(nested ? 'children' : undefined)}
          .href=${item.src ?? item.data?.href ?? ''}
          .target=${item.data?.target ?? ''}
          .rel=${item.data?.rel ?? ''}
          .current=${item.data?.current ?? ''}
          .expanded=${item.data?.expanded ?? false}
          .selected=${item.data?.selected ?? false}
          @expanded-change=${(event: CustomEvent<boolean>) => {
            (item.data ??= {}).expanded = event.detail;
          }}
          >${item.label} ${this.renderCenter ? html`<span slot="center">${this.renderCenter(item)}</span>` : undefined}
          ${this.renderEnd ? html`<span slot="end">${this.renderEnd(item)}</span>` : undefined}
          ${this._renderItems(item.children ?? [], true)}</nte-treeview-item
        >
      `,
    )}`;
  }

  /** Der Shadow-Renderer bleibt parallel zum ausdrücklich aktivierten Light-DOM-Renderer aktiv. */
  protected override render() {
    super.render();
    return html`<div part="list" role="list" aria-label=${ifDefined(this.ariaLabel || undefined)} ?inert=${this._isDisabled()}
      @label-click=${(event: CustomEvent<Omit<TreeViewActionDetail, 'node'>>) => this._onItemAction(event)}
      @label-dblclick=${(event: CustomEvent<Omit<TreeViewActionDetail, 'node'>>) => this._onItemAction(event, true)}
      @selection-request=${(event: CustomEvent<NteTreeViewItem>) => this._selectItem(event)}><slot></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nte-treeview': NteTreeView;
  }
}
