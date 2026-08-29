import '@nextrap/style-base/default';
import '@nextrap/style-typography/default';
import { defineDemo } from '@trunkjs/demo-viewer';

import '../index';
import style from './main.scss?inline';

export default defineDemo({
  title: 'Scroll to top',
  description: 'A fixed, accessible button that appears after the configured scroll threshold.',
  order: 10,
  css: ['default', style],
  html: `
    <main class="nte-scroll-to-top-demo">
      <h1>Scroll to top</h1>
      <p class="nte-scroll-to-top-demo__hint">
        Scroll down until the button appears in the lower corner. Activate it with a pointer or the keyboard to return
        to the top of the page.
      </p>
      <h2>Configuration</h2>
      <p>
        This example uses <code>threshold="200"</code>. The default is 300 pixels. Set
        <code>scroll-behavior="auto"</code> when smooth scrolling is not desired.
      </p>
      <p>The button label can be localized with <code>aria-label</code>.</p>
      <nte-scroll-to-top threshold="200" aria-label="Back to top"></nte-scroll-to-top>
    </main>`,
});
