# @nextrap/source

Monorepo for Nextrap

## Packages

<!-- Please also maintain the CODEOWNERS file when adjusting the table below -->

| Name                                                        | Contact     |
| ----------------------------------------------------------- | ----------- |
| [`nxa-element-highlighter`](./libs/nxa-element-highlighter) | @evolkmann  |
| [`nxa-infiniscroll`](./libs/nxa-infiniscroll)               | @dermatthes |
| [`nxa-scroll-to-top`](./libs/nxa-scroll-to-top)             | @dermatthes |

## Releases

The repo is setup so that each package is independently released with its own version.
This means that you can release a single or more packages without having to release the entire repo.

> [!WARNING]
> Releases currently do not work, because the following error with npm occurs:
>
> ```
> npm publish error:
> Not Found - PUT https://registry.npmjs.org/@nextrap%2fscroll-to-top - Not found
> '@nextrap/scroll-to-top@0.0.1' is not in this registry.
> Note that you can also install from a tarball, folder, http url, or git url.
> ```

### `@latest`-Releases

For each commit to the main branch, a new version of each package is created and
published to npm with the `@latest` tag. (see [publish-latest.yml](./.github/workflows/publish-latest.yml))

### Manual Releases / Creating specific versions

- `nx release --skip-publish [-p <package-name>]`
- `git push --follow-tags origin main`
- The [publish-tags Action](./.github/workflows/publish-tags.yml) will build and release the desired packages to npm
