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

- `@nextrap/nte-dialog` hält seine ungestylte Dialog- und Section-Fläche transparent; `style-default()` setzt die Fläche
  über `--nt-surface-raised` und die Textfarbe über `--nt-text`.
- `@nextrap/nte-offcanvas` ersetzt den systemfarbenen `Canvas`-Fallback durch Transparenz; `default-style()` setzt die
  sichtbare Fläche über `--nt-primary-subtle`.
- Rohe `dialog`-Elemente werden nach Einbindung des Resets transparent und übernehmen die umgebende Textfarbe.
- Verbraucher mit rohen `dialog`-Elementen müssen ihre Fläche und bei Bedarf ihren Rahmen explizit stylen.

## Akzeptanzkriterien

- Das kompilierte Reset-CSS enthält für `dialog` `background: transparent`, `color: inherit` und `border: none`.
- Der Reset verändert weder `display` noch `position`, `inset`, Größen, `open`/`:open` oder `::backdrop`.
- Die Default-Varianten von `@nextrap/nte-dialog` und `@nextrap/nte-offcanvas` beziehen ihre sichtbaren Oberflächen aus
  den Theme-Tokens; ohne Variante bleiben die Komponentenflächen transparent.
