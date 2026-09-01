import '@nextrap/style-base/default';
import '@nextrap/style-typography/default';
import { defineDemo } from '@trunkjs/demo-viewer';

import '../index';
import type { NteOffcanvas } from '../index';
import style from './main.scss?inline';

export default defineDemo({
  title: 'Push + Pane',
  description: 'Ein Pane reagiert gleichzeitig auf Push-Surfaces links und rechts',
  navPath: ['NTE Offcanvas'],
  order: 30,
  tags: ['public'],
  css: ['default', style],
  html: `
    <nte-offcanvas id="push-left-small" class="demo-push-left-a" aria-label="Small left push">
      <div class="demo-offcanvas-body"><h3>Navigation A</h3><p>17.5rem breit.</p></div>
    </nte-offcanvas>
    <nte-offcanvas id="push-left-large" class="demo-push-left-b" aria-label="Large left push">
      <div class="demo-offcanvas-body"><h3>Navigation B</h3><p>23.75rem breit.</p></div>
    </nte-offcanvas>
    <nte-offcanvas id="push-right" class="demo-push-right" aria-label="Right push">
      <div class="demo-offcanvas-body"><h3>Inspector</h3><p>16rem breit.</p></div>
    </nte-offcanvas>

    <nte-offcanvas-pane class="demo-pane">
      <div class="demo-pane-content">
        <h3>Offcanvas-aware Content</h3>
        <p>Der Pane reserviert den gemeldeten Platz auf der jeweiligen Seite.</p>
        <p>Beim Wechsel von Navigation A zu B wird der linke Inset direkt auf die neue Breite animiert.</p>
      </div>
    </nte-offcanvas-pane>
  `,
  actionBar: {
    items: [
      {
        id: 'left-small',
        type: 'button',
        label: 'Left A öffnen',
        onClick(_, env) {
          void env.query<NteOffcanvas>('#push-left-small').open();
        },
      },
      {
        id: 'left-large',
        type: 'button',
        label: 'Left B öffnen',
        onClick(_, env) {
          void env.query<NteOffcanvas>('#push-left-large').open();
        },
      },
      {
        id: 'right',
        type: 'button',
        label: 'Right öffnen',
        onClick(_, env) {
          void env.query<NteOffcanvas>('#push-right').open();
        },
      },
      {
        id: 'close-all',
        type: 'button',
        label: 'Alle schließen',
        onClick(_, env) {
          for (const offcanvas of env.queryAll<NteOffcanvas>('nte-offcanvas')) {
            void offcanvas.close();
          }
        },
      },
    ],
  },
});
