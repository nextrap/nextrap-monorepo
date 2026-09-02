import { defineDemo } from '@trunkjs/demo-viewer';

import demoHtml from './04-responsive-order.html?raw';
import { renderDocumentDemo } from './main';

export default defineDemo({
  title: 'Responsive & Order',
  description: 'Mixin-gesteuerter Richtungswechsel und optionale Flex-Sortierung',
  render(root) {
    renderDocumentDemo(root, demoHtml);
  },
});
