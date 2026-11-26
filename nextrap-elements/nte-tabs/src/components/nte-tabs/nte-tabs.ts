import { nextrap_element } from '@nextrap/nt-core';
import { html, unsafeCSS, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { NteTab } from '../nte-tab/nte-tab';
import styles from './nte-tabs.scss?inline';

/** Bestimmt die Präsentation bei Platzmangel. */
export type TabsOverflow = 'auto' | 'dropdown' | 'scroll';

/** Tabs mit dauerhaft eingebundenen Panels und intrinsischer Overflow-Messung. */
@customElement('nte-tabs')
export class NteTabs extends nextrap_element({ subLayoutApply: true }) {
  static override styles = unsafeCSS(styles);

  /** Aktiver Name; nur Benutzerwechsel lösen change aus. */
  @property({ type: String, reflect: true }) accessor value = '';

  /** Auto entscheidet anhand der verfügbaren Containerbreite. */
  @property({ type: String, reflect: true }) accessor overflow: TabsOverflow = 'auto';

  /** Zugänglicher Name der Navigation. */
  @property({ type: String, reflect: true, attribute: 'aria-label' })
  override accessor ariaLabel = '';

  @state() private accessor tabs: NteTab[] = [];
  @state() private accessor hasOverflow = false;

  // IDs bleiben bei einer Umordnung stabil; Panel-Inhalte werden nie kopiert.
  private readonly ids = new WeakMap<NteTab, number>();
  private nextId = 0;
  private resizeObserver?: ResizeObserver;
  private restoreFocus = false;
  private readonly mutationObserver = new MutationObserver(records => {
    if (records.some(record => record.target === this || record.target.parentNode === this)) {
      this.syncTabs();
    }
  });

  /** Nur direkte Panels mit einem eindeutigen Namen werden verwaltet. */
  private syncTabs(): void {
    const names = new Set<string>();
    this.tabs = Array.from(this.children).filter((element): element is NteTab => {
      if (!(element instanceof NteTab) || !element.name || names.has(element.name)) return false;
      names.add(element.name);
      if (!this.ids.has(element)) this.ids.set(element, ++this.nextId);
      element.slot = this.panelId(element);
      return true;
    });
  }

  /** Panel- und Button-IDs sind unabhängig von frei vergebenen Namen. */
  private panelId(tab: NteTab): string { return 'panel-' + this.ids.get(tab); }

  /** Kompakte Darstellung hängt nicht von Fenster-Breakpoints ab. */
  private get compact(): boolean {
    return this.overflow === 'dropdown' || (this.overflow === 'auto' && this.hasOverflow);
  }

  /** Metadaten und direkte Kinder können sich während der Nutzung ändern. */
  override connectedCallback(): void {
    super.connectedCallback();
    this.syncTabs();
    this.mutationObserver.observe(this, {
      childList: true, subtree: true, attributes: true,
      attributeFilter: ['name', 'label', 'count', 'disabled'],
    });
    if (this.hasUpdated) this.observeSize();
  }

  /** Observer werden bei Entfernung freigegeben. */
  override disconnectedCallback(): void {
    this.mutationObserver.disconnect();
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    super.disconnectedCallback();
  }

  /** Die vollständige Leiste bleibt auch im kompakten Modus messbar. */
  private observeSize(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = new ResizeObserver(() => this.measure());
    this.resizeObserver.observe(this.renderRoot.querySelector('#bar')!);
    this.resizeObserver.observe(this.renderRoot.querySelector('#strip')!);
    this.measure();
  }

  /** Verdeckte Tabs behalten ihre intrinsische Breite einschließlich Header-Slots. */
  private measure(): void {
    const bar = this.renderRoot.querySelector<HTMLElement>('#bar');
    const strip = this.renderRoot.querySelector<HTMLElement>('#strip');
    if (!bar || !strip || !bar.clientWidth) return;
    const overflow = strip.getBoundingClientRect().width > bar.clientWidth + 0.5;
    if (overflow !== this.hasOverflow) this.hasOverflow = overflow;
  }

  /** Ungültige Auswahlen fallen auf den ersten aktivierbaren Tab zurück. */
  protected override willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    if (this.tabs.length && !this.tabs.some(tab => tab.name === this.value && !tab.disabled)) {
      this.value = this.tabs.find(tab => !tab.disabled)?.name ?? '';
    }
    if (changed.has('overflow') || changed.has('hasOverflow')) {
      const focused = this.shadowRoot?.activeElement;
      this.restoreFocus = focused instanceof HTMLElement &&
        (focused.matches('[role="tab"]') || focused.id === 'picker');
    }
  }

  /** Nach dynamischen Änderungen werden Auswahl, Messung und Fokus synchronisiert. */
  protected override updated(changed: PropertyValues): void {
    super.updated(changed);
    if (!this.resizeObserver && this.isConnected) this.observeSize();
    const picker = this.renderRoot.querySelector<HTMLSelectElement>('#picker');
    if (picker) picker.value = this.value;
    this.measure();
    if (this.restoreFocus) {
      this.restoreFocus = false;
      this.focusActive();
    }
  }

  /** Ein Benutzerwechsel meldet ausschließlich den neuen Namen. */
  private select(tab: NteTab): void {
    if (tab.disabled || this.value === tab.name) return;
    this.value = tab.name;
    this.dispatchEvent(new CustomEvent<string>('change', {
      detail: tab.name, bubbles: true, composed: true,
    }));
  }

  /** Beim Wechsel des Präsentationsmodus bleibt der Fokus in der Navigation. */
  private focusActive(): void {
    const target = this.compact
      ? this.renderRoot.querySelector<HTMLElement>('#picker')
      : this.renderRoot.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
    target?.focus();
  }

  /** Pfeiltasten, Home und End navigieren ausschließlich aktivierbare Tabs. */
  private onKeyDown(event: KeyboardEvent, tab: NteTab): void {
    const enabled = this.tabs.filter(item => !item.disabled);
    const index = enabled.indexOf(tab);
    let next: NteTab | undefined;
    switch (event.key) {
      case 'ArrowRight': next = enabled[(index + 1) % enabled.length]; break;
      case 'ArrowLeft': next = enabled[(index - 1 + enabled.length) % enabled.length]; break;
      case 'Home': next = enabled[0]; break;
      case 'End': next = enabled[enabled.length - 1]; break;
      default: return;
    }
    event.preventDefault();
    if (!next) return;
    this.select(next);
    void this.updateComplete.then(() => this.focusActive());
  }

  /** Das native Select bietet auch in überlaufenden Sidebars eine sichere Auswahl. */
  private onDropdown(event: Event): void {
    event.stopPropagation();
    const name = (event.currentTarget as HTMLSelectElement).value;
    const tab = this.tabs.find(item => item.name === name);
    if (tab) this.select(tab);
  }

  /** Das Dropdown nutzt eine Textalternative auch für individuelle Header. */
  private optionLabel(tab: NteTab): string {
    return tab.count === null ? tab.label : tab.label + ' (' + tab.count + ')';
  }

  /** Derselbe Header-Slot bleibt in beiden Modi erhalten; nur die Sichtbarkeit wechselt. */
  protected override render() {
    super.render();
    const compact = this.compact;
    const label = this.ariaLabel || 'Tabs';
    return html`
      <div id="bar" part="bar" class=${compact ? 'compact' : this.overflow === 'scroll' ? 'scroll' : ''}>
        <div id="viewport">
          <div id="strip" part="tablist" role="tablist" aria-label=${label}>
            ${repeat(this.tabs, tab => tab, tab => {
              const active = tab.name === this.value && !tab.disabled;
              return html`
                <button type="button" role="tab" part=${active ? 'tab active-tab' : 'tab'}
                  id=${'tab-' + this.ids.get(tab)} aria-controls=${this.panelId(tab)}
                  aria-selected=${active ? 'true' : 'false'}
                  aria-hidden=${compact && !active ? 'true' : 'false'}
                  aria-label=${this.optionLabel(tab)}
                  tabindex=${active ? 0 : -1}
                  ?disabled=${tab.disabled} @click=${() => this.select(tab)}
                  @keydown=${(event: KeyboardEvent) => this.onKeyDown(event, tab)}>
                  <span part="label"><slot name=${'tab-' + tab.name}>${tab.label}</slot></span>
                  ${tab.count === null ? '' : html`<span part="count">${tab.count}</span>`}
                </button>
              `;
            })}
          </div>
        </div>
        ${compact ? html`
          <div id="dropdown" part="dropdown">
            <span aria-hidden="true">▾</span>
            <select id="picker" aria-label=${label}
              ?disabled=${!this.tabs.some(tab => !tab.disabled)} @change=${this.onDropdown}>
              ${repeat(this.tabs, tab => tab, tab => html`
                <option value=${tab.name} ?disabled=${tab.disabled}>${this.optionLabel(tab)}</option>
              `)}
            </select>
          </div>
        ` : ''}
      </div>
      ${repeat(this.tabs, tab => tab, tab => html`
        <div part="panel" class="panel" role="tabpanel" id=${this.panelId(tab)}
          aria-labelledby=${'tab-' + this.ids.get(tab)}
          ?hidden=${tab.name !== this.value || tab.disabled} tabindex="0">
          <slot name=${this.panelId(tab)}></slot>
        </div>
      `)}
      <slot NO-DEFAULT-SLOT></slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'nte-tabs': NteTabs; }
}
