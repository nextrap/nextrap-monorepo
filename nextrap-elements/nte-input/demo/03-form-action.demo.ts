import { defineDemo } from '@trunkjs/demo-viewer';
import demoHtml from './03-form-action.html?raw';
import { renderDocumentDemo, setupFormDataDemo } from './main';

export default defineDemo({
  title: 'FormData Submit',
  description: 'Native Formularauswertung über new FormData(form)',
  render(root) {
    renderDocumentDemo(root, demoHtml, setupFormDataDemo);
  },
});
