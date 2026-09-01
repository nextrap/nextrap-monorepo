import { defineDemo } from '@trunkjs/demo-viewer';

import './main';

let navbar: HTMLElement | null = null;
let state = 'expanded';

function updateState() {
  navbar?.classList.toggle('is-scrolled', state === 'scrolled');
}

export default defineDemo({
  title: 'Mehrzeilig und Scroll-State',
  description: 'Top-Line ausblenden und Hauptzeile verkleinern, ohne die Seite scrollen zu müssen',
  controls: [
    {
      label: 'Zustand',
      element: 'select',
      selectOptions: ['expanded', 'scrolled'],
      init(element) {
        (element as HTMLSelectElement).value = state;
      },
      onchange(event) {
        state = (event.currentTarget as HTMLSelectElement).value;
        updateState();
      },
    },
  ],
  render(root) {
    root.innerHTML = `
      <section class="nte-navbar-demo demo-scroll-state">
        <p class="demo-hint">
          Im echten Einsatz setzt <code>nte-navbar</code> diesen Zustand automatisch beim Scrollen.
        </p>
        <nte-navbar style="--container-width: 72rem">
          <nte-navbar-line class="hide-on-scroll" style="--height: 2.25rem; --background: #111827; --text-color: #fff">
            <span slot="start">Service & Support</span>
            <nav slot="end" class="demo-links navbar-control" aria-label="Sprachauswahl">
              <a href="#de">DE</a>
              <a href="#en">EN</a>
            </nav>
          </nte-navbar-line>
          <nte-navbar-line style="--height: 5.5rem; --height-scrolled: 4rem">
            <a slot="start" class="brand-logo" href="#start" aria-label="Nextrap Startseite">
              <img src="./assets/nextrap-logo.svg" alt="" />
            </a>
            <nav slot="center" class="demo-links navbar-control" aria-label="Hauptnavigation">
              <a href="#produkte">Produkte</a>
              <a href="#loesungen">Lösungen</a>
              <a href="#unternehmen">Unternehmen</a>
            </nav>
            <a slot="end" class="navbar-control" href="#kontakt">Kontakt</a>
          </nte-navbar-line>
        </nte-navbar>
      </section>
    `;
    navbar = root.querySelector('nte-navbar');
    updateState();
  },
});
