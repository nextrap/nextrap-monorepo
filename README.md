# @nextrap/source

Monorepo for Nextrap maintained with [Nx](https://nx.dev/).

## Packages

All packages use a common naming convention:

- `nt-*`: General purpose packages
- `nte-*`: Web-Components/Elements (e.g. `nte-burger`)
- `ntl-*`: Layout packages (e.g. `ntl-2col`)

These packages are grouped into their respective directories ([`nextrap-base`](./nextrap-base), [`nextrap-elements`](./nextrap-elements), and [`nextrap-layout`](./nextrap-layout)).

<!-- Please also maintain the CODEOWNERS file when adjusting the table below -->

| Name                                                                  | Contact                                      |
| --------------------------------------------------------------------- | -------------------------------------------- |
| [`nt-framework`](nextrap-base/nt-framework)                           | [@dermatthes](https://github.com/dermatthes) |
| [`nt-style-base`](nextrap-base/nt-style-base)                         | [@dermatthes](https://github.com/dermatthes) |
| [`nt-style-reset`](nextrap-base/nt-style-reset)                       | [@dermatthes](https://github.com/dermatthes) |
| [`nte-element-highlighter`](nextrap-elements/nte-element-highlighter) | [@evolkmann](https://github.com/evolkmann)   |
| [`nte-scroll-to-top`](nextrap-elements/nte-scroll-to-top)             | [@dermatthes](https://github.com/dermatthes) |
| [`nte-dialog`](nextrap-elements/nte-dialog)                           | [@evolkmann](https://github.com/evolkmann)   |
| [`ntl-infiniscroll`](nextrap-layout/ntl-infiniscroll)                 | [@dermatthes](https://github.com/dermatthes) |
| [`ntl-2col`](nextrap-layout/ntl-2col)                                 | [@evolkmann](https://github.com/evolkmann)   |

## Working with the repository

### Common Commands

- `npx nx dev <package>`: Start the development server for a package
- `npx nx build <package>`: Build a package
- `npx nx test <package>`: Run unit tests for a package
- `npx nx lint <package>`: Run linter for a package
- `npx nx show project <package>`: Show all targets of a package

Try out `npx nx dev ntl-2col` and make some changes [to the code](nextrap-elements/nte-element-highlighter/src).

### Dependencies

All external dependencies (from npm) only exist in one version and are defined in the
[`package.json`](./package.json) of the workspace. To add or update dependencies, use regular
npm procedures, e.g. `npm install <package>` or updating the `package.json` file directly.

Packages within the repo may be dependent on each other as well. For example, a web-component from the
[`nextrap-elements`](./nextrap-elements) directory may depend on a library from the [`nextrap-base`](./nextrap-base) folder.

Nx will handle the linking of these packages automatically during build, serve, etc.
You can just import them directly like this:

```javascript
import { NteSomeComponent } from '@nextrap/nte-some-component';
```

This import is made possible by defining a path alias in the `tsconfig.base.json` file.
This alias is typically set up automatically when creating a new package with Nx.

### Configuration and Targets

All tasks are defined as [targets](https://nx.dev/reference/project-configuration#project-configuration).
These targets may be defined globally and be inferred by plugins such as `@nx/vite`
or they may be defined in the `project.json` of each package. This hierarchy
defines the capabilities of each package.

Read the [Project Configuration](https://nx.dev/reference/project-configuration#project-configuration)
article to learn how this cascade of tasks works in detail.

To see all targets/capabilities of a package, run

`npx nx show project <package>`.

## Component Authoring

### Framework / Toolkit

We use [Lit](https://lit.dev/) as the framework for our web components. The following guidelines are based on using Lit.
For anything not specified here (e.g., reactive properties), refer to the [Lit documentation](https://lit.dev/docs/).

### Styling

When developing web components, we differentiate _Light DOM_ (the host document) and _Shadow DOM_
(the private document of the component).

The _Light-DOM-styles_ (e.g., global CSS variables) are available inside the component's Shadow DOM. On the contrary,
the _Shadow-DOM-styles_ are _not_ available in the host document and therefore private to the component.

We recommend that you read the [Lit documentation on styles](https://lit.dev/docs/components/styles/) to understand
how styles work in Lit and the Shadow DOM.

#### Code Structure

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

Inside your component's scss file, you can `@use '@nextrap/nt-style-reset';` to apply a consistent
baseline for your styling:

```scss
@use '@nextrap/nt-style-reset';

:host {
  --spacing: var(--nt-base-gap, 4px);
}

.some-internal-element {
  padding: var(--spacing);
}
```

In your component's class file (where you define the component), make sure to also import the
[@nextrap/style-base](./nextrap-base/nt-style-base) styles. These will be added to the component's Light DOM
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

#### Host-Styles / CSS Variables

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

By default, we use existing CSS variables from the [@nextrap/style-base](./nextrap-base/nt-style-base) package
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
<nte-my-component
  style="--bg-color: red; --fg-color: white;"
></nte-my-component>
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

## Creating new packages

1. Switch to a feature branch to benefit from CI checks and to avoid breaking the main branch.
2. Use [Nx Generators](https://nx.dev/features/generate-code) to generate new libs or apps:

   `nx g @nx/js:lib nextrap-elements/nte-some-component --publishable --importPath @nextrap/nte-some-component --bundler vite --linter eslint --unitTestRunner vitest`

3. Manually verify (and adjust if necessary) that the newly created `project.json`'s release settings are
   [like this](https://github.com/nextrap/nextrap-monorepo/blob/5ee04c3b75ac7bb069ba2ad9e4b6a9f2c2b0022a/libs/nxa-element-highlighter/project.json#L6-L13).
4. Import `viteServerConfig` and `viteTestConfig` in `vite.config.ts`

   ```ts
   import viteServerConfig from '../../utils/vite/config/vite-server-config';
   import viteTestConfig from '../../utils/vite/config/vite-test-config';

   export default defineConfig(() => ({
     ...viteServerConfig,
     test: viteTestConfig('nextrap-element/nte-some-component'),
     // more config ...
   }));
   ```

5. Add the new package to the _Packages_ list in this README and to the [CODEOWNERS](./CODEOWNERS) file.

The package will now automatically be picked up by the CI and Release workflows.

When you are ready, create a pull request to merge your changes into the `main` branch.

## Releases

> [!WARNING]
> Releases should only be created from the `main` branch!

The repo is configured so that each package is independently released with its own version.
This means that you can release a single or more packages without having to release the entire repo.

To create new versions, run the following commands:

- `nx release --skip-publish [-p <package-name>]`
- `git push --follow-tags origin main`
- The [publish-tags Action](./.github/workflows/publish-tags.yml) will build and release the desired packages to npm

> [!WARNING]
> Make sure to push the tags, otherwise the publish-tags workflow won't run!
>
> If you use a GUI such as GitHub Desktop, make sure that tags are pushed as well,
> as this is not the default behavior.
