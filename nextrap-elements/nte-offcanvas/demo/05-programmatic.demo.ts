import '@nextrap/style-base/default';
import '@nextrap/style-typography/default';
import { defineDemo } from '@trunkjs/demo-viewer';
import { html } from 'lit';

import { NteOffcanvas } from '../index';
import style from './main.scss?inline';

export default defineDemo({
  title: 'Programmatic Content',
  description: 'Offcanvas-Instanzen mit TemplateResult oder HTMLElement als Constructor-Content',
  navPath: ['NTE Offcanvas'],
  order: 50,
  tags: ['public'],
  css: ['default', style],
  html: '<div class="demo-programmatic-host"><p>Die Offcanvas-Instanzen werden erst über die Action Bar erzeugt.</p></div>',
  actionBar: {
    items: [
      {
        id: 'template',
        type: 'button',
        label: 'TemplateResult öffnen',
        onClick(_, env) {
          const offcanvas = new NteOffcanvas({
            content: html`
              <div class="demo-offcanvas-body">
                <h3>TemplateResult</h3>
                <p>Dieser Inhalt wurde direkt im Constructor übergeben.</p>
              </div>
            `,
          });
          offcanvas.classList.add('demo-right');
          offcanvas.setAttribute('aria-label', 'Programmatic template offcanvas');
          env.query('.demo-programmatic-host').append(offcanvas);
          void offcanvas.open();
        },
      },
      {
        id: 'element',
        type: 'button',
        label: 'HTMLElement öffnen',
        onClick(_, env) {
          const content = document.createElement('section');
          content.className = 'demo-offcanvas-body';
          content.innerHTML = '<h3>HTMLElement</h3><p>Die bestehende Elementinstanz wird als Content verwendet.</p>';

          const offcanvas = new NteOffcanvas({ content });
          offcanvas.classList.add('demo-left');
          offcanvas.setAttribute('aria-label', 'Programmatic element offcanvas');
          env.query('.demo-programmatic-host').append(offcanvas);
          void offcanvas.open();
        },
      },
    ],
  },
});
