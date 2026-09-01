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
