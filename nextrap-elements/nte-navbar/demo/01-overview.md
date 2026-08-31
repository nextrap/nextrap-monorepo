# `nte-navbar` – MVP

`nte-navbar` ist der schlanke Wrapper für eine mehrzeilige Navigation. Der Wrapper gibt die Containerbreite vor und setzt beim Scrollen zentral die Klasse `is-scrolled`. Jede `nte-navbar-line` besitzt die Slots `start`, `center` und `end`.

## Basis

```html
<nte-navbar style="--container-width: 1200px">
  <nte-navbar-line style="--height: 72px">
    <a slot="start" href="/">Logo links</a>
    <nav slot="end" class="navbar-control">Navigation rechts</nav>
  </nte-navbar-line>
</nte-navbar>
```

## Brand-Logo

Für Logos gibt es die Default-Klasse `brand-logo`. Sie wird auf einen Wrapper gesetzt, dessen direktes `img` immer den verfügbaren Platz nutzt. Das Bild wird mit `object-fit: contain` proportional skaliert und nicht abgeschnitten. Die Default-Aspect-Ratio ist `3 / 1` und kann über `--nt-navbar-brand-logo-aspect-ratio` angepasst werden.

Die Ausrichtung folgt automatisch dem Slot: `start` links, `center` geometrisch zentriert und `end` rechts. Da der Wrapper die Höhe der Navbar-Line übernimmt, folgt das Logo auch einer Änderung von `--height` zu `--height-scrolled` weich.

```html
<nte-navbar style="--container-width: 1200px">
  <nte-navbar-line style="--height: 96px; --height-scrolled: 60px">
    <nav slot="start" class="navbar-control">Produkte · Lösungen</nav>

    <div
      slot="center"
      class="brand-logo"
      style="--nt-navbar-brand-logo-aspect-ratio: 3 / 1"
    >
      <img src="./assets/nextrap-logo.svg" alt="Nextrap" />
    </div>

    <nav slot="end" class="navbar-control">Kontakt · Login</nav>
  </nte-navbar-line>
</nte-navbar>
```

Das gleiche Markup kann ohne weitere CSS-Regeln zwischen den Slots verschoben werden:

```html
<div slot="start" class="brand-logo">
  <img src="./assets/nextrap-logo.svg" alt="Nextrap" />
</div>
```

## Navbar Controls und Stacking

Interaktive Navigationselemente erhalten die Default-Klasse `navbar-control`. Dazu gehören zum Beispiel eine Navigation, ein Burger-Button, ein Menüöffner oder andere klickbare Header-Actions. Ein `navbar-control` wird innerhalb der Line bewusst vor normalem Navbar-Inhalt und dem `brand-logo` gerendert, damit es auch bei visuellen Überlappungen erreichbar und klickbar bleibt.

Jede `nte-navbar-line` erzeugt dafür mit `isolation: isolate` einen eigenen Stacking Context. Die Ebenen bleiben damit lokal auf die Line beschränkt und konkurrieren nicht mit Dialogen, Offcanvas oder anderen globalen Overlays. Standardmäßig liegt Content/Brand auf Ebene `1` und Controls auf Ebene `2`. Beide Werte können bei Bedarf über `--nt-navbar-content-z-index` und `--nt-navbar-control-z-index` angepasst werden.

```html
<nte-navbar-line style="--height: 88px; --height-scrolled: 60px">
  <div slot="center" class="brand-logo">
    <img src="./assets/nextrap-logo.svg" alt="Nextrap" />
  </div>

  <button
    slot="end"
    class="navbar-control"
    type="button"
    aria-label="Menü öffnen"
  >
    Menü
  </button>
</nte-navbar-line>
```

`navbar-control` verändert dabei nicht die Start-/Center-/End-Geometrie. Insbesondere bleibt ein Logo im Center-Slot geometrisch zentriert. Die Klasse definiert ausschließlich die Interaktions- und Layer-Priorität.

## Wirklich zentriertes Logo

Der Center-Slot bleibt geometrisch in der Mitte der vom Navbar vorgegebenen Containerbreite – unabhängig davon, wie breit Start oder End sind.

```html
<nte-navbar style="--container-width: 1200px">
  <nte-navbar-line style="--height: 80px">
    <nav slot="start" class="navbar-control">Shop · Produkte · Lösungen · Unternehmen</nav>
    <div slot="center" class="brand-logo">
      <img src="./assets/nextrap-logo.svg" alt="Nextrap" />
    </div>
    <a slot="end" class="navbar-control" href="/kontakt">Kontakt</a>
  </nte-navbar-line>
</nte-navbar>
```

## Mehrere Ebenen und Scroll-Größe

`--height` ist die Default-Größe, `--height-scrolled` die Größe im Scroll-Zustand. Der Scroll-State kommt ausschließlich vom `nte-navbar`-Wrapper.

```html
<nte-navbar style="--container-width: 1200px">
  <nte-navbar-line class="hide-on-scroll" style="--height: 36px">
    <span slot="start">Service</span>
    <nav slot="end" class="navbar-control">DE · EN</nav>
  </nte-navbar-line>

  <nte-navbar-line style="--height: 88px; --height-scrolled: 64px">
    <div slot="start" class="brand-logo">
      <img src="./assets/nextrap-logo.svg" alt="Nextrap" />
    </div>
    <nav slot="center" class="navbar-control">Produkte · Lösungen · Über uns</nav>
    <a slot="end" class="navbar-control" href="/kontakt">Kontakt</a>
  </nte-navbar-line>
</nte-navbar>
```

Leere Slots werden über `nextrap_element({ slotVisibility: true })` mit `.slot-empty` markiert. Die zugehörige Region bleibt ohne sichtbaren Inhalt, während das dreispaltige Grid die echte Zentrierung des Center-Slots erhält.

Nicht Teil dieses MVP sind automatische Navbar-Verschiebung, Relocator, Sidebar-Transfer, Spacer, Threshold-/Richtungslogik oder weitere Placement-Konfiguration.
