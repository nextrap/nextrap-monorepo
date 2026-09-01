import '@nextrap/nte-demo-viewer';
import '@nextrap/style-base';
import '@nextrap/style-button';
import '@nextrap/style-typography';
import '@nextrap/style-utils';
import { html } from 'lit';
import { NteOffcanvas } from '../index.ts';
import './main.scss';

function getOffcanvas(selector?: string): NteOffcanvas | null {
  if (!selector) {
    return null;
  }
  const element = document.querySelector(selector);
  return element instanceof NteOffcanvas ? element : null;
}

document.addEventListener('click', (event) => {
  const target = event.target instanceof HTMLElement ? event.target : null;
  if (target === null) {
    return;
  }

  const openTrigger = target.closest<HTMLElement>('[data-demo-open]');
  if (openTrigger !== null) {
    void getOffcanvas(openTrigger.dataset.demoOpen)?.open();
    return;
  }

  const toggleTrigger = target.closest<HTMLElement>('[data-demo-toggle]');
  if (toggleTrigger !== null) {
    void getOffcanvas(toggleTrigger.dataset.demoToggle)?.toggle();
  }
});

document.querySelector('#demo-programmatic-template')?.addEventListener('click', () => {
  const offcanvas = new NteOffcanvas({
    content: html`
      <div class="demo-offcanvas-body">
        <h3>Programmatic Template</h3>
        <p>Dieser Inhalt wurde als Lit TemplateResult an den Constructor übergeben.</p>
      </div>
    `,
  });
  offcanvas.setAttribute('aria-label', 'Programmatic Template');
  offcanvas.classList.add('demo-right');
  void offcanvas.open();
});

document.querySelector('#demo-programmatic-element')?.addEventListener('click', () => {
  const content = document.createElement('div');
  content.className = 'demo-offcanvas-body';
  content.innerHTML = '<h3>HTMLElement</h3><p>Dieses bestehende HTMLElement wurde direkt als Content übergeben.</p>';

  const offcanvas = new NteOffcanvas({ content });
  offcanvas.setAttribute('aria-label', 'Programmatic HTMLElement');
  offcanvas.classList.add('demo-left');
  void offcanvas.open();
});
