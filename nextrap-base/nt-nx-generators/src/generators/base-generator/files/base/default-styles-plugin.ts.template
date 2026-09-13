import path from 'node:path';
import type { Plugin } from 'vite';

// Vite extrahiert Library-CSS. Nur der Default-Einstieg importiert es wieder,
// damit der App-Bundler es verarbeitet und /unstyled vollständig CSS-frei bleibt.
export function defaultStylesPlugin(): Plugin {
  return {
    name: 'nextrap-default-styles',
    apply: 'build',
    enforce: 'post',
    generateBundle(_options, bundle) {
      const entry = Object.values(bundle).find(
        (item) => item.type === 'chunk' && item.isEntry && item.name === 'index',
      );
      if (!entry || entry.type !== 'chunk') return;
      const imports = Object.values(bundle)
        .filter((item) => item.type === 'asset' && item.fileName.endsWith('.css'))
        .map((item) => `import ${JSON.stringify('./' + path.posix.relative(path.posix.dirname(entry.fileName), item.fileName))};`);
      if (!imports.length) return;
      entry.code = imports.join('\n') + '\n' + entry.code;
      if (entry.map) entry.map.mappings = ';'.repeat(imports.length) + entry.map.mappings;
    },
  };
}
