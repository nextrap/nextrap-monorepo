# style-utils

This library was generated with [Nx](https://nx.dev).

## Synopsis

This library provides the utility classes known from Bootstrap but without the Media Queries.

The can be used in combination with [TrunkJS Responsive](https://github.com/trunkjs/trunkjs-monorepo/tree/main/packages/responsive).

- [Utility Classes](https://getbootstrap.com/docs/5.3/utilities/)

## Sass entry points

`@nextrap/style-utils` is a mixin-only Sass API and does not emit CSS. It
exports every individual utility mixin plus `style-utils()` from `_style-utils.scss`:

```scss
@use '@nextrap/style-utils' as u;

.card {
  @include u.d-flex();
  @include u.gap-3();
}

.theme-corporate {
  @include u.style-utils();
}
```

The scoped include above generates selectors such as
`.theme-corporate .d-flex`. To generate the complete class set globally, use
the default entry point instead:

```scss
@use '@nextrap/style-utils/default';
```



## Contents

### Background

- `.bg-primary`
- `.bg-secondary`
- `.bg-success`
