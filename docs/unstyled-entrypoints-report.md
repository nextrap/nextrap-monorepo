# Report: Default-Styles und `/unstyled`

## Vertrag und Entscheidung

Der normale JavaScript-Import injiziert die aus `default.scss` kompilierten Light-DOM-Defaults. `/unstyled` enthält dieselbe Logik, Registrierung und inline Shadow-DOM-Styles, aber niemals direkte oder transitive Light-DOM-Stylesheets. Themes komponieren die öffentliche, ausgabefreie Sass-API selbst. Der Name ist ausschließlich `unstyled`; es gibt keinen alternativen `/core`-Einstieg oder eine Übergangslogik. Das bestehende Logikpaket `@nextrap/nt-core` behält seinen Namen.

Die explizite Injektion ist erforderlich, weil Vite im Library-Build einen gewöhnlichen SCSS-Import sonst als separate CSS-Datei ausgeben kann. Beide ESM-Einstiege teilen ihre Implementierung; `sideEffects` erhält Registrierung und Default-Injektion. Interne Komponentenimporte verwenden `/unstyled`; der Default-Einstieg ergänzt benötigte Default-Pakete.

## Bearbeitete Pakete

Alle 30 NTE-, 6 NTL- und 7 Style-Pakete wurden umgestellt. Hinzu kommen Generatorvorlagen in `nt-nx-generators`, Regeln in `nt-skill`, zentrale Architektur-/Styling-Dokumentation, TypeScript-Pfade und CI. Reine Logikpakete erhalten keine künstlichen Stylesheet-Einstiege.

Die letzte Spalte zählt Stylesheets beim isolierten Default-Import einschließlich Abhängigkeiten. Null bedeutet, dass derzeit keine zusätzliche Light-DOM-Baseline vorhanden ist; vorhandene Shadow-DOM-Styles bleiben wirksam.

| Paketpfad | Default-Stylesheets im Laufzeittest |
|---|---:|
| `nextrap-elements/nte-accordion` | 1 |
| `nextrap-elements/nte-burger` | 0 |
| `nextrap-elements/nte-card` | 1 |
| `nextrap-elements/nte-consent-blocker` | 1 |
| `nextrap-elements/nte-data-table` | 2 |
| `nextrap-elements/nte-demo-viewer` | 0 |
| `nextrap-elements/nte-dialog` | 1 |
| `nextrap-elements/nte-dialog-component` | 1 |
| `nextrap-elements/nte-element-highlighter` | 0 |
| `nextrap-elements/nte-feedback` | 2 |
| `nextrap-elements/nte-image` | 1 |
| `nextrap-elements/nte-infiniscroll` | 0 |
| `nextrap-elements/nte-input` | 1 |
| `nextrap-elements/nte-input-old` | 0 |
| `nextrap-elements/nte-multiselect` | 0 |
| `nextrap-elements/nte-nav` | 1 |
| `nextrap-elements/nte-navbar` | 1 |
| `nextrap-elements/nte-offcanvas` | 1 |
| `nextrap-elements/nte-parallax-bg` | 0 |
| `nextrap-elements/nte-privacy-consent` | 2 |
| `nextrap-elements/nte-progress` | 0 |
| `nextrap-elements/nte-scroll-to-top` | 1 |
| `nextrap-elements/nte-scrollspy` | 0 |
| `nextrap-elements/nte-slider` | 0 |
| `nextrap-elements/nte-spinner` | 1 |
| `nextrap-elements/nte-split-view` | 0 |
| `nextrap-elements/nte-stepper` | 0 |
| `nextrap-elements/nte-table` | 1 |
| `nextrap-elements/nte-theme-switcher` | 0 |
| `nextrap-elements/nte-tree-node` | 0 |
| `nextrap-layout/ntl-2col` | 1 |
| `nextrap-layout/ntl-card-grid` | 0 |
| `nextrap-layout/ntl-card-row` | 2 |
| `nextrap-layout/ntl-footer` | 0 |
| `nextrap-layout/ntl-form` | 1 |
| `nextrap-layout/ntl-hero` | 1 |
| `nextrap-styles/style-base` | 1 |
| `nextrap-styles/style-button` | 1 |
| `nextrap-styles/style-elements` | 1 |
| `nextrap-styles/style-reset` | 1 |
| `nextrap-styles/style-switch` | 1 |
| `nextrap-styles/style-typography` | 1 |
| `nextrap-styles/style-utils` | 1 |

## Reparierte Sonderfälle

