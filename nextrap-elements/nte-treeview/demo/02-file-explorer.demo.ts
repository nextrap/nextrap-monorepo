import { defineDemo } from '@trunkjs/demo-viewer';
import { html, render } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import '../index';
import markup from './02-file-explorer.demo.html?raw';
import styles from './main.scss?inline';

// Der Dateibaum zeigt automatische Ordnersymbole und optionale Dateisymbole im vorhandenen Icon-Slot.
export default defineDemo({
  title: 'TreeView: Datei-Explorer direkt in HTML',
  description: 'Ordner öffnen, Dateien auswählen und Details über alle Ebenen ausrichten',
  render(root) {
    render(html`<style>${styles}</style>${unsafeHTML(markup)}`, root);
  },
});
