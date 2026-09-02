import { defineDemo } from '@trunkjs/demo-viewer';

import './main';

export default defineDemo({
  title: 'Slots und Zentrierung',
  description: 'Geometrisch zentriertes Logo bei unterschiedlich breiten Außenbereichen',
  render(root) {
    root.innerHTML = `
      <section class="nte-navbar-demo">
        <nte-navbar style="--container-width: 72rem">
          <nte-navbar-line style="--height: 5.5rem">
            <nav slot="start" class="demo-links navbar-control" aria-label="Produktnavigation">
              <a href="#produkte">Produkte</a>
              <a href="#loesungen">Lösungen</a>
              <a href="#unternehmen">Unternehmen</a>
            </nav>
            <a slot="center" class="brand-logo" href="#start" aria-label="Nextrap Startseite">
              <img src="./assets/nextrap-logo.svg" alt="" />
            </a>
            <nav slot="end" class="demo-links navbar-control" aria-label="Servicenavigation">
              <a href="#kontakt">Kontakt</a>
            </nav>
          </nte-navbar-line>
        </nte-navbar>

        <nte-navbar style="--container-width: 72rem">
          <nte-navbar-line style="--height: 4.5rem">
            <a slot="start" class="demo-brand" href="#start">Nextrap</a>
            <nav slot="end" class="demo-links navbar-control" aria-label="Hauptnavigation">
              <a href="#docs">Docs</a>
              <a href="#blog">Blog</a>
              <a href="#login">Login</a>
            </nav>
          </nte-navbar-line>
        </nte-navbar>
      </section>
    `;
  },
});
