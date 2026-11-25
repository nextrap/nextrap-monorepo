# nte-feedback

Zentrale Feedback-Fläche für Nextrap. Für Single Page Applications ist die
Integration mit [@trunkjs/api-stub](https://github.com/trunkjs/trunkjs-monorepo/tree/main/packages/api-stub)
der bevorzugte Weg für API-Ladezustände, Erfolgsmeldungen und Backend-Fehler.
Feedback einmal zentral konfigurieren, statt jede Aktion mit eigenen
Loading-/Error-Wrappern oder lokalen Catch-Blöcken zu versehen.

```bash
npm install @nextrap/nte-feedback
```

Einmal in der App-Shell einbinden:

```html
<nte-feedback></nte-feedback>
```

## API-Stub: zentrale SPA-Konfiguration

Die App benötigt eine Version von `@trunkjs/api-stub` mit
`onFeedbackStart`, `onFeedbackEnd` und `onError`
([TrunkJS PR #49](https://github.com/trunkjs/trunkjs-monorepo/pull/49)).
Der Adapter besitzt keine feste Abhängigkeit zu dieser Library.

```ts
import { Feedback } from '@nextrap/nte-feedback';
import { API as generatedAPI } from './generated-api';

export const API = generatedAPI.with(Feedback.createRequestHandler());
```

```ts
// Standard: nur der Mini-Ladebalken am oberen Rand.
const file = await API.File.Get.request({ params: { id: 'index.md' } });

// Expliziter Dialog mit automatisch erzeugter Erfolgsmeldung.
await API.File.Save.request({
  params: { id: 'index.md' },
  body: { content: '# Startseite' },
  feedback: { key: 'dialog', name: 'Datei speichern' },
});

// Individuelle Meldungen und optionale Zusatzinformationen.
await API.File.Save.request({
  params: { id: 'index.md' },
  body: { content: '# Startseite' },
  feedback: {
    key: 'dialog',
    name: 'Datei speichern',
    loadingMessage: 'Die Startseite wird gespeichert …',
    successMessage: 'Die Startseite wurde gespeichert.',
    errorMessage: 'Die Startseite konnte nicht gespeichert werden.',
    data: { details: 'index.md' },
  },
});
```

| Feedback | Während des Requests | Bei Erfolg | Bei Fehler |
| --- | --- | --- | --- |
| Standard / `'mini'` | Mini-Balken | Keine Meldung | Fehlerdialog |
| `{ key: 'dialog', name: 'Datei speichern' }` | Ladefenster | Erfolgreich: Datei speichern | Fehler: Datei speichern |
| `successMessage` / `errorMessage` | Wie gewählt | Individueller Text | Individueller Text und Fehlerdetails |
| `false` | Keine Anzeige | Keine Anzeige | Fehlerdialog |
 
Ohne explizite Meldung werden Name und tatsächliche Fehlermeldung verwendet.
Fehlt der Name, dient der API-Routenname als Fallback. Bei einem HTTP-Fehler
wird nach Möglichkeit die JSON-Fehlermeldung des Backends gelesen; HTTP-Status
und zusätzliche Textdetails stehen im Fehlerdialog. `successMessage: false`
und `errorMessage: false` unterdrücken die jeweilige Anzeige; `reportError: false`
deaktiviert den Error-Callback im Stub. Fehler bleiben Promise-Rejections.
Abbrüche erzeugen keine Fehlermeldung. Der Adapter verwaltet die Request-IDs,
damit ein beendeter Request den Loader eines anderen nicht schließt. Dialoge
haben Vorrang vor Mini-Feedback; Abschlussmeldungen werden nach den laufenden
sichtbaren Requests nacheinander angezeigt.

Eigene Presets werden einmal zentral definiert, z. B.:

```ts
export const API = generatedAPI.with(Feedback.createRequestHandler({
  ai: { variant: 'dialog', loadingMessage: 'AI arbeitet …' },
}));

await API.File.Save.request({
  params: { id: 'index.md' },
  body: { content: '# Startseite' },
  feedback: { key: 'ai', name: 'Datei speichern' },
});
```

## Manuelle Feedback-Funktionen

Für UI-spezifische Aktionen ohne API-Request, etwa Bestätigungen, Hinweise
oder lokale Validierung, steht die statische API weiterhin zur Verfügung.
Sie ist nicht der Standard-Wrapper für Backend-Requests. Da nur eine
Feedback-Fläche existiert, ersetzen manuelle Öffnungen das aktive Feedback;
vermeide konkurrierende manuelle Anzeigen während API-Feedback aktiv ist.

| Funktion | Zweck |
| --- | --- |
| `Feedback.loading({ variant: 'mini' })` | Nicht blockierenden Ladebalken starten |
| `Feedback.loading({ variant: 'dialog', message: 'Bitte warten …' })` | Ladefenster öffnen |
| `Feedback.ready()` | Loading abschließen, Mini-Balken animiert ausblenden |
| `Feedback.progress({ progress: 45, message: 'Import läuft …' })` | Messbaren Fortschritt anzeigen |
| `Feedback.success('Gespeichert.')` | Erfolg melden |
| `Feedback.error({ message: 'Fehler', details: 'Datei fehlt', autoClose: false })` / `Feedback.fail(...)` | Fehler melden |
| `Feedback.info('Hinweis')` | Information anzeigen |
| `Feedback.alert('Hinweis')` | Bestätigung per OK abwarten |
| `Feedback.confirm('Wirklich löschen?')` | Entscheidung abfragen, Promise<boolean> |
| `Feedback.close()` | Aktives Feedback sofort schließen |
| `Feedback.open(kind, detail)` | Low-Level-Shortcut für Sonderfälle |

```ts
import { Feedback } from '@nextrap/nte-feedback';

if (await Feedback.confirm('Datensatz wirklich löschen?')) {
  await API.File.Delete.request({ params: { id: 'index.md' } });
}
```

Öffnende Funktionen liefern Promises, die beim Schließen aufgelöst werden.
`Feedback.alert()` und `Feedback.confirm()` ersetzen die Browser-Dialoge.
Window-Events `nextrap:*` bleiben ein Low-Level-Integrationsvertrag.

## Mini-Ladebalken

`variant: 'mini'` zeigt einen 2 px hohen Balken in der Primärfarbe
(`--nt-primary`) am oberen Viewport-Rand, ohne Fokus oder Oberfläche zu
blockieren. Die Animation erreicht nach 200 ms 50 %, nach insgesamt
10 Sekunden 95 % und hält diesen Stand. `Feedback.ready()` animiert auf
100 % und blendet den Balken aus. Bei Bewegungsreduktion bleibt er statisch
bei 50 % und verschwindet bei Ready. `Feedback.close()` schließt sofort.
Ohne Variante bleibt die manuelle Loading-API beim bisherigen Dialog.

Siehe [SPA-Demo](demo/01-usage.md) und die interaktive Demo für die manuellen
Feedback-Shortcuts.
