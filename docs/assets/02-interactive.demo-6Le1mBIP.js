import './_virtual_tdemo-client-BQ75DL_E.js';
import './index-l0sNRNKZ.js';
import './main-Bir2UTEH.js';
import { d as a } from './types-4rIte7rE.js';
const o = ['loading', 'progress', 'checked', 'cross', 'info', 'warning'];
let t = null,
  r = 'loading',
  s = '30';
function i() {
  t &&
    (t.classList.remove('progress', 'checked', 'cross', 'info', 'warning'),
    r !== 'loading' && t.classList.add(r),
    t.style.setProperty('--percentage', s),
    t.style.setProperty('--percentage-txt', `'${s}%'`));
}
const g = a({
  title: 'Interactive states',
  description: 'Switch states and update determinate progress at runtime',
  controls: [
    {
      label: 'State',
      element: 'select',
      selectOptions: [...o],
      init(e) {
        e.value = r;
      },
      onchange(e) {
        ((r = e.currentTarget.value), i());
      },
    },
    {
      label: 'Progress',
      info: 'Used when the progress state is selected.',
      element: 'input',
      init(e) {
        const n = e;
        ((n.type = 'range'), (n.min = '0'), (n.max = '100'), (n.value = s));
      },
      oninput(e) {
        ((s = e.currentTarget.value), i());
      },
    },
  ],
  render(e) {
    ((e.innerHTML = `
      <section class="nte-spinner-interactive-demo">
        <nte-spinner id="interactive-spinner"></nte-spinner>
      </section>
    `),
      (t = e.querySelector('#interactive-spinner')),
      i());
  },
});
export { g as default };
