---
name: nte-notifier-usage
description: "Use @nextrap/nte-notifier: nte-notifier (element), NteNotifier (element class/programmatic API), NTE_NOTIFIER_DEFAULT_AUTO_CLOSE_MS (programmatic API), NextrapLoadingDetail, NextrapProgressDetail, NextrapSuccessDetail, NextrapFailDetail, NextrapInfoDetail, NextrapConfirmDetail, NextrapConfirmAction and NteNotifierStatus (programmatic TypeScript APIs)."
---

# NTE Notifier usage

- `<nte-notifier>` — Mounts the single global notification dialog. See the [usage demo](../../demo/01-usage.md).
- `NteNotifier` — Element class; `close()` dismisses and resets the active notification. See the [interactive demo](../../demo/02-interactions.demo.ts).
- `NTE_NOTIFIER_DEFAULT_AUTO_CLOSE_MS` — Default duration for automatically closing terminal states. See the [source](../../src/lib/types.ts).
- `NextrapLoadingDetail` — Payload for `nextrap:loading`. See the [usage demo](../../demo/01-usage.md).
- `NextrapProgressDetail` — Payload for `nextrap:progress`. See the [usage demo](../../demo/01-usage.md).
- `NextrapSuccessDetail` — Payload for `nextrap:success`. See the [usage demo](../../demo/01-usage.md).
- `NextrapFailDetail` — Payload for `nextrap:fail`. See the [usage demo](../../demo/01-usage.md).
- `NextrapInfoDetail` — Payload for `nextrap:info`. See the [usage demo](../../demo/01-usage.md).
- `NextrapConfirmDetail` and `NextrapConfirmAction` — Payload and action entries for `nextrap:confirm`. See the [interactive demo](../../demo/02-interactions.demo.ts).
- `NteNotifierStatus` — Union of the internal notifier states exposed for typed integrations. See the [source](../../src/lib/types.ts).
