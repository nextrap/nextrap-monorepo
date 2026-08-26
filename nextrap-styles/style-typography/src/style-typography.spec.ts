import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { compile, compileString } from 'sass-embedded';

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('styleTypography', () => {
  it('keeps the main Sass entry point free of CSS output', () => {
    const result = compile(join(packageRoot, 'index.scss'));

    expect(result.css.trim()).toBe('');
  });

  it('materializes native typography through the default entry point', () => {
    const result = compile(join(packageRoot, 'default.scss'));

    expect(result.css).toContain('h1, .h1');
    expect(result.css).toContain('var(--nt-header');
    expect(result.css).toContain('var(--nt-spacing-text');
    expect(result.css).toContain('var(--nt-text');
    expect(result.css).not.toContain('--nt-surface-');
    expect(result.css).not.toMatch(/(?:^|[},]\s*)(?:section|article)(?:\s|,|\{)/m);
  });

  it('materializes typography inside the caller scope', () => {
    const result = compileString(
      `
        @use 'index' as type;

        .theme-test {
          @include type.style-typography();
        }
      `,
      { loadPaths: [packageRoot] },
    );

    expect(result.css).toContain('.theme-test h1, .theme-test .h1');
    expect(result.css).toContain('.theme-test p');
    expect(result.css).not.toMatch(/^h1/m);
  });
});
