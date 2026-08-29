/* empty css                */ /* empty css                */ import './_virtual_tdemo-client-BQ75DL_E.js';
import { s as a } from './main-FGSHP2L5.js';
import './property-pW3KQYk0.js';
import './state-BVZImsYv.js';
import { d as s } from './types-4rIte7rE.js';
let e = null,
  o = null;
function r(t) {
  e && (e.value = t);
}
const f = s({
  title: 'Interactive API and events',
  description: 'Change properties from the action bar and inspect the emitted progress events.',
  order: 30,
  css: ['default', a],
  controls: [
    {
      label: 'Progress value',
      info: 'Sets the value property from 0 to 100.',
      element: 'input',
      init(t) {
        const n = t;
        ((n.type = 'range'), (n.min = '0'), (n.max = '100'), (n.value = '25'));
      },
      oninput(t) {
        r(t.target.valueAsNumber);
      },
    },
    {
      label: 'Toggle stripes',
      element: 'button',
      onclick() {
        e && (e.striped = !e.striped);
      },
    },
    {
      label: 'Toggle animation',
      element: 'button',
      onclick() {
        e && (e.animated = !e.animated);
      },
    },
    {
      label: 'Complete',
      element: 'button',
      onclick() {
        e && r(e.max);
      },
    },
    {
      label: 'Clear events',
      element: 'button',
      onclick() {
        o && (o.value = '');
      },
    },
  ],
  render(t) {
    ((t.innerHTML = `
      <main class="nte-progress-demo">
        <h1>Interactive progress</h1>
        <nte-progress id="interactive-progress" value="25"></nte-progress>
        <output class="nte-progress-demo__events" aria-live="polite">Use the controls below the demo.</output>
      </main>`),
      (e = t.querySelector('#interactive-progress')),
      (o = t.querySelector('output')));
    for (const n of ['progress-changed', 'step-changed', 'completed'])
      e == null ||
        e.addEventListener(n, (i) => {
          const l = JSON.stringify(i.detail);
          o &&
            (o.value += `${n}: ${l}
`);
        });
  },
});
export { f as default };
