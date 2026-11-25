import { nextrap_element } from '@nextrap/nt-core';
import { html, render, unsafeCSS, type PropertyValues, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { repeat } from 'lit/directives/repeat.js';

import { TreeModel, type TreeNode } from '../tree-model';
import { NteTreeViewItem } from './nte-treeview-item';
import styles from './nte-treeview.scss?inline';

/** Ersetzt die Standardbeschriftung durch Text oder ein Lit-Template, bei Bedarf mit Zusatz-Slots. */
export type TreeNodeRenderer = (node: TreeNode) => unknown;

/** Repräsentiert im Datenbetrieb einen Modellknoten und im HTML-Betrieb ein eigenes Item. */
export type TreeViewElement = TreeNode | NteTreeViewItem;

/** Liefert eine Momentaufnahme der gespeicherten Auswahl und des Aufklappzustands. */
export interface TreeViewState {
  selected: boolean;
  expanded: boolean;
}

/** Serialisierbarer Öffnungszustand der aktiven Ordner oder Unterseiten mit eindeutiger ID. */
export type TreeViewExpandedState = Record<string, boolean>;

/** Prüft Modellknoten unabhängig von ihrer momentanen Sichtbarkeit. */
export type TreeViewFilter = (node: TreeNode) => boolean;

/** Das Ereignis enthält unmittelbar die gewählte Referenz; null steht für eine gelöschte Auswahl. */
export interface TreeViewEventMap {
  'selection-change': CustomEvent<TreeViewElement | null>;
}

/** Eigenständiger Baum mit deklarativen Knoten oder reaktivem TreeModel. */
@customElement('nte-treeview')
export class NteTreeView extends nextrap_element() {
  static override styles = unsafeCSS(styles);

  /** Zugänglicher Name der hierarchischen Liste. */
  @property({ type: String, reflect: true, attribute: 'aria-label' })
  public override accessor ariaLabel = '';

  /** Ohne Renderer wird im Datenbetrieb node.label angezeigt. */
  @property({ attribute: false }) public accessor renderer: TreeNodeRenderer | undefined;

  /** Blendet Modellknoten ohne Treffer aus und lässt Pfade zu Treffern sichtbar. */
  @property({ attribute: false }) public accessor filter: TreeViewFilter | undefined;

  // Öffnungszustände bleiben auch erhalten, wenn eine ID vorübergehend im Modell fehlt.
  private readonly _rememberedExpansion = new Map<string, boolean>();

  // Ohne setData bleibt das vom Aufrufer geschriebene Light DOM vollständig erhalten.
  private _data?: TreeModel;
  private _unsubscribe?: () => void;

  // Deklarative und modellgesteuerte Bäume teilen dieselbe sichtbare Zeilenfolge.
  private readonly _rowsObserver = new MutationObserver(() => this._updateRows());

  /** Liest die vollständige Referenz; gesetzt werden können ein eigenes Objekt, eine ID oder null. */
  public get value(): TreeViewElement | null {
    return this._data
      ? this._modelNodes().find((node) => node.data?.selected) ?? null
      : this._ownItems().find((item) => item.selected) ?? null;
  }
  public set value(element: TreeViewElement | string | null) {
    if (typeof element === 'string') {
      const node = this.getNodeById(element);
      if (!node) throw new RangeError(`Die ID "${element}" gehört nicht zur aktiven TreeView.`);
      element = node;
    }
    this._setSelection(element);
  }

  /** Sucht über alle Ebenen; mehrdeutige IDs werden niemals durch den ersten Treffer aufgelöst. */
  public getNodeById(id: string): TreeViewElement | null {
    if (typeof id !== 'string') throw new TypeError('Eine TreeView-ID muss ein String sein.');
    const elements: TreeViewElement[] = this._data ? this._modelNodes() : this._ownItems();
    const matches = elements.filter((element) => (element instanceof NteTreeViewItem ? element.id || null : element.id) === id);
    if (matches.length > 1) throw new RangeError(`Die ID "${id}" ist in dieser TreeView nicht eindeutig.`);
    return matches[0] ?? null;
  }

  /** Fragt nur Mitglieder der aktiven Ansicht ab; gleichnamige IDs ersetzen keine Objektidentität. */
  public getState(element: TreeViewElement): TreeViewState {
    const { node, item } = this._resolveElement(element);
    return node
      ? { selected: Boolean(node.data?.selected), expanded: Boolean(node.data?.expanded) }
      : { selected: item!.selected, expanded: item!.expanded };
  }

  /** Gibt eine unabhängige Momentaufnahme einschließlich geschlossener Zweige zurück. */
  public get expandedState(): TreeViewExpandedState {
    const entries: [string, boolean][] = [];
    for (const [id, element] of this._uniqueElementsById()) {
      if (element instanceof NteTreeViewItem) {
        if (Array.from(element.children).some((child) => child instanceof NteTreeViewItem)) {
          entries.push([id, element.expanded]);
        }
      } else if (element.children?.length) {
        entries.push([id, Boolean(element.data?.expanded)]);
      }
    }
    return Object.fromEntries(entries);
  }

  /** Behält nur baumweit eindeutige IDs bei, damit gleichnamige Zweige keine Zustände teilen. */
  private _uniqueElementsById(): Map<string, TreeViewElement> {
    const unique = new Map<string, TreeViewElement>();
    const ambiguous = new Set<string>();
    for (const element of this._data ? this._modelNodes() : this._ownItems()) {
      const id = element.id;
      if (!id || ambiguous.has(id)) continue;
      if (unique.has(id)) {
        unique.delete(id);
        ambiguous.add(id);
      } else {
        unique.set(id, element);
      }
    }
    return unique;
  }

  /** Übernimmt ab dem ersten Aufruf das gesamte Light DOM für die Datenansicht. */
  public setData(data: TreeModel): void {
    if (!(data instanceof TreeModel)) {
      throw new TypeError('setData erwartet ein TreeModel.');
    }
    for (const [id, expanded] of Object.entries(this.expandedState)) {
      this._rememberedExpansion.set(id, expanded);
    }
    this._unsubscribe?.();
    if (!this._data) this.replaceChildren();
    this._data = data;
    for (const [id, element] of this._uniqueElementsById()) {
      const node = element as TreeNode;
      const expanded = this._rememberedExpansion.get(id);
      if (node.children?.length && expanded !== undefined && Boolean(node.data?.expanded) !== expanded) {
        (node.data ??= {}).expanded = expanded;
      }
    }
    this._subscribeToData();
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
      attributeFilter: ['expanded', 'hidden', 'selected'],
    });
    this._updateRows();
    if (this._data) this.requestUpdate();
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
    this._unsubscribe = this.isConnected ? this._data?.subscribe(() => this.requestUpdate()) : undefined;
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

  /** Benutzeraktionen wählen dieselbe Referenz wie der value-Setter aus. */
  private _selectItem(event: CustomEvent<NteTreeViewItem>): void {
    const selected = event.detail;
    if (selected.closest('nte-treeview') !== this) return;
    event.stopPropagation();
    const element = this._data ? selected._modelNode : selected;
    // Ein Label-Handler darf seinen Knoten bereits vor der anschließenden Auswahl entfernen.
    if (!element || (this._data && !this._modelNodes().includes(element as TreeNode))) return;
    this._setSelection(element);
  }

  /** Eigene Modell- und DOM-Zustände werden synchron gesetzt, bevor Anwendungshandler sie abfragen. */
  private _setSelection(element: TreeViewElement | null): void {
    const resolved = element === null ? { node: null, item: null } : this._resolveElement(element);
    const items = this._ownItems();
    const nodes = this._modelNodes();
    const changed = this._data
      ? nodes.some((node) => Boolean(node.data?.selected) !== (node === resolved.node))
      : items.some((item) => item.selected !== (item === resolved.item));

    // Die DOM-Properties folgen sofort; das ist auch für einen unmittelbar folgenden Link-Klick nötig.
    for (const item of items) {
      item.selected = element !== null && (this._data ? item._modelNode === resolved.node : item === resolved.item);
    }
    for (const node of nodes) {
      if (node === resolved.node) (node.data ??= {}).selected = true;
      else if (node.data?.selected) node.data.selected = false;
    }
    if (this._data) this.requestUpdate();
    if (!changed) return;

    this.dispatchEvent(new CustomEvent<TreeViewElement | null>('selection-change', {
      detail: element, bubbles: true, composed: true,
    }));
  }

  /** Fremde, entfernte und nur anhand einer ID ähnliche Referenzen verändern keine bestehende Auswahl. */
  private _resolveElement(element: TreeViewElement): { node: TreeNode | null; item: NteTreeViewItem | null } {
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

  /** Liest die Datenreihenfolge über echte Knotenreferenzen, auch ohne IDs. */
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
    if (!this._data) return;
    const visible = this.filter ? this._filteredNodes(this._data.children, this.filter) : undefined;
    render(this._renderItems(this._data.children, visible), this);
  }

  /** Erfasst Treffer von unten nach oben; der Wert markiert Pfade, die geöffnet werden müssen. */
  private _filteredNodes(items: TreeNode[], filter: TreeViewFilter): Map<TreeNode, boolean> {
    const visible = new Map<TreeNode, boolean>();
    const visit = (item: TreeNode): boolean => {
      let hasVisibleChild = false;
      for (const child of item.children ?? []) {
        if (child && visit(child)) hasVisibleChild = true;
      }
      const matches = filter(item) || hasVisibleChild;
      if (matches) visible.set(item, hasVisibleChild);
      return matches;
    };
    for (const item of items) {
      if (item) visit(item);
    }
    return visible;
  }

  /** Behält vorhandene Geschwister anhand ihrer IDs oder ihrer Objektidentität. */
  private _renderItems(items: TreeNode[], visible?: Map<TreeNode, boolean>, nested = false): TemplateResult {
    return html`${repeat(
      items,
      (item) => item.id ?? item,
      (item) => html`
        <nte-treeview-item
          data-tree-id=${ifDefined(item.id)}
          ._modelNode=${item}
          slot=${ifDefined(nested ? 'children' : undefined)}
          .href=${item.src ?? item.data?.href ?? ''}
          .target=${item.data?.target ?? ''}
          .rel=${item.data?.rel ?? ''}
          .current=${item.data?.current ?? ''}
          ?hidden=${visible !== undefined && !visible.has(item)}
          .expanded=${live(visible?.get(item) || Boolean(item.data?.expanded))}
          .selected=${item.data?.selected ?? false}
          @expanded-change=${(event: CustomEvent<boolean>) => {
            // Erzwingt offene Trefferpfade nur für die Ansicht, ohne den Modellzustand zu ändern.
            if (visible?.get(item)) {
              this.requestUpdate();
              return;
            }
            (item.data ??= {}).expanded = event.detail;
          }}
          >${this.renderer ? this.renderer(item) : item.label}
          ${this._renderItems(item.children ?? [], visible, true)}</nte-treeview-item
        >
      `,
    )}`;
  }

  /** Der Shadow-Renderer bleibt parallel zum ausdrücklich aktivierten Light-DOM-Renderer aktiv. */
  protected override render() {
    super.render();
    return html`<div part="list" role="list" aria-label=${ifDefined(this.ariaLabel || undefined)}
      @selection-request=${(event: CustomEvent<NteTreeViewItem>) => this._selectItem(event)}><slot></slot></div>`;
  }
}

// Ergänzt die nativen Listener-Typen nur für diese Komponente; zur Laufzeit bleibt addEventListener unverändert.
export interface NteTreeView {
  addEventListener<K extends keyof TreeViewEventMap>(
    type: K, listener: (this: NteTreeView, event: TreeViewEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener<K extends keyof HTMLElementEventMap>(
    type: K, listener: (this: HTMLElement, event: HTMLElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: string, listener: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'nte-treeview': NteTreeView;
  }
}
