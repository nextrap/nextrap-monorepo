import '@nextrap/nte-app-interaction';
import { defineDemo } from '@trunkjs/demo-viewer';
import { registerFormPreset } from '@trunkjs/form';
import demoHtml from './03-form-action.html?raw';
import { renderDocumentDemo } from './main';

const wait = (milliseconds: number) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));

registerFormPreset('nte-input-form-demo', {
  async onSubmit({ form, value }) {
    window.dispatchEvent(
      new CustomEvent('nextrap:loading', {
        detail: {
          message: 'Bitte warten …',
        },
      }),
    );

    await wait(1500);

    const output = form.closest('section')?.querySelector('#tjform-json');
    if (output instanceof HTMLTextAreaElement) {
      output.value = JSON.stringify(value, null, 2);
    }

    window.dispatchEvent(
      new CustomEvent('nextrap:success', {
        detail: {
          message: 'Formular verarbeitet.',
          autoClose: true,
        },
      }),
    );

    return value;
  },
});

export default defineDemo({
  title: 'TJForm Submit',
  description: 'Komplettes nte-input Formular mit TJForm und nte-app-interaction.',
  render(root) {
    renderDocumentDemo(root, demoHtml);
  },
});
