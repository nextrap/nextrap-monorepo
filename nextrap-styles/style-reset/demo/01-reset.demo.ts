import { defineDemo } from '@trunkjs/demo-viewer';
import css from './reset.scss?inline';

// Demonstriert den Reset ohne Viewer-Default-Styles, die das Ergebnis überlagern würden.
export default defineDemo({
  title: 'Reset für native Elemente',
  group: 'style-reset',
  description: 'Abstände, Listen, Links, Formularfelder und Tabellen ohne Browser-Dekoration',
  css,
  html: `
    <section class="reset-demo">
      <h1>Reset-Baseline</h1>
      <p>Überschrift und Absatz haben keine eigenen Außenabstände.</p>
      <p><a href="#reset-link">Links erben die Textfarbe und haben keine Unterstreichung.</a></p>
      <ul><li>Liste ohne Marker</li><li>Zweiter Eintrag</li></ul>
      <ol><li>Auch geordnete Listen sind zurückgesetzt.</li></ol>
      <label>Eingabe <input aria-label="Demo-Eingabe" value="Geerbte Schrift und Farbe" /></label>
      <button type="button">Button ohne Browser-Fläche</button>
      <table>
        <thead><tr><th>Element</th><th>Reset</th></tr></thead>
        <tbody><tr><td>Tabelle</td><td>Keine Zellzwischenräume</td></tr></tbody>
      </table>
    </section>
  `,
});
