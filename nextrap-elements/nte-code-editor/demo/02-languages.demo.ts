// Alle sechs Sprachmodi werden über dieselbe öffentliche Editor-API verwendet.
import { defineDemo } from '@trunkjs/demo-viewer';
import '../index';
import type { NteCodeEditor } from '../index';
import css from './demo.scss?inline';

// Die HTML-Abschnitte enthalten jeweils einen leeren Editor mit eigener Sprache.
export default defineDemo({
  title: '02 · HTML, Markdown, CSS, JavaScript, TypeScript und SCSS',
  navPath: ['Elemente', 'Code Editor'],
  order: 2,
  description:
    'Mitgelieferte Sprachen einschließlich HTML und Code-Fences innerhalb von Markdown.',
  css,
  html: `
    <h1>Mitgelieferte Sprachen</h1>
    <p>Die Sprache wird über <strong>language</strong> gesetzt. HTML verarbeitet auch enthaltene Style- und Script-Blöcke; Markdown erkennt HTML sowie die gezeigten Code-Fences.</p>
    <h2>HTML</h2>
    <section aria-label="HTML-Beispiel">
      <nte-code-editor id="html-editor" language="html" label="HTML-Beispiel"></nte-code-editor>
    </section>
    <h2>Markdown mit HTML und Code-Fences</h2>
    <section aria-label="Markdown-Beispiel">
      <nte-code-editor id="markdown-editor" language="markdown" label="Markdown-Beispiel"></nte-code-editor>
    </section>
    <h2>CSS</h2>
    <p>Klicke auf ein Farbquadrat, um die Farbe zu bearbeiten. Ziehe mit gedrückter mittlerer Maustaste oder Alt + linker Maustaste über mehrere Zeilen, um eine Spalte auszuwählen.</p>
    <section aria-label="CSS-Beispiel">
      <nte-code-editor id="css-editor" language="css" label="CSS-Beispiel"></nte-code-editor>
    </section>
    <h2>JavaScript</h2>
    <section aria-label="JavaScript-Beispiel">
      <nte-code-editor id="javascript-editor" language="javascript" label="JavaScript-Beispiel"></nte-code-editor>
    </section>
    <h2>TypeScript</h2>
    <section aria-label="TypeScript-Beispiel">
      <nte-code-editor id="typescript-editor" language="typescript" label="TypeScript-Beispiel"></nte-code-editor>
    </section>
    <h2>SCSS</h2>
    <p>Auch konkrete SCSS-Farbwerte lassen sich über den Picker bearbeiten; Variablenreferenzen bleiben unverändert.</p>
    <section aria-label="SCSS-Beispiel">
      <nte-code-editor id="scss-editor" language="scss" label="SCSS-Beispiel"></nte-code-editor>
    </section>
  `,
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
  color: #3498db;
  background: rgb(240, 244, 248);
  border-color: hsl(210, 50%, 40%);
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
    query<NteCodeEditor>('#scss-editor').value = `$accent: #663399;

@mixin card-border($color) {
  border: 1px solid $color;
}

.card {
  @include card-border($accent);

  &:hover {
    color: $accent;
  }

  .title { color: #3498db; font-weight: 600; }
}`;
  },
});
