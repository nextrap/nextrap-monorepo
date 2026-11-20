import { defineDemo } from '@trunkjs/demo-viewer';
import { html, render } from 'lit';

import '../index';
import './main.scss';

// Der sichtbare Quelltext zeigt dieselben Listener wie die beiden ausführbaren Einträge.
const clickSource = `<nte-treeview-item
  @label-click=\${() => window.alert('Einfacher Klick: Notizen.md')}>
  Notizen.md
</nte-treeview-item>`;

// Tastaturaktivierung hat Klickzahl null und löst dieselbe Aktion wie ein Doppelklick aus.
const doubleClickSource = `<nte-treeview-item
  @label-click=\${(event: CustomEvent<{ originalEvent: MouseEvent }>) => {
    if (event.detail.originalEvent.detail === 0) {
      window.alert('Tastatur: Handbuch.pdf');
    }
  }}
  @label-dblclick=\${() => window.alert('Doppelklick: Handbuch.pdf')}>
  Handbuch.pdf
</nte-treeview-item>`;

// Getrennte Einträge verhindern, dass ein Alert des ersten Mausklicks einen Doppelklick unterbricht.
export default defineDemo({
  title: 'TreeView: Klick- und Doppelklick-Aktionen',
  description: 'Eigene Dateiaktionen über Label-Events, einschließlich Tastaturbedienung',
  render(root) {
    render(
      html`<main>
        <h1>Eigene Dateiaktionen</h1>
        <p>
          Ein Klick auf „Notizen.md“ zeigt einen Alert. „Handbuch.pdf“ reagiert auf einen Doppelklick;
          mit der Tastatur zeigen Enter oder die Leertaste ebenfalls die ausgelöste Aktion. Name und Icon gehören zur Aktion.
        </p>
        <nte-treeview aria-label="Beispiele für Dateiaktionen">
          <nte-treeview-item @label-click=${() => window.alert('Einfacher Klick: Notizen.md')}>
            <svg slot="icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2"
              aria-hidden="true" focusable="false">
              <path d="M3 1.5h6l4 4v9H3z M9 1.5v4h4 M5 8h6 M5 10.5h6" />
            </svg>
            Notizen.md
            <span slot="end">Einfacher Klick</span>
          </nte-treeview-item>
          <nte-treeview-item
            @label-click=${(event: CustomEvent<{ originalEvent: MouseEvent }>) => {
              if (event.detail.originalEvent.detail === 0) {
                window.alert('Tastatur: Handbuch.pdf');
              }
            }}
            @label-dblclick=${() => window.alert('Doppelklick: Handbuch.pdf')}
          >
            <svg slot="icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2"
              aria-hidden="true" focusable="false">
              <path d="M3 1.5h6l4 4v9H3z M9 1.5v4h4 M5 8h6 M5 10.5h4" />
            </svg>
            Handbuch.pdf
            <span slot="end">Doppelklick</span>
          </nte-treeview-item>
        </nte-treeview>
        <h2>Einfacher Klick</h2>
        <pre><code>${clickSource}</code></pre>
        <h2>Doppelklick und Tastatur</h2>
        <pre><code>${doubleClickSource}</code></pre>
        <p>
          Die Events liefern <code>detail.item</code> und <code>detail.originalEvent</code>. Mit
          <code>event.preventDefault()</code> im <code>label-click</code>-Listener lässt sich die Navigation
          oder das automatische Aufklappen eines Ordners übernehmen; die Auswahl des Eintrags bleibt erhalten.
        </p>
      </main>`,
      root,
    );
  },
});
