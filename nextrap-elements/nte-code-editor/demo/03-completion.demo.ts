// HTML und eingebettetes HTML teilen die konfigurierbare Completion des Wrappers.
import { startCompletion } from '@codemirror/autocomplete';
import { defineDemo } from '@trunkjs/demo-viewer';
import '../index';
import type { CodeEditorHtmlElement, NteCodeEditor } from '../index';
import css from './demo.scss?inline';

// Beide Eingabefelder zeigen dieselben Vorgaben in unterschiedlichen Sprachkontexten.
export default defineDemo({
  title: '03 · Eigene HTML-Elemente und Klassen vervollständigen',
  navPath: ['Elemente', 'Code Editor'],
  order: 3,
  description:
    'Standard-HTML-Completion um eigene Tags, Attribute und verfügbare Klassen ergänzen – auch in Markdown.',
  css,
  html: `
    <h1>Eigene Completion-Vorgaben</h1>
    <p>Tippe <strong>&lt;app-</strong> oder ergänze einen Klassennamen innerhalb von <strong>class</strong>. <strong>Strg + Leertaste</strong> öffnet die Vorschläge auch ausdrücklich. Bereits gesetzte Klassen bleiben beim Vervollständigen des nächsten Klassennamens erhalten.</p>
    <h2>HTML</h2>
    <section aria-label="HTML mit eigenen Vorschlägen">
      <nte-code-editor id="completion-html" language="html" label="HTML mit eigenen Vorschlägen"></nte-code-editor>
    </section>
    <h2>HTML innerhalb von Markdown</h2>
    <section aria-label="Markdown mit eigenen Vorschlägen">
      <nte-code-editor id="completion-markdown" language="markdown" label="Markdown mit eigenen Vorschlägen"></nte-code-editor>
    </section>
  `,
  // Tags können nur Namen oder zusätzlich ihre erlaubten Attributwerte enthalten.
  afterRender({ query, controls }) {
    const htmlEditor = query<NteCodeEditor>('#completion-html');
    const markdownEditor = query<NteCodeEditor>('#completion-markdown');
    htmlEditor.label = 'HTML mit eigenen Vorschlägen';
    markdownEditor.label = 'Markdown mit eigenen Vorschlägen';
    const htmlElements: CodeEditorHtmlElement[] = [
      {
        name: 'app-card',
        attributes: { variant: ['standard', 'highlight'], title: null },
      },
      'app-icon',
    ];
    const classNames = [
      'container',
      'card',
      'card-title',
      'btn',
      'btn-primary',
      'md:grid-cols-2',
      'w-1/2',
    ];

    htmlEditor.htmlElements = htmlElements;
    htmlEditor.classNames = classNames;
    htmlEditor.value = `<app-card variant="standard" class="container card">
  <h2 class="card-title">Eigene HTML-Elemente</h2>
  <button class="btn btn-primary">Weiter</button>
</app-card>`;

    markdownEditor.htmlElements = htmlElements;
    markdownEditor.classNames = classNames;
    markdownEditor.value = `# Artikel mit HTML

Der Fließtext bleibt **Markdown**.

<app-card variant="highlight" class="container card">
  <h2 class="card-title">HTML im Markdown-Dokument</h2>
</app-card>

\`\`\`html
<div class="container card">Auch HTML-Code-Fences erhalten die Vorgaben.</div>
\`\`\``;
    controls.setValue('class-names', classNames.join('\n'));
    controls.setValue('element-names', 'app-card\napp-icon');
  },
  controls: {
    items: [
      {
        id: 'class-names',
        type: 'textarea',
        label: 'Verfügbare Klassen, eine pro Zeile',
        update: 'apply',
        info: 'Die neue Liste gilt sofort für beide Editoren.',
        // Die Anwendungsdaten werden über die öffentliche classNames-Property übergeben.
        onApply({ value }, { query }) {
          const classNames = String(value)
            .split('\n')
            .map((name) => name.trim())
            .filter(Boolean);
          query<NteCodeEditor>('#completion-html').classNames = classNames;
          query<NteCodeEditor>('#completion-markdown').classNames = classNames;
        },
      },
      {
        id: 'element-names',
        type: 'textarea',
        label: 'Eigene HTML-Elemente, eines pro Zeile',
        update: 'apply',
        info: 'Ersetzt die zusätzlich angebotenen Tags. Standard-HTML bleibt verfügbar; Attributvorgaben stehen im afterRender-Beispiel.',
        // Eine reine Namensliste ist die kürzeste Form der zusätzlichen Tag-Konfiguration.
        onApply({ value }, { query }) {
          const htmlElements = String(value)
            .split('\n')
            .map((name) => name.trim())
            .filter(Boolean);
          query<NteCodeEditor>('#completion-html').htmlElements = htmlElements;
          query<NteCodeEditor>('#completion-markdown').htmlElements =
            htmlElements;
        },
      },
      {
        type: 'button',
        label: 'Klassen-Completion im HTML zeigen',
        // Die öffentliche EditorView ermöglicht bei Bedarf direkte CodeMirror-Kommandos.
        async onClick(_event, { query }) {
          const editor = query<NteCodeEditor>('#completion-html');
          editor.value = '<div class="container ca"></div>';
          await editor.updateComplete;
          const view = editor.editorView;
          if (view) {
            view.dispatch({
              selection: { anchor: editor.value.indexOf('ca"') + 2 },
            });
            view.focus();
            startCompletion(view);
          }
        },
      },
      {
        type: 'button',
        label: 'Tag-Completion in Markdown zeigen',
        // Ein noch unvollständiger Tag muss bereits vor einem fertigen HTML-Block ergänzbar sein.
        async onClick(_event, { query }) {
          const editor = query<NteCodeEditor>('#completion-markdown');
          editor.value = '# Markdown\n\n<app-';
          await editor.updateComplete;
          const view = editor.editorView;
          if (view) {
            view.dispatch({ selection: { anchor: editor.value.length } });
            view.focus();
            startCompletion(view);
          }
        },
      },
    ],
  },
});
