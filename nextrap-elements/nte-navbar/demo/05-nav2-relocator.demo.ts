import { defineDemo } from '@trunkjs/demo-viewer';
import '@nextrap/nte-burger';
import '@nextrap/nte-nav-2';
import '@nextrap/nte-offcanvas';
import '@trunkjs/element-relocator';
import '@trunkjs/responsive';

import logoUrl from './assets/nextrap-logo.svg?url';
import './main';

export default defineDemo({
  title: 'Nav 2 + Element Relocator',
  description: 'TrunkJS Responsive verschiebt eine verschachtelte NTE Nav 2 zwischen Navbar und Offcanvas',
  iframe: true,
  render(root) {
    root.innerHTML = `
      <tj-responsive class="demo-responsive-shell">
        <section class="nte-navbar-demo">
          <nte-navbar class="with-shadow-on-scroll" style="--container-width: 72rem; --nte-navbar-position: sticky">
            <nte-navbar-line style="--height: 4.75rem">
              <a slot="start" class="brand-logo" href="/" aria-label="Nextrap Startseite"><img src="${logoUrl}" alt="" /></a>
              <nte-nav-2
                id="responsive-main-nav"
                slot="end"
                aria-label="Hauptnavigation"
                style="--nte-nav-flow: column; --nte-nav-align: stretch; width: 100%; padding: 1rem"
                style-lg="--nte-nav-flow: row; --nte-nav-align: stretch; width: auto; padding: 0"
              >
                <nte-nav-item href="/">Start</nte-nav-item>
                <nte-nav-item href="/leistungen" submenu-popover>
                  Leistungen
                  <nte-nav-item href="/beratung">Beratung</nte-nav-item>
                  <nte-nav-item href="/entwicklung">Entwicklung</nte-nav-item>
                </nte-nav-item>
                <nte-nav-item href="/unternehmen">Unternehmen</nte-nav-item>
              </nte-nav-2>
              <nte-burger
                slot="end"
                id="responsive-burger"
                aria-label="Navigation öffnen"
                aria-controls="responsive-offcanvas"
                style="display: block"
                style-lg="display: none"
              ></nte-burger>
            </nte-navbar-line>
          </nte-navbar>

          <nte-offcanvas id="responsive-offcanvas" aria-label="Mobile Hauptnavigation">
            <div slot="header"><strong>Navigation</strong></div>
            <tj-element-relocator source="#responsive-main-nav" placement="after" class="-lg:relocate"></tj-element-relocator>
          </nte-offcanvas>

          <main class="demo-responsive-content">
            <h2>Ein DOM-Baum, zwei Positionen</h2>
            <p>Unterhalb von <code>lg</code> setzt TrunkJS Responsive die Relocate-Klasse und die vertikalen CSS-Werte. Ab <code>lg</code> kehrt dieselbe Navigation rechts in die Navbar zurück und wird horizontal.</p>
          </main>
        </section>
      </tj-responsive>
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
