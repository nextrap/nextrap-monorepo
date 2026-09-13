import { defineDemo } from '@trunkjs/demo-viewer';
import { NavigationTree } from '../index';
import { renderDocumentDemo } from './main';

// Zeigt die programmatische API mit getrenntem Elternlink und nativer Disclosure.
export default defineDemo({
  title: 'Baum: Daten und Unterelemente',
  description: 'Ordner, verlinkte Eltern und reaktive Änderungen im Light DOM',
  render(root) {
    renderDocumentDemo(
      root,
      `
      <main>
        <h1>Navigationsbaum</h1>
        <p>„Handbuch“ öffnet die Seite; sein Pfeil öffnet die Unterseiten.
          „Entwürfe“ ist ein Ordner ohne eigenen Link.</p>
        <nte-nav class="with-tree" aria-label="Dateien"></nte-nav>
        <p>
          <button type="button" data-action="rename">Handbuch umbenennen</button>
          <button type="button" data-action="add">Datei in Entwürfe anlegen</button>
          <button type="button" data-action="remove">Letzte Datei entfernen</button>
          <button type="button" data-action="move">Datei ins Handbuch verschieben</button>
        </p>
        <p>Die Buttons ändern ausschließlich das Modell; NavItems werden automatisch aktualisiert.</p>
      </main>
    `,
    );

    // Ein Link darf gleichzeitig beliebig tief verschachtelte Unterseiten besitzen.
    const tree = new NavigationTree([
      {
        id: 'handbook',
        label: 'Handbuch',
        href: '#handbuch',
        expanded: true,
        children: [
          { id: 'start', label: 'Einstieg', href: '#einstieg' },
          {
            id: 'api',
            label: 'API',
            href: '#api',
            children: [{ id: 'navigation', label: 'Navigation', href: '#navigation' }],
          },
        ],
      },
      { id: 'drafts', label: 'Entwürfe', children: [] },
    ]);
    const nav = root.querySelector('nte-nav')!;
    nav.setData(tree);

    // Änderungen laufen über den beobachtbaren Baum; kein erneutes setData ist nötig.
    root.querySelector('[data-action="rename"]')!.addEventListener('click', () => {
      tree.children[0].label = 'Entwicklerhandbuch';
    });
    let nextId = 1;
    root.querySelector('[data-action="add"]')!.addEventListener('click', () => {
      const id = nextId++;
      tree.children[1].children!.push({ id: `draft-${id}`, label: `Entwurf ${id}`, href: `#entwurf-${id}` });
      tree.children[1].expanded = true;
    });
    root.querySelector('[data-action="remove"]')!.addEventListener('click', () => {
      tree.children[1].children!.pop();
    });
    root.querySelector('[data-action="move"]')!.addEventListener('click', () => {
      const file = tree.children[1].children!.pop();
      if (file) tree.children[0].children!.push(file);
      tree.children[0].expanded = true;
    });
  },
});
