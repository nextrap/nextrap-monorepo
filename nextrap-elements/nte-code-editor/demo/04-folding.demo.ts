// Die Demo steuert Folding vollständig über die öffentliche Wrapper-API.
import { defineDemo } from '@trunkjs/demo-viewer';
import '../index';
import type { NteCodeEditor } from '../index';
import css from './demo.scss?inline';

// Mehrzeilige Blöcke machen die Fold-Marker und das Wiederherstellen direkt erkennbar.
export default defineDemo({
  title: '04 · Code Folding ein- und ausschalten',
  navPath: ['Elemente', 'Code Editor'],
  order: 4,
  description:
    'Folding während der Bearbeitung umschalten, ohne den Editor oder seinen Text neu anzulegen.',
  css,
  html: `
    <h1>Code Folding</h1>
    <p>Die Marker am linken Rand falten einzelne Blöcke. Mit <strong>Folding aktiviert</strong> kann die Funktion während der Bearbeitung ein- und ausgeschaltet werden. Beim Abschalten wird zuvor eingeklappter Code wieder vollständig sichtbar.</p>
    <section aria-label="TypeScript mit Code Folding">
      <nte-code-editor id="folding-editor" language="typescript" label="TypeScript mit Code Folding"></nte-code-editor>
    </section>
  `,
  // folding ist standardmäßig aktiv; hier bleibt die Initialisierung beim Dokument.
  afterRender({ query }) {
    const editor = query<NteCodeEditor>('#folding-editor');
    editor.label = 'TypeScript mit Code Folding';
    editor.value = `interface Page {
  id: number;
  title: string;
}

const pages: Page[] = [
  { id: 1, title: 'Start' },
  { id: 2, title: 'Kontakt' },
];

function getTitle(id: number): string {
  const page = pages.find((item) => item.id === id);
  if (page) {
    return page.title;
  }
  return 'Unbekannt';
}`;
  },
  controls: {
    items: [
      {
        id: 'folding',
        type: 'checkbox',
        label: 'Folding aktiviert',
        value: true,
        // false entfernt sowohl Fold-Marker als auch den Folding-Zustand.
        onChange({ value }, { query, controls }) {
          const editor = query<NteCodeEditor>('#folding-editor');
          editor.folding = Boolean(value);
          controls.setValue(
            'folding-status',
            editor.folding
              ? 'Folding ist aktiv.'
              : 'Folding ist deaktiviert; der gesamte Code ist sichtbar.',
          );
        },
      },
      {
        type: 'button',
        label: 'Alle Blöcke einklappen',
        // Die Anwendung darf das optionale Feature auch programmatisch steuern.
        async onClick(_event, { query, controls }) {
          const editor = query<NteCodeEditor>('#folding-editor');
          await editor.updateComplete;
          if (editor.folding) {
            editor.foldAll();
            controls.setValue(
              'folding-status',
              'Faltbare Blöcke sind eingeklappt.',
            );
          } else {
            controls.setValue(
              'folding-status',
              'Aktiviere Folding, um Blöcke einzuklappen.',
            );
          }
        },
      },
      {
        type: 'button',
        label: 'Alle Blöcke ausklappen',
        // Ausklappen verändert den Dokumenttext nicht.
        onClick(_event, { query, controls }) {
          const editor = query<NteCodeEditor>('#folding-editor');
          editor.unfoldAll();
          controls.setValue('folding-status', 'Der gesamte Code ist sichtbar.');
        },
      },
      {
        id: 'folding-status',
        type: 'output',
        label: 'Zustand',
        value: 'Folding ist aktiv.',
      },
    ],
  },
});
