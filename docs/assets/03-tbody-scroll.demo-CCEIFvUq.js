/* empty css                */ /* empty css                */ import './_virtual_tdemo-client-27TqdLsd.js';
import './index-BR6EnczS.js';
import './nextrap-element-DPUCZMMu.js';
import './nte-table-CaDYTzJL.js'; /* empty css             */
import './property-CGWbrx0V.js'; /* empty css              */
import { d as o } from './types-4rIte7rE.js';
const d = Array.from({ length: 40 }, (e, t) => {
    const r = t + 1;
    return `
    <tr>
      <th scope="row">${r}</th>
      <td>Datensatz ${r}</td>
      <td>${['Neu', 'In Arbeit', 'Erledigt'][t % 3]}</td>
      <td>${['Nord', 'Ost', 'Süd', 'West'][t % 4]}</td>
      <td>${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(250 + t * 91)}</td>
      <td>Diese breite Notiz macht das horizontale Scrollen sichtbar.</td>
    </tr>
  `;
  }).join(''),
  u = o({
    title: 'Nur tbody scrollt',
    description: 'Absoluter Header/Footer, reservierter Body-Abstand, zwei gepinnte Spalten und Drag-Resize',
    render(e) {
      e.innerHTML = `
      <main class="nte-table-demo">
        <h1>Separater Tabellen-Body</h1>
        <p>
          Nur der Tabellenkörper bestimmt die Scrollhöhe und scrollt. Header und Footer bleiben im normalen Tabellenfluss außerhalb seiner Scrollbars; die ersten beiden
          Spalten bleiben beim horizontalen Scrollen stehen. Die Spaltenbreite lässt sich an jeder rechten
          Headerkante mit der Maus ändern.
        </p>

        <nte-table height="24rem" pinned-columns="2" scroll-label="Umsatzliste">
          <table>
            <thead>
              <tr>
                <th scope="col" data-width="5rem">Nr.</th>
                <th scope="col" data-width="13rem">Bezeichnung</th>
                <th scope="col" data-width="10rem">Status</th>
                <th scope="col" data-width="9rem">Region</th>
                <th scope="col" data-width="11rem">Umsatz</th>
                <th scope="col" data-width="28rem">Notiz</th>
              </tr>
            </thead>
            <tbody>${d}</tbody>
            <tfoot>
              <tr>
                <th scope="row">40</th>
                <td>Datensätze</td>
                <td>3 Status</td>
                <td>4 Regionen</td>
                <td>Summe</td>
                <td>Der Footer bleibt unter dem scrollenden Body stehen.</td>
              </tr>
            </tfoot>
          </table>
        </nte-table>
      </main>
    `;
    },
  });
export { u as default };
