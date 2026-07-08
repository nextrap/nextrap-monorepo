# ntl-accordion

Accordion layout component for embedded FAQ/detail blocks. The component keeps Shadow DOM styles functional only; visual defaults are provided through exported SCSS mixins.

## Import

```ts
import '@nextrap/ntl-accordion';
```

```scss
@use '@nextrap/ntl-accordion' as accordion;
```

## Basic usage

```markdown
## FAQ
{: layout="ntl-accordion.default"}

### Question 1

Answer 1

### Question 2

Answer 2
```

Accordions are intended to be used inside parent layouts/cards/content sections. Outer spacing should be handled by that parent.

## Attributes

### `ntl-accordion`

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `exclusive` | boolean | `true` | When an item opens, other open items are closed. |
| `initial-open-index` | number | `0` | Item index opened on first render. Empty attribute means `0`; omit or set invalid to disable. |
| `marker-position` | `start` \| `end` | item default | Propagated to child items unless they define their own value. |
| `marker-icon` | `chevron` \| `plus` | CSS default | Propagated to child items unless they define their own value. |

### `ntl-accordion-item`

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | boolean | `false` | Reflects the native `<details>` state. |
| `marker-position` | `start` \| `end` | `end` | Marker position for this item. |
| `marker-icon` | `chevron` \| `plus` | `null` | Marker icon variant for this item. |

## CSS parts

- `ntl-accordion`: `accordion`
- `ntl-accordion-item`: `details`, `summary`, `title`, `marker`, `content`

## Mixins

```scss
@include accordion.default-style();
@include accordion.with-details-end();
@include accordion.with-marker-start();
@include accordion.with-marker-plus();
@include accordion.with-modifier-classes();
```

`default-style()` includes the modifier classes by default:

- `.details-end`
- `.marker-start`
- `.marker-plus`

The package also provides `default.scss` with a `.default` class for demos/simple usage.
