import style from './nte-spinner.scss?inline';

const template = `
<div id="spinner" part="spinner">
  <svg id="spinner-viewbox" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" part="viewbox">
    <circle id="spinner-circle" cx="50" cy="50" r="45" pathLength="100" part="circle"></circle>
  </svg>

  <svg id="spinner-check" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" part="check">
    <path d="M7 14.17L2.83 10l-1.41 1.41L7 17 19 5l-1.41-1.42L7 14.17z"></path>
  </svg>
  <svg id="spinner-cross" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" part="cross">
    <line x1="30" y1="30" x2="70" y2="70"></line>
    <line x1="70" y1="30" x2="30" y2="70"></line>
  </svg>
  <svg id="spinner-info" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" part="info">
    <text x="50" y="72" text-anchor="middle" font-size="64" font-weight="bold" font-family="sans-serif">?</text>
  </svg>
  <svg id="spinner-warning" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" part="warning">
    <text x="50" y="72" text-anchor="middle" font-size="64" font-weight="bold" font-family="sans-serif">!</text>
  </svg>
  <div id="spinner-text" part="text"></div>
</div>`;

export class NteSpinnerElement extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
    const styleElement = document.createElement('style');
    const rootElement = document.createElement('div');

    styleElement.textContent = style;
    rootElement.innerHTML = template;

    shadowRoot.append(styleElement, rootElement);
  }
}

if (!customElements.get('nte-spinner')) {
  customElements.define('nte-spinner', NteSpinnerElement);
}

declare global {
  interface HTMLElementTagNameMap {
    'nte-spinner': NteSpinnerElement;
  }
}
