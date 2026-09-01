import { defineDemo } from '@trunkjs/demo-viewer';
import '@nextrap/nte-burger';
import '@nextrap/nte-nav-2';
import '@nextrap/nte-offcanvas';
import '@trunkjs/element-relocator';

import logoUrl from './assets/nextrap-logo.svg?url';
import './main';

export default defineDemo({
  title: 'Nav 2 + Element Relocator',
  description: 'Eine verschachtelte NTE Nav 2 wird am Breakpoint zwischen rechter Navbar-Seite und Offcanvas verschoben',
  iframe: true,
  render(root) {
    root.innerHTML = `
      <section class="nte-navbar-demo demo-responsive-shell">
        <nte-navbar position="sticky" class="with-shadow-on-scroll" style="--container-width: 72rem">
          <nte-navbar-line style="--height: 4.75rem">
            <a slot="start" class="brand-logo" href="/" aria-label="Nextrap Startseite"><img src="${logoUrl}" alt="" /></a>
            <nte-nav-2 id="responsive-main-nav" slot="end" class="demo-nav-horizontal" aria-label="Hauptnavigation">
              <nte-nav-item href="/">Start</nte-nav-item>
              <nte-nav-item href="/leistungen" submenu-popover>
                Leistungen
                <nte-nav-item href="/beratung">Beratung</nte-nav-item>
                <nte-nav-item href="/entwicklung">Entwicklung</nte-nav-item>
              </nte-nav-item>
              <nte-nav-item href="/unternehmen">Unternehmen</nte-nav-item>
            </nte-nav-2>
            <nte-burger slot="end" id="responsive-burger" class="demo-mobile-only" aria-label="Navigation öffnen" aria-controls="responsive-offcanvas"></nte-burger>
          </nte-navbar-line>
        </nte-navbar>

        <nte-offcanvas id="responsive-offcanvas" aria-label="Mobile Hauptnavigation">
          <div slot="header"><strong>Navigation</strong></div>
          <tj-element-relocator id="responsive-nav-relocator" source="#responsive-main-nav" placement="after"></tj-element-relocator>
        </nte-offcanvas>

        <main class="demo-responsive-content">
          <h2>Ein DOM-Baum, zwei Positionen</h2>
          <p>Unterhalb von 64rem wird dieselbe Navigation in das Offcanvas verschoben und vertikal dargestellt. Oberhalb davon kehrt sie rechts in die Navbar zurück und wird horizontal dargestellt.</p>
        </main>
      </section>
    `;

    const nav = root.querySelector<HTMLElement>('#responsive-main-nav');
    const relocator = root.querySelector<HTMLElement>('#responsive-nav-relocator');
    const burger = root.querySelector('nte-burger');
    const offcanvas = root.querySelector('nte-offcanvas');
    const media = window.matchMedia('(max-width: 63.999rem)');

    const applyMode = () => {
      relocator?.classList.toggle('relocated', media.matches);
      nav?.classList.toggle('demo-nav-vertical', media.matches);
      nav?.classList.toggle('demo-nav-horizontal', !media.matches);
      if (!media.matches) void offcanvas?.close();
    };

    burger?.addEventListener('click', () => void offcanvas?.toggle());
    offcanvas?.addEventListener('nte-offcanvas:closed', () => {
      if (burger) burger.open = false;
    });
    offcanvas?.addEventListener('nte-offcanvas:opened', () => {
      if (burger) burger.open = true;
    });
    media.addEventListener('change', applyMode);
    applyMode();
  },
});
