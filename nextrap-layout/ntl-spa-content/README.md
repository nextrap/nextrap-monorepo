# @nextrap/ntl-spa-content

Viewport-hohes SPA-Layout für Navigation, Editor und Inspector. Die Sidebars
reichen über die gesamte Höhe; Header und Footer des Hauptinhalts bleiben in
der Mitte. Alle drei Inhaltsbereiche scrollen unabhängig.

## Demo

Im Monorepo `npx nx dev ntl-spa-content` ausführen oder im zentralen Demo-Viewer
**Layouts → SPA Content** öffnen. Die Demo zeigt eine Navbar im Dokumentfluss
vor dem Workspace, alle sieben Slots und unterschiedliche Sidebar-Breiten.

## Verwendung und Styling

- [Import, Slots und Markdown-Beispiel](.agents/skills/ntl-spa-content-usage/SKILL.md)
- [Sass-Mixin, CSS-Variablen und Parts](.agents/skills/ntl-spa-content-theming/SKILL.md)
- [Vollständige Demo](demo/ntl-spa-content.demo.ts)

Das JavaScript registriert die Komponente und ihre funktionalen Shadow-Styles.
Die Anwendung bindet die visuelle Baseline ausdrücklich über `default-style()`
an `ntl-spa-content.style-default` ein. Eine automatische Veröffentlichung auf
npm erfolgt durch das Anlegen des Packages nicht.
