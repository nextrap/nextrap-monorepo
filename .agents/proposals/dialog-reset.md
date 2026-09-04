# Native dialog reset

## Entscheidung

`@nextrap/style-reset` neutralisiert die vom Browser gezeichnete Fläche, Textfarbe und den Rahmen nativer
`dialog`-Elemente. Top-Layer-Verhalten, `open`/`:open`, Positionierung, Größe, Fokusbehandlung und `::backdrop` bleiben
unangetastet.

## Begründung

Browser setzen für `dialog` eine eigene Canvas-Fläche und Textfarbe. Diese Werte können unabhängig vom aktiven Theme
sichtbar werden. Ein Reset soll keine visuelle Variante vorgeben; die konkrete Oberfläche gehört in das nutzende Theme
oder die Komponente.

## Auswirkungen

- `@nextrap/nte-dialog` und `@nextrap/nte-offcanvas` setzen Hintergrund, Textfarbe und Rahmen bereits explizit.
- Rohe `dialog`-Elemente werden nach Einbindung des Resets transparent und übernehmen die umgebende Textfarbe.
- Verbraucher mit rohen `dialog`-Elementen müssen ihre Fläche und bei Bedarf ihren Rahmen explizit stylen.

## Akzeptanzkriterien

- Das kompilierte Reset-CSS enthält für `dialog` `background: transparent`, `color: inherit` und `border: none`.
- Der Reset verändert weder `display` noch `position`, `inset`, Größen, `open`/`:open` oder `::backdrop`.
- Die bestehenden Nextrap-Dialogkomponenten behalten ihre explizit definierten Oberflächen.
