/* eslint-disable prefer-const, @typescript-eslint/no-unused-vars */
// TODO: Fix the linting errors and enable eslint!

import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import { Debouncer, ka_sleep } from '@kasimirjs/core';
import { style } from './style';

let debounceer = new Debouncer(100);
@customElement('nte-scroll-to-top')
export class NteScrollToTop extends LitElement {
  static styles = style;

  connectedCallback() {
    this.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    let active = false;

    window.addEventListener(
      'scroll',
      async () => {
        await debounceer.debounce();
        if (window.scrollY > 300 && active === false) {
          await ka_sleep(200);
          this.classList.add('show');
          active = true;
        }
        if (window.scrollY < 300 && active === true) {
          this.classList.remove('show');
          await ka_sleep(500);
          active = false;
        }
      },
      { passive: true }
    );
    super.connectedCallback();
  }

  render() {
    return html`<div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-arrow-up-circle"
        viewBox="0 0 16 16"
      >
        <path
          fill-rule="evenodd"
          d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707z"
        />
      </svg>
    </div>`;
  }
}
