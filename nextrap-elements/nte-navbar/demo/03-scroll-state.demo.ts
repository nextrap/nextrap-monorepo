import { defineDemo } from '@trunkjs/demo-viewer';

import logoUrl from './assets/nextrap-logo.svg?url';
import './main';

export default defineDemo({
  title: 'Mehrzeilig und Scroll-State',
  description: 'Die Top-Line gleitet beim Scrollen weg und die Hauptzeile wird kompakter',
  iframe: true,
  render(root) {
    root.innerHTML = `
      <div class="demo-scroll-page">
        <nte-navbar style="--container-width: 72rem">
          <nte-navbar-line class="hide-on-scroll" style="--height: 2.25rem; --background: #111827; --text-color: #fff">
            <span slot="start">Service & Support</span>
            <nav slot="end" class="demo-links navbar-control" aria-label="Sprachauswahl">
              <a href="/de">DE</a>
              <a href="/en">EN</a>
            </nav>
          </nte-navbar-line>
          <nte-navbar-line style="--height: 5.5rem; --height-scrolled: 4rem">
            <a slot="start" class="brand-logo" href="/" aria-label="Nextrap Startseite">
              <img src="${logoUrl}" alt="" />
            </a>
            <nav slot="center" class="demo-links navbar-control" aria-label="Hauptnavigation">
              <a href="/produkte">Produkte</a>
              <a href="/loesungen">Lösungen</a>
              <a href="/unternehmen">Unternehmen</a>
            </nav>
            <a slot="end" class="navbar-control" href="/kontakt">Kontakt</a>
          </nte-navbar-line>
        </nte-navbar>

        <main class="demo-scroll-content">
          <h1>Navbar beim Scrollen</h1>
          <p>Scrolle nach unten, um die Service-Zeile wegsliden und die Hauptnavigation schrumpfen zu sehen.</p>
          <div class="demo-scroll-spacer" aria-hidden="true"></div>
          <h2>Seitenende</h2>
          <p>Beim Zurückscrollen nach oben nimmt die Navbar wieder ihre volle Höhe ein.</p>
        </main>
      </div>
    `;
  },
});
