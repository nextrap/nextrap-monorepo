# `nte-app-interaction` verwenden

Das Element wird genau einmal auf der Seite gemountet und anschließend über globale `window`-Events gesteuert.

```html
<nte-app-interaction></nte-app-interaction>
```

```ts
window.dispatchEvent(
  new CustomEvent('nextrap:progress', {
    detail: {
      title: 'Datei-Upload',
      progress: 45,
      message: 'Dateien werden verarbeitet...',
      cancelable: true,
    },
  }),
);
```

## Öffentliche Event-API

| Event | Detail-Typ | Einsatzzweck |
|---|---|---|
| `nextrap:loading` | `NextrapLoadingDetail` | Unbestimmte Wartezeit mit optionalem Abbruch |
| `nextrap:progress` | `NextrapProgressDetail` | Fortschritt von 0 bis 100 mit optionalem Abbruch |
| `nextrap:success` | `NextrapSuccessDetail` | Erfolgsstatus, standardmäßig automatisch geschlossen |
| `nextrap:fail` | `NextrapFailDetail` | Fehlerstatus mit optional aufklappbaren Details |
| `nextrap:info` | `NextrapInfoDetail` | Hinweis mit optionalem Bestätigungs-Callback |
| `nextrap:confirm` | `NextrapConfirmDetail` | Entscheidung mit frei definierbaren `NextrapConfirmAction`-Aktionen |

`title`, `message` und `cancelable` stehen in allen Detail-Typen zur Verfügung. Statusabhängig kommen `reference`, `onAbort`, `progress`, `autoClose`, `details`, `onConfirm`, `html` oder `actions` hinzu. Mit `NteAppInteraction.close()` lässt sich der aktuelle Dialog programmgesteuert schließen.

Die interaktive Demo zeigt alle Zustände über die ausblendbare Controls-Leiste am unteren Fensterrand.
