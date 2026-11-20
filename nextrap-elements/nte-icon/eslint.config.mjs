// Die Root-Regeln gelten auch für die Komponente und ihre Demo.
import baseConfig from '../../eslint.config.mjs';

// Package-Abhängigkeiten werden ohne reine Build-Konfigurationsimporte geprüft.
export default [
  ...baseConfig,
  {
    files: ['**/*.json'],
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          ignoredFiles: [
            '{projectRoot}/eslint.config.{js,cjs,mjs}',
            '{projectRoot}/vite.config.{js,ts,mjs,mts}',
          ],
        },
      ],
    },
    languageOptions: {
      parser: await import('jsonc-eslint-parser'),
    },
  },
];
