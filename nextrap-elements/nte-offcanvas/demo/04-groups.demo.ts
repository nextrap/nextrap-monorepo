import '@nextrap/style-base/default';
import '@nextrap/style-typography/default';
import { defineDemo } from '@trunkjs/demo-viewer';

import '../index';
import type { NteOffcanvas } from '../index';
import style from './main.scss?inline';

export default defineDemo({
  title: 'Open Groups',
  description:
    'Open Groups koordinieren beliebige Flächen; modale Flächen desselben Placements werden automatisch sequenziert',
  navPath: ['NTE Offcanvas'],
  order: 40,
  tags: ['public'],
  css: ['default', style],
  html: `
    <nte-offcanvas id="same-right-a" class="demo-right" aria-label="Right A">
      <div class="demo-offcanvas-body"><h3>Right A</h3><p>Modales Right-Placement ohne Open Group.</p></div>
    </nte-offcanvas>
    <nte-offcanvas id="same-right-b" class="demo-right demo-wide" aria-label="Right B">
      <div class="demo-offcanvas-body"><h3>Right B</h3><p>Wartet, bis Right A vollständig geschlossen ist, bevor es öffnet.</p></div>
    </nte-offcanvas>

    <nte-offcanvas id="group-left" class="demo-left" open-group="main-navigation" aria-label="Grouped left">
      <div class="demo-offcanvas-body"><h3>Desktop Navigation</h3><p>Mitglied von main-navigation.</p></div>
    </nte-offcanvas>
    <nte-offcanvas id="group-fullscreen" class="demo-fullscreen" open-group="main-navigation" aria-label="Grouped fullscreen">
      <div class="demo-offcanvas-body"><h2>Mobile Navigation</h2><p>Dasselbe open-group trotz anderem Placement.</p></div>
    </nte-offcanvas>
  `,
  controls: {
    items: [
      {
        id: 'right-a',
        type: 'button',
        label: 'Right A',
        onClick: (_, env) => void env.query<NteOffcanvas>('#same-right-a').open(),
      },
      {
        id: 'right-b',
        type: 'button',
        label: 'Right B',
        onClick: (_, env) => void env.query<NteOffcanvas>('#same-right-b').open(),
      },
      {
        id: 'group-left',
        type: 'button',
        label: 'Group Left',
        onClick: (_, env) => void env.query<NteOffcanvas>('#group-left').open(),
      },
      {
        id: 'group-fullscreen',
        type: 'button',
        label: 'Group Fullscreen',
        onClick: (_, env) => void env.query<NteOffcanvas>('#group-fullscreen').open(),
      },
    ],
  },
});
