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
      ...(['left', 'right', 'top', 'bottom', 'fullscreen'] as const).map((placement) => ({
        id: placement,
        type: 'button' as const,
        label: placement[0].toUpperCase() + placement.slice(1),
        onClick(_: unknown, env: Parameters<NonNullable<NonNullable<ReturnType<typeof defineDemo>['actionBar']>['items'][number]['onClick']>>[1]) {
          void env.query<NteOffcanvas>(`#placement-${placement}`).open();
        },
      })),
    ],
  },
});
