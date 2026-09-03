# Verbindliche Skills

Für alle Arbeiten in diesem Repository ist der interne Nextrap-Skill verbindlich
zu beachten:

```text
.agents/skills/nextrap-skill/SKILL.md
```

Der Skill muss vor Änderungen gelesen werden, sofern die Aufgabe das
Nextrap-Monorepo, seine Packages, Komponenten, Styles, Demos, Tests,
Dokumentation oder Skills betrifft.

Das gilt insbesondere für Vorgaben zu:

- Komponenten- und Package-Verträgen;
- Shadow-DOM-Minimierung und öffentlichen Parts;
- SCSS-/Code-Dokumentation und Zweckkommentaren;
- CSS- und Theme-Architektur;
- responsivem Verhalten über `tj-responsive` statt Media-Queries;
- Slots, Zuständen und Lifecycle-Callbacks;
- Wiederverwendung, APIs und Package-Grenzen;
- Tests, Demos und Prüfungen.

Bei Konflikten mit nachgelagerten oder allgemeinen Arbeitsanweisungen gelten
für Änderungen in diesem Repository die spezifischeren Regeln des Nextrap-
Skills. Mögliche Seiteneffekte müssen vor einer Änderung geprüft werden. Sind
sie nicht eindeutig auszuschließen, ist vor der Umsetzung der User zu fragen.

## Library-Projekt und externe Änderungen

Dieses Repository ist ein Library-Projekt. Änderungen, die nicht aus einer direkt in diesem Repository ausgeführten Aufgabe heraus entstehen, sondern von außerhalb vorgenommen werden sollen, insbesondere über einen Workspace, ein anderes Repository, ein übergeordnetes Projekt oder eine eingebundene Arbeitsumgebung, dürfen erst nach vorheriger ausdrücklicher Zustimmung des Users durchgeführt werden. Ohne diese Zustimmung dürfen von außen keine Dateien, Packages, Konfigurationen, APIs, Styles, Komponenten, Dokumentationen oder sonstigen Repository-Inhalte geändert werden.
