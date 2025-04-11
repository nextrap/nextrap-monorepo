import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

declare global {
  interface HTMLElementTagNameMap {
    'nxa-element-highlighter': NxaElementHighlighter;
  }
}

@customElement('nxa-element-highlighter')
export class NxaElementHighlighter extends LitElement {
  private error?: string;
  private targetElement?: HTMLElement;

  private readonly resizeObserver = new ResizeObserver(() =>
    this.requestUpdate()
  );
  private readonly mutationObserver = new MutationObserver(() =>
    this.requestUpdate()
  );

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

  connectedCallback() {
    super.connectedCallback();

    this.targetElement = document.querySelector(this.selector);
    if (!this.targetElement) {
      this.error = `selector "${this.selector}" not found`;
    }

    this.validateInputs();

    window.addEventListener('resize', () => this.requestUpdate());
    window.addEventListener('scroll', () => this.requestUpdate());

    this.resizeObserver.observe(this.targetElement);
    this.mutationObserver.observe(this.targetElement, {
      attributeFilter: ['style'],
    });

    if (this.initiallyShown) {
      this.show();
    }

    if (this.showOnHover) {
      this.targetElement.addEventListener('mouseenter', () => this.show());
      this.addEventListener('mouseleave', () => this.hide());
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    window.removeEventListener('resize', () => this.requestUpdate());
    window.removeEventListener('scroll', () => this.requestUpdate());

    this.resizeObserver.disconnect();
    this.mutationObserver.disconnect();

    if (this.showOnHover) {
      this.targetElement.removeEventListener('mouseenter', () => this.show());
      this.removeEventListener('mouseleave', () => this.hide());
    }
  }

  render() {
    if (this.isHidden) {
      return html``;
    }
    if (this.error) {
      return html`<code style="color: red"
        >${this.localName}: ${this.error}</code
      >`;
    }

    const div = document.createElement('div');
    const rect = this.targetElement.getBoundingClientRect();
    const borderWidth = Math.max(this.borderWidth, 0);

    div.style.position = 'fixed';
    div.style.zIndex = this.zIndex;
    div.style.top = `${rect.top - borderWidth}px`;
    div.style.left = `${rect.left - borderWidth}px`;
    div.style.width = `${rect.width}px`;
    div.style.height = `${rect.height}px`;
    div.style.border = `${borderWidth}px solid ${this.borderColor}`;

    const topLeftArea = this.createPositionArea('top-left');
    div.appendChild(topLeftArea);

    const topRightArea = this.createPositionArea('top-right');
    div.appendChild(topRightArea);

    const bottomLeftArea = this.createPositionArea('bottom-left');
    div.appendChild(bottomLeftArea);

    const bottomRightArea = this.createPositionArea('bottom-right');
    div.appendChild(bottomRightArea);

    return html`${div}`;
  }

  private createPositionArea(
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  ): HTMLDivElement {
    const area = document.createElement('div');
    area.style.position = 'absolute';
    area.style.top = position.startsWith('top') ? '0' : 'auto';
    area.style.left = position.endsWith('left') ? '0' : 'auto';
    area.style.right = position.endsWith('right') ? '0' : 'auto';
    area.style.bottom = position.startsWith('bottom') ? '0' : 'auto';

    const slot = document.createElement('slot');
    slot.name = position;
    area.appendChild(slot);

    return area;
  }

  private validateInputs() {
    if (this.initiallyShown && this.showOnHover) {
      throw new Error('showOnHover and initiallyShown cannot be used together');
    }
  }
}
