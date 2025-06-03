# @nextrap/source

Monorepo for Nextrap maintained with [Nx](https://nx.dev/).

## Packages

<!-- Please also maintain the CODEOWNERS file when adjusting the table below -->

| Name                                                        | Contact                                      |
| ----------------------------------------------------------- | -------------------------------------------- |
| [`nt-framework`](./libs/nt-framework)                       | [@dermatthes](https://github.com/dermatthes) |
| [`nxa-element-highlighter`](./libs/nxa-element-highlighter) | [@evolkmann](https://github.com/evolkmann)   |
| [`ntl-infiniscroll`](libs/ntl-infiniscroll)                 | [@dermatthes](https://github.com/dermatthes) |
| [`nxa-scroll-to-top`](./libs/nxa-scroll-to-top)             | [@dermatthes](https://github.com/dermatthes) |
| [`nte-dialog`](./libs/nte-dialog)                           | [@evolkmann](https://github.com/evolkmann)   |
| [`ntl-2col`](./libs/ntl-2col)                               | [@evolkmann](https://github.com/evolkmann)   |

## Working with the repository

### Common Commands

- `npx nx dev <package>`: Start the development server for a package
- `npx nx build <package>`: Build a package
- `npx nx test <package>`: Run unit tests for a package
- `npx nx lint <package>`: Run linter for a package
- `npx nx show project <package>`: Show all targets of a package

Try out `npx nx dev nxa-element-highlighter` and make some changes [to the code](./libs/nxa-element-highlighter/src).

### Dependencies

All external dependencies (from npm) only exist in one version and are defined in the
[`package.json`](./package.json) of the workspace. To add or update dependencies, use regular
npm procedures, e.g. `npm install <package>` or updating the `package.json` file directly.

Packages within the repo may be dependent on each other as well. For example, a web-app from the
[`apps`](./apps) folder may depend on a library from the [`libs`](./libs) folder.

Nx will handle the linking of these packages automatically during build, serve, etc.
You can just import them directly like this:

```javascript
import { MyComponent } from '@nextrap/my-library';
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

## Creating new packages

1. Switch to a feature branch to benefit from CI checks and to avoid breaking the main branch.
2. Use [Nx Generators](https://nx.dev/features/generate-code) to generate new libs or apps:

   `nx g @nx/js:lib libs/nxa-element-highlighter --publishable --importPath @nextrap/element-highlighter --bundler vite --linter eslint --unitTestRunner vitest`

3. Manually verify (and adjust if necessary) that the newly created `project.json`'s release settings are
   [like this](https://github.com/nextrap/nextrap-monorepo/blob/5ee04c3b75ac7bb069ba2ad9e4b6a9f2c2b0022a/libs/nxa-element-highlighter/project.json#L6-L13).
4. Add the new package to the _Packages_ list in this README and to the [CODEOWNERS](./CODEOWNERS) file.

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
