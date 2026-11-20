import { defineDemo } from '@trunkjs/demo-viewer';
import { html, render } from 'lit';

import { TreeModel } from '../index';
import './main.scss';

// Die Ausschnitte verwenden dieselben Modellreferenzen und Ausgaben wie die ausführbare Demo.
const handlerSource = `const clickOutput = root.querySelector('[data-result="click"]')!;
const doubleClickOutput = root.querySelector('[data-result="double-click"]')!;
const selectedOutput = root.querySelector('[data-result="selected"]')!;

view.onClick = ({ node, originalEvent }) => {
  if (!node) return;
  // Die App übernimmt den Dateilink, der Eintrag bleibt auswählbar.
  if (node.src ?? node.data?.href) originalEvent.preventDefault();
  clickOutput.textContent = node.label + ' — ' + node.data?.['path'];
};
view.onDoubleClick = ({ node }) => {
  if (node) doubleClickOutput.textContent = node.label + ' — ' + node.data?.['path'];
};
view.onSelected = ({ node }) => {
  selectedOutput.textContent = node
    ? node.label + ' · selected: ' + view.getState(node).selected
      + ' · selectedElement === node: ' + (view.selectedElement === node)
    : 'Keine Auswahl';
};`;

// Wie bei einem Input unterscheiden sich ein gesetzter Wert und eine Änderung durch den Benutzer.
const valueSource = `const notes = tree.children[0].children![0];
view.value = 'notes';                 // onSelected läuft, change nicht.
view.value;                           // 'notes'
view.getNodeById('notes') === notes;   // true: derselbe Modellknoten.
view.selectedElement === notes;      // true: volle Knotenreferenz.
view.value = null;                    // Auswahl löschen.

const changeOutput = root.querySelector('[data-result="change"]')!;
let changes = 0;
view.addEventListener('change', (event) => {
  if (event.target !== view) return;
  const node = view.value === null ? null : view.getNodeById(view.value);
  changeOutput.textContent = ++changes + ' · value: ' + (view.value ?? 'keine')
    + ' · getNodeById(value) === selectedElement: ' + (node === view.selectedElement);
});`;

// Nur die gewählte ID wird als einzelner Formularwert übertragen, ohne Inputs pro Knoten.
const formSource = `<nte-treeview name="selectedNode" form="tree-actions-form"></nte-treeview>
<form id="tree-actions-form">
  <button type="submit">Formulardaten lesen</button>
</form>

// Nach setData und der Auswahl liefert die native Formular-API die ID.
const form = root.querySelector<HTMLFormElement>('#tree-actions-form')!;
const formOutput = root.querySelector('[data-result="form"]')!;
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  formOutput.textContent = 'selectedNode = ' + JSON.stringify(data.get('selectedNode'));
});`;

// Der Zustand wird mit dem Modellobjekt abgefragt; der Formularwert bleibt die eindeutige ID.
const stateSource = `const documents = tree.children[0];
const archive = tree.children[1];
view.getState(documents);     // Anfangs { selected: false, expanded: true }.
view.getState(archive);       // Anfangs { selected: false, expanded: false }.

archive.data!.expanded = !view.getState(archive).expanded;

// In dieser Demo liegen beide Ordner auf der Wurzelebene.
const openFolders = tree.children
  .filter((node) => view.getState(node).expanded)
  .map((node) => node.label);`;

