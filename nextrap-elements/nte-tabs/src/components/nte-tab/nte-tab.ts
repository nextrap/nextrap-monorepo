import { nextrap_element } from '@nextrap/nt-core';
import { html, unsafeCSS } from 'lit';
import styles from './nte-tab.scss?inline';
import { customElement } from 'lit/decorators.js';

/** Panel-Metadaten werden als Attribute gespeichert und vom Eltern-Element beobachtet. */
@customElement('nte-tab')
export class NteTab extends nextrap_element({ subLayoutApply: true, setDefaultStyle: false }) {
  static override styles = unsafeCSS(styles);

  /** Eindeutiger Name innerhalb der Tab-Leiste. */
  get name(): string { return this.getAttribute('name') ?? ''; }
  set name(value: string) { this.setAttribute('name', value); }

  /** Standardbeschriftung und Textalternative für den Dropdown. */
  get label(): string { return this.getAttribute('label') ?? this.name; }
  set label(value: string) { this.setAttribute('label', value); }

  /** Null entfernt den Counter; auch null Änderungen (0) bleiben sichtbar. */
  get count(): number | null {
    const raw = this.getAttribute('count');
    if (raw === null || raw.trim() === '') return null;
    const value = Number(raw);
    return Number.isSafeInteger(value) && value >= 0 ? value : null;
  }
  set count(value: number | null) {
    if (value === null) this.removeAttribute('count');
    else this.setAttribute('count', String(value));
  }

  /** Deaktivierte Panels können nicht ausgewählt werden. */
  get disabled(): boolean { return this.hasAttribute('disabled'); }
  set disabled(value: boolean) { this.toggleAttribute('disabled', value); }

  /** Default- und Content-Slot erhalten auch verschachtelte Layouts im Light DOM. */
  protected override render() {
    super.render();
    return html`<div part="content"><slot name="content"></slot><slot></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'nte-tab': NteTab; }
}
