import { NxaElementHighlighter } from '@nextrap/element-highlighter';
import { html, LitElement, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import globalStyles from '../styles.css?inline';

@customElement('nextrap-doc-visualizer')
export class AppElement extends LitElement {
  static styles = [unsafeCSS(globalStyles)];

  protected render(): unknown {
    // Example of using another nx-package here
    console.log(NxaElementHighlighter);

    return html` <h1 class="text-xl">nxa-doc-visualizer</h1> `;
  }
}
