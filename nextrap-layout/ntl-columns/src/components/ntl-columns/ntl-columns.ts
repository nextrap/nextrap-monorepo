import { nextrap_element } from '@nextrap/nt-core';
import { resetStyle } from '@nextrap/style-reset';
import { html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import style from './ntl-columns.scss?inline';

// Ordnet Content Pane-Inhalte drei unabhängig formatierbaren Regionen zu.
@customElement('ntl-columns')
export class NtlColumns extends nextrap_element({
  subLayoutApply: true,
  slotVisibility: true,
}) {
  static override styles = [unsafeCSS(resetStyle), unsafeCSS(style)];

  // Reagiert auch auf responsive Klassen und Inline-Styles belegter Slots.
  private readonly contentObserver = new MutationObserver(() => this.syncColumns());

  override connectedCallback(): void {
    super.connectedCallback();
    this.contentObserver.observe(this, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['class', 'style', 'slot'],
    });
    this.syncColumns();
  }

  // Beendet die Beobachtung nicht mehr verbundener Layouts.
  override disconnectedCallback(): void {
    this.contentObserver.disconnect();
    super.disconnectedCallback();
  }

  // Content Pane muss seine untergeordneten Layouts zuerst aufgebaut haben.
  override firstUpdated(changedProperties: Map<string, unknown>): void {
    super.firstUpdated(changedProperties);
    this.syncColumns();
  }

  // Explizite Slots haben Vorrang; direkte Aside-Inhalte landen sonst in End.
  private syncColumns(): void {
    for (const child of Array.from(this.children)) {
      if (child.classList.contains('aside') && !child.hasAttribute('slot')) {
        child.setAttribute('slot', 'end');
      }
    }

    // Text zählt als Inhalt; .d-none dagegen nicht. Der erste sichtbare
    // Inhalt mit gültigem Gewicht bestimmt die Breite der Region.
    for (const slot of Array.from(this.shadowRoot?.querySelectorAll('slot') ?? [])) {
      const visibleNodes = slot.assignedNodes({ flatten: true }).filter((node) =>
        node instanceof Element
          ? !node.classList.contains('d-none')
          : node.nodeType === Node.TEXT_NODE && Boolean(node.textContent?.trim()),
      );
      slot.toggleAttribute('data-no-visible-content', visibleNodes.length === 0);

      let weight: number | undefined;
      for (const node of visibleNodes) {
        if (!(node instanceof Element)) continue;
        const value = Number(getComputedStyle(node).getPropertyValue('--grid-cols').trim());
        if (Number.isFinite(value) && value > 0) {
          weight = value;
          break;
        }
      }

      // CSS verteilt den Platz und verwendet andernfalls das Standardgewicht.
      if (weight !== undefined) {
        slot.parentElement?.style.setProperty('--_ntl-columns-weight', String(weight));
      } else {
        slot.parentElement?.style.removeProperty('--_ntl-columns-weight');
      }
    }
  }

  // Die DOM-Reihenfolge entspricht Mobile und Desktop ohne Reverse.
  protected override render(): unknown {
    return html`
      ${super.render()}
      <div part="wrapper" id="wrapper">
        <div part="start" class="column">
          <slot name="start" @slotchange=${this.syncColumns}></slot>
        </div>
        <div part="center" class="column" id="center">
          <slot @slotchange=${this.syncColumns}></slot>
        </div>
        <div part="end" class="column">
          <slot name="end" @slotchange=${this.syncColumns}></slot>
        </div>
      </div>
    `;
  }
}
