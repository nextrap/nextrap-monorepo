# AGENTS.md – nextrap-monorepo

Diese Datei bleibt absichtlich kurz. Detaillierter Repository-Kontext steht in `AGENT_CONTEXT.md`; allgemeine Arbeitsregeln stehen in den Skills.

## Start

1. `AGENT_CONTEXT.md` lesen und als Onboarding-Cache verwenden.
2. Passende Skills laden, insbesondere `basic-coding`, `nextrap-lib-programming` und bei interner Arbeit an komplexen Strukturen `architecture-decisions`.
3. Weitere Skills unter `.agents/skills/` konsultieren; diese können teilweise als Git-Submodule eingebunden sein.
4. Bei package-spezifischer Arbeit lokale Skills unter `<package>/.agents/skills/` bevorzugen.
5. Bei interner Projektentwicklung vor strukturellen Änderungen nach anwendbaren `ARCHITECTURE.md`-Dateien in Repository- und Package-Wurzeln suchen und deren Verträge unverändert einhalten. Diese Dateien sind keine Library-Usage-Dokumentation.

## Repo-spezifische Kurzregeln

- Nicht aus `workspaces/`, `node_modules/`, `dist/` oder generierten Artefakten implementieren.
- Cross-Package-Imports immer über `@nextrap/<package-name>`.
- Externe npm-Abhängigkeiten nur im Root-`package.json` pflegen.
