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
The height is clamped between the configured CSS min and max height.
It also syncs the host `value` property with the internal `<textarea>`.

Relevant CSS variables:

```css
nte-input {
  --nte-input-textarea-min-height: 6rem;
  --nte-input-textarea-max-height: 16rem;
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

The package ships a root `mixins.scss` file.

```scss
@use '@nextrap/nte-input/mixins' as nte-input;

nte-input.hoverlabel {
  @include nte-input.hoverlabel();
}
```

The `hoverlabel` mixin turns the normal label into a floating Bootstrap-like label.
It keeps extra control height and input padding so the label has enough room across browsers.
The required spacing is calculated from the `$minHeight` SCSS argument.
The label floats automatically on focus, when a value exists, when a placeholder exists, or when the active plugin returns `true` from `isHoverlabelActive()`.

The package also exposes a `select-radio-vertical` mixin for `type="select-radio"`.
It is intended to be applied to a form or container selector and styles only descendant `nte-input[type="select-radio"]` elements.
Inside each input, the radio / checkbox options are rendered next to each other with a minimum width of `350px`.
Between columns a vertical separator is shown, and when the options wrap into a new row an additional horizontal separator becomes visible.
The mixin uses SCSS arguments with default values instead of CSS custom properties.

```scss
@use '@nextrap/nte-input/mixins' as nte-input;

.default.select-radio-vertical {
  nte-input[type='select-radio'] {
    @include nte-input.select-radio-vertical();
  }
}
```

## Notes

- Plugins are registered via TypeScript classes.
- `registerPlugin()` stores every type individually in the internal registry.
- `nte-input` resolves the plugin once and keeps that plugin instance.
- The plugin class handles render, lifecycle, value access, selected options and form value.
- For `type="checkbox"`, the label text is rendered by the checkbox plugin next to the checkbox, and the normal frame is omitted.
- For `type="token-input"`, option labels are used as suggestions, but free custom values are also allowed.
