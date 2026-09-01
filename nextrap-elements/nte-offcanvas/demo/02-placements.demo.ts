import '@nextrap/style-base/default';
import '@nextrap/style-typography/default';
import { defineDemo } from '@trunkjs/demo-viewer';

import '../index';
import type { NteOffcanvas } from '../index';
import style from './main.scss?inline';

export default defineDemo({
  title: 'Placements',
  description: 'Left, right, top, bottom und fullscreen über CSS Custom Properties',
  navPath: ['NTE Offcanvas'],
  order: 20,
  tags: ['public'],
  css: ['default', style],
  html: `
    <nte-offcanvas id="placement-left" class="demo-left" aria-label="Left Offcanvas">
      <div class="demo-offcanvas-body"><h3>Left</h3><p>Leichter Overshoot beim Öffnen und Schließen.</p></div>
    </nte-offcanvas>
    <nte-offcanvas id="placement-right" class="demo-right" aria-label="Right Offcanvas">
      <div class="demo-offcanvas-body"><h3>Right</h3><p>Standard-Placement.</p></div>
    </nte-offcanvas>
    <nte-offcanvas id="placement-top" class="demo-top" aria-label="Top Offcanvas">
      <div class="demo-offcanvas-body"><h3>Top</h3><p>Sliding-Sheet von oben.</p></div>
    </nte-offcanvas>
    <nte-offcanvas id="placement-bottom" class="demo-bottom" aria-label="Bottom Offcanvas">
      <div class="demo-offcanvas-body"><h3>Bottom</h3><p>Mobile-Sheet-Basis.</p></div>
    </nte-offcanvas>
    <nte-offcanvas id="placement-fullscreen" class="demo-fullscreen" aria-label="Fullscreen Offcanvas">
      <div class="demo-offcanvas-body"><h2>Fullscreen</h2><p>Füllt den Viewport und droppt standardmäßig von oben herein.</p></div>
    </nte-offcanvas>
  `,
  actionBar: {
    items: [
      { id: 'left', type: 'button', label: 'Left', onClick(_, env) { void env.query<NteOffcanvas>('#placement-left').open(); } },
      { id: 'right', type: 'button', label: 'Right', onClick(_, env) { void env.query<NteOffcanvas>('#placement-right').open(); } },
      { id: 'top', type: 'button', label: 'Top', onClick(_, env) { void env.query<NteOffcanvas>('#placement-top').open(); } },
      { id: 'bottom', type: 'button', label: 'Bottom', onClick(_, env) { void env.query<NteOffcanvas>('#placement-bottom').open(); } },
      { id: 'fullscreen', type: 'button', label: 'Fullscreen', onClick(_, env) { void env.query<NteOffcanvas>('#placement-fullscreen').open(); } },
    ],
  },
});
