---
name: nte-feedback-usage
description: "Use @nextrap/nte-feedback and its Feedback static API for application alerts, confirmations, loading/progress states, success/error feedback and other central user interaction feedback."
---

# NTE Feedback usage

Use `@nextrap/nte-feedback` as the single, central application feedback surface. Mount `<nte-feedback>` once in the application shell and call the static `Feedback` API from application code.

## Preferred public API

```ts
import { Feedback } from '@nextrap/nte-feedback';

await Feedback.alert('Hinweis');
const accepted = await Feedback.confirm('Fortfahren?');
await Feedback.success('Gespeichert.');
await Feedback.error({ message: 'Fehlgeschlagen.', details: errorText, autoClose: false });
```

For asynchronous work, open loading immediately, perform the work, then close or replace it:

```ts
const loading = Feedback.loading({ message: 'Bitte warten …' });
try {
  await request();
  Feedback.close();
  await loading;
  await Feedback.success('Fertig.');
} catch (error) {
  Feedback.close();
  await Feedback.error({ message: 'Fehler', details: String(error), autoClose: false });
}
```

Use `Feedback.progress({ progress, message })` when measurable progress is available. The percentage is shown by the circular spinner only; do not expect or add a second progress bar below the content.

For long-running work where no real percentage is available, use mock progress:

```ts
await Feedback.progress({
  mode: 'mock',
  durationMs: 15_000,
  message: 'Bericht wird erstellt …',
  cancelable: true,
});
```

Mock progress advances quickly at the beginning, passes 50% very early, then progressively slows down. It closes automatically after `durationMs` and the returned promise resolves. `Feedback.close()` or a permitted user dismissal can finish it earlier and resolves the same promise.

Use `Feedback.loading()` instead when no percentage display is desired at all.

## Details

Every feedback detail object may contain `details`. Supported values are a string or an array. The presenter renders details below the normal content inside a collapsible `<pre><code>` block. Arrays are formatted as indented JSON.

```ts
await Feedback.success({
  message: 'Import abgeschlossen.',
  details: [{ imported: 24 }, '2 Datensätze übersprungen'],
  autoClose: false,
});
```

## Browser API replacement

Do not use native browser `alert()` or `confirm()` in Nextrap application UI. Use `await Feedback.alert(...)` and `await Feedback.confirm(...)` instead. They use the shared accessible presenter and application styling.

## Available helpers

- `Feedback.open(kind, detail)` — generic awaitable low-level opener.
- `Feedback.close()` — closes the active feedback.
- `Feedback.loading(...)` — pending/waiting state.
- `Feedback.progress(...)` — determinate or mock progress meter.
- `Feedback.success(...)` — successful terminal state.
- `Feedback.error(...)` / `Feedback.fail(...)` — error terminal state.
- `Feedback.info(...)` — informational feedback.
- `Feedback.alert(...)` — explicit OK acknowledgement; replacement for `window.alert()`.
- `Feedback.confirm(...)` — explicit OK/cancel decision; replacement for `window.confirm()`, resolves to `boolean`.

The underlying `nextrap:*` events remain a low-level integration contract, but normal application code and demos should use `Feedback.*` rather than dispatching events manually.

Demos follow the current `@trunkjs/demo-viewer` API. Prefer the declarative `html` property for static example markup; use `render(root)` only when imperative rendering is actually required. Controls use `controls: { items }`, handlers receive the demo environment, DOM access goes through `env.query*`, and viewer toast/log facilities replace custom demo logging UI.
