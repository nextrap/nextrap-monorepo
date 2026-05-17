# nte-input

Minimal input wrapper for Nextrap.

`nte-input` itself only renders the frame around a control:

- a label above the control
- a bordered control box
- a validation area below the control
- an optional input aid area below the control

The actual control markup is provided through statically registered plugins.

Built-in plugins currently cover:
- text / email / password
- textarea
- select
- select-radio
- checkbox
- token-input

## Installation

```bash
npm install @nextrap/nte-input
```

## Plugin interface

Plugins are classes.
The package exposes:

- `NteInputPluginInterface`
- `AbstractNteInputPlugin`

Typical plugin shape:

```ts
class MyPlugin extends AbstractNteInputPlugin {
  static readonly types = ['text'];

  render(context: NteInputRenderContext) {
    return html`...`;
  }
}
```

The host element forwards these plugin APIs via:

```ts
element.value;
element.value = ...;
element.selectedOptions;
```

`nte-input` is also form-associated, so `new FormData(form)` can read named `nte-input` elements directly.

Built-in value behavior:

- text / email / password / textarea → `string`
- select → `string`
- checkbox → `boolean`
- select-radio → `string[]`
- token-input → `string[]`

A plugin may register multiple input types, but each type may only be registered once.

## Usage

```ts
import { html } from 'lit';
import { AbstractNteInputPlugin, NteInput, type NteInputRenderContext } from '@nextrap/nte-input';

class TextPlugin extends AbstractNteInputPlugin {
  static readonly types = ['text', 'email', 'password'];

  render(context: NteInputRenderContext) {
    const { type, controlId, validationId } = context;

    return html`
      <input
        id=${controlId}
        type=${type}
        placeholder=${this.host.getAttribute('placeholder') ?? ''}
        aria-describedby=${validationId}
      />
    `;
  }
}

NteInput.registerPlugin(TextPlugin);
```

```html
<nte-input label="E-Mail" type="email" placeholder="name@example.com"></nte-input>
<nte-input label="Kommentar" type="textarea" value="Erster Text"></nte-input>
<nte-input label="Status" type="select" validation-message="Bitte auswählen.">
  <options>
    <option value="draft">Entwurf</option>
    <option value="active">Aktiv</option>
  </options>
</nte-input>
<nte-input label="Status" type="select" data-options="draft|Entwurf;active|Aktiv"></nte-input>
<nte-input label="Status" type="select-radio" value="active" data-options="draft|Entwurf;active|Aktiv"></nte-input>
<nte-input label="Tags" type="select-radio" multiple value='["news"]' data-options='[{"value":"news","label":"News"},{"value":"events","label":"Events"}]'></nte-input>
<nte-input label="Schlagworte" type="token-input" value='["news"]' data-options='[{"value":"news","label":"News"},{"value":"events","label":"Events"}]'></nte-input>
<nte-input label="AGB akzeptieren" type="checkbox" checked></nte-input>
<nte-input label="Benutzername" type="text">
  <span slot="input-aid">Nur Kleinbuchstaben, Zahlen, Punkt und Bindestrich verwenden.</span>
</nte-input>
```

## Textarea auto grow

The built-in `textarea` plugin grows with its content.
The height is clamped between the configured theme min and max height.
It also syncs the host `value` property with the internal `<textarea>`.

Those values are configured through the `theme-bootstrap()` SCSS mixin map:

```scss
@use '@nextrap/nte-input/src/styles/theme-bootstrap';

nte-input.default {
  @include theme-bootstrap.theme-bootstrap(
    (
      textarea-min-height: 6rem,
      textarea-max-height: 16rem,
    )
  );
}
```

## Select options

The built-in `select` and `select-radio` plugins support two option sources:

1. `data-options` attribute
2. an `<options>` wrapper inside `<nte-input>`

If parsed `data-options` exist, they have priority and `<options>` content is ignored.

Supported `data-options` formats:

```html
<nte-input type="select" data-options="draft|Entwurf;active|Aktiv"></nte-input>
<nte-input type="select" data-options='[{"value":"draft","label":"Entwurf"},{"value":"active","label":"Aktiv"}]'></nte-input>
```

