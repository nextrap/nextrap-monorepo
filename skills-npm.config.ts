import { defineConfig } from 'skills-npm';

export default defineConfig({
  source: 'node_modules',
  agents: ['universal'],
  include: ['@leuffen/*', '@nextrap/*', '@trunkjs/*'],
  gitignore: true,
  yes: true,
  force: true,
});
