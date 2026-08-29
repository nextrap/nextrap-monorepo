---
name: nte-privacy-consent-theming
description: Theme the @nextrap/nte-privacy-consent dialog through its parts, inherited Nextrap tokens and style-default mixin.
---

# NTE Privacy Consent Theming

The component inherits the page's `--nt-*` tokens. Its buttons compile the existing `@nextrap/style-button` primary and outline-secondary mixins into the Shadow DOM; do not recreate those button styles.

Public parts are `dialog`, `header`, `content`, `footer`, `title`, `body`, `intro`, `services`, `service` and `actions`. The first four are forwarded from `nte-dialog`.

```scss
@use '@nextrap/nte-privacy-consent' as privacy-consent;

.theme nte-privacy-consent.style-default {
  @include privacy-consent.style-default();
}

.theme nte-privacy-consent::part(service) {
  border-color: var(--nt-primary);
}
```

Use tokens and parts only. Do not target nodes inside the Shadow DOM. For markup and behavior, use `nte-privacy-consent-usage`.
