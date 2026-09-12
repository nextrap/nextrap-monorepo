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
- Komponenten (`nte-*` und `ntl-*`) besitzen zwei JavaScript-Entrypoints: `index.ts` exportiert die API von `unstyled.ts` und injiziert das aus `default.scss` kompilierte komponentenspezifische Light-DOM-CSS. Der öffentliche Entry Point `/unstyled` darf niemals Light-DOM-SCSS/-CSS direkt oder indirekt importieren, exportieren, re-exportieren, ausgeben oder injizieren, auch nicht durch Side-Effect-Imports, dynamische Imports, eingebundene Runtime-Module oder spätere Lifecycle-/API-Aufrufe. Er enthält ausschließlich Logik, Registrierung und inline eingebundene Shadow-DOM-Styles. Interne Komponentenabhängigkeiten werden im Unstyled-Importgraphen ebenfalls über `/unstyled` geladen; der normale Einstieg ergänzt deren Default-Einstiege. Theme-/Seaming-Entwicklung (insbesondere ThemeJS2) importiert Komponenten ausschließlich über `/unstyled` und materialisiert die öffentliche Sass-Mixin-API explizit im Theme. `index.scss` bleibt eine Sass-API ohne CSS-Ausgabe; `default.scss` materialisiert dieselben Mixins unter komponentenspezifischen `.style-default`-Selektoren. Instanzbezogene funktionale DOM-Geometrie und Zustandswerte bleiben Logik; sie dürfen keine Default-Stylesheets verstecken. Shadow-DOM-Styles bleiben auf den bestehenden Shadow-DOM-Vertrag beschränkt. Verbindlicher Vertrag: `ARCHITECTURE.md`.
- Cross-Package-Imports immer über `@nextrap/<package-name>`.
- Abhängigkeiten zwischen veröffentlichten `@nextrap/*`-Packages ausschließlich als `peerDependencies` deklarieren; keine internen Laufzeitabhängigkeiten in `dependencies`. Reine Demo-/Test-Abhängigkeiten bleiben `devDependencies`. Details und Generator-Vorgaben: Nextrap-Skill, Abschnitt „Libraries, interne Packages und Test-Abhängigkeiten“.
- Externe npm-Abhängigkeiten nur im Root-`package.json` pflegen.

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