// Alle Baumaktionen werden nach setData programmatisch an derselben TreeView registriert.
export default defineDemo({
  title: 'TreeView: Modell, Handler und Zustand',
  description: 'Modellknoten in Handlern, ID als Formularwert und der aktuelle Aufklappzustand',
  render(root) {
    render(
      html`<main>
        <h1>TreeView programmatisch nutzen</h1>
        <p>
          Klicke auf einen Namen oder doppelklicke auf eine Datei. Die Handler erhalten den zugehörigen
          Knoten aus <code>tree.children</code> mit seinen Daten sowie das DOM-Element als <code>item</code>.
          Den Link von „Notizen.md“ übernimmt hier die Anwendung; Ordner öffnen weiterhin ihren Unterbaum.
        </p>
        <nte-treeview name="selectedNode" form="tree-actions-form"
          aria-label="Dokumente mit programmatischen Handlern"></nte-treeview>
        <p>
          <button data-action="select">Notizen.md auswählen</button>
          <button data-action="clear">Auswahl löschen</button>
          <button data-action="toggle">Archiv auf/zu</button>
          <button data-action="state">Zustand lesen</button>
        </p>
        <p>Klick: <output data-result="click" aria-live="polite">Noch kein Klick</output></p>
        <p>Doppelklick: <output data-result="double-click" aria-live="polite">Noch kein Doppelklick</output></p>
        <p>Auswahl: <output data-result="selected" aria-live="polite">Keine Auswahl</output></p>
        <p>Benutzeränderungen: <output data-result="change" aria-live="polite">0</output></p>
        <form id="tree-actions-form">
          <button type="submit">Formulardaten lesen</button>
        </form>
        <p>Formularwert: <output data-result="form" aria-live="polite">Noch nicht gelesen</output></p>
        <p>
          <code>onSelected</code> reagiert auch auf die Auswahl-Buttons. <code>change</code> zählt nur eine
          tatsächlich geänderte Auswahl durch den Benutzer im Baum. Ein erneuter Klick auf denselben Eintrag
          löst weiter <code>onClick</code> aus. Enter und Leertaste aktivieren unverlinkte Namen ebenfalls.
        </p>
        <h2>Letzte Zustandsabfrage</h2>
        <pre><code data-result="state" aria-live="polite">„Zustand lesen“ zeigt Auswahl und Ordnerzustände.</code></pre>
        <h2>Handler programmatisch zuweisen</h2>
        <p>
          Die Ausschnitte ergänzen den Modellaufbau dieser Demo: <code>view.setData(tree)</code> bindet den
          <code>TreeModel</code> an die TreeView; <code>root</code> enthält ihre sichtbaren Ausgabefelder.
          <code>onClick</code> läuft vor der Standardaktion, <code>onSelected</code> nach der Auswahl.
        </p>
        <pre><code>${handlerSource}</code></pre>
        <h2>Auswahl über value lesen und setzen</h2>
        <pre><code>${valueSource}</code></pre>
        <p>
          <code>value</code> enthält die ID, <code>selectedElement</code> den vollständigen Modellknoten;
          ohne Auswahl sind beide <code>null</code>. <code>getNodeById(id)</code> liefert den Knoten oder
          <code>null</code>, wenn die ID unbekannt ist. Verwende baumweit eindeutige IDs für den Formularwert.
          Der Konstruktor kopiert Eingabedaten; <code>node</code> in den Handlern ist eine Referenz aus
          <code>tree.children</code>.
        </p>
        <h2>Die gewählte ID als Formularwert</h2>
        <p>
          Die TreeView ist über <code>form</code> mit dem Formular verbunden. <code>FormData</code> enthält
          unter <code>selectedNode</code> nur die gewählte ID; ohne Auswahl entfällt dieser Eintrag.
        </p>
        <pre><code>${formSource}</code></pre>
        <h2>Offene Ordner und Auswahl abfragen</h2>
        <pre><code>${stateSource}</code></pre>
      </main>`,
      root,
    );

    // Anwendungsdaten bleiben im Modell; der Handler erhält genau diese beobachtbaren Knoten.
    const tree = new TreeModel([
      {
        id: 'documents', label: 'Dokumente', data: { expanded: true, path: '/dokumente' },
        children: [
          { id: 'notes', label: 'Notizen.md', src: '#notizen', data: { path: '/dokumente/notizen.md' } },
          { id: 'handbook', label: 'Handbuch.pdf', data: { path: '/dokumente/handbuch.pdf' } },
        ],
      },
      {
        id: 'archive', label: 'Archiv', data: { expanded: false, path: '/archiv' },
        children: [{ id: 'archived-notes', label: 'Notizen-2025.md', data: { path: '/archiv/notizen-2025.md' } }],
      },
    ]);
    const view = root.querySelector('nte-treeview')!;
    view.setData(tree);
    const notes = tree.children[0].children![0];
    const archive = tree.children[1];

    // Ausgaben statt modaler Alerts lassen die beiden Klicks eines Doppelklicks ungestört durchlaufen.
    const clickOutput = root.querySelector('[data-result="click"]')!;
    const doubleClickOutput = root.querySelector('[data-result="double-click"]')!;
    const selectedOutput = root.querySelector('[data-result="selected"]')!;
    view.onClick = ({ node, originalEvent }) => {
      if (!node) return;
      if (node.src ?? node.data?.href) originalEvent.preventDefault();
      clickOutput.textContent = node.label + ' — ' + node.data?.['path'];
    };
    view.onDoubleClick = ({ node }) => {
      if (node) doubleClickOutput.textContent = node.label + ' — ' + node.data?.['path'];
    };
    view.onSelected = ({ node }) => {
      selectedOutput.textContent = node
        ? node.label + ' · selected: ' + view.getState(node).selected
          + ' · selectedElement === node: ' + (view.selectedElement === node)
        : 'Keine Auswahl';
    };

    // Programmatische Auswahl löst diesen nativen Änderungslistener bewusst nicht aus.
    const changeOutput = root.querySelector('[data-result="change"]')!;
    let changes = 0;
    view.addEventListener('change', (event) => {
      if (event.target !== view) return;
      const node = view.value === null ? null : view.getNodeById(view.value);
      changeOutput.textContent = ++changes + ' · value: ' + (view.value ?? 'keine')
        + ' · getNodeById(value) === selectedElement: ' + (node === view.selectedElement);
    });

    // Native Formularausgabe zeigt dieselbe einzelne ID wie value; die Demo versendet keine Daten.
    const form = root.querySelector<HTMLFormElement>('#tree-actions-form')!;
    const formOutput = root.querySelector('[data-result="form"]')!;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(form);
      formOutput.textContent = 'selectedNode = ' + JSON.stringify(data.get('selectedNode'));
    });

    // Beide Setter aktualisieren Modell und Markierung, ohne eine Dateiaktion auszulösen.
    root.querySelector('[data-action="select"]')!.addEventListener('click', () => { view.value = notes.id; });
    root.querySelector('[data-action="clear"]')!.addEventListener('click', () => { view.value = null; });
    root.querySelector('[data-action="toggle"]')!.addEventListener('click', () => {
      archive.data!.expanded = !view.getState(archive).expanded;
    });

    // Die Abfrage ist ein Snapshot; getState benötigt weder einen DOM-Selektor noch ein vorheriges Rendern.
    const stateOutput = root.querySelector('[data-result="state"]')!;
    root.querySelector('[data-action="state"]')!.addEventListener('click', () => {
      stateOutput.textContent = JSON.stringify({
        value: view.value,
        notes: view.getState(notes),
        folders: tree.children.map((node) => ({ id: node.id, ...view.getState(node) })),
        openFolders: tree.children.filter((node) => view.getState(node).expanded).map((node) => node.label),
      }, null, 2);
    });
  },
});
