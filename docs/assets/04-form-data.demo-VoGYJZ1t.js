import './_virtual_tdemo-client-BQ75DL_E.js';
import './directive-CJw_OlP2.js';
import './index-5uYvO--2.js';
import './index-BR6EnczS.js';
import './index-l0sNRNKZ.js'; /* empty css              */
import { a, r as t } from './main-D7kcPh5k.js';
import './nextrap-element-BgVUIfl5.js';
import './property-pW3KQYk0.js';
import './state-BVZImsYv.js';
import { d as n } from './types-4rIte7rE.js';
const o = `<!doctype html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>nte-input FormDataAccessor Demo</title>
  </head>
  <body>
    <main>
      <h1>nte-input</h1>
      <p>Direkte Arbeit mit <code>FormDataAccessor</code> über die <code>value</code>-API.</p>

      <section id="form-data-demo">
        <h2>FormDataAccessor Beispiel</h2>
        <p>
          Die JSON-Ausgabe zeigt direkt <code>FormDataAccessor.data</code>. Änderungen an den Feldern aktualisieren das
          JSON automatisch. Änderungen am JSON werden direkt zurück in die Inputs geschrieben – inklusive Arrays wie bei
          <code>select-radio</code> und <code>token-input</code>.
        </p>

        <div class="demo-form-grid">
          <nte-input class="hoverlabel" label="Name" type="text" name="name" value="Anna Beispiel"></nte-input>

          <nte-input
            class="hoverlabel"
            label="Kommentar"
            type="textarea"
            name="message"
            value="Wert direkt am Host lesen"
          ></nte-input>

          <nte-input class="hoverlabel" label="Status" type="select" name="status" value="inprogress">
            <options>
              <option value="wrust">Wartet auf Rückmeldung</option>
              <option value="inprogress">In Bearbeitung</option>
            </options>
          </nte-input>

          <nte-input
            label="Kategorien"
            type="select-radio"
            name="categories"
            multiple
            value='["news","events"]'
            data-options='[{"value":"news","label":"News"},{"value":"events","label":"Events"}]'
          ></nte-input>

          <nte-input
            class="hoverlabel"
            label="Schlagworte"
            type="token-input"
            name="tags"
            value='["news","docs"]'
            data-options='[{"value":"news","label":"News"},{"value":"events","label":"Events"},{"value":"docs","label":"Dokumentation"}]'
          ></nte-input>

          <nte-input label="AGB akzeptieren" type="checkbox" name="accepted" value="yes" checked></nte-input>
        </div>

        <label class="json-label" for="form-data-json">FormDataAccessor Ausgabe</label>
        <textarea id="form-data-json" class="demo-json" spellcheck="false"></textarea>
      </section>
    </main>

    <script src="/demo/main.js" type="module"><\/script>
  </body>
</html>
`,
  h = n({
    title: 'FormDataAccessor',
    description: 'Werte direkt als Objekt lesen, anzeigen und zurückschreiben',
    render(e) {
      t(e, o, a);
    },
  });
export { h as default };
