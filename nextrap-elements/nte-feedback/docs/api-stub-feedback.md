# API-Stub-Feedback in einer SPA konfigurieren

`<nte-feedback>` einmal in der App-Shell platzieren. Die Anwendung konfiguriert
die Feedback-Callbacks des [TrunkJS API-Stub](https://github.com/trunkjs/trunkjs-monorepo/tree/main/packages/api-stub)
einmal zentral in ihrer `api.ts`. Eine API-Stub-Version mit den Callbacks aus
[PR #49](https://github.com/trunkjs/trunkjs-monorepo/pull/49) ist erforderlich.

## 1. Presets und globale Callbacks

Dieses bewusst einfache Anwendungsbeispiel verwendet die vorhandene
`Feedback`-API direkt, ohne zusätzlichen Nextrap-Adapter. Es setzt voraus,
dass sichtbare Aktionen nacheinander ausgeführt werden. Für parallel laufende
Requests siehe den Hinweis unten.

```ts
import { Feedback } from '@nextrap/nte-feedback';
import type { FeedbackEvent } from '@trunkjs/api-stub';
import { API as generatedAPI } from './generated-api';

// Frei definierbare Presets der Anwendung.
const presets: Record<string, {
  variant: 'mini' | 'dialog';
  success: boolean;
  loadingMessage?: string;
}> = {
  mini: { variant: 'mini', success: false },
  dialog: { variant: 'dialog', success: true },
  ai: { variant: 'dialog', success: true, loadingMessage: 'AI arbeitet …' },
};

function preset(event: FeedbackEvent) {
  return presets[event.key ?? 'mini'] ?? presets.mini;
}

export const API = generatedAPI.with({
  feedback: 'mini',

  onFeedbackStart(event) {
    const details = event.feedback || {};
    const name = event.name ?? event.context.name;

    // Nicht awaiten: Feedback-Promises lösen erst beim Schließen auf.
    void Feedback.loading({
      variant: preset(event).variant,
      title: name,
      message: details.loadingMessage ?? preset(event).loadingMessage ?? name,
    });
  },

  onFeedbackEnd(event) {
    Feedback.ready();
    const details = event.feedback || {};
    const name = event.name ?? event.context.name;

    if (event.status === 'success' && details.successMessage !== false
        && (preset(event).success || details.successMessage !== undefined)) {
      void Feedback.success({
        title: 'Erfolgreich: ' + name,
        message: details.successMessage ?? 'Vorgang erfolgreich abgeschlossen.',
      });
    }
  },

  onError(event) {
    const details = event.feedback || {};
    if (details.errorMessage === false) return;

    const name = event.name ?? event.context.name;
    const reason = event.error instanceof Error
      ? event.error.message : String(event.error);

    void Feedback.error({
      title: 'Fehler: ' + name,
      message: details.errorMessage ?? reason,
      details: [
        reason,
        event.response ? 'HTTP ' + event.response.status : '',
        typeof details.data === 'string' ? details.data : '',
      ].filter(Boolean).join('\n'),
      autoClose: false,
    });
  },
});
```

Das Beispiel verwendet die vom Stub gelieferte Exception und den HTTP-Status.
Wenn das Backend zusätzlich strukturierte Fehlermeldungen im Response-Body
liefert, kann der zentrale `onError`-Callback diese nach dem API-Vertrag der
Anwendung aus einer Response-Kopie lesen und als Details anzeigen.

## 2. Verwendung in Pages und Komponenten

Die typisierten Beispielrouten `File.Get` und `File.Save` werden vom eigenen
Backend bereitgestellt. Die Page importiert nur die konfigurierte API:

```ts
import { API } from './api';

// Standard: Mini-Ladebalken, keine Erfolgsmeldung.
const file = await API.File.Get.request({ params: { id: 'index.md' } });

// Dialog mit automatisch erzeugten Meldungen.
await API.File.Save.request({
  params: { id: 'index.md' },
  body: { content: file.content + '\nNeue Zeile' },
  feedback: { key: 'dialog', name: 'Datei speichern' },
});
```

Bei Erfolg erscheint „Erfolgreich: Datei speichern“, bei Fehler
„Fehler: Datei speichern“ mit der ursprünglichen Fehlermeldung.

## 3. Individuelle Texte

Dieser Aufruf ersetzt den Save-Aufruf aus dem vorigen Beispiel:

```ts
await API.File.Save.request({
  params: { id: 'index.md' },
  body: { content: '# Startseite' },
  feedback: {
    key: 'dialog',
    name: 'Startseite speichern',
    successMessage: 'Die Startseite wurde gespeichert.',
    errorMessage: 'Die Startseite konnte nicht gespeichert werden.',
    data: 'index.md',
  },
});
```

Weitere Presets werden nur in `api.ts` ergänzt. `feedback: false`
deaktiviert den Ladezustand, nicht den globalen Error-Callback.
`reportError: false` deaktiviert diesen explizit. Fehler bleiben
Promise-Rejections; Abbrüche lösen keinen globalen Error-Callback aus.

## 4. Parallele Requests

NTE Feedback besitzt eine einzige Feedback-Fläche. Für gleichzeitig laufende
Requests muss die zentrale App-Konfiguration die aktiven `event.id`-Werte
verwalten: Mini-Loading erst beim ersten Request öffnen, erst nach dem letzten
beenden und Abschluss-/Fehlermeldungen so koordinieren, dass sie nicht durch
andere Requests überschrieben werden. Das obige Beispiel ist bewusst kein
vollständiger Parallelitäts- oder Dialog-Manager. Diese Koordination gehört
einmal in die Anwendung, nicht in einzelne Komponenten und nicht in NTE Feedback.
