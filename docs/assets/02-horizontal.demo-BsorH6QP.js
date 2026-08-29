const n = `import { defineDemo } from '@trunkjs/demo-viewer';

import demoHtml from './02-horizontal.html?raw';
import { renderDocumentDemo } from './main';

export default defineDemo({
  title: 'Horizontal',
  description: 'Hauptnavigation mit Icons, nicht verlinkten Eltern und mehrstufigen Popup-Untermenüs',
  render(root) {
    renderDocumentDemo(root, demoHtml);
  },
});
`;
export { n as default };
