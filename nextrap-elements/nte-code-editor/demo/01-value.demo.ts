// Registriert den Editor für die ausführbare Demo.
import { defineDemo } from '@trunkjs/demo-viewer';
import '../index';
import type { NteCodeEditor } from '../index';
import css from './demo.scss?inline';

// Das direkte HTML-Markup übergibt keinen Inhalt an den Diagnose-Slot des Editors.
export default defineDemo({
  title: '01 · Value und Formulare',
  navPath: ['Elemente', 'Code Editor'],
  order: 1,
  description:
    'Code über value setzen und lesen, Benutzereingaben verfolgen und den Wert mit FormData übernehmen.',
  css,
  html: `
    <h1>Code wie einen Formularwert bearbeiten</h1>
    <p>Bearbeite das HTML direkt im Editor. <strong>input</strong> meldet die Bearbeitung sofort, <strong>change</strong> nach dem Verlassen des Editors. Eine Zuweisung an <strong>value</strong> löst keines dieser beiden Benutzerereignisse aus.</p>
    <section aria-label="HTML-Quelltext">
      <nte-code-editor id="value-editor" name="source" label="HTML-Quelltext"></nte-code-editor>
    </section>
  `,
  // Das echte Formular nutzt denselben Editor über seine explizite Form-Zuordnung.
  async afterRender({ root, query, controls }) {
    await customElements.whenDefined('nte-code-editor');
    const editor = query<NteCodeEditor>('#value-editor');
    editor.label = 'HTML-Quelltext';
    const form = document.createElement('form');
    form.id = 'code-editor-value-form';
    root.append(form);
    editor.setAttribute('form', form.id);
    editor.defaultValue =
      '<article>\n  <h1>Hallo Nextrap</h1>\n  <p>Bearbeite diesen Quelltext.</p>\n</article>';
    editor.value = editor.defaultValue;
    controls.setValue('source-value', editor.value);
    controls.setValue('event', 'Noch kein Benutzerereignis.');
    controls.setValue('form-value', 'Klicke auf „FormData lesen“.');

    // Der Wert wird am Event-Ziel synchron ausgelesen, wie bei einem Textfeld.
    const onInput = () => {
      controls.setValue('source-value', editor.value);
      controls.setValue('event', 'input');
    };
    const onChange = () => controls.setValue('event', 'change');
    editor.addEventListener('input', onInput);
    editor.addEventListener('change', onChange);

    // Der Viewer kann dieselbe Demo mehrfach mounten, ohne Listener zurückzulassen.
    return () => {
      editor.removeEventListener('input', onInput);
      editor.removeEventListener('change', onChange);
      form.remove();
    };
  },
  controls: {
    items: [
      {
        id: 'source-value',
        type: 'textarea',
        label: 'editor.value',
        update: 'apply',
        info: '„Anwenden“ schreibt den Text über die value-Property in den Editor.',
        // Programmatisches Setzen ist absichtlich von Benutzereingaben getrennt.
        onApply({ value }, { query }) {
          query<NteCodeEditor>('#value-editor').value = String(value);
        },
      },
      {
        type: 'button',
        label: 'Value lesen',
        // Der Getter liefert auch vor dem nächsten Lit-Update den aktuellen Text.
        onClick(_event, { query, controls }) {
          controls.setValue(
            'source-value',
            query<NteCodeEditor>('#value-editor').value,
          );
        },
      },
      {
        type: 'button',
        label: 'FormData lesen',
        // name="source" nimmt den Editor in die native Formularserialisierung auf.
        onClick(_event, { query, controls }) {
          const form = query<HTMLFormElement>('#code-editor-value-form');
          const data = new FormData(form);
          controls.setValue(
            'form-value',
            JSON.stringify({ source: data.get('source') }, null, 2),
          );
        },
      },
      {
        type: 'button',
        label: 'Formular zurücksetzen',
        // reset() stellt den mit defaultValue gesetzten Ausgangstext wieder her.
        onClick(_event, { query, controls }) {
          query<HTMLFormElement>('#code-editor-value-form').reset();
          controls.setValue(
            'source-value',
            query<NteCodeEditor>('#value-editor').value,
          );
        },
      },
      { id: 'event', type: 'output', label: 'Letztes Benutzerereignis' },
      { id: 'form-value', type: 'output', label: 'FormData-Ergebnis' },
    ],
  },
});
