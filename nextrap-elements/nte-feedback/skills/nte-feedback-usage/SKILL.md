---
name: nte-feedback-usage
description: "Use @nextrap/nte-feedback and its Feedback static API for application alerts, confirmations, loading/progress states, success/error feedback and other central user interaction feedback."
---

# NTE Feedback usage

Für Single Page Applications die zentralen Feedback-Callbacks von
`@trunkjs/api-stub` verwenden. `<nte-feedback>` einmal in der App-Shell
einbinden. Keine individuellen Request-Wrapper, Loading-Flags oder
Catch-Blöcke nur für die API-Fehleranzeige in Komponenten.

Die App konfiguriert `onFeedbackStart`, `onFeedbackEnd` und `onError`
des API-Stubs einmal zentral mit den vorhandenen `Feedback.*`-Methoden.
Das [Konfigurationsbeispiel mit Presets](https://github.com/nextrap/nextrap-monorepo/blob/main/nextrap-elements/nte-feedback/docs/api-stub-feedback.md)
zeigt Mini-Ladebalken als Standard, Ladefenster mit Aktionsnamen sowie
individuelle Meldungen. Die Presets werden in der App definiert; NTE Feedback
stellt dafür keinen zusätzlichen Adapter bereit. Bei parallelen Requests
koordiniert die App die Feedback-Anzeige anhand der Request-IDs.

## Manuelle API für Nicht-API-Aktionen

- `Feedback.loading(...)`, `Feedback.ready()`, `Feedback.progress(...)` —
  lokale Lade- und Fortschrittsanzeige.
- `Feedback.success(...)`, `Feedback.error(...)` / `Feedback.fail(...)` —
  manuelle Erfolgsmeldung und Fehleranzeige.
- `Feedback.info(...)`, `Feedback.alert(...)`, `Feedback.confirm(...)` —
  Hinweise und Bestätigung (statt Browser-Dialoge).
- `Feedback.open(kind, detail)`, `Feedback.close()` — Low-Level-Shortcuts.

Öffnende Methoden liefern Promises, die beim Schließen auflösen;
`confirm()` liefert boolean. Manuelle Öffnungen ersetzen die aktive
Feedback-Fläche. Nicht zusätzlich zu zentralem API-Feedback einsetzen.
Die `nextrap:*` Window-Events bleiben ein Low-Level-Vertrag.

Demos nutzen `controls: { items }`, Demo-Environment für DOM-Zugriffe
und Viewer-Toast/Log-Funktionen.
