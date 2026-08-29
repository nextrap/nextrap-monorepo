# NTE Privacy Consent

`<nte-privacy-consent>` is a small HTML-first consent dialog for optional scripts and embeds. It discovers services from the markup, stores a versioned decision and activates a service only after consent.

## Basic usage

```html
<nte-privacy-consent policy-version="2026-08" show-reject-all>
  <a slot="privacy-link" href="/datenschutz">Datenschutzerklärung</a>

  <script
    type="text/plain"
    data-consent-service="analytics"
    data-consent-label="Analytics"
    data-consent-purpose="Statistik"
    data-consent-description="Hilft uns, die Nutzung der Website zu verstehen."
    data-src="/analytics.js"
    defer>
  </script>

  <template
    data-consent-service="youtube"
    data-consent-label="YouTube"
    data-consent-purpose="Video"
    data-consent-privacy="https://policies.google.com/privacy">
    <iframe src="https://www.youtube-nocookie.com/embed/VIDEO_ID" title="Video"></iframe>
  </template>
</nte-privacy-consent>
```

The initial dialog always uses **Accept all** as its primary action. **Settings** opens the per-service switches. Add `show-reject-all` when the initial view should also offer direct rejection.

## Attributes

| Attribute | Default | Description |
|---|---|---|
| `policy-version` | required | Invalidates a stored decision after a material policy change. |
| `storage` | `local` | `local`, `session` or `memory`. |
| `storage-key` | `nte-privacy-consent` | Storage key used by Browser Utils. |
| `prompt` | `auto` | `auto` opens without a valid decision; `manual` waits for `show()`. |
| `show-reject-all` | off | Adds **Reject all** to the first view. |

## Service declarations

Each blocked `<script>` needs `type="text/plain"` and `data-consent-service`. Use `data-src` instead of `src`; `data-type="module"` restores a module script and `data-async` opts out of ordered loading. A `<template>` can hold iframes or arbitrary markup without loading it early.

Declarations sharing the same stable service ID become one setting. Add label, purpose, description and privacy URL to the first declaration.

## JavaScript API

```ts
const consent = document.querySelector('nte-privacy-consent');

consent.showPreferences();
await consent.setDecision({ analytics: true, youtube: false });
console.log(consent.getDecision());
```

Methods: `show()`, `showPreferences()`, `hide()`, `getDecision()`, `setDecision()` and `reset()`.

Events: `consent-ready`, `consent-change`, `consent-service-activated` and `consent-error`. All events bubble and are composed.

Scripts cannot be generically undone after execution. Withdrawal removes content cloned from templates, while provider-specific script cleanup or a reload remains the application's responsibility.
