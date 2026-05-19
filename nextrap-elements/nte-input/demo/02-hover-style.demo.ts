import { defineDemo } from '@trunkjs/demo-viewer';
import demoHtml from './02-hover-style.html?raw';
import { renderDocumentDemo } from './main';

export default defineDemo({
  title: 'Styles & Typen',
  description: 'Themes, Größen, Slots und die wichtigsten eingebauten Input-Typen',
  render(root) {
    renderDocumentDemo(root, demoHtml);
  },
});
