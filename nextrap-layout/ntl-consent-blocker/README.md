# ntl-consent-blocker

`ntl-consent-blocker` is a consent-gate layout component for external embeds such as Google Maps. It shows a preview/background and a pre-consent message first. After a click on an element with `data-action="consent"`, the direct `<template>` content is cloned into the consented-content slot.

## Example

```md
---
{: layout="ntl-consent-blocker.default"}

![Map preview](/map-preview.jpg)

<template>
  <iframe title="Map" src="..."></iframe>
</template>

<button class="btn btn-primary" slot="pre-consent" data-action="consent">Karte laden</button>
```

## Styling

```scss
@use '@nextrap/ntl-consent-blocker' as consentBlocker;

ntl-consent-blocker.default {
  @include consentBlocker.default-style();
}
```

Available parts: `wrapper`, `background`, `pre-consent`, `consented-content`, `loading-text`.

See `demo/base.md` and `demo/pairing-ntl-2col.md` for usage examples.
