# `nte-navbar` – MVP

`nte-navbar` ist der schlanke Wrapper für eine mehrzeilige Navigation. Der Wrapper gibt die Containerbreite vor und setzt beim Scrollen zentral die Klasse `is-scrolled`. Jede `nte-navbar-line` besitzt die Slots `start`, `center` und `end`.

## Basis

```html
<nte-navbar style="--container-width: 1200px">
  <nte-navbar-line style="--height: 72px">
    <a slot="start" href="/">Logo links</a>
    <nav slot="end">Navigation rechts</nav>
  </nte-navbar-line>
</nte-navbar>
```

## Brand-Logo

Für Logos gibt es die Default-Klasse `brand-logo`. Sie wird auf einen Wrapper gesetzt, dessen direktes `img` immer den verfügbaren Platz nutzt. Das Bild wird mit `object-fit: contain` proportional skaliert und nicht abgeschnitten. Die Default-Aspect-Ratio ist `3 / 1` und kann über `--nt-navbar-brand-logo-aspect-ratio` angepasst werden.

Die Ausrichtung folgt automatisch dem Slot: `start` links, `center` geometrisch zentriert und `end` rechts. Da der Wrapper die Höhe der Navbar-Line übernimmt, folgt das Logo auch einer Änderung von `--height` zu `--height-scrolled` weich.

```html
<nte-navbar style="--container-width: 1200px">
  <nte-navbar-line style="--height: 96px; --height-scrolled: 60px">
    <nav slot="start">Produkte · Lösungen</nav>

    <div
      slot="center"
      class="brand-logo"
      style="--nt-navbar-brand-logo-aspect-ratio: 3 / 1"
    >
      <img src="./assets/nextrap-logo.svg" alt="Nextrap" />
    </div>

    <nav slot="end">Kontakt · Login</nav>
  </nte-navbar-line>
</nte-navbar>
```

Das gleiche Markup kann ohne weitere CSS-Regeln zwischen den Slots verschoben werden:

```html
<div slot="start" class="brand-logo">
  <img src="./assets/nextrap-logo.svg" alt="Nextrap" />
</div>
```

## Wirklich zentriertes Logo

Der Center-Slot bleibt geometrisch in der Mitte der vom Navbar vorgegebenen Containerbreite – unabhängig davon, wie breit Start oder End sind.

```html
<nte-navbar style="--container-width: 1200px">
  <nte-navbar-line style="--height: 80px">
    <nav slot="start">Shop · Produkte · Lösungen · Unternehmen</nav>
    <div slot="center" class="brand-logo">
      <img src="./assets/nextrap-logo.svg" alt="Nextrap" />
    </div>
    <a slot="end" href="/kontakt">Kontakt</a>
  </nte-navbar-line>
</nte-navbar>
```

## Mehrere Ebenen und Scroll-Größe

`--height` ist die Default-Größe, `--height-scrolled` die Größe im Scroll-Zustand. Der Scroll-State kommt ausschließlich vom `nte-navbar`-Wrapper.

```html
<nte-navbar style="--container-width: 1200px">
  <nte-navbar-line class="hide-on-scroll" style="--height: 36px">
    <span slot="start">Service</span>
    <nav slot="end">DE · EN</nav>
  </nte-navbar-line>

  <nte-navbar-line style="--height: 88px; --height-scrolled: 64px">
    <div slot="start" class="brand-logo">
      <img src="./assets/nextrap-logo.svg" alt="Nextrap" />
    </div>
    <nav slot="center">Produkte · Lösungen · Über uns</nav>
    <a slot="end" href="/kontakt">Kontakt</a>
  </nte-navbar-line>
</nte-navbar>
```

Leere Slots werden über `nextrap_element({ slotVisibility: true })` mit `.slot-empty` markiert. Die zugehörige Region bleibt ohne sichtbaren Inhalt, während das dreispaltige Grid die echte Zentrierung des Center-Slots erhält.

Nicht Teil dieses MVP sind automatische Navbar-Verschiebung, Relocator, Sidebar-Transfer, Spacer, Threshold-/Richtungslogik oder weitere Placement-Konfiguration.
