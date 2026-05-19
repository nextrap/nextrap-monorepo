import { defineDemo } from '@trunkjs/demo-viewer';
import demoHtml from './04-form-data.html?raw';
import { renderDocumentDemo, setupFormDataAccessorDemo } from './main';

export default defineDemo({
  title: 'FormDataAccessor',
  description: 'Werte direkt als Objekt lesen, anzeigen und zurückschreiben',
  render(root) {
    renderDocumentDemo(root, demoHtml, setupFormDataAccessorDemo);
  },
});
