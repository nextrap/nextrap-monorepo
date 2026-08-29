import '@nextrap/style-base/default';
import '@nextrap/style-typography/default';
import { defineDemo } from '@trunkjs/demo-viewer';

import '../index';
import './main.scss';

const rows = Array.from({ length: 40 }, (_, index) => {
  const number = index + 1;
  return `
    <tr>
      <th scope="row">${number}</th>
      <td>Datensatz ${number}</td>
      <td>${['Neu', 'In Arbeit', 'Erledigt'][index % 3]}</td>
      <td>${['Nord', 'Ost', 'Süd', 'West'][index % 4]}</td>
      <td>${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(250 + index * 91)}</td>
      <td>Diese breite Notiz macht das horizontale Scrollen sichtbar.</td>
    </tr>
  `;
}).join('');

export default defineDemo({
  title: 'Nur tbody scrollt',
  description: 'Absoluter Header/Footer, reservierter Body-Abstand, zwei gepinnte Spalten und Drag-Resize',
  render(root) {
    root.innerHTML = `
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
            <tbody>${rows}</tbody>
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