For `type="select"`, the plugin renders either `data-options` or the `<options>` content into the internal `<select>`.
The option matching the current host `value` is selected.

For `type="select-radio"`, the same options are rendered as a radio group.
If `multiple` is set, it renders checkboxes instead.
The current host `value` is synced into the checked state, and user changes are written back to `value`.
For `select-radio`, `value` is handled as a `string[]`.

For `type="token-input"`, the same option sources are used as suggestions for a token field.
The plugin renders selected values as removable tokens and keeps `value` as a `string[]`.
Users can add tokens with `Enter`, `,` or `;` and remove tokens via the built-in remove button.
Values are deduplicated automatically.
If the boolean `strict` attribute is set, only option values from `data-options` or `<options>` may be added.
Free custom values are ignored in that mode.

## Validation and input aid

`nte-input` supports two helper areas below the control:

- `validation-message` or `slot="validation"`
- `slot="input-aid"`

Behavior:
- validation is rendered as a red bubble below the control
- input aid is rendered as a neutral bubble below the validation bubble
- input aid expands on `:focus-within`
- if both exist, validation is shown first and input aid below it
- empty named slots are detected through the `.slot-empty` class added by `nte_element`

Example:

```html
<nte-input
  label="Passwort"
  type="password"
  invalid
  validation-message="Bitte mindestens 12 Zeichen eingeben."
>
  <span slot="input-aid">Nutze Groß-/Kleinbuchstaben, Zahlen und Sonderzeichen.</span>
</nte-input>
```

## SCSS mixins

The package exposes its styling mixins from `src/styles/*`.
The bundled `src/styles/index.scss` applies the same defaults automatically for `nte-input.default`.

```scss
@use '@nextrap/nte-input/src/styles/theme-bootstrap';
@use '@nextrap/nte-input/src/styles/floating-labels';
@use '@nextrap/nte-input/src/styles/select-radio-vertical';
@use '@nextrap/nte-input/src/styles/size';

nte-input.default {
  @include theme-bootstrap.theme-bootstrap();
}

nte-input.default.hoverlabel {
  @include floating-labels.floating-labels();
}

.default.select-radio-vertical {
  nte-input[type='select-radio'] {
    @include select-radio-vertical.select-radio-vertical();
  }
}
```

`theme-bootstrap()` styles the shared nte-input frame, helper bubbles, checkbox/select-radio layout and token presentation.
It uses a small SCSS map API instead of component-specific CSS variables.

`floating-labels()` turns the normal label into a floating Bootstrap-like label.
It increases the control height / spacing from the `$minHeight` SCSS argument and floats the label automatically on focus, when a value exists, when a placeholder exists, or when the active plugin returns `true` from `isHoverlabelActive()`.

`select-radio-vertical()` is intended for `type="select-radio"` and should usually be applied from a form or container selector.
It styles only descendant `nte-input[type="select-radio"]` elements and lays out their options side by side inside the input.
It uses SCSS arguments with defaults instead of component CSS variables.

`size()` is a small helper mixin that sets the shared CSS scale variables used by `theme-bootstrap()` and `floating-labels()`.
It accepts separate scales for spacing, label and input.
The bundled `src/styles/index.scss` already defines example classes: `sm`, `md`, `lg`, `xl`, `xxl`.

```scss
@use '@nextrap/nte-input/src/styles/size';

nte-input.sm {
  @include size.size(0.875, 0.875, 0.875);
}

nte-input.xxl {
  @include size.size(1.35, 1.15, 1.15);
}
```

## Notes

- Plugins are registered via TypeScript classes.
- `registerPlugin()` stores every type individually in the internal registry.
- `nte-input` resolves the plugin once and keeps that plugin instance.
- The plugin class handles render, lifecycle, value access, selected options and form value.
- For `type="checkbox"`, the label text is rendered by the checkbox plugin next to the checkbox, and the normal frame is omitted.
- For `type="token-input"`, option labels are used as suggestions, but free custom values are also allowed.
