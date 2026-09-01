import '@nextrap/style-base/default';
import '@nextrap/style-typography/default';
import { defineDemo } from '@trunkjs/demo-viewer';

import '../index';
import type { NteOffcanvas } from '../index';
import style from './main.scss?inline';

export default defineDemo({
  title: 'Basis',
  description: 'Header, Hauptinhalt, Footer und eingebauter Close-Button',
  navPath: ['NTE Offcanvas'],
  order: 10,
  tags: ['public'],
  css: ['default', style],
  html: `
    <nte-offcanvas id="basic-offcanvas" class="demo-right" aria-label="Basis Offcanvas">
      <div slot="header" class="demo-offcanvas-header">
        <strong>Offcanvas Header</strong>
      </div>

      <div class="demo-offcanvas-body">
        <p>Der Default-Slot enthält den Hauptinhalt.</p>
        <p>Der Close-Button wird automatisch von der Komponente bereitgestellt.</p>
      </div>

      <div slot="footer" class="demo-offcanvas-actions">
        <span>Footer-Inhalt</span>
        <button type="button" data-nt-dismiss="offcanvas">Schließen</button>
      </div>
    </nte-offcanvas>
  `,
  controls: {
    items: [
      {
        id: 'open',
        type: 'button',
        label: 'Offcanvas öffnen',
        onClick(_, env) {
          void env.query<NteOffcanvas>('#basic-offcanvas').open();
        },
      },
      {
        id: 'close',
        type: 'button',
        label: 'Offcanvas schließen',
        onClick(_, env) {
          void env.query<NteOffcanvas>('#basic-offcanvas').close();
        },
      },
    ],
  },
});
