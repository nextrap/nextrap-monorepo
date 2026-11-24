// Die Split-Ansicht verwendet dieselben Formularwerte wie der einzelne Editor.
import { defineDemo } from '@trunkjs/demo-viewer';
import '../index';
import type { NteCodeEditor } from '../index';
import css from './demo.scss?inline';

// Unterschiedlich lange Änderungen zeigen Ausrichtung und gemeinsamen Scrollbereich.
export default defineDemo({
  title: '06 · Versionen nebeneinander vergleichen und übernehmen',
  navPath: ['Elemente', 'Code Editor'],
  order: 6,
  description:
    'Seiten tauschen, einzelne Änderungsblöcke in beide Richtungen übernehmen und beide Versionen gemeinsam scrollen.',
  css,
  html: `
    <h1>Zwei Versionen gemeinsam bearbeiten</h1>
    <p><strong>originalValue</strong> ist das Original, <strong>value</strong> die bearbeitbare Arbeitsfassung. Scrolle innerhalb des Vergleichs: Zusammengehörige Abschnitte bleiben auf gleicher Höhe, auch wenn eine Version zusätzliche Zeilen enthält.</p>
    <p>Die Buttons zwischen den Seiten holen zunächst den jeweiligen Originalblock in die Arbeitsfassung zurück. <strong>Neue Blöcke ins Original übernehmen</strong> kehrt die Kopierrichtung um und verändert damit gezielt die Vergleichsbasis. Das Original bleibt für direkte Texteingaben schreibgeschützt.</p>
    <p><strong>Neue Version links</strong> vertauscht nur die Darstellung. Die Bedeutung von <strong>value</strong>, <strong>originalValue</strong> und der gewählten Kopierrichtung bleibt erhalten.</p>
    <section aria-label="Original und Arbeitsfassung vergleichen">
      <nte-code-editor id="split-editor" language="html" diff-mode="side-by-side" label="Original und Arbeitsfassung vergleichen"></nte-code-editor>
    </section>
  `,
  // Konkrete Dokumente enthalten getrennte Ersetzungen, Ergänzungen und Löschungen.
  afterRender({ query, controls, state }) {
    const editor = query<NteCodeEditor>('#split-editor');
    editor.label = 'Workshop-Seite';
    editor.originalValue = `<article class="workshop">
  <header>
    <h1>Nextrap Workshop</h1>
    <p>Ein Tag für die Grundlagen von Web Components.</p>
  </header>

  <nav aria-label="Inhalt">
    <ul>
      <li><a href="#programm">Programm</a></li>
      <li><a href="#vorbereitung">Vorbereitung</a></li>
      <li><a href="#kontakt">Kontakt</a></li>
    </ul>
  </nav>

  <section id="programm">
    <h2>Programm</h2>
    <ol>
      <li>09:00 Uhr: Begrüßung</li>
      <li>09:30 Uhr: Komponenten kennenlernen</li>
      <li>11:00 Uhr: Gemeinsames Beispiel</li>
      <li>12:30 Uhr: Mittagspause</li>
      <li>13:30 Uhr: Eigene Komponenten bauen</li>
      <li>15:00 Uhr: Fragen und Austausch</li>
    </ol>
  </section>

  <section id="vorbereitung">
    <h2>Vorbereitung</h2>
    <p>Bring einen Laptop und deine Projektideen mit.</p>
    <ul>
      <li>Aktueller Browser</li>
      <li>Installierter Code-Editor</li>
      <li>Grundkenntnisse in HTML und TypeScript</li>
    </ul>
    <p>Das Beispielprojekt stellen wir vor Ort bereit.</p>
  </section>

  <aside class="notice">
    <h2>Hinweis zur Anmeldung</h2>
    <p>Die Anmeldung ist nur telefonisch möglich.</p>
    <p>Wir bestätigen deinen Platz anschließend per E-Mail.</p>
  </aside>

  <section id="kontakt">
    <h2>Kontakt</h2>
    <address>
      Workshop-Team<br>
      Beispielstraße 12<br>
      12345 Beispielstadt
    </address>
    <p><a href="/kontakt">Fragen zum Workshop stellen</a></p>
  </section>

  <footer>
    <p>Wir freuen uns auf deine Ideen.</p>
  </footer>
</article>`;
    editor.value = `<article class="workshop">
  <header>
    <h1>Nextrap Workshop</h1>
    <p>Ein Praxistag für Web Components und gemeinsame Code-Reviews.</p>
  </header>

  <nav aria-label="Inhalt">
    <ul>
      <li><a href="#programm">Programm</a></li>
      <li><a href="#vorbereitung">Vorbereitung</a></li>
      <li><a href="#kontakt">Kontakt</a></li>
    </ul>
  </nav>

  <section id="programm">
    <h2>Programm</h2>
    <ol>
      <li>09:00 Uhr: Begrüßung</li>
      <li>09:30 Uhr: Komponenten kennenlernen</li>
      <li>11:00 Uhr: Gemeinsames Beispiel</li>
      <li>12:30 Uhr: Mittagspause</li>
      <li>13:30 Uhr: Eigene Komponenten bauen</li>
      <li>14:30 Uhr: Änderungen im Diff besprechen</li>
      <li>15:00 Uhr: Fragen und Austausch</li>
    </ol>
    <div class="registration">
      <h3>Jetzt anmelden</h3>
      <p>Reserviere deinen Platz direkt auf unserer Website.</p>
      <a href="/anmeldung">Zur Online-Anmeldung</a>
    </div>
  </section>

  <section id="vorbereitung">
    <h2>Vorbereitung</h2>
    <p>Bring einen Laptop und deine Projektideen mit.</p>
    <ul>
      <li>Aktueller Browser</li>
      <li>Installierter Code-Editor</li>
      <li>Grundkenntnisse in HTML und TypeScript</li>
    </ul>
    <p>Das Beispielprojekt stellen wir vor Ort bereit.</p>
  </section>

  <section id="kontakt">
    <h2>Kontakt</h2>
    <address>
      Workshop-Team<br>
      Beispielstraße 12<br>
      12345 Beispielstadt
    </address>
    <p><a href="/kontakt">Fragen zum Workshop stellen</a></p>
  </section>

  <footer>
    <p>Wir freuen uns auf deine Ideen.</p>
  </footer>
</article>`;

    state.set('initial-original', editor.originalValue);
    state.set('initial-value', editor.value);
    controls.setValue('original-value', editor.originalValue);
    controls.setValue('current-value', editor.value);

    // Tippen und Zurückholen eines Originalblocks aktualisieren dieselbe value-Property.
    const onInput = () => controls.setValue('current-value', editor.value);
    // Kopieren in die Vergleichsbasis hat ein eigenes Ereignis und verändert value nicht.
    const onOriginalChange = (event: Event) => {
      const detail = (event as CustomEvent<{ value: string }>).detail;
      controls.setValue('original-value', detail.value);
    };
    editor.addEventListener('input', onInput);
    editor.addEventListener('original-change', onOriginalChange);

    // Wiederholtes Öffnen der Demo darf keine zusätzlichen Listener hinterlassen.
    return () => {
      editor.removeEventListener('input', onInput);
      editor.removeEventListener('original-change', onOriginalChange);
    };
  },
  controls: {
    items: [
      {
        id: 'modified-first',
        type: 'checkbox',
        label: 'Neue Version links',
        value: false,
        // Nur die visuelle Reihenfolge ändert sich; Original und Formularwert bleiben zugeordnet.
        onChange({ value }, { query, controls }) {
          const editor = query<NteCodeEditor>('#split-editor');
          editor.diffOrientation = value
            ? 'modified-first'
            : 'original-first';
          controls.setValue(
            'layout-status',
            value
              ? 'Links: Arbeitsfassung · Rechts: Original'
              : 'Links: Original · Rechts: Arbeitsfassung',
          );
        },
      },
      {
        id: 'copy-to-original',
        type: 'checkbox',
        label: 'Neue Blöcke ins Original übernehmen',
        value: false,
        info: 'Aktiviert: Die Buttons verändern originalValue. Sonst setzen sie den jeweiligen Block in value zurück.',
        // Die Richtung bezieht sich auf Dokumentrollen, unabhängig von links und rechts.
        onChange({ value }, { query, controls }) {
          const editor = query<NteCodeEditor>('#split-editor');
          editor.revertControls = controls.getValue<boolean>('show-controls')
            ? value
              ? 'modified-to-original'
              : 'original-to-modified'
            : 'none';
          controls.setValue(
            'transfer-status',
            editor.revertControls === 'none'
              ? 'Keine Übernahme-Buttons.'
              : value
                ? 'Arbeitsfassung → Original: Vergleichsbasis blockweise aktualisieren.'
                : 'Original → Arbeitsfassung: Änderungen blockweise zurücksetzen.',
          );
        },
      },
      {
        id: 'show-controls',
        type: 'checkbox',
        label: 'Übernahme-Buttons anzeigen',
        value: true,
        // Ausblenden der Buttons erhält beide Texte und die gewählte Kopierrichtung.
        onChange({ value }, { query, controls }) {
          const editor = query<NteCodeEditor>('#split-editor');
          const copyToOriginal =
            controls.getValue<boolean>('copy-to-original');
          editor.revertControls = value
            ? copyToOriginal
              ? 'modified-to-original'
              : 'original-to-modified'
            : 'none';
          controls.setValue(
            'transfer-status',
            value
              ? copyToOriginal
                ? 'Arbeitsfassung → Original: Vergleichsbasis blockweise aktualisieren.'
                : 'Original → Arbeitsfassung: Änderungen blockweise zurücksetzen.'
              : 'Keine Übernahme-Buttons.',
          );
        },
      },
      {
        type: 'button',
        label: 'Beispieltexte zurücksetzen',
        // Property-Zuweisungen sind ereignislos; die Demo aktualisiert ihre Ausgaben ausdrücklich.
        onClick(_event, { query, controls, state }) {
          const editor = query<NteCodeEditor>('#split-editor');
          editor.originalValue = String(state.get('initial-original'));
          editor.value = String(state.get('initial-value'));
          controls.setValue('original-value', editor.originalValue);
          controls.setValue('current-value', editor.value);
        },
      },
      {
        id: 'layout-status',
        type: 'output',
        label: 'Seitenanordnung',
        value: 'Links: Original · Rechts: Arbeitsfassung',
      },
      {
        id: 'transfer-status',
        type: 'output',
        label: 'Wirkung der Übernahme-Buttons',
        value:
          'Original → Arbeitsfassung: Änderungen blockweise zurücksetzen.',
      },
      {
        id: 'current-value',
        type: 'output',
        label: 'Arbeitsfassung: value',
      },
      {
        id: 'original-value',
        type: 'output',
        label: 'Vergleichsbasis: originalValue',
      },
    ],
  },
});
