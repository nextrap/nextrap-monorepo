import { defineDemo } from '@trunkjs/demo-viewer';
import demoHtml from './05-validation.html?raw';
import { renderDocumentDemo, setupValidationDemo } from './main';

export default defineDemo({
  title: 'Validation',
  description: 'Pflichtfelder, Pattern und native Browser-Validierung',
  render(root) {
    renderDocumentDemo(root, demoHtml, setupValidationDemo);
  },
});
