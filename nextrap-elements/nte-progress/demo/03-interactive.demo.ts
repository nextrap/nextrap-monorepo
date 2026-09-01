import '@nextrap/style-base/default';
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
  description: 'Change properties from the controls and inspect the emitted progress events.',
  order: 30,
  css: ['default', style],
  controls: {
    items: [
      {
        id: 'value',
        type: 'input',
        label: 'Progress value',
        info: 'Sets the value property from 0 to 100.',
        value: 25,
        attributes: { type: 'range', min: '0', max: '100' },
        onInput(event) {
          setValue(Number(event.value));
        },
      },
      {
        id: 'stripes',
        type: 'button',
        label: 'Toggle stripes',
        onClick() {
          if (progress) progress.striped = !progress.striped;
        },
      },
      {
        id: 'animation',
        type: 'button',
        label: 'Toggle animation',
        onClick() {
          if (progress) progress.animated = !progress.animated;
        },
      },
      {
        id: 'complete',
        type: 'button',
        label: 'Complete',
        onClick() {
          if (progress) setValue(progress.max);
        },
      },
      {
        id: 'clear',
        type: 'button',
        label: 'Clear events',
        onClick() {
          if (output) output.value = '';
        },
      },
    ],
  },
  render(root) {
    root.innerHTML = `
      <main class="nte-progress-demo">
        <h1>Interactive progress</h1>
        <nte-progress id="interactive-progress" value="25"></nte-progress>
        <output class="nte-progress-demo__events" aria-live="polite">Use the controls below the demo.</output>
      </main>`;

    progress = root.querySelector<nteProgressElement>('#interactive-progress');
    output = root.querySelector<HTMLOutputElement>('output');

    for (const eventName of ['progress-changed', 'step-changed', 'completed']) {
      progress?.addEventListener(eventName, (event) => {
        const detail = JSON.stringify((event as CustomEvent).detail);
        if (output) output.value += `${eventName}: ${detail}\n`;
      });
    }
  },
});
