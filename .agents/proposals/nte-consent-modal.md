# Proposal: NTE Consent (HTML-first)

- Status: Proposed
- Package: `@nextrap/nte-consent`
- Element: `<nte-consent>`
- Scope: declarative consent UI and deterministic resource gating

## Decision summary

Replace the controller-, adapter-, and TypeScript-config-heavy design with an HTML-first custom element.

The page declares optional services directly in markup. Gated JavaScript uses a non-JavaScript `type`; arbitrary embeds use `<template>`. `<nte-consent>` discovers those declarations, renders the consent UI, persists a small versioned decision record, and activates allowed resources by creating fresh DOM nodes.

No TypeScript configuration is required for normal use. A JavaScript API remains an optional escape hatch for SPAs and advanced provider integrations.

This component is a lightweight consent building block, not a certified CMP, tag scanner, legal policy engine, or IAB TCF/GPP implementation.

## Why simplify

The previous proposal split the feature across a controller, bootstrap entry, stores, receipt sinks, typed policy configuration, and provider adapters. That architecture is flexible but makes a common static/CMS integration unnecessarily difficult.

The common case should be visible in the HTML:

1. Which service is present?
2. Why does it need consent?
3. Which scripts or embeds belong to it?
4. What may run after consent?

The DOM becomes the service registry and activation plan. The element owns only discovery, choice UI, persistence, and deterministic activation.

## Market patterns

| Product/project | Configuration pattern | Lesson for NTE |
| --- | --- | --- |
| CookieConsent / Cookiebot | `type="text/plain"` plus a consent/category data attribute | Blocking scripts declaratively in HTML is an established pattern. |
| Klaro | `type="text/plain"`, `data-name`, `data-type`, and `data-src`; service metadata still lives in JavaScript config | Keep the script annotation pattern, but allow service metadata in HTML too. |
| tarteaucitron.js | JavaScript service registry with `js` and `fallback` callbacks | Powerful, but too callback-heavy for the default NTE API. |
| OneTrust/Usercentrics and hosted CMPs | Dashboard configuration, scanner, hosted policy, SDK, and audit services | These solve a larger operational/compliance problem than this package should claim to solve. |
| Google Consent Mode | Early provider-specific `default` and later `update` signals | Treat this as an optional integration mode, not as the core consent model. |

The proposed syntax intentionally resembles CookieConsent and Klaro so existing integrations are easy to migrate.

## Goals

- Configure services and gated resources in HTML.
- Render one consent choice per declared service, optionally grouped by purpose.
- Prevent marked scripts, iframes, images, or other embeds from loading before consent.
- Persist a versioned choice in local storage by default.
- Support session storage and memory storage as explicit alternatives.
- Reapply stored choices before activating declared resources.
- Expose small DOM events and methods for SPAs and exceptional provider behavior.
- Keep the implementation provider-neutral and dependency-light.

## Non-goals

- Legal advice, reviewed policy wording, or automatic lawful-basis decisions.
- Cookie/script scanning or automatic provider classification.
- Deleting arbitrary third-party cookies after withdrawal.
- Undoing JavaScript side effects or data already transmitted.
- IAB TCF/GPP strings, CMP certification, geolocation, consent receipts, or an audit backend.
- Loading arbitrary URLs from a TypeScript/JSON configuration object.
- Guaranteeing Google Consent Mode Advanced behavior without an explicit integration.

## Recommended declarative API

### One script per service

For a service that needs one external script, the complete declaration can live on the script tag:

```html
<nte-consent policy-version="2026-08">
  <script
    type="text/plain"
    data-consent-service="plausible"
    data-consent-purpose="analytics"
    data-consent-label="Plausible Analytics"
    data-consent-description="Hilft uns, die Nutzung der Website zu verstehen."
    data-consent-privacy="https://plausible.io/privacy"
    data-src="https://plausible.example/js/script.js"
    defer>
  </script>
</nte-consent>
```

`type="text/plain"` makes the original script a data block. The browser does not execute it and ignores its `src`. `data-src` also makes the blocked URL explicit and avoids eager fetching by tools that inspect `src`.

