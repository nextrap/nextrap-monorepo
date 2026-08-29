import './_virtual_tdemo-client-Pi1VR-d9.js';
import { d as e } from './types-4rIte7rE.js'; /* empty css                */ /* empty css              */ /* empty css                */
const n = `{: layout="1;.container.prose" }

# Style Elements

\`@nextrap/style-elements\` stellt wiederverwendbare Muster für semantische HTML-Elemente bereit.

## Prose

### Lesbarer Fließtext

Die Prose-Klasse bündelt typische Rich-Content-Elemente in einer gut lesbaren Darstellung.
Sie formatiert Überschriften, [Links](#tabellen), Zitate, Code und weitere Inhalte konsistent.

> Ein gutes Element-Style bleibt semantisch und lässt sich über Tokens an das Theme anpassen.

~~~scss
@use '@nextrap/style-elements/default';
~~~

## Tabellen

| Paket | Typ | Status |
| --- | --- | --- |
| style-elements | Patterns | Aktiv |
| style-utils | Utilities | Aktiv |
| style-typography | Typography | Aktiv |
{: .table .table-striped .table-bordered .table-hover }

## Listen

### Diamond

- Geometrischer Marker
- Am ersten Textabschnitt zentriert
- Auch für längere Listeneinträge geeignet, die über mehrere Zeilen laufen.
{: .list .list-diamond }

### Status Plain

Die Zustandsklasse gehört zum einzelnen Eintrag. Ein Eintrag ohne Zustandsklasse ist neutral.

<ul class="list list-status-plain">
  <li>Neutral ist der Standard</li>
  <li class="list-item-tick">Verfügbar</li>
  <li class="list-item-cross">Nicht verfügbar</li>
</ul>

### Status Circle

Die Größe des Indicators kann direkt über die öffentliche CSS-Variable angepasst werden.

<ul class="list list-status-circle" style="--list-status-indicator-size: 1.35em">
  <li>Noch offen</li>
  <li class="list-item-tick">Erledigt</li>
  <li class="list-item-cross">Abgelehnt</li>
</ul>

### Inline und Unstyled

- Start
- Produkte
- Kontakt
{: .list .list-inline }

- Ohne Marker
- Semantische Liste bleibt erhalten
{: .list .list-unstyled }

## List Group

<ul class="list-group">
  <li>Allgemeine Einstellungen</li>
  <li>Benachrichtigungen</li>
  <li>Datenschutz</li>
</ul>

<ul class="list-group list-group-flush">
  <li>Flush-Eintrag eins</li>
  <li>Flush-Eintrag zwei</li>
</ul>

## Bilder

<figure>
  <svg class="img-fluid img-thumbnail figure-img" viewBox="0 0 640 360" role="img" aria-labelledby="style-elements-image-title" style="max-width: 28rem">
    <title id="style-elements-image-title">Abstrakte Nextrap Demo-Grafik</title>
    <rect width="640" height="360" fill="var(--nt-primary-subtle)" />
    <circle cx="220" cy="180" r="92" fill="var(--nt-primary)" />
    <rect x="330" y="112" width="160" height="136" rx="24" fill="var(--nt-accent)" />
  </svg>
  <figcaption>Responsive Bilddarstellung mit Thumbnail-Rahmen.</figcaption>
</figure>

## Container
{: layout="1;.container" }

Zentrierter Container mit responsiver Maximalbreite.

---
{: layout="1;.container-fluid" }

Fluid Container über die verfügbare Breite.
`,
  a = e({
    title: 'Style Elements',
    group: 'style-elements',
    description: 'Prose, Tabellen, Listen, List Groups, Bilder und Container',
    css: ['default'],
    markdown: n,
  });
export { a as default };
