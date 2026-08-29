const t = `import '@nextrap/style-base/default';
import '@nextrap/style-typography/default';
import { defineDemo } from '@trunkjs/demo-viewer';

import '../index';
import './main.scss';

const table = (style: string, label: string, highlight: string) => \`
  <nte-table class="style-default \${style}" height="15rem" pinned-columns="1" scroll-label="\${label}">
    <table>
      <thead><tr>
        <th class="border-free" scope="col" data-width="5rem" data-column-id="id">ID</th>
        <th scope="col" data-width="13rem" data-column-id="name">Name <span class="indicator" aria-label="aufsteigend">▲</span></th>
        <th class="\${highlight}" scope="col" data-width="11rem" data-column-id="status">Status <span class="indicator">3</span></th>
        <th scope="col" data-width="12rem" data-column-id="team">Team</th>
      </tr></thead>
      <tbody>
        <tr><th scope="row">A-101</th><td>Ada Lovelace</td><td>Aktiv</td><td>Platform</td></tr>
        <tr><th scope="row">A-102</th><td>Grace Hopper</td><td>Review</td><td>Compiler</td></tr>
        <tr><th scope="row">A-103</th><td>Margaret Hamilton</td><td>Aktiv</td><td>Runtime</td></tr>
        <tr><th scope="row">A-104</th><td>Radia Perlman</td><td>Planung</td><td>Network</td></tr>
      </tbody>
      <tfoot><tr><th scope="row">4</th><td>Personen</td><td>3 Zustände</td><td>4 Teams</td></tr></tfoot>
    </table>
  </nte-table>\`;

export default defineDemo({
  title: 'Header-Styles und Zellzustände',
  description: 'Default-, Strong- und Minimal-Header mit Indicator, Highlight und border-free ID-Spalte',
  render(root) {
    root.innerHTML = \`
      <main class="nte-table-demo">
        <h1>Header-Variationen</h1>
        <p>Eine Klasse am TH überträgt Highlight, Selected oder Border-Free automatisch auf die vollständige Spalte.</p>
        <h2>Default</h2>\${table('', 'Default Header', 'highlight-primary')}
        <h2>Strong</h2>\${table('with-header-strong', 'Strong Header', 'highlight-warning')}
        <h2>Minimal</h2>\${table('with-header-minimal', 'Minimal Header', 'selected')}
      </main>\`;
  },
});
`;
export { t as default };
