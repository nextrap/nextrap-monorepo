import { defineDemo } from '@trunkjs/demo-viewer';
import demoHtml from './06-select-radio-vertical.html?raw';
import { renderDocumentDemo } from './main';

export default defineDemo({
  title: 'Select-Radio Vertical',
  description: 'Layout-Mixin für nebeneinander angeordnete Optionen mit Umbruch',
  render(root) {
    renderDocumentDemo(root, demoHtml);
  },
});