### Several resources for one service

Real providers often need an external loader plus inline initialization. Repeating the stable service ID groups all tags into one user choice. Metadata only has to appear on the first declaration.

```html
<nte-consent policy-version="2026-08">
  <script
    type="text/plain"
    data-consent-service="google-analytics"
    data-consent-purpose="analytics"
    data-consent-label="Google Analytics"
    data-consent-description="Reichweitenmessung und Nutzungsstatistik."
    data-consent-privacy="https://policies.google.com/privacy"
    data-src="https://www.googletagmanager.com/gtag/js?id=G-XXXX"
    data-async>
  </script>

  <script type="text/plain" data-consent-service="google-analytics">
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'G-XXXX');
  </script>
</nte-consent>
```

Tags for the same service activate in DOM order. External classic scripts are sequential by default so an inline initializer cannot overtake its loader. `data-async` opts a tag into asynchronous loading.

### Arbitrary HTML and embeds

`<template>` is the preferred inert container for iframes, videos, maps, images, widgets, and mixed markup:

```html
<nte-consent policy-version="2026-08">
  <template
    data-consent-service="youtube"
    data-consent-purpose="media"
    data-consent-label="YouTube"
    data-consent-description="Lädt Videos vom Anbieter YouTube."
    data-consent-privacy="https://policies.google.com/privacy">
    <iframe
      src="https://www.youtube-nocookie.com/embed/VIDEO_ID"
      title="Video"
      loading="lazy"
      allowfullscreen>
    </iframe>
  </template>
</nte-consent>
```

The template content is cloned only after consent. This is safer and more general than inventing `data-src` aliases for every possible HTML element.

### Optional explicit service wrapper

For verbose metadata or many resources, a declarative wrapper avoids repeating attributes:

```html
<nte-consent policy-version="2026-08">
  <nte-consent-service
    name="matomo"
    purpose="analytics"
    label="Matomo"
    description="Lokale Reichweitenmessung."
    privacy-url="/datenschutz#matomo">
    <script type="text/plain" data-src="/matomo.js"></script>
    <script type="text/plain">
      window._paq = window._paq || [];
    </script>
  </nte-consent-service>
</nte-consent>
```

The direct `data-consent-service` form is the minimal API. `<nte-consent-service>` is only syntax sugar for multi-resource services; both forms produce the same internal declaration.

## Public element API

### `<nte-consent>` attributes

| Attribute | Default | Meaning |
| --- | --- | --- |
| `policy-version` | required | Invalidates older decisions after a material policy/service change. |
| `storage` | `local` | `local`, `session`, or `memory`. |
| `storage-key` | `nte-consent` | First-party storage key. |
| `prompt` | `auto` | `auto` opens when no valid decision exists; `manual` waits for `show()`. |
| `selection` | `services` | `services` renders one choice per provider; a later `purposes` mode may aggregate choices. |
| `lang` | document language | Selects component-owned control labels. |

Scripts without a consent declaration execute normally and are outside the component's responsibility. Required code should therefore remain ordinary HTML, not use a fake `necessary` consent category.

### Service declaration attributes

| Attribute | Required | Meaning |
| --- | --- | --- |
| `data-consent-service` / `name` | yes | Stable service ID and grouping key. |
| `data-consent-purpose` / `purpose` | recommended | Human grouping such as `analytics`, `media`, or `marketing`. |
| `data-consent-label` / `label` | yes on first declaration | Display name. |
| `data-consent-description` / `description` | recommended | Short reason shown in preferences. |
| `data-consent-privacy` / `privacy-url` | recommended | Provider or site privacy information. |
| `data-src` | external scripts only | Source copied to a fresh executable script after consent. |
| `data-type` | no | Restored executable type, especially `module`; default is classic JavaScript. |
| `data-async` | no | Allow asynchronous activation instead of ordered activation. |
| `data-reload-on-withdraw` | no | Explain/request a reload when generic cleanup is impossible. |

