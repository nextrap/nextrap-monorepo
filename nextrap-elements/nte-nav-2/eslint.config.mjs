import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  {
    files: ['**/*.json'],
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          ignoredDependencies: ['@nextrap/style-base', '@nextrap/style-reset', '@nextrap/style-typography', 'vitest'],
          ignoredFiles: [
            '{projectRoot}/demo/**/*',
            '{projectRoot}/src/**/*.spec.ts',
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
  {
    files: ['**/demo/**/*.demo.ts', '**/vite.config.ts'],
    rules: {
      '@nx/enforce-module-boundaries': 'off',
    },
  },
];
