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

Use [Nx Generators](https://nx.dev/features/generate-code) to quickly setup new packages, for example:

`nx g @nx/js:lib libs/nxa-element-highlighter --publishable --importPath @nextrap/element-highlighter --bundler vite --linter eslint --unitTestRunner vitest`

The package will automatically be picked up by the CI and Release workflows.

Start on a new branch and create a pull request, so that all quality checks are performed automatically.
For example, the system checks that tests are in place and that the build works.

## Releases

The repo is configured so that each package is independently released with its own version.
This means that you can release a single or more packages without having to release the entire repo.

To create new versions, run the following commands:

- `nx release --skip-publish [-p <package-name>]`
- `git push --follow-tags origin main`
- The [publish-tags Action](./.github/workflows/publish-tags.yml) will build and release the desired packages to npm