Duplicate service declarations must agree on user-facing metadata. Conflicts emit an error and the service remains blocked.

### Methods

```ts
interface NteConsentElement extends HTMLElement {
  show(): void;
  showPreferences(): void;
  hide(): void;
  getDecision(): NteConsentDecision;
  setDecision(services: Record<string, boolean>): Promise<void>;
  reset(): Promise<void>;
}
```

The methods are optional integration hooks, not required configuration.

### Events

All events bubble and are composed.

| Event | Detail | Meaning |
| --- | --- | --- |
| `consent-ready` | `{ decision }` | Storage was read and declarations were resolved. |
| `consent-change` | `{ previous, current, changedServices }` | A decision was committed. |
| `consent-service-activated` | `{ service, elements }` | All currently allowed resources for one service activated. |
| `consent-error` | `{ phase, service?, error }` | Discovery, storage, or activation failed. |

A newly added matching script/template is discovered through a `MutationObserver`. If the service is already allowed, it activates once; otherwise it remains inert. This supports CMS fragments and SPA route changes without a separate controller.

### Slots

| Slot | Purpose |
| --- | --- |
| `title` | Site-specific heading. |
| `intro` | Consent explanation. |
| `privacy-link` | Link to site privacy/cookie information. |
| `launcher` | Persistent control for reopening preferences. |
| `footer` | Additional site-owned information. |

Accept all, reject optional, configure, and save controls remain component-owned for consistent accessibility and event behavior.

## Activation algorithm

The original blocked script is never made executable in place. Changing the `type` of an already parsed node is not a reliable execution contract.

For each allowed declaration, the element:

1. creates a fresh `<script>` element;
2. copies safe executable attributes such as nonce, integrity, crossorigin, referrerpolicy, nomodule, and the restored script type;
3. maps `data-src` to `src`;
4. copies inline source text when no external source exists;
5. inserts the new element beside the inert declaration;
6. marks the declaration as activated so it cannot run twice;
7. waits for ordered external scripts before activating following tags for the same service.

For `<template>`, it clones `template.content` into a generated container beside the template. Generated DOM is recorded so removable embeds can be detached on withdrawal.

Inline scripts remain subject to the page's Content Security Policy. A page that disallows inline scripts must use external scripts, a valid nonce/hash strategy, or its own event listener. The component does not bypass CSP or Trusted Types.

## Persistence

Default record in `localStorage`:

```json
{
  "schema": 1,
  "policyVersion": "2026-08",
  "services": {
    "plausible": true,
    "youtube": false
  },
  "decidedAt": "2026-08-28T12:00:00.000Z"
}
```

- `local` persists across browser restarts and is the recommended default for client-only sites.
- `session` is isolated to a tab/session and intentionally asks again in a new tab or browser session.
- `memory` is useful when storage is unavailable or deliberately disabled; it does not survive navigation.
- All storage access is guarded because browsers can deny access and throw.
- Missing, corrupt, or mismatched records mean no optional consent and reopen the prompt.
- A `storage` event applies valid decisions from another tab.

This client-writable record is preference state, not tamper-proof legal evidence. Applications that require server-side proof or SSR access need a separate backend/cookie integration; that is outside the MVP.

## Withdrawal behavior

Generic script execution cannot be undone. Removing a `<script>` element does not reverse its global listeners, timers, network requests, or cookies. The component therefore makes an honest distinction:

- templates/iframes and generated markup are removed immediately where possible;
- not-yet-activated scripts remain blocked;
- the persisted grant is revoked immediately;
- already activated scripts emit `consent-change` so provider-specific code may stop itself;
- services marked `data-reload-on-withdraw` ask for a page reload, after which the script stays blocked;
- the component never promises to delete arbitrary provider cookies.

Provider-specific cleanup can later be added as small optional integrations. It must not become mandatory TypeScript configuration for the base element.

## Google Consent Mode

The HTML-first gate corresponds naturally to Google Consent Mode Basic: Google tags are not loaded until consent is granted.

Advanced mode is different: Google code loads with restrictive defaults and may still send cookieless requests. If supported later, it should be an explicit optional element/entry point that:

