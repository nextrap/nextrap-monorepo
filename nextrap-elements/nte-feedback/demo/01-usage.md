# SPA: API-Feedback zentral konfigurieren

Das Feedback wird einmal in der App-Shell eingebunden:

```html
<nte-feedback></nte-feedback>
```

Dieses Beispiel zeigt die echte API-Stub-Konfiguration mit zwei
typisierten Beispielrouten. Voraussetzung ist eine Version von
`@trunkjs/api-stub` mit den Feedback-Callbacks aus
[PR #49](https://github.com/trunkjs/trunkjs-monorepo/pull/49).
Die Beispielrouten erwarten ein entsprechendes Backend; es ist eine
Konfigurationsdemo, kein gestarteter Demo-Server.

```ts
import { createApi, type ApiRoute } from '@trunkjs/api-stub';
import { Feedback } from '@nextrap/nte-feedback';

type FileData = { content: string };
type Routes = {
  File: {
    Get: ApiRoute<{ id: string }, {}, never, FileData>;
    Save: ApiRoute<{ id: string }, {}, FileData, FileData>;
  };
};

const API = createApi<Routes>({
  'File.Get': ['GET', '/api/files/{id}'],
  'File.Save': ['PUT', '/api/files/{id}'],
}, Feedback.createRequestHandler());

const file = await API.File.Get.request({ params: { id: 'index.md' } });

await API.File.Save.request({
  params: { id: 'index.md' },
  body: { content: file.content + '\nNeue Zeile' },
  feedback: { key: 'dialog', name: 'Datei speichern' },
});
```

Der GET zeigt nur den Mini-Ladebalken. Der Save öffnet ein Ladefenster
mit dem Namen und meldet bei Erfolg **Erfolgreich: Datei speichern**.
Bei einem Fehler erscheint **Fehler: Datei speichern** mit der
Fehlermeldung des Backends bzw. der Exception.

## Individuelle Texte

Die folgende Variante ersetzt den Save-Aufruf oben:

```ts
await API.File.Save.request({
  params: { id: 'index.md' },
  body: { content: '# Startseite' },
  feedback: {
    key: 'dialog',
    name: 'Startseite speichern',
    successMessage: 'Die Startseite wurde gespeichert.',
    errorMessage: 'Die Startseite konnte nicht gespeichert werden.',
    data: { details: 'index.md' },
  },
});
```

Die API liefert weiterhin die typisierte Response oder verwirft das
Promise mit dem ursprünglichen Fehler. Kein zusätzlicher Feedback-Wrapper
in der Page oder UI-Komponente ist notwendig.

## Manuelle Aktionen

Die interaktive Demo zeigt die weiterhin verfügbaren manuellen Shortcuts
für lokale Aktionen, z. B. `Feedback.confirm()`, `Feedback.error()` und
`Feedback.progress()`. Für normale API-Aufrufe ist die zentrale
Konfiguration oben zu bevorzugen.
