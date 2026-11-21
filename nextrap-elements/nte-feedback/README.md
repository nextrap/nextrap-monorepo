# nte-feedback

Central application feedback surface for Nextrap.

Mount `<nte-feedback>` once and use the exported static `Feedback` API instead of dispatching custom events manually. It covers loading/progress feedback, success and error states, informational alerts and confirmation questions.

```bash
npm install @nextrap/nte-feedback
```

```html
<nte-feedback></nte-feedback>
```

```ts
import { Feedback } from '@nextrap/nte-feedback';

const loading = Feedback.loading({ message: 'Bitte warten …' });
try {
  await save();
  Feedback.close();
  await loading;
  await Feedback.success('Gespeichert.');
} catch (error) {
  Feedback.close();
  await Feedback.error({ message: 'Speichern fehlgeschlagen.', details: String(error), autoClose: false });
}

if (await Feedback.confirm('Datensatz wirklich löschen?')) {
  await remove();
}

await Feedback.alert('Die Verarbeitung ist abgeschlossen.');
```

`Feedback.alert()` and `Feedback.confirm()` are the Nextrap replacements for browser `alert()` and `confirm()`. Use `Feedback.loading()` whenever an operation blocks or needs a waiting indicator, and `Feedback.progress()` whenever measurable progress is available. All opening helpers return promises that resolve when the feedback closes; `confirm()` resolves to `boolean`.

Low-level `nextrap:*` window events remain available for integrations, but application code should prefer `Feedback.*`.

## Mini-Loader per Trigger steuern

`variant: 'mini'` zeigt einen 2 px hohen Balken in der Primärfarbe
(`--nt-primary`) am oberen Viewport-Rand, ohne die Oberfläche oder den Fokus zu
blockieren. Eine CSS-Animation erreicht
nach 200 ms bereits 50 % und läuft danach langsamer bis 95 %. Nach 10 Sekunden
bleibt der Balken dort stehen. `Feedback.ready()` lässt ihn von seiner aktuellen
Position bis 100 % laufen und anschließend ausblenden. Ohne `variant` oder mit
`variant: 'dialog'` bleibt der bisherige Loading-Dialog erhalten.

Bei aktivierter Bewegungsreduktion bleibt der Balken statisch bei 50 % und
verschwindet bei Ready ohne Bewegungsanimation.

Dieser Ausschnitt ersetzt den Loading-Teil oben und verwendet dasselbe `save()`:

```ts
const loading = Feedback.loading({ variant: 'mini', message: 'Wird gespeichert …' });
try {
  await save();
  Feedback.ready();
  await loading;
} catch (error) {
  Feedback.close();
  throw error;
}
```

Der ursprüngliche Loading-Promise wird nach dem Ausblenden aufgelöst.
`Feedback.close()` beendet den Loader sofort. Ready schließt auch den normalen
Loading-Dialog, ignoriert andere Feedback-Zustände und startet eine bereits
laufende Abschlussanimation nicht erneut. Wie bisher ist nur ein Feedback aktiv;
ein neuer Feedback-Aufruf ersetzt das vorherige.

Alternativ verwenden Integrationen die Window-Events direkt. Die Variante steht
im Detail des Loading-Events; das Ready-Event benötigt keine weiteren Daten:

```ts
window.dispatchEvent(new CustomEvent('nextrap:loading', {
  detail: { variant: 'mini' },
}));
try {
  await save();
  window.dispatchEvent(new Event('nextrap:ready'));
} catch (error) {
  window.dispatchEvent(new Event('nextrap:feedback-close'));
  throw error;
}
```

Im Demo-Viewer startet **Mini-Loader** den Balken; **Ready** zeigt den Abschluss.
**Schließen** beendet ihn unmittelbar.
