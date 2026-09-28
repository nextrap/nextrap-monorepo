import { nextrap_element } from '@nextrap/nt-core';
import { css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

/** Entspricht den nativen aria-current-Werten für verlinkte Knoten. */
export type TreeItemCurrent = 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | '';

/** Ein Baumknoten trennt Unterbaum, Link und zusätzliche Zellen; Beispiele: ../../examples/README.md. */
@customElement('nte-treeview-item')
export class NteTreeViewItem extends nextrap_element() {
  // Nur funktionales Layout; alle visuellen Defaults kommen aus dem öffentlichen Sass-Mixin.
  static override styles = css`
    :host {
      display: block;
      min-inline-size: 0;
    }
    /* Alle Ebenen behalten dieselbe rechte Kante und gemeinsam vorgegebene Zellbreiten. */
    #row {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) var(--nte-treeview-center-width, auto) var(
          --nte-treeview-end-width,
          auto
        );
      align-items: center;
      min-inline-size: 0;
    }
    #details {
      display: contents;
    }
    #toggle {
      grid-column: 1;
      grid-row: 1;
      list-style: none;
      cursor: pointer;
    }
    #toggle::-webkit-details-marker {
      display: none;
    }
    #label {
      grid-column: 2;
      grid-row: 1;
      min-inline-size: 0;
      overflow-wrap: anywhere;
    }
    #center {
      grid-column: 3;
      grid-row: 1;
      min-inline-size: 0;
      text-align: center;
    }
    #end {
      grid-column: 4;
      grid-row: 1;
      min-inline-size: 0;
      text-align: end;
    }
    #children {
      grid-column: 1 / -1;
      grid-row: 2;
      min-inline-size: 0;
    }
    /* Explizites Ausblenden erhält native Disclosure auch bei display: contents am details. */
    #details:not([open]) > #children {
      display: none;
    }
    #indicator {
      display: block;
      inline-size: 1em;
      block-size: 1em;
      transform: rotate(-90deg);
    }
    #details[open] #indicator {
      transform: none;
    }
  `;

  // Link und Unterbaum sind voneinander unabhängig konfigurierbar.
  @property({ reflect: true }) public accessor href = '';
  @property({ reflect: true }) public accessor target = '';
  @property({ reflect: true }) public accessor rel = '';
  @property({ reflect: true }) public accessor current: TreeItemCurrent = '';
  @property({ type: Boolean, reflect: true }) public accessor expanded = false;
  @property({ attribute: 'toggle-label' }) public accessor toggleLabel = 'Unterbaum';
  @state() private accessor _hasChildren = false;
  @state() private accessor _labelText = '';

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

  /** Native Disclosure schreibt nur den Aufklappzustand zurück, niemals Navigation oder Zellaktionen. */
  private _onToggle(event: Event): void {
    const open = (event.currentTarget as HTMLDetailsElement).open;
    if (this.expanded === open) return;
    this.expanded = open;
    this.dispatchEvent(new CustomEvent<boolean>('expanded-change', { detail: open }));
  }

  /** Link, Pfeil und Zellen sind Geschwister: Ein Dropdown-Klick kann den Unterbaum nicht umschalten. */
  protected override render() {
    super.render();
    const label = html`<slot name="icon"></slot><slot @slotchange=${this._onLabelChange}></slot>`;
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
          : html`<span part="spacer" aria-hidden="true"></span>`
      }
      ${
        this.href
          ? html`<a
              id="label"
              part="label link"
              href=${this.href}
              target=${ifDefined(this.target || undefined)}
              rel=${ifDefined(this.rel || undefined)}
              aria-current=${ifDefined(this.current || undefined)}
              >${label}</a
            >`
          : html`<span id="label" part="label text">${label}</span>`
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
