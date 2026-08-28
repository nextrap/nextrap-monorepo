const e = `import { defineDemo } from '@trunkjs/demo-viewer';

import demoHtml from './03-vertical.html?raw';
import { renderDocumentDemo } from './main';

export default defineDemo({
  title: 'Vertikal',
  description: 'Vertikale Unternavigation mit denselben Komponenten und einem anderen Layout-Mixin',
  render(root) {
    renderDocumentDemo(root, demoHtml);
  },
});
`;
export { e as default };
