# nte-consent-blocker

`nte-consent-blocker` is a consent gate for external embeds such as Google Maps. It shows a preview and a consent prompt
before cloning the direct `<template>` content into the `consented-content` slot.

## Short example

Only the consented content is normally required. The component supplies its Maps preview and pre-consent prompt as
default slot content.

```md
---
{: layout="nte-consent-blocker"}

<template>
  <iframe title="Map" src="..."></iframe>
</template>
```

## Shared templates

`--default-template-selector`, `--default-background-selector`, and `--default-pre-consent-selector` may reference
document-level `<template>` elements. Define these variables once on a theme selector to reuse the same defaults across
many blockers and keep each content occurrence short. Direct templates or explicitly assigned slot content take
precedence, so selectors are optional.

```html
<template id="map-background"><img alt="Map preview" src="..."></template>
<template id="map-consent"><button data-action="consent">Load map</button></template>
```

```css
nte-consent-blocker {
  --default-background-selector: #map-background;
  --default-pre-consent-selector: #map-consent;
}
```

## Styling

```scss
@use '@nextrap/nte-consent-blocker' as consentBlocker;

nte-consent-blocker.default {
  @include consentBlocker.default-style();
}
```

Available parts: `wrapper`, `background`, `pre-consent`, `consented-content`, `loading-text`.

See `demo/base.md` and `demo/pairing-ntl-2col.md` for usage examples.
