# @nextrap/ntl-spa-content

Viewport-hohes SPA-Layout für Navigation, Editor und Inspector. Die Sidebars
reichen über die gesamte Höhe; Header und Footer des Hauptinhalts bleiben in
der Mitte. Alle drei Inhaltsbereiche scrollen unabhängig.

## Demo

Im Monorepo `npx nx dev ntl-spa-content` ausführen. Die vollständige HTML-Seite
ist unter `http://localhost:4000/demo/index.html` erreichbar; der Demo-Viewer
unter `http://localhost:4000/` zeigt dasselbe Beispiel. Im zentralen Demo-Viewer
steht es unter **Layouts → SPA Content**.

Die Seite zeigt eine Navbar im Dokumentfluss vor dem Workspace, alle sieben
Slots und unterschiedliche Sidebar-Breiten. Navbar und mittlerer Header ordnen
Navigation beziehungsweise Dateiinformationen links und Aktionen rechts an.
Die HTML-Datei ist die gemeinsame Quelle für die Seite und den Demo-Viewer;
`demo/index.ts` lädt lediglich die Komponente und ihre Demo-Styles.

## Verwendung und Styling

- [Import, Slots und HTML-Beispiel](.agents/skills/ntl-spa-content-usage/SKILL.md)
- [Sass-Mixin, CSS-Variablen und Parts](.agents/skills/ntl-spa-content-theming/SKILL.md)
- [Vollständige HTML-Seite](https://github.com/nextrap/nextrap-monorepo/blob/main/nextrap-layout/ntl-spa-content/demo/index.html)
- [Einbindung in den Demo-Viewer](https://github.com/nextrap/nextrap-monorepo/blob/main/nextrap-layout/ntl-spa-content/demo/ntl-spa-content.demo.ts)

Das JavaScript registriert die Komponente und ihre funktionalen Shadow-Styles.
Die Anwendung bindet die visuelle Baseline ausdrücklich über `default-style()`
an `ntl-spa-content.style-default` ein. Eine automatische Veröffentlichung auf
npm erfolgt durch das Anlegen des Packages nicht.
