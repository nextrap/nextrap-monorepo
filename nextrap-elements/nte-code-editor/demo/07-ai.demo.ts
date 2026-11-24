// Ausführbare KI-Demo ohne Netzwerk, Zugangsdaten oder fest vorgegebenen Anbieter.
import { defineDemo } from '@trunkjs/demo-viewer';
import '../index';
import type {
  NteCodeEditor, CodeEditorInlineCompletionCallback, CodeEditorInlineEditCallback,
} from '../index';
import css from './demo.scss?inline';

// Die beiden getrennten Callbacks zeigen Request, Response und aktuellen Formularwert.
export default defineDemo({
  title: '07 · KI-Vervollständigung und Textbearbeitung',
  navPath: ['Elemente', 'Code Editor'],
  order: 7,
  description: 'Zwei typisierte Callbacks verbinden den Editor mit einem eigenen KI-Dienst: Inline Completion und Inline Edit.',
  css,
  html: `
    <h1>KI-Unterstützung ohne externen Dienst</h1>
    <p>Die Demo simuliert einen KI-Dienst lokal. Beide Callbacks können durch eigene API-Aufrufe ersetzt werden.</p>
    <ol>
      <li><strong>Inline Completion:</strong> Ergänze in der ersten Zeile <code>Hell</code> zu <code>Hello</code>. Nach dem Debounce erscheint <code> world!</code> als Ghost-Text. Tab übernimmt, Escape verwirft.</li>
      <li><strong>Inline Edit:</strong> Markiere Text in der zweiten Zeile. Öffne mit Strg+K (macOS: Cmd+K) oder dem Demo-Button das Anweisungsfeld, gib <code>uppercase</code> ein und bestätige mit Enter. Accept übernimmt den Vorschlag, Reject verwirft ihn. Ohne Markierung öffnet derselbe Shortcut das Eingabefeld am Cursor; <code>uppercase</code> fügt dann <code>NEW TEXT</code> ein.</li>
    </ol>
    <section aria-label="KI-Editor">
      <nte-code-editor id="ai-editor" language="text" label="KI-Editor"></nte-code-editor>
    </section>
    <h2>Callback-Typen und Beispielwerte</h2>
    <p><code>CodeEditorInlineCompletionCallback</code> und <code>CodeEditorInlineEditCallback</code> sind asynchrone Funktionen. Sie erhalten jeweils einen typisierten Request und liefern eine Promise mit <code>{ text: string }</code> oder <code>null</code>.</p>
    <h3>CodeEditorInlineCompletionRequest</h3>
    <p>Beispiel: Der Cursor steht direkt hinter <code>Hello</code> in der ersten Zeile.</p>
    <ul>
      <li><code>language: CodeEditorLanguage</code> – aktive Sprache, z. B. <code>'text'</code>; weitere Werte: <code>'html'</code>, <code>'markdown'</code>, <code>'css'</code>, <code>'scss'</code>, <code>'javascript'</code>, <code>'typescript'</code>.</li>
      <li><code>codeBefore: string</code> – gesamter Text vor dem Cursor, z. B. <code>'Hello'</code>.</li>
      <li><code>codeAfter: string</code> – gesamter Text danach, z. B. <code>'\\nMark this text to edit.'</code>.</li>
      <li><code>cursor: number</code> – nullbasierter UTF-16-Offset, hier <code>5</code>.</li>
      <li><code>signal: AbortSignal</code> – Abbruchsignal, z. B. <code>signal.aborted === false</code>; an <code>fetch</code> weiterreichen.</li>
    </ul>
    <p><code>CodeEditorInlineCompletionResponse</code>: <code>{ text: ' world!' }</code> ergänzt nur den fehlenden Text; <code>null</code> erzeugt keinen Vorschlag.</p>
    <h3>CodeEditorInlineEditRequest</h3>
    <p>Beispiel: Nach Übernahme der Completion wird die zweite Zeile bearbeitet. Das Plugin erweitert Markierungen auf vollständige Zeilen; ohne Markierung gilt <code>selection: ''</code> und <code>from === to</code>.</p>
    <ul>
      <li><code>language: CodeEditorLanguage</code> – z. B. <code>'text'</code>.</li>
      <li><code>codeBefore: string</code> – Text vor dem Edit-Bereich, z. B. <code>'Hello world!\\n'</code>.</li>
      <li><code>selection: string</code> – vollständiger zu ersetzender Text, z. B. <code>'Mark this text to edit.'</code>.</li>
      <li><code>codeAfter: string</code> – Text nach dem Edit-Bereich, hier <code>''</code>.</li>
      <li><code>from: number</code> – Startoffset, hier <code>13</code>.</li>
      <li><code>to: number</code> – exklusiver Endoffset, hier <code>36</code>.</li>
      <li><code>prompt: string</code> – Anweisung, z. B. <code>'uppercase'</code>.</li>
      <li><code>signal?: AbortSignal</code> – optionales Abbruchsignal; kann auch <code>undefined</code> sein.</li>
    </ul>
    <p><code>CodeEditorInlineEditResponse</code>: <code>{ text: 'MARK THIS TEXT TO EDIT.' }</code> ersetzt nur die betroffenen Zeilen. <code>null</code> oder leerer Ersatz lässt den Originaltext unverändert. Erst Accept ändert <code>editor.value</code>.</p>
    <h3>Editor und CodeMirror</h3>
    <p><code>editor</code> ist die Nextrap-Web-Component; <code>editor.value</code> enthält den gesamten Text. <code>editor.editorView</code> ist die zugrunde liegende CodeMirror-View der Arbeitsfassung. Ihr <code>state</code> enthält Dokument und Auswahl. <code>dispatch()</code> wendet eine Transaktion an, etwa um den Cursor zu setzen. Für normales Lesen und Schreiben genügt <code>value</code>.</p>
  `,

  // Die Antwort enthält ausschließlich den einzufügenden bzw. zu ersetzenden Text.
  async afterRender({ query, controls }) {
    // editor ist die Web Component; value ist ihre öffentliche Lese-/Schreib-API.
    const editor = query<NteCodeEditor>('#ai-editor');
    editor.value = 'Hell\nMark this text to edit.';
    // Der Completion-Request enthält Kontext und Cursorposition. Die Antwort
    // liefert ausschließlich die Ergänzung, nicht den gesamten Dokumenttext.
    const completion: CodeEditorInlineCompletionCallback = async request => {
      const { signal, ...data } = request;
      controls.setValue('request', JSON.stringify({ ...data, signal: { aborted: signal.aborted } }, null, 2));
      const result = !signal.aborted && request.codeBefore.endsWith('Hello') ? { text: ' world!' } : null;
      controls.setValue('response', JSON.stringify(result, null, 2));
      return result;
    };
    // Der Edit-Request enthält zusätzlich prompt und den vollständigen
    // Zeilenbereich selection/from/to. Der Ersatz betrifft nur diesen Bereich.
    const edit: CodeEditorInlineEditCallback = async request => {
      const { signal, ...data } = request;
      controls.setValue('request', JSON.stringify({ ...data, signal: signal ? { aborted: signal.aborted } : null }, null, 2));
      const result = !signal?.aborted && request.prompt.toLowerCase() === 'uppercase'
        ? { text: request.selection ? request.selection.toUpperCase() : 'NEW TEXT' }
        : null;
      controls.setValue('response', JSON.stringify(result, null, 2));
      return result;
    };
    // Die Registrierung aktiviert beide unabhängigen Plugin-Funktionen.
    editor.inlineCompletion = completion;
    editor.inlineEdit = edit;
    // updateComplete wartet auf das Lit-Rendering. Erst danach ist editorView
    // verfügbar. dispatch setzt die Auswahl per Transaktion auf Offset 4 (nach Hell).
    await editor.updateComplete;
    editor.editorView?.dispatch({ selection: { anchor: 4 } });
    // input meldet die tatsächliche Übernahme eines Vorschlags.
    controls.setValue('value', editor.value);
    const onInput = () => controls.setValue('value', editor.value);
    editor.addEventListener('input', onInput);
    // Beim Verlassen der Demo den registrierten Listener wieder entfernen.
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
        type: 'button', label: 'Bearbeiten / Einfügen',
        onClick(_event, { query }) {
          query<NteCodeEditor>('#ai-editor').triggerInlineEdit();
        },
      },
      { id: 'request', type: 'output', label: 'Request (AbortSignal als Status)' },
      { id: 'response', type: 'output', label: 'Response' },
      { id: 'value', type: 'output', label: 'Aktueller editor.value' },
    ],
  },
});
