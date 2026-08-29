/* empty css                */ /* empty css                */ import './_virtual_tdemo-client-Pi1VR-d9.js';
import { s as e } from './main-BhzSJOqw.js';
import './property-BLTBoP6p.js';
import './state-CNjn0hWp.js';
import { d as s } from './types-4rIte7rE.js';
const c = s({
  title: 'Circular progress',
  description: 'Circular indicators with slotted labels and custom ranges.',
  order: 20,
  css: ['default', e],
  html: `
    <main class="nte-progress-demo">
      <h1>Circular progress</h1>
      <div class="nte-progress-demo__circles">
        <nte-progress type="circle" value="60">
          <strong class="nte-progress-demo__circle-value">60%</strong>
          <span class="nte-progress-demo__circle-label">uploaded</span>
        </nte-progress>
        <nte-progress type="circle" value="2" min="0" max="4" steps="4">
          <strong class="nte-progress-demo__circle-value">2 / 4</strong>
          <span class="nte-progress-demo__circle-label">steps</span>
        </nte-progress>
      </div>
    </main>`,
});
export { c as default };
