import '@nextrap/nte-burger';
import '@nextrap/nte-offcanvas';
import { defineDemo } from '@trunkjs/demo-viewer';

import logoUrl from './assets/nextrap-logo.svg?url';
import './main';

export default defineDemo({
  title: 'Burger + Offcanvas',
  description: 'Navbar mit NTE Burger als Trigger für ein externes Offcanvas',
  iframe: true,
  controls: {
    items: [
      {
        id: 'navbar-shadow',
        type: 'checkbox',
        label: 'Schatten',
        value: true,
        onChange(event, env) {
          env.query<HTMLElement>('#burger-navbar').classList.toggle('with-shadow', Boolean(event.value));
        },
      },
      {
        id: 'navbar-position',
        type: 'select',
        label: 'Position',
        value: 'sticky',
        options: [
          { label: 'Static', value: 'static' },
          { label: 'Sticky', value: 'sticky' },
        ],
        onChange(event, env) {
          env.query<HTMLElement>('#burger-navbar').style.setProperty('--nte-navbar-position', String(event.value));
        },
      },
    ],
  },
  render(root) {
    root.innerHTML = `
      <section class="nte-navbar-demo">
        <nte-navbar id="burger-navbar" class="with-shadow" style="--container-width: 72rem; --nte-navbar-position: sticky">
          <nte-navbar-line style="--height: 4.5rem">
            <a slot="start" class="brand-logo" href="/" aria-label="Nextrap Startseite"><img src="${logoUrl}" alt="" /></a>
            <nte-burger slot="end" id="offcanvas-burger" aria-label="Navigation öffnen" aria-controls="navbar-offcanvas"></nte-burger>
          </nte-navbar-line>
        </nte-navbar>

        <nte-offcanvas id="navbar-offcanvas" aria-label="Mobile Navigation">
          <div slot="header"><strong>Navigation</strong></div>
          <nav class="demo-offcanvas-nav" aria-label="Hauptnavigation">
            <a href="/produkte">Produkte</a>
            <a href="/loesungen">Lösungen</a>
            <a href="/unternehmen">Unternehmen</a>
            <a href="/kontakt">Kontakt</a>
          </nav>
        </nte-offcanvas>
      </section>
    `;

    const burger = root.querySelector('nte-burger');
    const offcanvas = root.querySelector('nte-offcanvas');
    burger?.addEventListener('click', () => void offcanvas?.toggle());
    offcanvas?.addEventListener('nte-offcanvas:closed', () => {
      if (burger) burger.open = false;
    });
    offcanvas?.addEventListener('nte-offcanvas:opened', () => {
      if (burger) burger.open = true;
    });
  },
});
