# AGENTS.md – nextrap-monorepo

Diese Datei bleibt absichtlich kurz. Detaillierter Repository-Kontext steht in `AGENT_CONTEXT.md`; allgemeine Arbeitsregeln stehen in den Skills.

## Start

1. `AGENT_CONTEXT.md` lesen und als Onboarding-Cache verwenden.
2. Passende Skills laden, insbesondere `nextrap-lib-programming` und bei interner Arbeit an komplexen Strukturen `architecture-decisions`.
3. Weitere Skills unter `.agents/skills/` konsultieren; diese können teilweise als Git-Submodule eingebunden sein.
4. Bei package-spezifischer Arbeit lokale Skills unter `<package>/.agents/skills/` bevorzugen.
5. Bei interner Projektentwicklung vor strukturellen Änderungen nach anwendbaren `ARCHITECTURE.md`-Dateien in Repository- und Package-Wurzeln suchen und deren Verträge unverändert einhalten. Diese Dateien sind keine Library-Usage-Dokumentation.

## Repo-spezifische Kurzregeln

- Nicht aus `node_modules/`, `dist/` oder generierten Artefakten implementieren. Änderungen unter `workspaces/` sind nur nach ausdrücklicher Zustimmung des Users erlaubt; vorher den geplanten Umfang kurz erläutern.
- Komponenten-`index.ts` dürfen niemals Light-DOM-SCSS/-CSS importieren, exportieren oder re-exportieren, auch nicht indirekt über Runtime-Module; Komponenten dürfen keine Light-DOM-Styles ausgeben oder injizieren. Die Einbindung erfolgt ausschließlich über öffentliche Sass-Mixins durch Theme/App; `index.scss` bleibt ohne CSS-Ausgabe. Verbindlicher Vertrag: `ARCHITECTURE.md`.
- Cross-Package-Imports immer über `@nextrap/<package-name>`.
- Abhängigkeiten zwischen veröffentlichten `@nextrap/*`-Packages ausschließlich als `peerDependencies` deklarieren; keine internen Laufzeitabhängigkeiten in `dependencies`. Reine Demo-/Test-Abhängigkeiten bleiben `devDependencies`. Details und Generator-Vorgaben: Nextrap-Skill, Abschnitt „Libraries, interne Packages und Test-Abhängigkeiten“.
- Externe npm-Abhängigkeiten nur im Root-`package.json` pflegen.

## Grundlage für deklarative Layout-Komponenten

- `ntl-*`-Layouts bestehen nach Möglichkeit ausschließlich aus einem
  deklarativen HTML-/Lit-Template mit nativen Slots und Shadow-DOM-SCSS.
  Nutze HTML- und CSS-Funktionen sowie vorhandene TrunkJS-Mixins, bevor
  eigene TypeScript-Logik eingeführt wird. Layout-Grundfunktionen dürfen
  nicht durch eigene `addEventListener`-, `slotchange`-, MutationObserver-,
  Lifecycle- oder DOM-Umsortierungslogik nachgebaut werden.
- Aktiviere in `nextrap_element({ subLayoutApply: true, slotVisibility: true, breakpoints: true })`
  grundsätzlich diese Layout-Features. `SubLayoutApplyMixin` aus
  `@trunkjs/content-pane` wertet beim ersten Update `data-query` an Slots
  aus, weist passende Kinder automatisch zu und verarbeitet untergeordnete
  Layouts rekursiv. Explizite Slot-Zuweisungen bleiben erhalten; ein bereits
  belegter benannter Slot wird bei der automatischen Zuordnung übersprungen.
  Beispiel: `<slot name="end" data-query=":scope > .aside"></slot>`.
  Nutze bei Bedarf die vorhandene `data-set-attribute-*`-Syntax, statt
  Attribute per eigenem Code zu setzen.
- `SlotVisibilityMixin` aus `@trunkjs/browser-utils` setzt und entfernt
  `.slot-empty` am Slot automatisch bei Lit-Updates und Slotwechseln.
  Leerraum und Kommentare gelten nicht als Inhalt; vorhandener Fallback-
  Inhalt zählt. Blende unbelegte Regionen deklarativ per CSS aus, z. B.
  `.column:has(> slot.slot-empty)`. CSS-Zustände wie `.d-none` werden
  separat per CSS ausgewertet; der Mixin erkennt keine CSS-Sichtbarkeit.
