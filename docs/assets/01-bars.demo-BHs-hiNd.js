/* empty css                */ /* empty css                */ import './_virtual_tdemo-client-Pi1VR-d9.js';
import { s } from './main-BhzSJOqw.js';
import './property-BLTBoP6p.js';
import './state-CNjn0hWp.js';
import { d as e } from './types-4rIte7rE.js';
const m = e({
  title: 'Progress bars',
  description: 'Determinate progress with the default range, a custom range, steps, and stripes.',
  order: 10,
  css: ['default', s],
  html: `
    <main class="nte-progress-demo">
      <h1>Progress bars</h1>
      <div class="nte-progress-demo__examples">
        <section class="nte-progress-demo__example">
          <h2>Default range</h2>
          <nte-progress value="50"></nte-progress>
          <p><code>value="50"</code> uses the default range from 0 to 100.</p>
        </section>
        <section class="nte-progress-demo__example">
          <h2>Custom range</h2>
          <nte-progress value="5" min="0" max="10"></nte-progress>
          <p>The displayed progress is normalized to the configured range.</p>
        </section>
        <section class="nte-progress-demo__example">
          <h2>Discrete steps</h2>
          <nte-progress value="40" steps="5"></nte-progress>
          <p>Values are rounded to the nearest of five intervals.</p>
        </section>
        <section class="nte-progress-demo__example">
          <h2>Striped and animated</h2>
          <nte-progress value="75" striped animated></nte-progress>
          <p>Animation only applies when <code>striped</code> is also set.</p>
        </section>
      </div>
    </main>`,
});
export { m as default };
