// Die Nextrap-Basis bleibt erhalten; eine visuelle Default-Style-Klasse ist nicht erforderlich.
import { nextrap_element } from '@nextrap/nt-core';
import { html, nothing, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { registerBootstrapIconFont } from '../../lib/bootstrap-icon-font';
import icons from './bootstrap-icons.css?inline';
import style from './nte-icon.scss?inline';

// Host-Klassen wählen das Font-Glyph direkt per CSS; src ist die einzige Komponenten-Property.
@customElement('nte-icon')
export class NteIcon extends nextrap_element({ setDefaultStyle: false }) {
  static override styles = [unsafeCSS(icons), unsafeCSS(style)];
  @property({ reflect: true }) accessor src = '';

  // Die Schrift wird einmal registriert und vom Browser erst bei tatsächlicher Nutzung geladen.
  override connectedCallback(): void {
    super.connectedCallback();
    registerBootstrapIconFont();
  }

  // Bei src übernimmt ein normales Bild die Darstellung; ansonsten genügt das Host-Pseudo-Element.
  override render() {
    return html`
      ${super.render()}
      ${this.src ? html`<img part="image" src=${this.src} alt="">` : nothing}
      <slot NO-DEFAULT-SLOT></slot>
    `;
  }
}

// DOM-Abfragen erhalten den Komponententyp mit seiner src-Property.
declare global {
  interface HTMLElementTagNameMap {
    'nte-icon': NteIcon;
  }
}