- Responsives Verhalten wird grundsätzlich über `@trunkjs/responsive`
  gesteuert. Verwende Klassen wie `lg:desktop`, `xl:reverse` und
  responsive Styles wie `style-xl`; reagiere in der Komponente nur auf
  die wirksamen Klassen und Styles. Jede responsive Demo muss
  `@trunkjs/responsive` importieren und den Demo-Inhalt in
  `<tj-responsive>` einbetten, auch bei Content-Pane-Markdown-Demos.
  Keine eigene Breakpoint-Auswertung, Media Queries oder Resize-Listener
  für diese Grundfunktionen. Für `ntl-*` bleibt der vorhandene
  `BreakPointMixin` über `breakpoints: true` grundsätzlich aktiv. Er liest
  `--breakpoint` und reflektiert den Zustand als `mode="mobile"`,
  `mode="tablet"` oder `mode="desktop"`. Ein Wert wie `lg` schaltet zwischen
  Mobile und Desktop; zwei Werte wie `md, xl` ergänzen den Tablet-Modus.
  Definiere einen sinnvollen Default, den Themes global über Layout-Selektoren
  oder Instanzen individuell überschreiben können. Ohne explizite Vorgabe
  gilt der automatisch ermittelte Modus. Explizite responsive Klassen wie
  `mobile` oder `desktop` können bei dafür vorgesehenen Layouts den Modus
  im CSS übersteuern, ohne das `mode`-Attribut zu manipulieren.
  `eventBinding` bleibt ohne konkreten Bedarf deaktiviert.

Quellreferenzen: [SubLayoutApplyMixin](https://github.com/trunkjs/trunkjs-monorepo/blob/main/packages/content-pane/src/mixins/SubLayoutApplyMixin.ts),
[SlotVisibilityMixin](https://github.com/trunkjs/trunkjs-monorepo/blob/main/packages/browser-utils/src/mixins/SlotVisibilityMixin.ts),
[BreakPointMixin](https://github.com/trunkjs/trunkjs-monorepo/blob/main/packages/browser-utils/src/mixins/BreakPointMixin.ts)
und [TrunkJS Responsive](https://github.com/trunkjs/trunkjs-monorepo/tree/main/packages/responsive).

## Verbindlicher Nextrap-Skill

Für alle Arbeiten in diesem Repository ist der interne Nextrap-Skill verbindlich zu beachten:

```text
.agents/skills/nextrap-skill/SKILL.md
```

Der Skill muss vor Änderungen gelesen werden, sofern die Aufgabe das Nextrap-Monorepo, seine Packages, Komponenten, Styles, Demos, Tests, Dokumentation oder Skills betrifft.

Das gilt insbesondere für Vorgaben zu:

- Komponenten- und Package-Verträgen;
- Shadow-DOM-Minimierung und öffentlichen Parts;
- SCSS-/Code-Dokumentation und Zweckkommentaren;
- CSS- und Theme-Architektur;
- responsivem Verhalten über `tj-responsive` statt Media-Queries;
- Slots, Zuständen und Lifecycle-Callbacks;
- Wiederverwendung, APIs und Package-Grenzen;
- Tests, Demos und Prüfungen.

Bei Konflikten mit nachgelagerten oder allgemeinen Arbeitsanweisungen gelten für Änderungen in diesem Repository die spezifischeren Regeln des Nextrap-Skills. Mögliche Seiteneffekte müssen vor einer Änderung geprüft werden. Sind sie nicht eindeutig auszuschließen, ist vor der Umsetzung der User zu fragen.

## Library-Projekt und externe Änderungen

Dieses Repository ist ein Library-Projekt. Werden Änderungen von außerhalb dieses Repositories durchgeführt, insbesondere wenn es als Workspace, eingebundene Abhängigkeit oder Teil eines anderen Repositories beziehungsweise übergeordneten Projekts bearbeitet wird, müssen vor jeder Änderung zuerst alle Dateien, die geändert, neu angelegt oder gelöscht werden sollen, kurz und konkret aufgelistet werden; anschließend muss die ausdrückliche Zustimmung des Users zu genau diesen vorgesehenen Änderungen eingeholt werden, und erst nach dieser Zustimmung dürfen die Änderungen ausgeführt werden. Erfolgt die Entwicklung dagegen direkt innerhalb dieses Repositories als eigentliche Arbeitsumgebung und Ziel der Aufgabe, ist aufgrund dieser Library-Regel keine zusätzliche Zustimmung erforderlich.

Für automatische Aufgaben, die vom zentralen Hypervisor-Agenten in `dermatthes/chatgpt-agent-space` gestartet werden und ausschließlich auf einem eigenen Branch arbeiten sowie einen Pull Request zur menschlichen Prüfung erstellen oder aktualisieren, gilt die ausdrückliche Nutzerfreigabe dauerhaft als erteilt. Diese Ausnahme erlaubt keine direkten Commits auf `main`, keine Scope-Erweiterungen außerhalb der jeweiligen Agent-Aufgabe und kein automatisches oder eigenständiges Mergen.
