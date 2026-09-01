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

Use `Feedback.progress({ progress, message })` when measurable progress is available. Use `Feedback.loading()` whenever an operation needs a pending/waiting indicator even when no percentage exists.

## Browser API replacement

Do not use native browser `alert()` or `confirm()` in Nextrap application UI. Use `await Feedback.alert(...)` and `await Feedback.confirm(...)` instead. They use the shared accessible presenter and application styling.

## Available helpers

- `Feedback.open(kind, detail)` — generic awaitable low-level opener.
- `Feedback.close()` — closes the active feedback.
- `Feedback.loading(...)` — pending/waiting state.
- `Feedback.progress(...)` — measurable progress meter.
- `Feedback.success(...)` — successful terminal state.
- `Feedback.error(...)` / `Feedback.fail(...)` — error terminal state.
- `Feedback.info(...)` — informational feedback.
- `Feedback.alert(...)` — explicit OK acknowledgement; replacement for `window.alert()`.
- `Feedback.confirm(...)` — explicit OK/cancel decision; replacement for `window.confirm()`, resolves to `boolean`.

The underlying `nextrap:*` events remain a low-level integration contract, but normal application code and demos should use `Feedback.*` rather than dispatching events manually.

Demos follow the current `@trunkjs/demo-viewer` skill: use `controls: { items }`, handlers receive the demo environment, DOM access goes through `env.query*`, and viewer toast/log facilities replace custom demo logging UI.