- establishes `default: denied` before Google tags initialize;
- maps NTE service decisions to Google's consent signals;
- sends `update` on the same page after a choice;
- clearly documents that denied Advanced Mode is not the same as no network request.

It should not complicate the base script-gating API.

## Styling, responsive behavior, and accessibility

- Compose the existing public `nte-dialog` API rather than subclassing it.
- Use native labeled checkboxes for services and fixed text for required functionality.
- Show equally understandable reject, configure, and accept actions.
- Closing, Escape, scrolling, or navigation never grants consent.
- On narrow viewports, use a full-width/bottom-sheet presentation; on larger viewports, use a constrained dialog.
- Export CSS parts for dialog, service list, service item, purpose heading, actions, and launcher.
- Keep only functional layout in Shadow DOM; visual defaults belong in the package Sass mixin.
- Site-specific legal text remains slotted HTML; the package owns only generic control labels.

## Dependencies

- `@nextrap/nt-core` / repository-standard `nextrap_element`
- `@nextrap/nte-dialog`
- existing Lit runtime used by NTE packages

No provider SDK, CMP, scanner, geolocation service, or adapter framework is a runtime dependency.

## Implementation slices

1. Implement declarative discovery, service validation, local/session/memory persistence, and fresh-node script/template activation.
2. Add the dialog UI, slots, events, parts, responsive behavior, and usage/theming skills.
3. Add demos for one external script, ordered multi-script providers, a YouTube template, saved decisions, withdrawal, and SPA-inserted declarations.
4. Consider Google Consent Mode as an isolated follow-up only after the base API is proven.

## Acceptance criteria

- A static HTML page can configure a complete consent flow without TypeScript or a JavaScript config object.
- A marked external or inline script makes no request and executes no code before consent.
- A service with multiple scripts activates exactly once and in deterministic DOM order.
- Template-contained embeds do not load before consent and are removable after withdrawal.
- Missing, invalid, stale, or unavailable storage fails closed.
- A policy version change invalidates old optional grants.
- Duplicate/conflicting declarations fail closed and emit an observable error.
- Dynamically inserted declarations work without duplicating already activated services.
- The UI is keyboard accessible and exposes stable parts/slots.
- Withdrawal documentation does not claim that arbitrary JavaScript or cookies can be undone.
- Google Advanced Mode, TCF/GPP, scanning, certification, and server-side evidence remain outside the MVP.

## Open questions

1. Should `<nte-consent-service>` ship in v1, or is the direct script/template annotation sufficient initially?
2. Should the UI always expose individual services, or optionally group decisions at purpose level?
3. Is `localStorage` the right default, or should storage be explicitly selected?
4. Should withdrawal always offer a reload after any script activation, or only when `data-reload-on-withdraw` is present?
5. Should `policy-version` be mandatory, or may the component derive a fingerprint from declarations as a convenience?
6. Should Google Consent Mode Basic remain a documentation recipe or receive an isolated optional helper?

## Recommendation

Adopt the direct annotated script/template API as the MVP. Keep `<nte-consent-service>` as small declarative sugar if the implementation remains trivial. Default to per-service choices and local storage, require an explicit policy version, activate in DOM order, and handle withdrawal honestly through removable embeds, events, and optional reload.

This gives Nextrap the simplicity requested for static HTML and CMS use while leaving a narrow DOM API for advanced applications.

## References

- [CookieConsent: manage scripts](https://cookieconsent.orestbida.com/advanced/manage-scripts.html)
- [Cookiebot: manual cookie blocking](https://support.cookiebot.com/hc/en-us/articles/4405978132242-Manual-cookie-blocking)
- [Klaro: getting started](https://klaro.org/docs/getting-started)
- [tarteaucitron.js service model](https://github.com/AmauriC/tarteaucitron.js/)
- [HTML Standard: scripting and data blocks](https://html.spec.whatwg.org/multipage/scripting.html)
- [Google: set up consent mode](https://developers.google.com/tag-platform/security/guides/consent)