- `nte-image`: bisher beim Öffnen injiziertes Vollbild-CSS in die öffentliche `fullsize-style()`-Mixin verschoben. Der Default-Import bindet sie ein; Themes übernehmen sie in ihrem Scope. Die aktuelle Bild-URL bleibt Instanzzustand.
- `nte-feedback`: defekten Sass-Forward repariert; vorhandene `feedback-default()`-Mixin wiederverwendet.
- `nte-spinner`: Light-DOM-Baseline in Sass-API überführt und automatische `style-default`-Klasse ergänzt.
- `ntl-form`: bestehende Formatierungsregeln in eine ausgabefreie Mixin-API überführt.
- `nte-accordion`, `nte-card`, `ntl-2col`, `ntl-card-row`, `nte-dialog`, `nte-navbar`: Default-Selektoren auf die jeweilige Komponente begrenzt; globale `.default`-/`.style-default`-Kollisionen vermieden.
- Fehlende oder leere Sass-APIs/Defaults vereinheitlicht; vorhandene historische Sass-Unterpfade bleiben auf dieselbe Default-Quelle bezogen.

## Validierung

- 43/43 Vite-Library-Builds einschließlich beider JavaScript-Einstiege und TypeScript-Deklarationen erfolgreich, ohne TypeScript-Diagnosen. Zusätzlich `nt-core` gebaut.
- 43/43 Sass-APIs erzeugen kein CSS; alle 43 `default.scss` kompilieren erfolgreich.
- `node tools/check-unstyled.mjs`: alle 43 gebauten Unstyled-Importgraphen in isoliertem jsdom ohne globale Stylesheets; gleiche Exportmenge und Exportidentität nach Default-Import; wiederholter Import erzeugt keine zusätzlichen Stylesheets.
- Bild-Vollansicht per API geöffnet: Portal vorhanden, kein globales Stylesheet injiziert.
- Echte Nx-Generatorvorlagen im In-Memory-Tree gerendert: `unstyled.ts`, Root-Reexport und Package-Export vorhanden. Der vollständige Nx-Library-Generator wurde nicht end-to-end ausgeführt.
- ThemeJS2-Sass für alle sechs Themes kompiliert; Vite-Site-Build gegen diese neuen Nextrap-Artefakte erfolgreich.

Die native Dart-Runtime von `sass-embedded` startet in dieser Arbeitsumgebung nicht (Stack-Bounds-Fehler). Für die lokale Library-Validierung wurde dasselbe SCSS mit der JavaScript-Ausgabe von Dart Sass kompiliert und Vite als Inline-CSS übergeben. Die regulären Build-Konfigurationen enthalten keinen Umgebungs-Workaround. CI führt den normalen Build und den eingecheckten Vertragstest aus.

## Noch zu beachten

- ThemeJS2 muss die neuen Nextrap-Artefakte beziehen. Ein Merge veröffentlicht keine npm-Pakete; die vorhandene Veröffentlichung läuft über Release-Tags. Veröffentlichungen, Versionsanhebungen und Registry-Lockfile-Updates sind in diesen PRs nicht vorweggenommen. Mit alten installierten Paketen fehlt `/unstyled`.
- Visuelle Desktop-/Mobil-Prüfung aller Komponenten und sechs Themes steht aus. Besonders Vollbild-Portal, Navbar, Dialog-Modifier und Formularformatierung überprüfen. Ein erfolgreicher Build ersetzt diese Prüfung nicht.
- Leere Defaults in der Tabelle sind absichtlich keine erfundenen Designs. Bei gewünschter visueller SPA-Baseline diese Pakete gesondert gestalten.
- `nte-input-old` und `nte-input` bleiben alternative Implementierungen mit bestehenden Registrierungsüberschneidungen; sie wurden isoliert geprüft.
- Ein Default-Import von `nte-data-table` bindet Tabellen-CSS auch über seine Sass-Zusammenstellung ein; bei gleichzeitiger Nutzung des Tabellen-Defaults sind identische Regeln möglich.
- Inline-Style-Injektion benötigt eine passende CSP. `/unstyled` plus externes Theme-CSS ist der Weg für CSP ohne Inline-Styles. SSR-Kompatibilität ist durch die Styling-Trennung nicht zugesichert.

## Geänderte Dateien

