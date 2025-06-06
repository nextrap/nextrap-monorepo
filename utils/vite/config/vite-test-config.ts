import type { InlineConfig } from 'vitest/node';

export default function (packagePath: string): InlineConfig {
  return {
    passWithNoTests: true,
    watch: false,
    globals: true,
    environment: 'node',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: `../../coverage/${packagePath}`,
      provider: 'v8' as const,
    },
  };
}
