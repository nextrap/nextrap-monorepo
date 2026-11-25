# SPA: API-Feedback zentral konfigurieren

```html
<nte-feedback></nte-feedback>
```

Für API-Requests einer SPA die globalen Callbacks des TrunkJS API-Stubs
mit den vorhandenen `Feedback.*`-Funktionen verbinden. Die vollständige
Konfiguration mit frei definierbaren Presets steht im
[API-Stub-Konfigurationsbeispiel](https://github.com/nextrap/nextrap-monorepo/blob/main/nextrap-elements/nte-feedback/docs/api-stub-feedback.md).

Nach dieser einmaligen Konfiguration genügt in der Page:

```ts
import { API } from './api';

const file = await API.File.Get.request({ params: { id: 'index.md' } });

await API.File.Save.request({
  params: { id: 'index.md' },
  body: { content: file.content + '\nNeue Zeile' },
  feedback: { key: 'dialog', name: 'Datei speichern' },
});
```

Der GET zeigt nur den Mini-Ladebalken. Der Save öffnet ein Ladefenster
und zeigt Erfolg oder Fehler mit dem Aktionsnamen. Die Presets gehören
zur App-Konfiguration, nicht zum NTE-Feedback-Paket. Die Beispielrouten
erwarten ein entsprechendes Backend.

## Manuelle Aktionen

Die interaktive Demo zeigt die weiterhin verfügbaren manuellen Shortcuts
für lokale Aktionen, z. B. `Feedback.confirm()`, `Feedback.error()` und
`Feedback.progress()`. Für normale API-Aufrufe ist die zentrale
Konfiguration zu bevorzugen.
