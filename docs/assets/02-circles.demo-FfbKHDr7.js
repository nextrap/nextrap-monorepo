const e = `import '@nextrap/style-base/default';
import '@nextrap/style-typography/default';
import { defineDemo } from '@trunkjs/demo-viewer';

import '../src';
import style from './main.css?inline';

export default defineDemo({
  title: 'Circular progress',
  description: 'Circular indicators with slotted labels and custom ranges.',
  order: 20,
  css: ['default', style],
  html: \`
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
    </main>\`,
});
`;
export { e as default };
