// Ausführbare KI-Demo ohne Netzwerk, Zugangsdaten oder fest vorgegebenen Anbieter.
import { defineDemo } from '@trunkjs/demo-viewer';
import '../index';
import type {
  NteCodeEditor, CodeEditorInlineCompletionCallback, CodeEditorInlineEditCallback,
} from '../index';
import css from './demo.scss?inline';

// Die beiden getrennten Callbacks zeigen Request, Response und bestätigten Formularwert.
export default defineDemo({
  title: '07 · KI-Vervollständigung und Textbearbeitung',
  navPath: ['Elemente', 'Code Editor'],
  order: 7,
  description: 'Ghost-Text und gezielte Änderungen mit eigenen asynchronen Callbacks.',
  css,
  html: `
    <h1>KI-Unterstützung ohne externen Dienst</h1>
    <p>Tippe beispielsweise am Zeilenende <strong>Hello</strong> und warte kurz. Strg+Umschalt+Leertaste fragt sofort an, Tab übernimmt und Escape verwirft. Markiere einen Text und öffne mit Strg+K das Anweisungsfeld. Der Demo-Callback versteht <strong>uppercase</strong> und <strong>delete</strong>. Erst Accept ändert den Wert.</p>
    <section aria-label="KI-Editor">
      <nte-code-editor id="ai-editor" language="text" label="KI-Editor"></nte-code-editor>
    </section>
  `,

  // Die Antwort enthält ausschließlich den einzufügenden bzw. zu ersetzenden Text.
  async afterRender({ query, controls }) {
    const editor = query<NteCodeEditor>('#ai-editor');
    editor.value = 'Hello\nMark this text to edit.';
    const completion: CodeEditorInlineCompletionCallback = async request => {
      const { signal, ...data } = request;
      controls.setValue('request', JSON.stringify(data, null, 2));
      const result = request.codeBefore.endsWith('Hello') ? { text: ' world!' } : null;
      controls.setValue('response', JSON.stringify(result, null, 2));
      return signal.aborted ? null : result;
    };
    const edit: CodeEditorInlineEditCallback = async request => {
      const { signal, ...data } = request;
      controls.setValue('request', JSON.stringify(data, null, 2));
      const result = request.prompt.toLowerCase() === 'uppercase'
        ? { text: request.selection.toUpperCase() }
        : request.prompt.toLowerCase() === 'delete' ? { text: '' } : null;
      controls.setValue('response', JSON.stringify(result, null, 2));
      return signal.aborted ? null : result;
    };
    editor.inlineCompletion = completion;
    editor.inlineEdit = edit;
    await editor.updateComplete;
    editor.editorView?.dispatch({ selection: { anchor: 5 } });
    controls.setValue('value', editor.value);
    const onInput = () => controls.setValue('value', editor.value);
    editor.addEventListener('input', onInput);
    return () => editor.removeEventListener('input', onInput);
  },

  // Die Buttons illustrieren die öffentliche API unabhängig von Tastaturbefehlen.
  controls: {
    items: [
      {
        id: 'automatic', type: 'checkbox', label: 'Automatische Vervollständigung', value: true,
        onChange({ value }, { query }) {
          query<NteCodeEditor>('#ai-editor').inlineCompletionAutomatic = Boolean(value);
        },
      },
      {
        type: 'button', label: 'Vervollständigung anfordern',
        onClick(_event, { query }) {
          query<NteCodeEditor>('#ai-editor').triggerInlineCompletion();
        },
      },
      {
        type: 'button', label: 'Auswahl bearbeiten',
        onClick(_event, { query }) {
          query<NteCodeEditor>('#ai-editor').triggerInlineEdit();
        },
      },
      { id: 'request', type: 'output', label: 'Request (ohne AbortSignal)' },
      { id: 'response', type: 'output', label: 'Response' },
      { id: 'value', type: 'output', label: 'Bestätigter editor.value' },
    ],
  },
});
