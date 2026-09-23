# NTE TreeView

Eigenständiger Dateibaum und CMS-Seitenbaum mit reaktivem Datenmodell. Ein Knoten
kann einen eigenen Link und gleichzeitig Unterseiten besitzen. Der Pfeil öffnet
und schließt ausschließlich den Unterbaum; Link und Zellaktionen bleiben unabhängig.

- `<nte-treeview>` enthält verschachtelte `<nte-treeview-item>`.
- `setData(new TreeModel(...))` erzeugt diese Knoten automatisch im Light DOM.
- Änderungen an `tree.children` aktualisieren den Baum ohne erneuten Methodenaufruf.
- `center` und `end` nehmen Größen, Statusanzeigen, Dropdowns oder andere Elemente auf.
  Im Datenbetrieb liefern `renderCenter(node)` und `renderEnd(node)` diese Zellinhalte.
- `index.ts` und `index.scss` liegen im Paketwurzelverzeichnis. Das Sass-Mixin
  `default-style()` bindet die Anwendung ausdrücklich ein.

`TreeNode` verwendet den verschachtelten Objektbaum `{ id, label, children, data }`.
`data` bündelt `href`, `expanded` und weitere Darstellungsoptionen sowie individuelle
primitive Werte wie `icon`, Dateigröße oder CMS-Status. Änderungen daran sind reaktiv.
Serverseitige Bäume mit dieser Datenkonvention können direkt als Wurzelknoten-Array
an `TreeModel` übergeben werden. Andere Formate benötigen gegebenenfalls einen
Adapter; ein universeller Baumstandard wird damit nicht vorausgesetzt.

[Beispiele und API-Vertrag](examples/README.md) · Interaktive Demo: `demo/01-tree.demo.ts`.

Das Paket hängt nicht von `nte-nav` oder dem älteren `nte-tree-node` ab.
Es verwendet native Links und Disclosure mit Tab/Enter/Leertaste, keine ARIA-Treegrid-
Semantik. Sortierung, Spaltenköpfe, Mehrfachauswahl und Virtualisierung gehören nicht
zu dieser API. Version `0.0.0` ist ein Entwicklungsplatzhalter; keine Veröffentlichung.
