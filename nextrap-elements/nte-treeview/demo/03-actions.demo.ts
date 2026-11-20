import { defineDemo } from '@trunkjs/demo-viewer';
import { html, render } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import { TreeModel } from '../index';
import markup from './03-actions.demo.html?raw';
import styles from './main.scss?inline';

export default defineDemo({
  title: 'TreeView: Auswahl und Zustand',
  description: 'Modellobjekte über value auswählen und mit selection-change auslesen',
  render(root) {
    render(html`<style>${styles}</style>${unsafeHTML(markup)}`, root);

    const tree = new TreeModel([
      {
        id: 'documents', label: 'Dokumente', data: { expanded: true, path: '/dokumente' },
        children: [
          // Die Objektauswahl benötigt keine ID.
          { label: 'Notizen.md', data: { path: '/dokumente/notizen.md' } },
          { id: 'handbook', label: 'Handbuch.pdf', data: { path: '/dokumente/handbuch.pdf' } },
        ],
      },
      {
        id: 'archive', label: 'Archiv', data: { expanded: false, path: '/archiv' },
        children: [{ label: 'Notizen-2025.md', data: { path: '/archiv/notizen-2025.md' } }],
      },
    ]);
    const view = root.querySelector('nte-treeview')!;
    view.setData(tree);
    const notes = tree.children[0].children![0];
    const archive = tree.children[1];

    // detail ist dieselbe Node aus tree.children; auch API-Auswahlwechsel lösen das Event aus.
    const selectedOutput = root.querySelector('[data-result="selected"]')!;
    view.addEventListener('selection-change', (event) => {
      selectedOutput.textContent = JSON.stringify(event.detail, null, 2);
    });

    root.querySelector('[data-action="select-object"]')!.addEventListener('click', () => {
      view.value = notes;
    });
    root.querySelector('[data-action="select-id"]')!.addEventListener('click', () => {
      view.value = 'handbook';
    });
    root.querySelector('[data-action="clear"]')!.addEventListener('click', () => {
      view.value = null;
    });
    root.querySelector('[data-action="toggle"]')!.addEventListener('click', () => {
      archive.data!.expanded = !view.getState(archive).expanded;
    });

    // value liefert das aktuelle Objekt; getState liest Auswahl und Öffnungszustand.
    const stateOutput = root.querySelector('[data-result="state"]')!;
    root.querySelector('[data-action="state"]')!.addEventListener('click', () => {
      stateOutput.textContent = JSON.stringify({
        selected: view.value,
        folders: tree.children.map((node) => ({ label: node.label, ...view.getState(node) })),
        openFolders: tree.children.filter((node) => view.getState(node).expanded).map((node) => node.label),
      }, null, 2);
    });
  },
});
