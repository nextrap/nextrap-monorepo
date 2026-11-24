// Der Unified Diff vergleicht originalValue mit dem weiterhin editierbaren value.
import { defineDemo } from '@trunkjs/demo-viewer';
import '../index';
import type { NteCodeEditor } from '../index';
import css from './demo.scss?inline';

// Die Vergleichsversion bleibt vom aktuellen Formularwert getrennt.
export default defineDemo({
  title: '05 · Änderungen als Diff anzeigen',
  navPath: ['Elemente', 'Code Editor'],
  order: 5,
  description:
    'Eine unveränderliche Vergleichsversion und den aktuellen value als bearbeitbaren Unified Diff anzeigen.',
  css,
  html: `
    <h1>Original und Bearbeitungsstand vergleichen</h1>
    <p><strong>originalValue</strong> enthält die Vergleichsversion, <strong>value</strong> den aktuellen Text. Der Diff markiert hinzugefügte und entfernte Zeilen, während du weiterarbeitest. <strong>undefined</strong> beendet den Vergleich; ein leerer String vergleicht dagegen mit einem leeren Dokument.</p>
    <section aria-label="HTML-Vergleich">
      <nte-code-editor id="diff-editor" language="html" label="HTML-Vergleich"></nte-code-editor>
    </section>
  `,
  // Original und Arbeitsfassung werden explizit über die beiden Properties gesetzt.
  afterRender({ query, controls, state }) {
    const editor = query<NteCodeEditor>('#diff-editor');
    editor.label = 'HTML-Vergleich';
    editor.originalValue = `<article class="card">
  <h1>Willkommen</h1>
  <p>Die bisherige Beschreibung.</p>
</article>`;
    editor.value = `<article class="card highlighted">
  <h1>Willkommen bei Nextrap</h1>
  <p>Die überarbeitete Beschreibung.</p>
  <a href="/kontakt">Kontakt aufnehmen</a>
</article>`;
    state.set('baseline', editor.originalValue);
    controls.setValue('original-value', editor.originalValue);
    controls.setValue('current-value', editor.value);

    // Ausgelesen wird ausschließlich der aktuelle Quelltext, ohne Diff-Markierungen.
    const onInput = () => controls.setValue('current-value', editor.value);
    editor.addEventListener('input', onInput);
    return () => editor.removeEventListener('input', onInput);
  },
  controls: {
    items: [
      {
        id: 'diff-enabled',
        type: 'checkbox',
        label: 'Diff anzeigen',
        value: true,
        // Die Demo merkt sich die Vergleichsversion, wenn die Anzeige abgeschaltet wird.
        onChange({ value }, { query, state }) {
          query<NteCodeEditor>('#diff-editor').originalValue = value
            ? String(state.get('baseline') ?? '')
            : undefined;
        },
      },
      {
        id: 'original-value',
        type: 'textarea',
        label: 'Vergleichsversion: originalValue',
        update: 'apply',
        // Eine neue Baseline lässt den aktuellen Bearbeitungsstand unangetastet.
        onApply({ value }, { query, controls, state }) {
          const originalValue = String(value);
          state.set('baseline', originalValue);
          if (controls.getValue<boolean>('diff-enabled')) {
            query<NteCodeEditor>('#diff-editor').originalValue = originalValue;
          }
        },
      },
      {
        type: 'button',
        label: 'Aktuellen Stand als Original übernehmen',
        // Der Vergleich hat nach dieser Aktion keine Änderungen mehr.
        onClick(_event, { query, controls, state }) {
          const editor = query<NteCodeEditor>('#diff-editor');
          state.set('baseline', editor.value);
          controls.setValue('original-value', editor.value);
          if (controls.getValue<boolean>('diff-enabled'))
            editor.originalValue = editor.value;
        },
      },
      {
        id: 'current-value',
        type: 'output',
        label: 'Aktueller Quelltext: value',
      },
    ],
  },
});
