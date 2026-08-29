---
name: nte-privacy-consent-usage
description: Use @nextrap/nte-privacy-consent to declare privacy-gated scripts and embeds in HTML and configure its consent dialog API.
---

# NTE Privacy Consent Usage

Use one `<nte-privacy-consent>` for the site-wide first-visit decision. Use `nte-consent-blocker` when an individual embed needs its own local placeholder instead.

```html
<nte-privacy-consent policy-version="2026-08" show-reject-all>
  <a slot="privacy-link" href="/datenschutz">Datenschutzerklärung</a>
  <script
    type="text/plain"
    data-consent-service="analytics"
    data-consent-label="Analytics"
    data-consent-description="Anonyme Reichweitenmessung"
    data-src="/analytics.js">
  </script>
  <template data-consent-service="youtube" data-consent-label="YouTube">
    <iframe src="https://www.youtube-nocookie.com/embed/VIDEO_ID" title="Video"></iframe>
  </template>
</nte-privacy-consent>
```

- `policy-version` invalidates older choices.
- `storage="local|session|memory"` selects persistence; local is the default.
- `show-reject-all` adds direct rejection to the initial view.
- Use `data-src`, not `src`, for blocked external scripts; use `data-type="module"` when needed.
- Declarations with the same `data-consent-service` form one setting and activate in DOM order.
- Methods: `show()`, `showPreferences()`, `hide()`, `getDecision()`, `setDecision()` and `reset()`.
- Events: `consent-ready`, `consent-change`, `consent-service-activated` and `consent-error`.

For parts, tokens and theme integration, use `nte-privacy-consent-theming`.
