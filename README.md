# @nextrap/source

Monorepo for Nextrap

## Creating Releases

- `nx release --skip-publish [-p <package-name>]`
- `git push --follow-tags origin main`
- The [Publish-Action](./.github/workflows/publish.yml) will build and release the desired packages to npm
