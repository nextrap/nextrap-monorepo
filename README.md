# @nextrap/source

Monorepo for Nextrap

## Packages

<!-- Please also maintain the CODEOWNERS file when adjusting the table below -->

| Name                                                        | Contact     |
| ----------------------------------------------------------- | ----------- |
| [`nxa-element-highlighter`](./libs/nxa-element-highlighter) | @evolkmann  |
| [`nxa-infiniscroll`](./libs/nxa-infiniscroll)               | @dermatthes |
| [`nxa-scroll-to-top`](./libs/nxa-scroll-to-top)             | @dermatthes |

## Creating Releases

- `nx release --skip-publish [-p <package-name>]`
- `git push --follow-tags origin main`
- The [Publish-Action](./.github/workflows/publish.yml) will build and release the desired packages to npm
