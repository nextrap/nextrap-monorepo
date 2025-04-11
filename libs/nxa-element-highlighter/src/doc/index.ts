import { registerComponent } from '@nextrap/doc-visualizer';

registerComponent({
  package: 'element-highlighter',
  description: 'Element Highlighter',
  title: 'NxaElementHighlighter',
  examples: [
    {
      title: 'Highlight a static element',
      description: `
<p>This test shows a grey div, which is the target for highlighting.</p>
<p>The highlighter is initially hidden; use the <code>Show</code> and <code>Hide</code> buttons/methods or the <code>initiallyShown</code> attribute.</p>
<p>Properties like border width and color can be changed via attributes.</p>
<p>Use the browser dev tools to resize/style the target element and see how the highlighter adjusts.</p>
`,
      lang: 'html',
      // language=html
      code: `
<div
    id="element-highlighter-target-element"
    style="background: grey; width: 50%; height: 100px"
></div>
<nxa-element-highlighter
    id="element-highlighter-1"
    selector="#element-highlighter-target-element"
></nxa-element-highlighter>

<fieldset style="margin-top: 20px">
    <legend>Demo Controls</legend>

    <button onclick="document.getElementById('element-highlighter-1').show()">Show</button>
    <button onclick="document.getElementById('element-highlighter-1').hide()">Hide</button>

    <label for="el-highlight-demo-1-border-with-ctrl">Border Width</label>
    <select id="el-highlight-demo-1-border-with-ctrl" onchange="document.getElementById('element-highlighter-1').borderWidth = this.value">
        <option value="1">1</option>
        <option value="2" selected>2</option>
        <option value="3">3</option>
    </select>

    <label for="el-highlight-demo-1-border-color-ctrl">Border Color</label>
    <select id="el-highlight-demo-1-border-color-ctrl" onchange="document.getElementById('element-highlighter-1').borderColor = this.value">
        <option value="red" selected>red</option>
        <option value="green">green</option>
        <option value="blue">blue</option>
    </select>
</fieldset>
            `,
    },
    {
      title: 'Highlighter with buttons',
      description: `
<p>This example shows a highlighter with buttons. Buttons must be positioned with the <code>slot</code> attribute, otherwise they will not be rendered. The possible slot positions are:</p>
<ul>
    <li><code>top-left</code></li>
    <li><code>top-right</code></li>
    <li><code>bottom-left</code></li>
    <li><code>bottom-right</code></li>
</ul>
            `,
      lang: 'html',
      code: `
<div
    id="element-highlighter-target-element-2"
    style="background: lightseagreen; width: 500px; height: 150px"
></div>
<nxa-element-highlighter
    id="element-highlighter-2"
    selector="#element-highlighter-target-element-2"
    initiallyShown
>
    <button slot="top-left" onclick="alert('Top Left Action')">Top Left Action</button>
    <button slot="top-right" onclick="alert('Top Right Action')">Top Right Action</button>
    <button slot="bottom-left" onclick="alert('Bottom Left Action')">Bottom Left Action</button>
    <button slot="bottom-right" onclick="alert('Bottom Right Action')">Bottom Right Action</button>

    <button onclick="alert('Invalid Action')">Invalid Action</button>
</nxa-element-highlighter>

<fieldset style="margin-top: 20px">
    <legend>Demo Controls</legend>

    <button onclick="document.getElementById('element-highlighter-2').show()">Show</button>
    <button onclick="document.getElementById('element-highlighter-2').hide()">Hide</button>
</fieldset>
            `,
    },
    {
      title: 'Highlighter that is shown on hover',
      description: `
<p>This example shows a highlighter that is shown when the user hovers it. This is controlled by the <code>showOnHover</code> attribute.</p>
            `,
      lang: 'html',
      code: `
<div
    id="element-highlighter-target-element-3"
    style="background: lightseagreen; width: 50%; height: 150px"
></div>
<nxa-element-highlighter
    id="element-highlighter-3"
    selector="#element-highlighter-target-element-3"
    showOnHover
>
    <button slot="top-left" onclick="alert('Top Left Action')">Action revealed by hover!</button>
</nxa-element-highlighter>
            `,
    },
  ],
});
