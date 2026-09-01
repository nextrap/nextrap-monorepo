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

## Progress

Use determinate progress when the application knows the real percentage:

```ts
await Feedback.progress({
  progress: 45,
  message: 'Dateien werden verarbeitet …',
});
```

For long-running actions where the real duration is unknown, use mock progress with an expected holding time:

```ts
await Feedback.progress({
  mode: 'mock',
  durationMs: 15_000,
  message: 'Bericht wird erstellt …',
  cancelable: true,
});
```

Mock progress intentionally advances non-linearly: it reaches more than half very early, then slows down progressively and spends the final part of the configured duration close to completion. When `durationMs` expires, the feedback closes automatically and the returned promise resolves. Calling `Feedback.close()` or dismissing a cancelable mock progress closes it earlier and resolves the promise immediately.

The circular progress spinner is the only visual percentage indicator; there is no additional progress bar below the message.

## Details

All feedback variants accept optional `details`. Pass either a string or an array. Details are rendered below the message in a collapsible code block. Arrays are formatted as indented JSON, so mixed diagnostic values and objects remain readable.

```ts
await Feedback.success({
  message: 'Import abgeschlossen.',
  details: [
    { file: 'users.csv', imported: 24 },
    '2 Datensätze übersprungen',
  ],
  autoClose: false,
});
```

`Feedback.alert()` and `Feedback.confirm()` are the Nextrap replacements for browser `alert()` and `confirm()`. Use `Feedback.loading()` whenever an operation blocks or needs a waiting indicator, and `Feedback.progress()` whenever measurable or intentionally simulated progress is useful. All opening helpers return promises that resolve when the feedback closes; `confirm()` resolves to `boolean`.

Low-level `nextrap:*` window events remain available for integrations, but application code should prefer `Feedback.*`.
