const o = `import { defineDemo } from '@trunkjs/demo-viewer';

import demoHtml from './02-horizontal.html?raw';
import { renderDocumentDemo } from './main';

export default defineDemo({
  title: 'Horizontal',
  description: 'Hauptnavigation mit Icons und mehrstufigen Popover-Untermenüs',
  render(root) {
    renderDocumentDemo(root, demoHtml);
  },
});
`;
export { o as default };
