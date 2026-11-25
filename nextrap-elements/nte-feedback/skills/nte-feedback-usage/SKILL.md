---
name: nte-feedback-usage
description: "Use @nextrap/nte-feedback and its Feedback static API for application alerts, confirmations, loading/progress states, success/error feedback and other central user interaction feedback."
---

# NTE Feedback usage

Für Single Page Applications die zentralen Feedback-Callbacks von
`@trunkjs/api-stub` verwenden. `<nte-feedback>` einmal in der App-Shell
einbinden. Keine individuellen Request-Wrapper, Loading-Flags oder
Catch-Blöcke nur für die API-Fehleranzeige in Komponenten.

```ts
import { Feedback } from '@nextrap/nte-feedback';
import { API as generatedAPI } from './generated-api';

export const API = generatedAPI.with(Feedback.createRequestHandler());
```

Standardmäßig Mini-Ladebalken, bei `feedback: { key: 'dialog', name: 'Datei speichern' }`
Ladefenster und Erfolgsmeldung. Individuelle `successMessage`, `errorMessage`
und `loadingMessage` sowie `data: { details: 'index.md' }` sind optional.
Die globale Fehleranzeige enthält den Namen und die Backend-Fehlermeldung.
Die Stub-Callbacks werden mit TrunkJS PR #49 eingeführt.
Details und Beispielrouten: [README](../../README.md) und
[SPA-Demo](../../demo/01-usage.md).

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
