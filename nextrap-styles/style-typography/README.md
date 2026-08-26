# @nextrap/style-typography

Typographic rules and vertical rhythm for individual text elements. Rich-content patterns such as `.prose`, boxes, tables and image layouts belong to `@nextrap/style-elements`.

## Sass entry points

The main entry point exports mixins without emitting CSS:

```scss
@use '@nextrap/style-typography' as type;

.article-theme {
  @include type.style-typography();
}
```

The scoped include styles native text elements and typography helper classes below `.article-theme`. To materialize the default typography globally, use:

```scss
@use '@nextrap/style-base/default';
@use '@nextrap/style-typography/default';
```

Load rich-content element patterns separately when needed:

```scss
@use '@nextrap/style-elements/default';
```

See the [typography demo](./demo/typography.md) for the supported text elements.
