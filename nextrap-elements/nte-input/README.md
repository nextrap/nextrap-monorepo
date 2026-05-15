# nte-input

Minimal input wrapper for Nextrap.

`nte-input` itself only renders the frame around a control:

- a label above the control
- a bordered control box
- a validation area below the control

The actual control markup is provided through statically registered plugins.

Built-in plugins currently cover:
- text / email / password
- textarea
- select
- select-radio
- checkbox

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
<nte-input label="AGB akzeptieren" type="checkbox" checked></nte-input>
```

## Textarea auto grow

The built-in `textarea` plugin grows with its content.
The height is clamped between the configured CSS min and max height.
It also syncs the host `value` attribute with the internal `<textarea>`.

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

For `type="select"`, the plugin copies either `data-options` or the `<options>` content into the internal `<select>`.
After syncing, it applies the current `value` attribute to select the matching option.

For `type="select-radio"`, the same options are rendered as a radio group.
If `multiple` is set, it renders checkboxes instead.
The current `value` attribute is synced into the checked state, and user changes are written back to `value`.
In multiple mode, `value` is stored as a JSON array string.

## SCSS mixins

The package ships a root `mixins.scss` file.

```scss
@use '@nextrap/nte-input/mixins' as nte-input;

nte-input.hoverlabel {
  @include nte-input.hoverlabel;
}
```

The `hoverlabel` mixin turns the normal label into a floating Bootstrap-like label.
It keeps extra control height and input padding so the label has enough room across browsers.
The label floats automatically on focus, when a value exists, when a placeholder exists, or when the active plugin returns `true` from `isHoverlabelActive()`.

## Notes

- Plugins are registered via TypeScript classes.
- `registerPlugin()` stores every type individually in the internal registry.
- `nte-input` resolves the plugin once and keeps that plugin instance.
- The plugin class handles render, lifecycle, value access, selected options and form value.
- For `type="checkbox"`, the label text is rendered by the checkbox plugin next to the checkbox, and the normal frame is omitted.
