import '@nextrap/style-base/default';
import { defineDemo } from '@trunkjs/demo-viewer';
import css from './tokens.scss?inline';

// Zeigt die öffentlichen Token-Skalen ohne den früheren Prolit-/Include-Loader.
export default defineDemo({
  title: 'Farben, Typografie und Abstände',
  group: 'style-base',
  description: 'Runtime-Tokens für Farben, Schriftgrößen und Spacing',
  css,
  html: `
    <div class="token-demo">
      <h1>Style Base Tokens</h1>
      <p>style-base liefert nur CSS-Variablen. Die Darstellung der Muster übernimmt diese Demo.</p>
      <h2>Farben</h2>
      <div class="token-demo__colors">
        ${[
          'primary',
          'accent',
          'secondary',
          'tertiary',
          'success',
          'info',
          'warning',
          'danger',
          'light',
          'dark',
          'white',
          'black',
        ]
          .map(
            (color) => `
          <div style="background: var(--nt-${color}); color: var(--nt-text-on-${color})">
            <code>--nt-${color}</code>
          </div>
        `,
          )
          .join('')}
      </div>
      <h2>Subtle und Emphasis</h2>
      <div class="token-demo__colors">
        ${['primary', 'accent', 'secondary', 'tertiary', 'success', 'info', 'warning', 'danger']
          .map(
            (color) => `
          <div style="background: var(--nt-${color}-subtle); color: var(--nt-${color}-emphasis)">
            <code>--nt-${color}-subtle / -emphasis</code>
          </div>
        `,
          )
          .join('')}
      </div>
      <h2>Typografie</h2>
      ${[1, 2, 3, 4, 5, 6]
        .map(
          (size) => `
        <p style="font-family: var(--nt-font-family-header); font-size: var(--nt-fs-h${size})">Heading ${size}: --nt-fs-h${size}</p>
        <p style="font-size: var(--nt-fs-${size})">Text ${size}: --nt-fs-${size}</p>
      `,
        )
        .join('')}
      <h2>Spacing</h2>
      ${Array.from(
        { length: 11 },
        (_, size) => `
        <div class="token-demo__spacing">
          <code>--nt-space-${size}</code>
          <span style="width: var(--nt-space-${size})"></span>
        </div>
      `,
      ).join('')}
    </div>
  `,
});
