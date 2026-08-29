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
  controls: [
    {
      label: 'State',
      element: 'select',
      selectOptions: [...states],
      init(element) {
        (element as HTMLSelectElement).value = state;
      },
      onchange(event) {
        state = (event.currentTarget as HTMLSelectElement).value;
        updateSpinner();
      },
    },
    {
      label: 'Progress',
      info: 'Used when the progress state is selected.',
      element: 'input',
      init(element) {
        const input = element as HTMLInputElement;
        input.type = 'range';
        input.min = '0';
        input.max = '100';
        input.value = percentage;
      },
      oninput(event) {
        percentage = (event.currentTarget as HTMLInputElement).value;
        updateSpinner();
      },
    },
  ],
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
