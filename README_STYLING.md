# Component Authoring

## Framework / Toolkit

We use [Lit](https://lit.dev/) as the framework for our web components. The following guidelines are based on using Lit.
For anything not specified here (e.g., reactive properties), refer to the [Lit documentation](https://lit.dev/docs/).

## Styling

When developing web components, we differentiate _Light DOM_ (the host document) and _Shadow DOM_
(the private document of the component).

The _Light-DOM-styles_ (e.g., global CSS variables) are available inside the component's Shadow DOM. On the contrary,
the _Shadow-DOM-styles_ are _not_ available in the host document and therefore private to the component.

We recommend that you read the [Lit documentation on styles](https://lit.dev/docs/components/styles/) to understand
how styles work in Lit and the Shadow DOM.

### Code Structure

To write private CSS for a component, create a `scss`-file and import it.
The [`?inline`](https://vite.dev/guide/features#disabling-css-injection-into-the-page) parameter makes the import
return the CSS string rather than injecting it as a style-element the DOM.
It has the same effect as using a [`css` tag](https://lit.dev/docs/components/styles/#add-styles)
directly in your component file, but allows us to write styles in a separate file.

We have to use the `unsafeCSS` function to allow importing CSS (strings) that are not defined with the trusted `css` tag.
This is not a problem here as we are in full control of the CSS file that is imported. At runtime, there is no performance
difference or security risk with this approach.

The styles in the component's static `styles` property will be the Shadow DOM styles of the component.

```ts
import { LitElement, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import style from './nte-my-component.scss?inline';

@customElement('nte-my-component')
export class NteDialog extends LitElement {
    static override styles = [unsafeCSS(style)];
}
```

Inside your component's scss file, you can `@use '@nextrap/style-reset';` to apply a consistent
baseline for your styling:

```scss
@use '@nextrap/style-reset';

:host {
    --spacing: var(--nt-base-gap, 4px);
}

.some-internal-element {
    padding: var(--spacing);
}
```

In your component's class file (where you define the component), make sure to also import the
[@nextrap/style-base](nextrap-base/style-base) styles. These will be added to the component's Light DOM
and provide default variables for theming etc.
(see [@nextrap/nte-dialog](./nextrap-elements/nte-dialog/src/lib/nte-dialog.ts))

```ts
import { LitElement, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@nextrap/nt-style-base'; // These will be added to the Light DOM
import style from './nte-my-component.scss?inline';

@customElement('nte-my-component')
export class NteDialog extends LitElement {
    static override styles = [unsafeCSS(style)];
}
```

### Host-Styles / CSS Variables

The `:host` selector can be used as a "bridge" between the Light DOM and the Shadow DOM.
We use it to define the component's public API in terms of CSS variables.
This allows the host document (user of the component) to style the component without having to know about
its internal structure. (see also: [Lit Docs](https://lit.dev/docs/components/styles/#customprops))

```scss
:host {
    --bg-color: var(--nt-primary);
    --fg-color: var(--nt-text-on-primary);
}

.some-internal-element {
    background-color: var(--bg-color);
    color: var(--fg-color);
}
```

By default, we use existing CSS variables from the [@nextrap/style-base](nextrap-base/style-base) package
(this is why we import them like described above). They act as a fallback if the user does not define their own variables.

To overwrite the component's styles, the user can now simply define the CSS variables in their global stylesheet:

```css
:root {
    --nt-primary: red;
    --nt-text-on-primary: white;
}
```

or, alternatively, provide the component's CSS variables as inline styles on the component's host element:

```html
<nte-my-component style="--bg-color: red; --fg-color: white;"></nte-my-component>
```

You can also use the following syntax to define a public API in terms of CSS classes that applied to the component by the host document. For an example, see the [@nextrap/nte-dialog](./nextrap-elements/nte-dialog/src/lib/nte-dialog.scss) _fullsize_ class.

```scss
:host {
    --width: 100px;
    --height: 100px;
}

:host(.large) {
    --width: 200px;
    --height: 200px;
}
```
