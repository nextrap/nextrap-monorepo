# @nextrap/source

Monorepo for Nextrap maintained with [Nx](https://nx.dev/).

## Links

- [Kickstart DevContainer Setup & Development](https://nfra.infracamp.org/)
- [Development Concepts for Nextrap Elements](docs/nextrap-elements-concept.md)
- [STyling Guide / Lit Styling](README_STYLING.md)
- [Nextrap Website / Demos](https://www.nextrap.org)

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
| [`style-base`](nextrap-base/style-base)                               | [@dermatthes](https://github.com/dermatthes) |
| [`style-reset`](nextrap-base/style-reset)                             | [@dermatthes](https://github.com/dermatthes) |
| [`style-button`](nextrap-base/style-button)                           | [@dermatthes](https://github.com/dermatthes) |
| [`nte-element-highlighter`](nextrap-elements/nte-element-highlighter) | [@evolkmann](https://github.com/evolkmann)   |
| [`nte-scroll-to-top`](nextrap-elements/nte-scroll-to-top)             | [@dermatthes](https://github.com/dermatthes) |
| [`nte-dialog`](nextrap-elements/nte-dialog)                           | [@evolkmann](https://github.com/evolkmann)   |
| [`ntl-infiniscroll`](nextrap-layout/ntl-infiniscroll)                 | [@dermatthes](https://github.com/dermatthes) |
| [`ntl-2col`](nextrap-layout/ntl-2col)                                 | [@evolkmann](https://github.com/evolkmann)   |
| [`nte-stepper`](nextrap-elements/nte-stepper)                         | [@marliedev](https://github.com/marliedev)   |
| [`ntl-scrollspy`](nextrap-elements/ntl-scrollspy)                     | [@marliedev](https://github.com/marliedev)   |
| [`nte-progress`](nextrap-elements/nte-progress)                       | [@marliedev](https://github.com/marliedev)   |
| [`nte-rating`](nextrap-elements/nte-rating)                           | [@marliedev](https://github.com/marliedev)   |

_) Do not include any style-_ packages (except 'style-reset') in the Shadow DOM of components!

## How to use

If you want to know how to utilize/consume the nextrap monorepo, go [here](/docs/how-to-use.md).

## Working with the repository

### Common Commands

- `npx nx dev <package>`: Start the development server for a package
- `npx nx build <package>`: Build a package
- `npx nx test <package>`: Run unit tests for a package
- `npx nx lint <package>`: Run linter for a package
- `npx nx show project <package>`: Show all targets of a package

Try out `npx nx dev ntl-2col` and make some changes [to the code](nextrap-elements/nte-element-highlighter/src).

**Note**: When renaming packages or moving them to a different directory, make sure to update all import paths
and run `npm update` on the monorepos root to update the package links.

## Creating new packages

1. Switch to a feature branch to benefit from CI checks and to avoid breaking the main branch.
2. Use our [Nx Generator](./nextrap-base/nt-nx-generators) to generate new libs or apps:

**Create new element Package**:

`nx g @nextrap/nt-nx-generators:base --name nte-demo --path nextrap-elements/nte-demo`

3. Run `npm i` and `nx run <new-package>:build` to verify that the new package has been created successfully.

4. Add the new package to the _Packages_ list in this README and to the [CODEOWNERS](./CODEOWNERS) file.

The package will now automatically be picked up by the CI and Release workflows.

When you are ready, create a pull request to merge your changes into the `main` branch.

## Releases

> [!WARNING]
> Releases should only be created from the `main` branch!

The repo is configured so that each package is independently released with its own version.
This means that you can release a single or more packages without having to release the entire repo.

To create new versions, run the following commands:

- `nx release --skip-publish -p <package-1[,package-2,...]>` (if `-p` is omitted, you will be asked to select a version for _all_ packages)
- `git push --follow-tags origin main`
- The [publish-tags Action](./.github/workflows/publish-tags.yml) will build and release the desired packages to npm

> [!WARNING]
> Make sure to push the tags, otherwise the publish-tags workflow won't run!
>
> If you use a GUI such as GitHub Desktop, make sure that tags are pushed as well,
> as this is not the default behavior.

### Branches

**Feature branches** are used for development and should be created from the `main` branch. The Name should be "feat/<yourName>/<featureName>".

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
