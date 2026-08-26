import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { compile, compileString } from 'sass-embedded';

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('styleElements', () => {
  it('keeps the main Sass entry point free of CSS output', () => {
    const result = compile(join(packageRoot, 'index.scss'));

    expect(result.css.trim()).toBe('');
  });

  it('materializes prose through the default entry point', () => {
    const result = compile(join(packageRoot, 'default.scss'));

    expect(result.css).toContain('.prose');
    expect(result.css).toContain('.prose.prose-xl');
    expect(result.css).toContain('var(--nt-text');
    expect(result.css).not.toContain('--nt-surface-');
  });

  it('materializes prose inside the caller scope', () => {
    const result = compileString(
      `
        @use 'index' as e;

        .theme-test {
          @include e.elements();
        }
      `,
      { loadPaths: [packageRoot] },
    );

    expect(result.css).toContain('.theme-test .prose');
    expect(result.css).not.toMatch(/^\.prose/m);
  });
});
