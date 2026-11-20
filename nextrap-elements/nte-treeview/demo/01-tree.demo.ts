import { defineDemo } from '@trunkjs/demo-viewer';
import { html, nothing, render } from 'lit';
import { TreeModel } from '../index';
import './main.scss';

// Der Ablauf zeigt CMS-Seiten, Dateien, unabhängige Disclosure und ausgerichtete Zusatz-Zellen.
export default defineDemo({
  title: 'TreeView: Seiten, Dateien und Zusatzspalten',
  description: 'Reaktiver Baum mit Ordner-Icons, Elternlinks, Dateigrößen und Status-Dropdowns',
  render(root) {
    render(
      html`<main>
        <h1>Inhalte und Dateien</h1>
        <p>
          Bei verlinkten Ordnern wählt der erste Klick nur den Eintrag aus; ein weiterer Klick öffnet die Seite.
          Dateilinks öffnen ihr Ziel direkt. Der Pfeil klappt unabhängig davon den Unterbaum auf. Ordner ohne Link
          öffnen und schließen über ihren Namen oder ihr Icon. Freie Zeilenflächen und Größenangaben lösen keine
          Aktion aus; das Dropdown ändert nur den Status.
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
        src: '#handbuch',
        data: { expanded: true, size: '12 KB', status: 'Entwurf' },
        children: [
          { id: 'start', label: 'Einstieg', src: '#einstieg', data: { size: '4 KB', status: 'Veröffentlicht' } },
          {
            id: 'api',
            label: 'API',
            src: '#api',
            data: { expanded: true, size: '8 KB', status: 'Entwurf' },
            children: [
              { id: 'methods', label: 'Methoden', src: '#methoden', data: { size: '2 KB', status: 'Entwurf' } },
            ],
          },
        ],
      },
      {
        id: 'files',
        label: 'Dateien',
        data: { expanded: true },
        children: [{ id: 'notes', label: 'Notizen.md', src: '#notizen', data: { size: '1 KB' } }],
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
        src: `#datei-${id}`,
        data: { size: '3 KB' },
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
