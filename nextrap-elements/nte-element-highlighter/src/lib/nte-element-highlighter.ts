import { LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

declare global {
  interface HTMLElementTagNameMap {
    'nte-element-highlighter': NteElementHighlighter;
  }
}

@customElement('nte-element-highlighter')
export class NteElementHighlighter extends LitElement {
  private error?: string;
  private targetElement?: HTMLElement;

  private readonly resizeObserver = new ResizeObserver(() => this.requestUpdate());
  private readonly mutationObserver = new MutationObserver(() => this.requestUpdate());

  @state()
  private isHidden = true;

  @property({ type: Boolean })
  initiallyShown = false;

  @property({ type: Boolean })
  showOnHover = false;

  @property({ type: String })
  selector = '';

  @property({ type: String })
  zIndex = '10';

  @property({ type: Number })
  borderWidth = 2;

  @property({ type: String })
  borderColor = 'red';

  show() {
    this.isHidden = false;
  }

  hide() {
    this.isHidden = true;
  }
}
