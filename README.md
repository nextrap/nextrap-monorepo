# @nextrap/source

Monorepo for Nextrap maintained with [Nx](https://nx.dev/).

## Packages

<!-- Please also maintain the CODEOWNERS file when adjusting the table below -->

| Name                                                        | Contact                                      |
| ----------------------------------------------------------- | -------------------------------------------- |
| [`nxa-element-highlighter`](./libs/nxa-element-highlighter) | [@evolkmann](https://github.com/evolkmann)   |
| [`nxa-infiniscroll`](./libs/nxa-infiniscroll)               | [@dermatthes](https://github.com/dermatthes) |
| [`nxa-scroll-to-top`](./libs/nxa-scroll-to-top)             | [@dermatthes](https://github.com/dermatthes) |

## Creating new packages

1. Switch to a feature branch to benefit from CI checks and to avoid breaking the main branch.
2. Use [Nx Generators](https://nx.dev/features/generate-code) to generate new libs or apps:

   `nx g @nx/js:lib libs/nxa-element-highlighter --publishable --importPath @nextrap/element-highlighter --bundler vite --linter eslint --unitTestRunner vitest`

3. Manually verify (and adjust if necessary) that the newly created `project.json`'s release settings are
   [like this](https://github.com/nextrap/nextrap-monorepo/blob/5ee04c3b75ac7bb069ba2ad9e4b6a9f2c2b0022a/libs/nxa-element-highlighter/project.json#L6-L13).

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
