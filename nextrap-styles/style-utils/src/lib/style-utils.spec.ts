import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { compile, compileString } from 'sass-embedded';
import { styleUtils } from './style-utils';

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('styleUtils', () => {
  it('should work', () => {
    expect(styleUtils()).toEqual('style-utils');
  });

  it('keeps the main Sass entry point free of CSS output', () => {
    const result = compile(join(packageRoot, 'index.scss'));

    expect(result.css.trim()).toBe('');
  });

  it('materializes all utility classes through the default entry point', () => {
    const result = compile(join(packageRoot, 'default.scss'));

    expect(result.css).toContain('.d-flex');
    expect(result.css).toContain('.surface-primary');
    expect(result.css).toContain('--nt-text: var(--nt-text-on-primary)');
    expect(result.css).not.toContain('--nt-surface-text');
    expect(result.css).toContain('.scheme-dark');
  });

  it('materializes the complete class set inside a theme scope', () => {
    const result = compileString(
      `
        @use 'index' as u;

        .theme-test {
          @include u.generate-utility-classes();
        }
      `,
      { loadPaths: [packageRoot] },
    );

    expect(result.css).toContain('.theme-test .d-flex');
    expect(result.css).toContain('.theme-test .surface-primary');
    expect(result.css).not.toMatch(/^\.d-flex/m);
  });
});
