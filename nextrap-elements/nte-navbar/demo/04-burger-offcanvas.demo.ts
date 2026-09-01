import { defineDemo } from '@trunkjs/demo-viewer';
import '@nextrap/nte-burger';
import '@nextrap/nte-offcanvas';

import logoUrl from './assets/nextrap-logo.svg?url';
import './main';

export default defineDemo({
  title: 'Burger + Offcanvas',
  description: 'Navbar mit NTE Burger als Trigger für ein externes Offcanvas',
  iframe: true,
  render(root) {
    root.innerHTML = `
      <section class="nte-navbar-demo">
        <nte-navbar position="sticky" class="with-shadow" style="--container-width: 72rem">
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
