# Repo Setup

Steps used to create this repo:

- `npx create-nx-workspace@latest --packageManager npm --useGithub --ci github --skipGit --formatter prettier --bundler vite --name nextrap --preset npm`
- Move files from `nextrap` one level up
- `nx g @nx/js:lib libs/nxa-element-highlighter --publishable --importPath @nextrap/element-highlighter --bundler vite --linter eslint --unitTestRunner vitest`
