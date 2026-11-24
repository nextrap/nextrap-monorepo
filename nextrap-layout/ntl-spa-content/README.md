# @nextrap/ntl-spa-content

SPA-Layout für Navigation, Editor und Inspector mit einem gemeinsamen
Dokument-Scrollweg. Die globale Navbar scrollt aus dem Bild; der Content-Header
und beide Sidebars bleiben am oberen Viewport-Rand sticky.

Der Hauptinhalt bestimmt die Dokumenthöhe und besitzt keinen zusätzlichen
Scrollport. Sein Footer folgt im Dokumentfluss. Die Sidebars füllen die gesamte
Fensterhöhe (`100dvh`, Fallback `100vh`) und scrollen nur bei überlangem Inhalt
intern. View-Timelines und Scroll-Listener sind nicht erforderlich.

## Container-Vertrag

Header, Hauptinhalt (Default-Slot) und Footer haben kein horizontales Padding.
Verwende für diese drei Bereiche immer `container` oder `container-fluid` an
den eingesetzten Elementen beziehungsweise ihren Inhaltswrappern. Diese Klassen
übernehmen Breitenbegrenzung und horizontale Abstände: `container` begrenzt die
Breite, `container-fluid` nutzt die gesamte verfügbare Breite. Kein zusätzliches
X-Padding auf den zugehörigen Layout-Parts setzen. Vertikale Abstände und das
Padding der Sidebars bleiben Aufgabe des Layouts.

## Demo

Im Monorepo `npx nx dev ntl-spa-content` ausführen. Die vollständige HTML-Seite
ist unter `http://localhost:4000/demo/index.html` erreichbar; der Demo-Viewer
unter `http://localhost:4000/` zeigt dasselbe Beispiel. Im zentralen Demo-Viewer
steht es unter **Layouts → SPA Content**.

Die Seite verwendet `@nextrap/ntl-spa-header` als Navbar im Dokumentfluss vor dem
Workspace und zeigt alle sieben Content-Slots sowie unterschiedliche
Sidebar-Breiten. Der Header ordnet Brand, Hauptnavigation und rechte Aktionen
in einer Zeile an; der erklärende Text liegt in seiner optionalen Sub-Line.
Direkt eingesetzte Aktionsbuttons werden ohne zusätzlichen Wrapper zentriert.
Der mittlere Editor-Header behält Dateiinformationen links und Aktionen rechts.

Die Header-Komponente setzt kein Padding und keine Abstände zwischen den
Inhalten. `ms-4`, `me-3`, `ms-2`, `me-4` und `mx-4` im HTML bestimmen die
gewünschten Ränder und Zwischenräume. Die Zeilenhöhen lassen sich über
`--main-line-height` und `--sub-line-height` anpassen; die Demo nutzt die Defaults
`4.5rem` und `2rem` der [Header-Komponente](../ntl-spa-header/README.md).

Die HTML-Datei ist die gemeinsame Quelle für die Seite und den Demo-Viewer.
Beide Demo-Entrys registrieren Header und Workspace; das Demo-SCSS bindet ihre
öffentlichen `default-style()`-Mixins ausdrücklich ein.

Das Demo-SCSS nutzt die Runtime-Tokens aus `@nextrap/style-base` und Klassen aus
`@nextrap/style-utils`, `@nextrap/style-typography`, `@nextrap/style-elements`
und `@nextrap/style-button`. Flex- und Abstands-Utilities, Typografie, List Groups,
Badges und Buttons übernehmen die Darstellung. Eigene Regeln bleiben auf die
SPA-Mixin-Einbindungen, Sidebar-Breiten und kleine Layout-/Formular-Korrekturen
beschränkt. Ein zusätzlicher Responsive-Wrapper ist dafür nicht nötig.

Prüfe die Footer-Position auf der eigenständigen HTML-Seite oder in der
Fullscreen-Ansicht des Viewers. Die eingebettete Vorschau besitzt einen eigenen
Viewport und kann unter dem Viewer-Header selbst teilweise außerhalb des
sichtbaren Browserbereichs liegen.

## Verwendung und Styling

- [Import, Slots und HTML-Beispiel](.agents/skills/ntl-spa-content-usage/SKILL.md)
- [Sass-Mixin, CSS-Variablen und Parts](.agents/skills/ntl-spa-content-theming/SKILL.md)
- [Vollständige HTML-Seite](https://github.com/nextrap/nextrap-monorepo/blob/main/nextrap-layout/ntl-spa-content/demo/index.html)
- [Einbindung in den Demo-Viewer](https://github.com/nextrap/nextrap-monorepo/blob/main/nextrap-layout/ntl-spa-content/demo/ntl-spa-content.demo.ts)

Das JavaScript registriert die Komponente und ihre funktionalen Shadow-Styles.
Die Anwendung bindet die visuelle Baseline ausdrücklich über `default-style()`
an `ntl-spa-content.style-default` ein. Eine automatische Veröffentlichung auf
npm erfolgt durch das Anlegen des Packages nicht.
