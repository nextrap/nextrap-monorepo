import { Feedback } from '@nextrap/nte-feedback';
import { sleep } from '@trunkjs/browser-utils';
import { defineDemo } from '@trunkjs/demo-viewer';
import { registerFormPreset } from '@trunkjs/form';
import '@trunkjs/content-pane';
import '@nextrap/ntl-2col';
import '../index';
import demoHtml from './03-form-action.html?raw';
import style from './03-form-action.scss?inline';

export default defineDemo({
  title: 'TJForm Submit',
  description: 'Komplettes nte-input Formular mit TJForm und nte-feedback.',
  css: ['default', style],
  wrapper_html: '<tj-content-pane pre-parser="text-block">{{content}}</tj-content-pane>',
  render(root) {
    registerFormPreset('nte-input-form-demo', {
      async onSubmit({ value }) {
        await Feedback.loading({ message: 'Die Nachricht wird sicher verarbeitet …' });

        await sleep(2000);

        await Feedback.success({ message: 'Gesicherte Übertragung erfolgreich.' });

        return value;
      },
    });

    root.innerHTML = demoHtml;
  },
});
