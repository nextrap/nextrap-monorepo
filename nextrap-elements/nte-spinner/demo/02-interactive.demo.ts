import { defineDemo } from '@trunkjs/demo-viewer';
import './main';

const states = ['loading', 'progress', 'checked', 'cross', 'info', 'warning'] as const;
let spinner: HTMLElement | null = null;
let state = 'loading';
let percentage = '30';

function updateSpinner() {
  if (!spinner) return;

  spinner.classList.remove('progress', 'checked', 'cross', 'info', 'warning');
  if (state !== 'loading') spinner.classList.add(state);

  spinner.style.setProperty('--percentage', percentage);
  spinner.style.setProperty('--percentage-txt', `'${percentage}%'`);
}

export default defineDemo({
  title: 'Interactive states',
  description: 'Switch states and update determinate progress at runtime',
  controls: {
    items: [
      {
        id: 'state',
        type: 'select',
        label: 'State',
        options: [...states],
        value: () => state,
        onChange(event) {
          state = String(event.value);
          updateSpinner();
        },
      },
      {
        id: 'progress',
        type: 'input',
        label: 'Progress',
        info: 'Used when the progress state is selected.',
        value: () => percentage,
        attributes: { type: 'range', min: '0', max: '100' },
        onInput(event) {
          percentage = String(event.value);
          updateSpinner();
        },
      },
    ],
  },
  render(root) {
    root.innerHTML = `
      <section class="nte-spinner-interactive-demo">
        <nte-spinner id="interactive-spinner"></nte-spinner>
      </section>
    `;
    spinner = root.querySelector('#interactive-spinner');
    updateSpinner();
  },
});
