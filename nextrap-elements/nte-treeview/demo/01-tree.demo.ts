import { defineDemo } from '@trunkjs/demo-viewer';
import { html, nothing, render } from 'lit';
import { TreeModel } from '../index';
import './main.scss';

// Der Ablauf zeigt CMS-Seiten, Dateien, unabhängige Disclosure und ausgerichtete Zusatz-Zellen.
export default defineDemo({
  title: 'TreeView: Seiten, Dateien und Zusatzspalten',
  description: 'Reaktiver Baum mit Elternlinks, Dateigrößen und Status-Dropdowns',
  render(root) {
    render(
      html`<main>
        <h1>Inhalte und Dateien</h1>
        <p>
          Der Seitenname öffnet die Seite. Ausschließlich der Pfeil klappt den Unterbaum auf. Das Dropdown ändert nur
          den Status.
        </p>
        <nte-treeview aria-label="Inhalte und Dateien"></nte-treeview>
        <p>
          <button data-action="rename">Handbuch umbenennen</button>
          <button data-action="add">Datei hinzufügen</button>
          <button data-action="remove">Letzte Datei entfernen</button>
          <button data-action="toggle">Unterbaum umschalten</button>
        </p>
      </main>`,
      root,
    );

    // Ein CMS-Elternknoten ist selbst navigierbar; ein Verzeichnis braucht keinen Link.
    const tree = new TreeModel([
      {
        id: 'handbook',
        label: 'Handbuch',
        data: { href: '#handbuch', expanded: true, size: '12 KB', status: 'Entwurf' },
        children: [
          { id: 'start', label: 'Einstieg', data: { href: '#einstieg', size: '4 KB', status: 'Veröffentlicht' } },
          {
            id: 'api',
            label: 'API',
            data: { href: '#api', expanded: true, size: '8 KB', status: 'Entwurf' },
            children: [
              { id: 'methods', label: 'Methoden', data: { href: '#methoden', size: '2 KB', status: 'Entwurf' } },
            ],
          },
        ],
      },
      {
        id: 'files',
        label: 'Dateien',
        data: { expanded: true },
        children: [{ id: 'notes', label: 'Notizen.md', data: { href: '#notizen', size: '1 KB' } }],
      },
    ]);
    const view = root.querySelector('nte-treeview')!;
    view.renderCenter = (node) => node.data?.['size'] ?? '';
    view.renderEnd = (node) =>
      node.data?.['status'] == null
        ? nothing
        : html` <select
            aria-label=${`Status für ${node.label}`}
            .value=${String(node.data['status'])}
            @change=${(event: Event) => {
          node.data!['status'] = (event.target as HTMLSelectElement).value;
        }}
          >
            <option>Entwurf</option>
            <option>Veröffentlicht</option>
          </select>`;
    view.setData(tree);

    // Alle Aktionen ändern ausschließlich das Modell, einschließlich des Aufklappzustands.
    root.querySelector('[data-action="rename"]')!.addEventListener('click', () => {
      tree.children[0].label = 'Entwicklerhandbuch';
    });
    let nextId = 1;
    root.querySelector('[data-action="add"]')!.addEventListener('click', () => {
      const id = nextId++;
      tree.children[1].children!.push({
        id: `file-${id}`,
        label: `Datei-${id}.md`,
        data: { href: `#datei-${id}`, size: '3 KB' },
      });
      tree.children[1].data!.expanded = true;
    });
    root.querySelector('[data-action="remove"]')!.addEventListener('click', () => {
      tree.children[1].children!.pop();
    });
    root.querySelector('[data-action="toggle"]')!.addEventListener('click', () => {
      tree.children[0].data!.expanded = !tree.children[0].data!.expanded;
    });
  },
});
