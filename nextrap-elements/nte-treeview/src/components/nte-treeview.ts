import { nextrap_element } from '@nextrap/nt-core';
import { css, html, render, type PropertyValues, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { repeat } from 'lit/directives/repeat.js';

import { TreeModel, type TreeNode } from '../tree-model';
import type { NteTreeViewItem } from './nte-treeview-item';
import './nte-treeview-item';

/** Rendert zusätzliche Zellinhalte; siehe examples/README.md. */
export type TreeCellRenderer = (node: TreeNode) => unknown;

/** Eigenständiger Baum mit deklarativen Knoten oder reaktivem TreeModel. */
@customElement('nte-treeview')
export class NteTreeView extends nextrap_element() {
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

  // Ohne setData bleibt das vom Aufrufer geschriebene Light DOM vollständig erhalten.
  private _data?: TreeModel;
  private _unsubscribe?: () => void;

  // Deklarative und modellgesteuerte Bäume teilen dieselbe sichtbare Zeilenfolge.
  private readonly _rowsObserver = new MutationObserver(() => this._updateRows());

  /** Übernimmt ab dem ersten Aufruf das gesamte Light DOM für die Datenansicht. */
  public setData(data: TreeModel): void {
    if (!(data instanceof TreeModel)) {
      throw new TypeError('setData erwartet ein TreeModel.');
    }
    this._unsubscribe?.();
    if (!this._data) this.replaceChildren();
    this._data = data;
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
      attributeFilter: ['expanded', 'hidden'],
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

  /** Hält eine einzelne Auswahl im eigenen Baum; Modellknoten werden über ihre Identität zugeordnet. */
  private _selectItem(event: CustomEvent<NteTreeViewItem>, node?: TreeNode): void {
    const selected = event.detail;
    if (selected.closest('nte-treeview') !== this) return;
    event.stopPropagation();
    const items = Array.from(this.querySelectorAll('nte-treeview-item'))
      .filter((item) => item.closest('nte-treeview') === this);
    const changed = items.some((item) => item.selected !== (item === selected));
    items.forEach((item) => { item.selected = item === selected; });
    if (node && this._data) this._selectModelNode(this._data.children, node);
    if (changed) {
      this.dispatchEvent(new CustomEvent<NteTreeViewItem>('selection-change', {
        detail: selected,
        bubbles: true,
        composed: true,
      }));
    }
  }

  /** Löscht auch versteckte Auswahlen; IDs dürfen in unterschiedlichen Zweigen gleich sein. */
  private _selectModelNode(nodes: TreeNode[], selected: TreeNode): void {
    for (const node of nodes) {
      if (node === selected) (node.data ??= {}).selected = true;
      else if (node.data?.selected) node.data.selected = false;
      if (node.children) this._selectModelNode(node.children, selected);
    }
  }

  /** Rendert zusätzlich zum Shadow DOM nur im ausdrücklich aktivierten Datenbetrieb. */
  protected override updated(changed: PropertyValues): void {
    super.updated(changed);
    if (this._data) render(this._renderItems(this._data.children), this);
  }

  /** Behält vorhandene Geschwister anhand ihrer IDs und erzeugt echte Light-DOM-Kinder. */
  private _renderItems(items: TreeNode[], nested = false): TemplateResult {
    return html`${repeat(
      items,
      (item) => item.id,
      (item) => html`
        <nte-treeview-item
          data-tree-id=${item.id}
          slot=${ifDefined(nested ? 'children' : undefined)}
          .href=${item.data?.href ?? ''}
          .target=${item.data?.target ?? ''}
          .rel=${item.data?.rel ?? ''}
          .current=${item.data?.current ?? ''}
          .expanded=${item.data?.expanded ?? false}
          .selected=${item.data?.selected ?? false}
          @selection-request=${(event: CustomEvent<NteTreeViewItem>) => this._selectItem(event, item)}
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
    return html`<div part="list" role="list" aria-label=${ifDefined(this.ariaLabel || undefined)}
      @selection-request=${(event: CustomEvent<NteTreeViewItem>) => this._selectItem(event)}><slot></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nte-treeview': NteTreeView;
  }
}
