---
name: nte-app-interaction-usage
description: "Use @nextrap/nte-app-interaction: nte-app-interaction (element), NteAppInteraction (element class/programmatic API), NTE_APP_INTERACTION_DEFAULT_AUTO_CLOSE_MS (programmatic API), NextrapLoadingDetail, NextrapProgressDetail, NextrapSuccessDetail, NextrapFailDetail, NextrapInfoDetail, NextrapConfirmDetail, NextrapConfirmAction and NteAppInteractionStatus (programmatic TypeScript APIs)."
---

# NTE App Interaction usage

- `<nte-app-interaction>` — Mounts the single global coordinator for application messages and questions. The current presenter is a native dialog; the public responsibility is presentation-independent. See the [usage demo](../../demo/01-usage.md).
- `NteAppInteraction` — Element class; `close()` dismisses and resets the active interaction. See the [interactive demo](../../demo/02-interactions.demo.ts).
- `NTE_APP_INTERACTION_DEFAULT_AUTO_CLOSE_MS` — Default duration for automatically closing terminal states. See the [source](../../src/lib/types.ts).
- `NextrapLoadingDetail` — Payload for `nextrap:loading`. See the [usage demo](../../demo/01-usage.md).
- `NextrapProgressDetail` — Payload for `nextrap:progress`. See the [usage demo](../../demo/01-usage.md).
- `NextrapSuccessDetail` — Payload for `nextrap:success`. See the [usage demo](../../demo/01-usage.md).
- `NextrapFailDetail` — Payload for `nextrap:fail`. See the [usage demo](../../demo/01-usage.md).
- `NextrapInfoDetail` — Payload for `nextrap:info`. See the [usage demo](../../demo/01-usage.md).
- `NextrapConfirmDetail` and `NextrapConfirmAction` — Payload and action entries for `nextrap:confirm`. See the [interactive demo](../../demo/02-interactions.demo.ts).
- `NteAppInteractionStatus` — Union of the internal app interaction states exposed for typed integrations. See the [source](../../src/lib/types.ts).

A future toast presenter may be delegated to for non-blocking messages. Keep that renderer separate from the global event coordinator; confirmations and blocking or cancelable operations remain modal.

The dialog presenter inherits its surface, text, border, radius and backdrop colors directly from `@nextrap/style-base`. Its Shadow DOM buttons use the targeted `@nextrap/style-button` mixins. Backdrop clicks close passive messages; interactions that require a selection or a non-cancelable running operation shake instead.
