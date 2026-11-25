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

Die App konfiguriert `onFeedbackStart`, `onFeedbackEnd` und `onError`
des API-Stubs einmal zentral und verwendet darin die vorhandenen
`Feedback.*`-Funktionen. NTE Feedback benötigt keinen zusätzlichen Adapter.

**[Beispiel: API-Stub mit Feedback-Presets konfigurieren](https://github.com/nextrap/nextrap-monorepo/blob/main/nextrap-elements/nte-feedback/docs/api-stub-feedback.md)**
zeigt die vollständige Konfiguration in der Anwendung und die zugehörigen
Request-Aufrufe. Die dort definierten Presets sind Anwendungsbeispiele,
keine eingebauten NTE-Feedback-Presets.

| Beispiel-Preset | Während des Requests | Bei Erfolg | Bei Fehler |
| --- | --- | --- | --- |
| `mini` (Standard) | Mini-Balken | Keine Meldung | Fehlerdialog |
| `dialog` | Ladefenster | Erfolg mit Aktionsname | Fehler mit Aktionsname |
| `ai` | Ladefenster mit eigenem Text | Erfolg | Fehlerdialog |

Für individuelle Meldungen übergibt die Anwendung dem Stub z. B.
`feedback: { key: 'dialog', name: 'Datei speichern', successMessage: 'Gespeichert.' }`.

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
