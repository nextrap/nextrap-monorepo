# NTE TreeView

Eigenständiger Dateibaum und CMS-Seitenbaum mit reaktivem Datenmodell. Ein Knoten
kann einen eigenen Link und gleichzeitig Unterseiten besitzen. Der Pfeil öffnet
und schließt ausschließlich den Unterbaum; Link und Zellaktionen bleiben unabhängig.
Ohne Link klappt auch der Ordnername samt Icon den Unterbaum auf und zu. Nur Name
und Icon lösen die Auswahl aus; die Hervorhebung umfasst alle Zusatzspalten.

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

Die Default-Styles liefern offene und geschlossene Ordner-Icons. Dateien haben
keinen leeren Pfeil-Platzhalter; optionale Dateisymbole stehen im `icon`-Slot.
`label-click` und `label-dblclick` verbinden eigene Aktionen mit Name und Icon,
auch ohne `href`. Die Events liefern `detail.item` und `detail.originalEvent`.

[Beispiele und API-Vertrag](examples/README.md) · Interaktive Demos:

- [Reaktiver Seitenbaum](demo/01-tree.demo.ts)
- [Datei-Explorer mit Icons](demo/02-file-explorer.demo.ts)
- [Klick- und Doppelklick-Aktionen](demo/03-actions.demo.ts)

Das Paket hängt nicht von `nte-nav` oder dem älteren `nte-tree-node` ab.
Es verwendet native Links und Disclosure mit Tab/Enter/Leertaste, keine ARIA-Treegrid-
Semantik. Sortierung, Spaltenköpfe, Mehrfachauswahl und Virtualisierung gehören nicht
zu dieser API. Version `0.0.0` ist ein Entwicklungsplatzhalter; keine Veröffentlichung.
