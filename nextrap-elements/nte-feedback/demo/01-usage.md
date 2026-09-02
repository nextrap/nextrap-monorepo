# `nte-feedback` verwenden

Mount once:

```html
<nte-feedback></nte-feedback>
```

Then import the public API:

```ts
import { Feedback } from '@nextrap/nte-feedback';

await Feedback.alert('Hinweis');

if (await Feedback.confirm('Wirklich fortfahren?')) {
  await Feedback.success('Bestätigt.');
}
```

For work in progress use `Feedback.loading()` or `Feedback.progress()`. The helpers are awaitable and resolve when the current feedback is closed.
