import { nextrap_element } from '@nextrap/nt-core';
import { html, render, unsafeCSS, type PropertyValues, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { repeat } from 'lit/directives/repeat.js';

import { NavigationTree, type NavigationTreeElement } from '../../navigation-tree';
import '../nte-nav-item/nte-nav-item';

import style from './nte-nav.scss?inline';

@customElement('nte-nav')
export class NteNav extends nextrap_element() {
  static override styles = [unsafeCSS(style)];

  /** Accessible name forwarded to the internal navigation landmark. */
  @property({ type: String, reflect: true, attribute: 'aria-label' })
  public override accessor ariaLabel = '';

  // Ohne setData bleibt das vom Aufrufer geschriebene Light DOM vollständig erhalten.
  private _data?: NavigationTree;
  private _unsubscribe?: () => void;

  /** Übernimmt ab dem ersten Aufruf das gesamte Light DOM für die Datenansicht. */
  public setData(data: NavigationTree): void {
    if (!(data instanceof NavigationTree)) {
      throw new TypeError('setData erwartet einen NavigationTree.');
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
    if (this._data) this.requestUpdate();
  }

  /** Verhindert, dass ein langlebiges Modell entfernte Navigationen festhält. */
  override disconnectedCallback(): void {
    this._unsubscribe?.();
    this._unsubscribe = undefined;
    super.disconnectedCallback();
  }

  /** Hängt pro verbundener Navigation genau einen Listener an das aktuelle Modell. */
  private _subscribeToData(): void {
    this._unsubscribe?.();
    this._unsubscribe = this.isConnected ? this._data?.subscribe(() => this.requestUpdate()) : undefined;
  }

  /** Rendert zusätzlich zum Shadow DOM nur im ausdrücklich aktivierten Datenbetrieb. */
  protected override updated(changed: PropertyValues): void {
    super.updated(changed);
    if (this._data) render(this._renderItems(this._data.children), this);
  }

  /** Behält vorhandene Geschwister anhand ihrer IDs und erzeugt echte Light-DOM-Kinder. */
  private _renderItems(items: NavigationTreeElement[], nested = false): TemplateResult {
    return html`${repeat(
      items,
      (item) => item.id,
      (item) => html`
        <nte-nav-item
          data-nav-id=${item.id}
          slot=${ifDefined(nested ? 'submenu' : undefined)}
          .href=${item.href ?? ''}
          .target=${item.target ?? ''}
          .rel=${item.rel ?? ''}
          .current=${item.current ?? ''}
          .expanded=${item.expanded ?? false}
          .submenuPopover=${item.submenuPopover ?? false}
          @expanded-change=${(event: CustomEvent<boolean>) => {
          item.expanded = event.detail;
        }}
          >${item.label}${this._renderItems(item.children ?? [], true)}</nte-nav-item
        >
      `,
    )}`;
  }

  /** Die Navigation selbst bleibt auch im Datenbetrieb eine Shadow-DOM-Komponente. */
  protected override render() {
    super.render();

    return html`
      <nav id="nav" part="nav" aria-label=${ifDefined(this.ariaLabel || undefined)}>
        <div id="list" part="list" role="list">
          <slot @slotchange=${this._onSlotChange}></slot>
        </div>
      </nav>
    `;
  }

  private _onSlotChange(event: Event): void {
    // Datenbetrieb verwendet die ausdrückliche Submenu-Konfiguration jedes Knotens.
    if (this._data) return;
    const slot = event.currentTarget as HTMLSlotElement;
    const items = slot.assignedElements({ flatten: true }).filter((element) => element.matches('nte-nav-item'));
    const isVertical = getComputedStyle(this).getPropertyValue('--nte-nav-flow').trim() === 'column';

    items.forEach((item) => {
      const hasSubmenu = Array.from(item.children).some((child) => child.matches('nte-nav-item'));
      item.toggleAttribute('submenu-popover', hasSubmenu && !isVertical);
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nte-nav': NteNav;
  }
}
