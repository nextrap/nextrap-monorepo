import { defineDemo } from '@trunkjs/demo-viewer';
import { html, render } from 'lit';

import { TreeModel } from '../index';
import './main.scss';

// Derselbe Baum zeigt die rahmenlose Baseline und die optionale Zebra-Klasse im direkten Wechsel.
export default defineDemo({
  title: 'TreeView: optionale Zebra-Streifen',
  description: 'Volle Zeilenbreite, verschachtelte Ordner und Zebra über die Klasse with-zebra',
  render(root) {
    render(
      html`<main class="treeview-zebra-demo">
        <h1>Optionale Zebra-Streifen</h1>
        <p>
          Öffne und schließe Ordner über ihren Namen oder den Pfeil. Die Streifen wechseln über alle sichtbaren
          Ebenen hinweg; Hover und Auswahl reichen immer über die gesamte Breite.
        </p>
        <p>
          <label>
            <input type="checkbox" checked @change=${(event: Event) => {
              root.querySelector('nte-treeview')!.classList.toggle(
                'with-zebra', (event.target as HTMLInputElement).checked,
              );
            }}>
            Zebra-Streifen anzeigen
          </label>
        </p>
        <!-- Die Zusatzspalten bleiben ausgerichtet, ohne Trenner zwischen den Einträgen. -->
        <div class="treeview-columns" aria-hidden="true">
          <span>Name</span><span>Typ</span><span>Größe</span>
        </div>
        <nte-treeview class="with-zebra" aria-label="Projektdateien mit optionalen Zebra-Streifen"></nte-treeview>
        <p>
          <code>class="with-zebra"</code> aktiviert die Streifen. Ohne diese Klasse bleibt die Fläche einfarbig;
          Auswahl und Hover funktionieren in beiden Varianten. Größen und freie Zeilenflächen lösen keine Aktion aus.
        </p>
      </main>`,
      root,
    );

    // Mehrere geöffnete Ebenen und ein geschlossener Zweig machen die sichtbare Reihenfolge nachvollziehbar.
    const tree = new TreeModel([
      {
        id: 'project', label: 'Website', data: { expanded: true },
        children: [
          {
            id: 'src', label: 'src', data: { expanded: true },
            children: [
              {
                id: 'components', label: 'components', data: { expanded: true },
                children: [
                  { id: 'button', label: 'Button.ts', data: { selected: true, type: 'TypeScript', size: '4 KB' } },
                  { id: 'treeview', label: 'TreeView.ts', data: { type: 'TypeScript', size: '8 KB' } },
                ],
              },
              { id: 'index', label: 'index.ts', data: { type: 'TypeScript', size: '2 KB' } },
            ],
          },
          {
            id: 'styles', label: 'styles',
            children: [
              { id: 'theme', label: 'theme.scss', data: { type: 'Sass', size: '3 KB' } },
            ],
          },
          { id: 'readme', label: 'README.md', data: { type: 'Markdown', size: '1 KB' } },
        ],
      },
      { id: 'package', label: 'package.json', data: { type: 'JSON', size: '2 KB' } },
    ]);

    // Die öffentlichen Renderer ergänzen ausschließlich Zellinhalte; Zebra benötigt keine Datenfelder.
    const view = root.querySelector('nte-treeview')!;
    view.renderCenter = (node) => node.children?.length ? 'Ordner' : node.data?.['type'] ?? '';
    view.renderEnd = (node) => node.data?.['size'] ?? '—';
    view.setData(tree);
  },
});
