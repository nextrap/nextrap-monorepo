import './_virtual_tdemo-client-BQ75DL_E.js';
import './directive-CJw_OlP2.js';
import './index-5uYvO--2.js';
import './index-BR6EnczS.js';
import './index-l0sNRNKZ.js'; /* empty css              */
import { b as i, r as t } from './main-D7kcPh5k.js';
import './nextrap-element-BgVUIfl5.js';
import './property-pW3KQYk0.js';
import './state-BVZImsYv.js';
import { d as n } from './types-4rIte7rE.js';
const a = `<!doctype html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>nte-input Validation Demo</title>
  </head>
  <body>
    <main>
      <h1>nte-input</h1>
      <p>
        Beispiel zum Testen der Formular-Validation mit <code>form</code>, <code>action</code> und <code>method</code>.
      </p>

      <section>
        <h2>Validation Beispiel</h2>
        <p>
          Das Formular nutzt native Submit-Validierung. Bitte die Pflichtfelder leer lassen oder ausfüllen und dann
          <code>Absenden</code> testen.
        </p>

        <form action="/demo/05-validation.html" method="post">
          <nte-input
            class="hoverlabel"
            label="Name *"
            type="text"
            name="name"
            placeholder="Max Mustermann"
            required
          ></nte-input>

          <nte-input
            class="hoverlabel"
            label="E-Mail *"
            type="email"
            name="email"
            placeholder="name@example.com"
            required
          ></nte-input>

          <nte-input
            class="hoverlabel"
            label="PLZ * (5 Ziffern)"
            type="text"
            name="zip"
            pattern="^\\d{5}$"
            placeholder="12345"
            required
          ></nte-input>

          <nte-input class="hoverlabel" label="Kommentar *" type="textarea" name="message" required></nte-input>

          <nte-input class="hoverlabel" label="Status *" type="select" name="status" required>
            <options>
              <option value="">Bitte wählen</option>
              <option value="draft">Entwurf</option>
              <option value="inprogress">In Bearbeitung</option>
            </options>
          </nte-input>

          <nte-input
            class="hoverlabel"
            label="Schlagworte *"
            type="token-input"
            name="tags"
            required
            data-options='[{"value":"news","label":"News"},{"value":"events","label":"Events"},{"value":"docs","label":"Dokumentation"}]'
            validation-message="Bitte mindestens ein Schlagwort eingeben oder auswählen."
          ></nte-input>

          <nte-input label="AGB akzeptieren *" type="checkbox" name="accepted" value="yes" required></nte-input>

          <div class="demo-actions">
            <button type="submit">Absenden</button>
          </div>
        </form>
      </section>
    </main>

    <script src="/demo/main.js" type="module"><\/script>
  </body>
</html>
`,
  v = n({
    title: 'Validation',
    description: 'Pflichtfelder, Pattern und native Browser-Validierung',
    render(e) {
      t(e, a, i);
    },
  });
export { v as default };
