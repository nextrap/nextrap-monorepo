const e = `import '@nextrap/style-base/default';
import '@nextrap/style-typography/default';
import { defineDemo } from '@trunkjs/demo-viewer';

import '../src';
import type { nteProgressElement } from '../src/lib/nte-progress';
import style from './main.css?inline';

let progress: nteProgressElement | null = null;
let output: HTMLOutputElement | null = null;

function setValue(value: number) {
  if (progress) progress.value = value;
}

export default defineDemo({
  title: 'Interactive API and events',
  description: 'Change properties from the action bar and inspect the emitted progress events.',
  order: 30,
  css: ['default', style],
  controls: [
    {
      label: 'Progress value',
      info: 'Sets the value property from 0 to 100.',
      element: 'input',
      init(element) {
        const input = element as HTMLInputElement;
        input.type = 'range';
        input.min = '0';
        input.max = '100';
        input.value = '25';
      },
      oninput(event) {
        setValue((event.target as HTMLInputElement).valueAsNumber);
      },
    },
    {
      label: 'Toggle stripes',
      element: 'button',
      onclick() {
        if (progress) progress.striped = !progress.striped;
      },
    },
    {
      label: 'Toggle animation',
      element: 'button',
      onclick() {
        if (progress) progress.animated = !progress.animated;
      },
    },
    {
      label: 'Complete',
      element: 'button',
      onclick() {
        if (progress) setValue(progress.max);
      },
    },
    {
      label: 'Clear events',
      element: 'button',
      onclick() {
        if (output) output.value = '';
      },
    },
  ],
  render(root) {
    root.innerHTML = \`
      <main class="nte-progress-demo">
        <h1>Interactive progress</h1>
        <nte-progress id="interactive-progress" value="25"></nte-progress>
        <output class="nte-progress-demo__events" aria-live="polite">Use the controls below the demo.</output>
      </main>\`;

    progress = root.querySelector<nteProgressElement>('#interactive-progress');
    output = root.querySelector<HTMLOutputElement>('output');

    for (const eventName of ['progress-changed', 'step-changed', 'completed']) {
      progress?.addEventListener(eventName, (event) => {
        const detail = JSON.stringify((event as CustomEvent).detail);
        if (output) output.value += \`\${eventName}: \${detail}\\n\`;
      });
    }
  },
});
`;
export { e as default };
