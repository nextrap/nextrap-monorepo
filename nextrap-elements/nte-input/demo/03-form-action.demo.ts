import '@nextrap/nte-app-interaction';
import { sleep } from '@trunkjs/browser-utils';
import { defineDemo } from '@trunkjs/demo-viewer';
import { registerFormPreset } from '@trunkjs/form';
import '../index';
import demoHtml from './03-form-action.html?raw';
import style from './03-form-action.scss?inline';

export default defineDemo({
  title: 'TJForm Submit',
  description: 'Komplettes nte-input Formular mit TJForm und nte-app-interaction.',
  css: ['default', style],
  render(root) {
    registerFormPreset('nte-input-form-demo', {
      async onSubmit({ value }) {
        window.dispatchEvent(
          new CustomEvent('nextrap:loading', {
            detail: { message: 'Die Nachricht wird sicher verarbeitet …' },
          }),
        );

        await sleep(2000);

        window.dispatchEvent(
          new CustomEvent('nextrap:success', {
            detail: {
              message: 'Gesicherte Übertragung erfolgreich.',
            },
          }),
        );

        return value;
      },
    });

    root.innerHTML = demoHtml;
  },
});
