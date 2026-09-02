import { defineDemo } from '@trunkjs/demo-viewer';

import demoHtml from './03-vertical.html?raw';
import { renderDocumentDemo } from './main';

export default defineDemo({
  title: 'Vertikal',
  description: 'Vertikale Pfadnavigation mit nach unten auf- und zuslidenden Inline-Unterpunkten',
  render(root) {
    renderDocumentDemo(root, demoHtml);
  },
});
