import type { TDemoEnvironment } from '@trunkjs/demo-viewer';
import { defineDemo } from '@trunkjs/demo-viewer';

import logoUrl from './assets/nextrap-logo.svg?url';
import './main';

const getNavbar = (env: TDemoEnvironment): HTMLElement => env.query<HTMLElement>('#scroll-navbar');

const setStylePreset = (env: TDemoEnvironment, preset: 'static' | 'sticky' | 'transparent' | 'fixed-overlay') => {
  const navbar = getNavbar(env);
  navbar.classList.remove('with-transparent-at-top', 'with-shadow', 'with-shadow-on-scroll', 'with-overlay-at-top');

  if (preset === 'static') {
    navbar.style.setProperty('--nte-navbar-position', 'static');
    return;
  }

  if (preset === 'sticky') {
    navbar.style.setProperty('--nte-navbar-position', 'sticky');
    navbar.classList.add('with-shadow-on-scroll');
    return;
  }

  if (preset === 'transparent') {
    navbar.style.setProperty('--nte-navbar-position', 'sticky');
    navbar.classList.add('with-transparent-at-top', 'with-shadow-on-scroll');
    return;
  }

  navbar.style.setProperty('--nte-navbar-position', 'fixed');
  navbar.style.setProperty('--nte-navbar-overlay-offset', '7.75rem');
  navbar.classList.add('with-transparent-at-top', 'with-shadow-on-scroll', 'with-overlay-at-top');
};

export default defineDemo({
  title: 'Scroll-Verhalten',
  description: 'CSS-gesteuerte Position, Scroll-Schwelle, optionale Top-Line und schrumpfende Hauptzeile',
  iframe: true,
  controls: {
    items: [
      {
        id: 'style-static',
        type: 'button',
        label: 'Static',
        onClick(_, env) {
          setStylePreset(env, 'static');
        },
      },
      {
        id: 'style-sticky',
        type: 'button',
        label: 'Sticky',
        onClick(_, env) {
          setStylePreset(env, 'sticky');
        },
      },
      {
        id: 'style-transparent',
        type: 'button',
        label: 'Sticky transparent',
        onClick(_, env) {
          setStylePreset(env, 'transparent');
        },
      },
      {
        id: 'style-overlay',
        type: 'button',
        label: 'Fixed overlay',
        onClick(_, env) {
          setStylePreset(env, 'fixed-overlay');
        },
      },
      {
        id: 'threshold',
        type: 'input',
        label: 'Scroll threshold',
        value: '12',
        attributes: { type: 'range', min: '0', max: '160', step: '4' },
        onInput(event, env) {
          getNavbar(env).style.setProperty('--nte-navbar-scroll-threshold', String(event.value));
        },
      },
      {
        id: 'toggle-top-line',
        type: 'button',
        label: 'Top-Line collapse an/aus',
        onClick(_, env) {
          env.query<HTMLElement>('#service-line').classList.toggle('with-collapse-on-scroll');
        },
      },
      {
        id: 'toggle-shrink',
        type: 'button',
        label: 'Hauptleiste shrink an/aus',
        onClick(_, env) {
          env.query<HTMLElement>('#main-line').classList.toggle('with-shrink-on-scroll');
        },
      },
    ],
  },
  render(root) {
    root.innerHTML = `
      <div class="demo-scroll-page">
        <nte-navbar
          id="scroll-navbar"
          class="with-transparent-at-top with-shadow-on-scroll"
          style="--container-width: 72rem; --nte-navbar-position: sticky; --nte-navbar-scroll-threshold: 12"
        >
          <nte-navbar-line id="service-line" class="with-collapse-on-scroll" style="--height: 2.25rem; --background: #111827; --text-color: #fff">
            <span slot="start">Service & Support</span>
            <nav slot="end" class="demo-links navbar-control" aria-label="Sprachauswahl">
              <a href="/de">DE</a>
              <a href="/en">EN</a>
            </nav>
          </nte-navbar-line>
          <nte-navbar-line id="main-line" class="with-shrink-on-scroll" style="--height: 5.5rem; --height-scrolled: 4rem">
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
          <p>Die Demo-Controls ändern ausschließlich Klassen und CSS Custom Properties. Die Komponente liest den effektiven Style nach jeder Class-/Style-Änderung neu ein.</p>
          <p>Teste Static, Sticky, transparenten Top-State und Fixed Overlay direkt über die Controls.</p>
          <div class="demo-scroll-spacer" aria-hidden="true"></div>
          <h2>Seitenende</h2>
          <p>Beim Zurückscrollen zum Anfang nimmt die Navbar wieder ihre volle Höhe ein.</p>
        </main>
      </div>
    `;
  },
});
