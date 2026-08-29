import { defineDemo } from '@trunkjs/demo-viewer';

import demoHtml from './05-variations.html?raw';
import { renderDocumentDemo } from './main';

export default defineDemo({
  title: 'Variationen',
  description: 'Größen, Varianten, verlinkte und nicht verlinkte Eltern sowie responsive Ausrichtung',
  render(root) {
    renderDocumentDemo(root, demoHtml);
  },
});
