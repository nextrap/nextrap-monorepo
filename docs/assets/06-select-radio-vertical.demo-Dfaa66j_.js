import './_virtual_tdemo-client-CxMeb5Rk.js';
import './directive-CJw_OlP2.js';
import './index-BR6EnczS.js';
import './index-K51eAYk-.js';
import './index-l0sNRNKZ.js'; /* empty css              */
import { r as t } from './main-NvqPSaEw.js';
import './nextrap-element-DeSHPIJn.js';
import './property-C2fH_zxw.js';
import './state-C6dwV5NT.js';
import { d as n } from './types-4rIte7rE.js';
const i = `<!doctype html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>nte-input Select-Radio Vertical Demo</title>
  </head>
  <body class="wide-demo">
    <main>
      <h1>nte-input Select-Radio Vertical</h1>
      <p>
        Die Variante <code>.default.select-radio-vertical</code> wird auf ein Form bzw. einen Container gelegt und stylt
        darin nur <code>nte-input[type="select-radio"]</code>. Die Radios werden innerhalb des jeweiligen Inputs
        nebeneinander gerendert. Mindestbreite pro Element: 350px. Bei Umbruch entsteht zusätzlich eine horizontale
        Trennlinie.
      </p>

      <section>
        <h2>Zwei Optionen nebeneinander im Input</h2>
        <form class="default select-radio-vertical demo-select-radio-vertical-form">
          <nte-input
            label="Status"
            type="select-radio"
            value="inprogress"
            data-options="wrust|Wartet auf Rückmeldung;inprogress|In Bearbeitung"
          ></nte-input>
        </form>
      </section>

      <section>
        <h2>Mit Overflow / Umbruch im Input</h2>
        <form class="default select-radio-vertical demo-select-radio-vertical-form narrow">
          <nte-input
            label="Kategorien"
            type="select-radio"
            multiple
            value='["news","internal"]'
            data-options='[{"value":"news","label":"News"},{"value":"events","label":"Events"},{"value":"internal","label":"Intern"},{"value":"release","label":"Release"}]'
          ></nte-input>
        </form>
      </section>
    </main>

    <script src="/demo/main.js" type="module"><\/script>
  </body>
</html>
`,
  b = n({
    title: 'Select-Radio Vertical',
    description: 'Layout-Mixin für nebeneinander angeordnete Optionen mit Umbruch',
    render(e) {
      t(e, i);
    },
  });
export { b as default };
