// Alle sechs Sprachmodi werden über dieselbe öffentliche Editor-API verwendet.
import '@trunkjs/content-pane';
import { defineDemo } from '@trunkjs/demo-viewer';
import '../index';
import type { NteCodeEditor } from '../index';
import css from './demo.scss?inline';

// Die Markdown-Abschnitte erzeugen jeweils einen leeren Editor mit eigener Sprache.
export default defineDemo({
  title: '02 · HTML, Markdown, CSS, JavaScript, TypeScript und SCSS',
  navPath: ['Elemente', 'Code Editor'],
  order: 2,
  description:
    'Mitgelieferte Sprachen einschließlich HTML und Code-Fences innerhalb von Markdown.',
  css,
  markdown: `# Mitgelieferte Sprachen

Die Sprache wird über **language** gesetzt. HTML verarbeitet auch enthaltene
Style- und Script-Blöcke; Markdown erkennt HTML sowie die gezeigten Code-Fences.

## HTML

---
{: layout="nte-code-editor#html-editor[language=html]" section-aria-label="HTML-Beispiel"}

---
{: layout="/;"}

## Markdown mit HTML und Code-Fences

---
{: layout="nte-code-editor#markdown-editor[language=markdown]" section-aria-label="Markdown-Beispiel"}

---
{: layout="/;"}

## CSS

---
{: layout="nte-code-editor#css-editor[language=css]" section-aria-label="CSS-Beispiel"}

---
{: layout="/;"}

## JavaScript

---
{: layout="nte-code-editor#javascript-editor[language=javascript]" section-aria-label="JavaScript-Beispiel"}

---
{: layout="/;"}

## TypeScript

---
{: layout="nte-code-editor#typescript-editor[language=typescript]" section-aria-label="TypeScript-Beispiel"}

---
{: layout="/;"}

## SCSS

---
{: layout="nte-code-editor#scss-editor[language=scss]" section-aria-label="SCSS-Beispiel"}

---
{: layout="/;"}
`,
  wrapper_html: '<tj-content-pane>{{content}}</tj-content-pane>',
  // value bleibt in jedem Sprachmodus ein String; die Inhalte werden nicht ausgeführt.
  afterRender({ query }) {
    query<NteCodeEditor>('#html-editor').label = 'HTML-Beispiel';
    query<NteCodeEditor>('#html-editor').value = `<div class="card">
  <h2>Eine Karte</h2>
  <style>
    .card { color: rebeccapurple; }
  </style>
  <script>
    const title = document.querySelector('h2');
    console.log(title?.textContent);
  </script>
</div>`;

    query<NteCodeEditor>('#markdown-editor').label = 'Markdown-Beispiel';
    query<NteCodeEditor>('#markdown-editor').value = `# Markdown und HTML

**Formatierter Text** und ein [Link](https://example.org).

<div class="card">
  <h2>HTML innerhalb von Markdown</h2>
  <p>Auch die Tags erhalten Syntax-Highlighting.</p>
</div>

\`\`\`typescript
interface Page { title: string; }
const page: Page = { title: 'Nextrap' };
\`\`\`

\`\`\`scss
$accent: rebeccapurple;
.card { &:hover { color: $accent; } }
\`\`\``;

    query<NteCodeEditor>('#css-editor').label = 'CSS-Beispiel';
    query<NteCodeEditor>('#css-editor').value = `.card {
  display: grid;
  gap: 1rem;
  color: rebeccapurple;
}

.card:hover {
  color: darkviolet;
}`;

    query<NteCodeEditor>('#javascript-editor').label = 'JavaScript-Beispiel';
    query<NteCodeEditor>('#javascript-editor').value =
      `const pages = ['Start', 'Kontakt'];

function renderTitles(items) {
  return items.map((title) => title.toUpperCase());
}

console.log(renderTitles(pages));`;

    query<NteCodeEditor>('#typescript-editor').label = 'TypeScript-Beispiel';
    query<NteCodeEditor>('#typescript-editor').value = `interface Page {
  id: number;
  title: string;
}

function findPage(pages: Page[], id: number): Page | undefined {
  return pages.find((page) => page.id === id);
}

const selected = findPage([{ id: 1, title: 'Start' }], 1);`;

    query<NteCodeEditor>('#scss-editor').label = 'SCSS-Beispiel';
    query<NteCodeEditor>('#scss-editor').value = `$accent: rebeccapurple;

@mixin card-border($color) {
  border: 1px solid $color;
}

.card {
  @include card-border($accent);

  &:hover {
    color: $accent;
  }

  .title { font-weight: 600; }
}`;
  },
});