- `.agents/skills/nextrap-skill/SKILL.md`
- `.github/workflows/ci.yml`
- `AGENTS.md`
- `AGENT_CONTEXT.md`
- `ARCHITECTURE.md`
- `README_STYLING.md`
- `docs/nextrap-elements-concept.md`
- `docs/style-packages-architecture.md`
- `nextrap-base/nt-nx-generators/src/generators/base-generator/files/base/README.md.template`
- `nextrap-base/nt-nx-generators/src/generators/base-generator/files/base/default.scss.template`
- `nextrap-base/nt-nx-generators/src/generators/base-generator/files/base/index.ts.template`
- `nextrap-base/nt-nx-generators/src/generators/base-generator/files/base/package.json.template`
- `nextrap-base/nt-nx-generators/src/generators/base-generator/files/base/src/components/__name__/__name__.ts.template`
- `nextrap-base/nt-nx-generators/src/generators/base-generator/files/base/src/styles/index.scss.template`
- `nextrap-base/nt-nx-generators/src/generators/base-generator/files/base/tsconfig.lib.json.template`
- `nextrap-base/nt-nx-generators/src/generators/base-generator/files/base/unstyled.ts.template`
- `nextrap-base/nt-nx-generators/src/generators/base-generator/files/base/vite.config.ts.template`
- `nextrap-base/nt-skill/skills/nextrap-api-skill/SKILL.md`
- `nextrap-elements/nte-accordion/.ai-usage-info.md`
- `nextrap-elements/nte-accordion/default.scss`
- `nextrap-elements/nte-accordion/index.ts`
- `nextrap-elements/nte-accordion/package.json`
- `nextrap-elements/nte-accordion/skills/nte-accordion-theming/SKILL.md`
- `nextrap-elements/nte-accordion/skills/nte-accordion-usage/SKILL.md`
- `nextrap-elements/nte-accordion/src/components/nte-accordion-item/nte-accordion-item.ts`
- `nextrap-elements/nte-accordion/src/components/nte-accordion/nte-accordion.ts`
- `nextrap-elements/nte-accordion/tsconfig.lib.json`
- `nextrap-elements/nte-accordion/unstyled.ts`
- `nextrap-elements/nte-accordion/vite.config.ts`
- `nextrap-elements/nte-burger/.ai-usage-info.md`
- `nextrap-elements/nte-burger/default.scss`
- `nextrap-elements/nte-burger/index.scss`
- `nextrap-elements/nte-burger/index.ts`
- `nextrap-elements/nte-burger/package.json`
- `nextrap-elements/nte-burger/skills/nte-burger-usage/SKILL.md`
- `nextrap-elements/nte-burger/src/scss/_default-style.scss`
- `nextrap-elements/nte-burger/tsconfig.lib.json`
- `nextrap-elements/nte-burger/unstyled.ts`
- `nextrap-elements/nte-burger/vite.config.ts`
- `nextrap-elements/nte-card/.ai-usage-info.md`
- `nextrap-elements/nte-card/default.scss`
- `nextrap-elements/nte-card/index.ts`
- `nextrap-elements/nte-card/package.json`
- `nextrap-elements/nte-card/src/components/nte-card/nte-card.ts`
- `nextrap-elements/nte-card/tsconfig.lib.json`
- `nextrap-elements/nte-card/unstyled.ts`
- `nextrap-elements/nte-card/vite.config.ts`
- `nextrap-elements/nte-consent-blocker/.ai-usage-info.md`
- `nextrap-elements/nte-consent-blocker/README.md`
- `nextrap-elements/nte-consent-blocker/index.ts`
- `nextrap-elements/nte-consent-blocker/package.json`
- `nextrap-elements/nte-consent-blocker/src/components/nte-consent-blocker/nte-consent-blocker.ts`
- `nextrap-elements/nte-consent-blocker/src/styles/index.scss`
- `nextrap-elements/nte-consent-blocker/tsconfig.lib.json`
- `nextrap-elements/nte-consent-blocker/unstyled.ts`
- `nextrap-elements/nte-consent-blocker/vite.config.ts`
- `nextrap-elements/nte-data-table/.ai-usage-info.md`
- `nextrap-elements/nte-data-table/index.ts`
- `nextrap-elements/nte-data-table/package.json`
- `nextrap-elements/nte-data-table/skills/nte-data-table-theming/SKILL.md`
- `nextrap-elements/nte-data-table/skills/nte-data-table-usage/SKILL.md`
- `nextrap-elements/nte-data-table/src/components/nte-data-table/nte-data-table.ts`
- `nextrap-elements/nte-data-table/tsconfig.lib.json`
- `nextrap-elements/nte-data-table/unstyled.ts`
- `nextrap-elements/nte-data-table/vite.config.ts`
- `nextrap-elements/nte-demo-viewer/.ai-usage-info.md`
- `nextrap-elements/nte-demo-viewer/default.scss`
- `nextrap-elements/nte-demo-viewer/index.scss`
- `nextrap-elements/nte-demo-viewer/index.ts`
- `nextrap-elements/nte-demo-viewer/package.json`
- `nextrap-elements/nte-demo-viewer/src/components/nte-theme-switcher/nte-theme-switcher.ts`
- `nextrap-elements/nte-demo-viewer/src/scss/_default-style.scss`
- `nextrap-elements/nte-demo-viewer/src/styles/index.scss`
- `nextrap-elements/nte-demo-viewer/tsconfig.lib.json`
- `nextrap-elements/nte-demo-viewer/unstyled.ts`
- `nextrap-elements/nte-demo-viewer/vite.config.ts`
- `nextrap-elements/nte-dialog-component/.ai-usage-info.md`
- `nextrap-elements/nte-dialog-component/default.scss`
- `nextrap-elements/nte-dialog-component/index.scss`
- `nextrap-elements/nte-dialog-component/index.ts`
- `nextrap-elements/nte-dialog-component/package.json`
- `nextrap-elements/nte-dialog-component/src/lib/nte-dialog-component.ts`
- `nextrap-elements/nte-dialog-component/src/scss/_default-style.scss`
- `nextrap-elements/nte-dialog-component/tsconfig.lib.json`
- `nextrap-elements/nte-dialog-component/unstyled.ts`
- `nextrap-elements/nte-dialog-component/vite.config.ts`
- `nextrap-elements/nte-dialog/.ai-usage-info.md`
- `nextrap-elements/nte-dialog/default.scss`
- `nextrap-elements/nte-dialog/index.ts`
- `nextrap-elements/nte-dialog/package.json`
- `nextrap-elements/nte-dialog/src/components/nte-dialog/nte-dialog.ts`
- `nextrap-elements/nte-dialog/src/scss/_with-modifier-classes.scss`
- `nextrap-elements/nte-dialog/tsconfig.lib.json`
- `nextrap-elements/nte-dialog/unstyled.ts`
- `nextrap-elements/nte-dialog/vite.config.ts`
- `nextrap-elements/nte-element-highlighter/.ai-usage-info.md`
- `nextrap-elements/nte-element-highlighter/default.scss`
- `nextrap-elements/nte-element-highlighter/index.scss`
- `nextrap-elements/nte-element-highlighter/index.ts`
- `nextrap-elements/nte-element-highlighter/package.json`
- `nextrap-elements/nte-element-highlighter/src/scss/_default-style.scss`
- `nextrap-elements/nte-element-highlighter/tsconfig.lib.json`
- `nextrap-elements/nte-element-highlighter/unstyled.ts`
- `nextrap-elements/nte-element-highlighter/vite.config.ts`
- `nextrap-elements/nte-feedback/.ai-usage-info.md`
- `nextrap-elements/nte-feedback/default.scss`
- `nextrap-elements/nte-feedback/index.scss`
- `nextrap-elements/nte-feedback/index.ts`
- `nextrap-elements/nte-feedback/package.json`
- `nextrap-elements/nte-feedback/skills/nte-feedback-usage/SKILL.md`
- `nextrap-elements/nte-feedback/src/components/nte-feedback/nte-feedback.ts`
- `nextrap-elements/nte-feedback/src/styles/index.scss`
- `nextrap-elements/nte-feedback/tsconfig.lib.json`
- `nextrap-elements/nte-feedback/unstyled.ts`
- `nextrap-elements/nte-feedback/vite.config.ts`
- `nextrap-elements/nte-image/.ai-usage-info.md`
- `nextrap-elements/nte-image/README.md`
- `nextrap-elements/nte-image/default.scss`
- `nextrap-elements/nte-image/index.scss`
- `nextrap-elements/nte-image/index.ts`
- `nextrap-elements/nte-image/package.json`
- `nextrap-elements/nte-image/src/components/nte-image/nte-image.utils.ts`
- `nextrap-elements/nte-image/src/scss/_default-style.scss`
- `nextrap-elements/nte-image/src/scss/_fullsize-style.scss`
- `nextrap-elements/nte-image/src/styles/index.scss`
- `nextrap-elements/nte-image/tsconfig.lib.json`
- `nextrap-elements/nte-image/unstyled.ts`
- `nextrap-elements/nte-image/vite.config.ts`
- `nextrap-elements/nte-infiniscroll/.ai-usage-info.md`
- `nextrap-elements/nte-infiniscroll/default.scss`
- `nextrap-elements/nte-infiniscroll/index.scss`
- `nextrap-elements/nte-infiniscroll/index.ts`
- `nextrap-elements/nte-infiniscroll/package.json`
- `nextrap-elements/nte-infiniscroll/src/scss/_default-style.scss`
- `nextrap-elements/nte-infiniscroll/tsconfig.lib.json`
- `nextrap-elements/nte-infiniscroll/unstyled.ts`
- `nextrap-elements/nte-infiniscroll/vite.config.ts`
- `nextrap-elements/nte-input-old/.ai-usage-info.md`
- `nextrap-elements/nte-input-old/default.scss`
- `nextrap-elements/nte-input-old/index.scss`
- `nextrap-elements/nte-input-old/index.ts`
- `nextrap-elements/nte-input-old/package.json`
- `nextrap-elements/nte-input-old/src/scss/_default-style.scss`
- `nextrap-elements/nte-input-old/tsconfig.lib.json`
- `nextrap-elements/nte-input-old/unstyled.ts`
- `nextrap-elements/nte-input-old/vite.config.ts`
- `nextrap-elements/nte-input/.ai-usage-info.md`
- `nextrap-elements/nte-input/default.scss`
- `nextrap-elements/nte-input/index.ts`
- `nextrap-elements/nte-input/package.json`
- `nextrap-elements/nte-input/src/components/nte-input/nte-input.ts`
- `nextrap-elements/nte-input/tsconfig.lib.json`
- `nextrap-elements/nte-input/unstyled.ts`
- `nextrap-elements/nte-input/vite.config.ts`
- `nextrap-elements/nte-multiselect/.ai-usage-info.md`
- `nextrap-elements/nte-multiselect/default.scss`
- `nextrap-elements/nte-multiselect/index.scss`
- `nextrap-elements/nte-multiselect/index.ts`
- `nextrap-elements/nte-multiselect/package.json`
- `nextrap-elements/nte-multiselect/src/components/nte-multiselect/nte-multiselect.ts`
- `nextrap-elements/nte-multiselect/src/scss/_default-style.scss`
- `nextrap-elements/nte-multiselect/src/styles/index.scss`
- `nextrap-elements/nte-multiselect/tsconfig.lib.json`
- `nextrap-elements/nte-multiselect/unstyled.ts`
- `nextrap-elements/nte-multiselect/vite.config.ts`
- `nextrap-elements/nte-nav/.ai-usage-info.md`
- `nextrap-elements/nte-nav/default.scss`
- `nextrap-elements/nte-nav/index.ts`
- `nextrap-elements/nte-nav/package.json`
- `nextrap-elements/nte-nav/skills/nte-nav-usage/SKILL.md`
- `nextrap-elements/nte-nav/tsconfig.lib.json`
- `nextrap-elements/nte-nav/unstyled.ts`
- `nextrap-elements/nte-nav/vite.config.ts`
- `nextrap-elements/nte-navbar/.ai-usage-info.md`
- `nextrap-elements/nte-navbar/default.scss`
- `nextrap-elements/nte-navbar/index.ts`
- `nextrap-elements/nte-navbar/package.json`
- `nextrap-elements/nte-navbar/skills/nte-navbar-usage/SKILL.md`
- `nextrap-elements/nte-navbar/src/scss/default-style.scss`
- `nextrap-elements/nte-navbar/tsconfig.lib.json`
- `nextrap-elements/nte-navbar/unstyled.ts`
- `nextrap-elements/nte-navbar/vite.config.ts`
- `nextrap-elements/nte-offcanvas/.ai-usage-info.md`
- `nextrap-elements/nte-offcanvas/index.ts`
- `nextrap-elements/nte-offcanvas/package.json`
- `nextrap-elements/nte-offcanvas/src/components/nte-offcanvas/nte-offcanvas.ts`
- `nextrap-elements/nte-offcanvas/tsconfig.lib.json`
- `nextrap-elements/nte-offcanvas/unstyled.ts`
- `nextrap-elements/nte-offcanvas/vite.config.ts`
- `nextrap-elements/nte-parallax-bg/.ai-usage-info.md`
- `nextrap-elements/nte-parallax-bg/default.scss`
- `nextrap-elements/nte-parallax-bg/index.scss`
- `nextrap-elements/nte-parallax-bg/index.ts`
- `nextrap-elements/nte-parallax-bg/package.json`
- `nextrap-elements/nte-parallax-bg/src/components/nte-parallax-bg/nte-parallax-bg.ts`
- `nextrap-elements/nte-parallax-bg/src/scss/_default-style.scss`
- `nextrap-elements/nte-parallax-bg/src/styles/index.scss`
- `nextrap-elements/nte-parallax-bg/tsconfig.lib.json`
- `nextrap-elements/nte-parallax-bg/unstyled.ts`
- `nextrap-elements/nte-parallax-bg/vite.config.ts`
- `nextrap-elements/nte-privacy-consent/.ai-usage-info.md`
- `nextrap-elements/nte-privacy-consent/index.ts`
- `nextrap-elements/nte-privacy-consent/package.json`
- `nextrap-elements/nte-privacy-consent/skills/nte-privacy-consent-theming/SKILL.md`
- `nextrap-elements/nte-privacy-consent/skills/nte-privacy-consent-usage/SKILL.md`
- `nextrap-elements/nte-privacy-consent/src/components/nte-privacy-consent/nte-privacy-consent.ts`
- `nextrap-elements/nte-privacy-consent/tsconfig.lib.json`
- `nextrap-elements/nte-privacy-consent/unstyled.ts`
- `nextrap-elements/nte-privacy-consent/vite.config.ts`
- `nextrap-elements/nte-progress/.ai-usage-info.md`
- `nextrap-elements/nte-progress/default.scss`
- `nextrap-elements/nte-progress/index.scss`
- `nextrap-elements/nte-progress/index.ts`
- `nextrap-elements/nte-progress/package.json`
- `nextrap-elements/nte-progress/skills/nte-progress-usage/SKILL.md`
- `nextrap-elements/nte-progress/src/scss/_default-style.scss`
- `nextrap-elements/nte-progress/tsconfig.lib.json`
- `nextrap-elements/nte-progress/unstyled.ts`
- `nextrap-elements/nte-progress/vite.config.ts`
- `nextrap-elements/nte-scroll-to-top/.ai-usage-info.md`
- `nextrap-elements/nte-scroll-to-top/default.scss`
- `nextrap-elements/nte-scroll-to-top/index.ts`
- `nextrap-elements/nte-scroll-to-top/package.json`
- `nextrap-elements/nte-scroll-to-top/skills/nte-scroll-to-top-theming/SKILL.md`
- `nextrap-elements/nte-scroll-to-top/skills/nte-scroll-to-top-usage/SKILL.md`
- `nextrap-elements/nte-scroll-to-top/src/lib/nte-scroll-to-top.ts`
- `nextrap-elements/nte-scroll-to-top/tsconfig.lib.json`
- `nextrap-elements/nte-scroll-to-top/unstyled.ts`
- `nextrap-elements/nte-scroll-to-top/vite.config.ts`
- `nextrap-elements/nte-scrollspy/.ai-usage-info.md`
- `nextrap-elements/nte-scrollspy/default.scss`
- `nextrap-elements/nte-scrollspy/index.scss`
- `nextrap-elements/nte-scrollspy/index.ts`
- `nextrap-elements/nte-scrollspy/package.json`
- `nextrap-elements/nte-scrollspy/src/scss/_default-style.scss`
- `nextrap-elements/nte-scrollspy/tsconfig.lib.json`
- `nextrap-elements/nte-scrollspy/unstyled.ts`
- `nextrap-elements/nte-scrollspy/vite.config.ts`
- `nextrap-elements/nte-slider/.ai-usage-info.md`
- `nextrap-elements/nte-slider/default.scss`
- `nextrap-elements/nte-slider/index.scss`
- `nextrap-elements/nte-slider/index.ts`
- `nextrap-elements/nte-slider/package.json`
- `nextrap-elements/nte-slider/src/components/nte-slide/nte-slide.ts`
- `nextrap-elements/nte-slider/src/components/nte-slider/nte-slider.ts`
- `nextrap-elements/nte-slider/src/scss/_default-style.scss`
- `nextrap-elements/nte-slider/src/styles/index.scss`
- `nextrap-elements/nte-slider/tsconfig.lib.json`
- `nextrap-elements/nte-slider/unstyled.ts`
- `nextrap-elements/nte-slider/vite.config.ts`
- `nextrap-elements/nte-spinner/.ai-usage-info.md`
- `nextrap-elements/nte-spinner/default.scss`
- `nextrap-elements/nte-spinner/index.scss`
- `nextrap-elements/nte-spinner/index.ts`
- `nextrap-elements/nte-spinner/package.json`
- `nextrap-elements/nte-spinner/skills/nte-spinner-usage/SKILL.md`
- `nextrap-elements/nte-spinner/src/components/nte-spinner/nte-spinner.ts`
- `nextrap-elements/nte-spinner/src/scss/_default-style.scss`
- `nextrap-elements/nte-spinner/src/styles/index.scss`
- `nextrap-elements/nte-spinner/tsconfig.lib.json`
- `nextrap-elements/nte-spinner/unstyled.ts`
- `nextrap-elements/nte-spinner/vite.config.ts`
- `nextrap-elements/nte-split-view/.ai-usage-info.md`
- `nextrap-elements/nte-split-view/default.scss`
- `nextrap-elements/nte-split-view/index.scss`
- `nextrap-elements/nte-split-view/index.ts`
- `nextrap-elements/nte-split-view/package.json`
- `nextrap-elements/nte-split-view/src/components/nte-split-view/nte-split-view.ts`
- `nextrap-elements/nte-split-view/src/scss/_default-style.scss`
- `nextrap-elements/nte-split-view/src/styles/index.scss`
- `nextrap-elements/nte-split-view/tsconfig.lib.json`
- `nextrap-elements/nte-split-view/unstyled.ts`
- `nextrap-elements/nte-split-view/vite.config.ts`
- `nextrap-elements/nte-stepper/.ai-usage-info.md`
- `nextrap-elements/nte-stepper/default.scss`
- `nextrap-elements/nte-stepper/index.scss`
- `nextrap-elements/nte-stepper/index.ts`
- `nextrap-elements/nte-stepper/package.json`
- `nextrap-elements/nte-stepper/src/lib/nte-stepper.ts`
- `nextrap-elements/nte-stepper/src/scss/_default-style.scss`
- `nextrap-elements/nte-stepper/tsconfig.lib.json`
- `nextrap-elements/nte-stepper/unstyled.ts`
- `nextrap-elements/nte-stepper/vite.config.ts`
- `nextrap-elements/nte-table/.ai-usage-info.md`
- `nextrap-elements/nte-table/index.ts`
- `nextrap-elements/nte-table/package.json`
- `nextrap-elements/nte-table/skills/nte-table-theming/SKILL.md`
- `nextrap-elements/nte-table/skills/nte-table-usage/SKILL.md`
- `nextrap-elements/nte-table/src/components/nte-table/nte-table.ts`
- `nextrap-elements/nte-table/tsconfig.lib.json`
- `nextrap-elements/nte-table/unstyled.ts`
- `nextrap-elements/nte-table/vite.config.ts`
- `nextrap-elements/nte-theme-switcher/.ai-usage-info.md`
- `nextrap-elements/nte-theme-switcher/default.scss`
- `nextrap-elements/nte-theme-switcher/index.scss`
- `nextrap-elements/nte-theme-switcher/index.ts`
- `nextrap-elements/nte-theme-switcher/package.json`
- `nextrap-elements/nte-theme-switcher/src/components/nte-theme-switcher/nte-theme-switcher.ts`
- `nextrap-elements/nte-theme-switcher/src/scss/_default-style.scss`
- `nextrap-elements/nte-theme-switcher/src/styles/index.scss`
- `nextrap-elements/nte-theme-switcher/tsconfig.lib.json`
- `nextrap-elements/nte-theme-switcher/unstyled.ts`
- `nextrap-elements/nte-theme-switcher/vite.config.ts`
- `nextrap-elements/nte-tree-node/.ai-usage-info.md`
- `nextrap-elements/nte-tree-node/default.scss`
- `nextrap-elements/nte-tree-node/index.scss`
- `nextrap-elements/nte-tree-node/index.ts`
- `nextrap-elements/nte-tree-node/package.json`
- `nextrap-elements/nte-tree-node/src/components/nte-tree-node/nte-tree-node.ts`
- `nextrap-elements/nte-tree-node/src/scss/_default-style.scss`
- `nextrap-elements/nte-tree-node/src/styles/index.scss`
- `nextrap-elements/nte-tree-node/tsconfig.lib.json`
- `nextrap-elements/nte-tree-node/unstyled.ts`
- `nextrap-elements/nte-tree-node/vite.config.ts`
- `nextrap-layout/ntl-2col/.agents/skills/ntl-2col-theming/SKILL.md`
- `nextrap-layout/ntl-2col/.agents/skills/ntl-2col-usage/SKILL.md`
- `nextrap-layout/ntl-2col/.ai-usage-info.md`
- `nextrap-layout/ntl-2col/default.scss`
- `nextrap-layout/ntl-2col/index.ts`
- `nextrap-layout/ntl-2col/package.json`
- `nextrap-layout/ntl-2col/src/components/ntl-2col/ntl-2col.ts`
- `nextrap-layout/ntl-2col/tsconfig.lib.json`
- `nextrap-layout/ntl-2col/unstyled.ts`
- `nextrap-layout/ntl-2col/vite.config.ts`
- `nextrap-layout/ntl-card-grid/.ai-usage-info.md`
- `nextrap-layout/ntl-card-grid/default.scss`
- `nextrap-layout/ntl-card-grid/index.scss`
- `nextrap-layout/ntl-card-grid/index.ts`
- `nextrap-layout/ntl-card-grid/package.json`
- `nextrap-layout/ntl-card-grid/src/components/ntl-card-grid/ntl-card-grid.ts`
- `nextrap-layout/ntl-card-grid/src/scss/_default-style.scss`
- `nextrap-layout/ntl-card-grid/src/styles/index.scss`
- `nextrap-layout/ntl-card-grid/tsconfig.lib.json`
- `nextrap-layout/ntl-card-grid/unstyled.ts`
- `nextrap-layout/ntl-card-grid/vite.config.ts`
- `nextrap-layout/ntl-card-row/.agents/skills/ntl-card-row-theming/SKILL.md`
- `nextrap-layout/ntl-card-row/.agents/skills/ntl-card-row-usage/SKILL.md`
- `nextrap-layout/ntl-card-row/.ai-usage-info.md`
- `nextrap-layout/ntl-card-row/default.scss`
- `nextrap-layout/ntl-card-row/index.ts`
- `nextrap-layout/ntl-card-row/package.json`
- `nextrap-layout/ntl-card-row/src/components/ntl-card-row/ntl-card-row.ts`
- `nextrap-layout/ntl-card-row/tsconfig.lib.json`
- `nextrap-layout/ntl-card-row/unstyled.ts`
- `nextrap-layout/ntl-card-row/vite.config.ts`
- `nextrap-layout/ntl-footer/.ai-usage-info.md`
- `nextrap-layout/ntl-footer/default.scss`
- `nextrap-layout/ntl-footer/index.scss`
- `nextrap-layout/ntl-footer/index.ts`
- `nextrap-layout/ntl-footer/package.json`
- `nextrap-layout/ntl-footer/src/lib/ntl-footer.ts`
- `nextrap-layout/ntl-footer/src/scss/_default-style.scss`
- `nextrap-layout/ntl-footer/tsconfig.lib.json`
- `nextrap-layout/ntl-footer/unstyled.ts`
- `nextrap-layout/ntl-footer/vite.config.ts`
- `nextrap-layout/ntl-form/.ai-usage-info.md`
- `nextrap-layout/ntl-form/default.scss`
- `nextrap-layout/ntl-form/index.scss`
- `nextrap-layout/ntl-form/index.ts`
- `nextrap-layout/ntl-form/package.json`
- `nextrap-layout/ntl-form/src/components/ntl-form-format/ntl-form-format.ts`
- `nextrap-layout/ntl-form/src/components/ntl-form/ntl-form.ts`
- `nextrap-layout/ntl-form/src/scss/_default-style.scss`
- `nextrap-layout/ntl-form/src/scss/_format-style.scss`
- `nextrap-layout/ntl-form/src/styles/index.scss`
- `nextrap-layout/ntl-form/tsconfig.lib.json`
- `nextrap-layout/ntl-form/unstyled.ts`
- `nextrap-layout/ntl-form/vite.config.ts`
- `nextrap-layout/ntl-hero/.ai-usage-info.md`
- `nextrap-layout/ntl-hero/README.md`
- `nextrap-layout/ntl-hero/default.scss`
- `nextrap-layout/ntl-hero/index.ts`
- `nextrap-layout/ntl-hero/package.json`
- `nextrap-layout/ntl-hero/src/components/ntl-hero/ntl-hero.ts`
- `nextrap-layout/ntl-hero/src/styles/index.scss`
- `nextrap-layout/ntl-hero/tsconfig.lib.json`
- `nextrap-layout/ntl-hero/unstyled.ts`
- `nextrap-layout/ntl-hero/vite.config.ts`
- `nextrap-styles/style-base/.ai-usage-info.md`
- `nextrap-styles/style-base/index.ts`
- `nextrap-styles/style-base/package.json`
- `nextrap-styles/style-base/tsconfig.lib.json`
- `nextrap-styles/style-base/unstyled.ts`
- `nextrap-styles/style-base/vite.config.ts`
- `nextrap-styles/style-button/.agents/skills/style-button-theming/SKILL.md`
- `nextrap-styles/style-button/.agents/skills/style-button-usage/SKILL.md`
- `nextrap-styles/style-button/.ai-usage-info.md`
- `nextrap-styles/style-button/index.ts`
- `nextrap-styles/style-button/package.json`
- `nextrap-styles/style-button/tsconfig.lib.json`
- `nextrap-styles/style-button/unstyled.ts`
- `nextrap-styles/style-button/vite.config.ts`
- `nextrap-styles/style-elements/.ai-usage-info.md`
- `nextrap-styles/style-elements/index.ts`
- `nextrap-styles/style-elements/package.json`
- `nextrap-styles/style-elements/tsconfig.lib.json`
- `nextrap-styles/style-elements/unstyled.ts`
- `nextrap-styles/style-elements/vite.config.ts`
- `nextrap-styles/style-reset/.ai-usage-info.md`
- `nextrap-styles/style-reset/index.ts`
- `nextrap-styles/style-reset/package.json`
- `nextrap-styles/style-reset/tsconfig.lib.json`
- `nextrap-styles/style-reset/unstyled.ts`
- `nextrap-styles/style-reset/vite.config.ts`
- `nextrap-styles/style-switch/.agents/skills/style-switch-theming/SKILL.md`
- `nextrap-styles/style-switch/.agents/skills/style-switch-usage/SKILL.md`
- `nextrap-styles/style-switch/.ai-usage-info.md`
- `nextrap-styles/style-switch/index.ts`
- `nextrap-styles/style-switch/package.json`
- `nextrap-styles/style-switch/tsconfig.lib.json`
- `nextrap-styles/style-switch/unstyled.ts`
- `nextrap-styles/style-switch/vite.config.ts`
- `nextrap-styles/style-typography/.ai-usage-info.md`
- `nextrap-styles/style-typography/index.ts`
- `nextrap-styles/style-typography/package.json`
- `nextrap-styles/style-typography/tsconfig.lib.json`
- `nextrap-styles/style-typography/unstyled.ts`
- `nextrap-styles/style-typography/vite.config.ts`
- `nextrap-styles/style-utils/.ai-usage-info.md`
- `nextrap-styles/style-utils/index.ts`
- `nextrap-styles/style-utils/package.json`
- `nextrap-styles/style-utils/tsconfig.lib.json`
- `nextrap-styles/style-utils/unstyled.ts`
- `nextrap-styles/style-utils/vite.config.ts`
- `tools/check-unstyled.mjs`
- `tsconfig.base.json`
