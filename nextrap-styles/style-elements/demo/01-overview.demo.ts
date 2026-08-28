import { defineDemo } from '@trunkjs/demo-viewer';

import '@nextrap/style-base/default';
import '@nextrap/style-reset';
import '@nextrap/style-typography/default';
import '../default.scss';

const demoCss = `
.style-elements-demo {
  display: grid;
  gap: 2rem;
  max-width: 960px;
}

.style-elements-demo__section {
  display: grid;
  gap: 1rem;
}

.style-elements-demo__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.style-elements-demo__preview {
  padding: 1rem;
  border: 1px solid var(--nt-border);
  border-radius: var(--nt-border-radius, .5rem);
}

.style-elements-demo__preview > :last-child {
  margin-bottom: 0;
}

.style-elements-demo__status-large {
  --list-status-indicator-size: 1.35em;
}

.style-elements-demo__thumbnail {
  inline-size: min(100%, 280px);
  aspect-ratio: 16 / 9;
  object-fit: cover;
}
`;

export default defineDemo({
  title: 'Style Elements',
  group: 'style-elements',
  description: 'Prose, Tabellen, Listen, List Groups, Bilder und Container',
  css: ['default', demoCss],
  html: `
    <div class="style-elements-demo">
      <section class="style-elements-demo__section">
        <h2>Prose</h2>
        <article class="prose style-elements-demo__preview">
          <h3>Lesbarer Fließtext</h3>
          <p class="lead">Die Prose-Klasse bündelt typische Rich-Content-Elemente in einer gut lesbaren Darstellung.</p>
          <p>Sie formatiert Überschriften, <a href="#style-elements-tables">Links</a>, Zitate, Code und weitere Inhalte konsistent.</p>
          <blockquote>Ein gutes Element-Style bleibt semantisch und lässt sich über Tokens an das Theme anpassen.</blockquote>
          <pre><code>@use '@nextrap/style-elements/default';</code></pre>
        </article>
      </section>

      <section id="style-elements-tables" class="style-elements-demo__section">
        <h2>Tabellen</h2>
        <div class="table-responsive">
          <table class="table table-striped table-bordered table-hover">
            <thead>
              <tr><th scope="col">Paket</th><th scope="col">Typ</th><th scope="col">Status</th></tr>
            </thead>
            <tbody>
              <tr><td>style-elements</td><td>Patterns</td><td>Aktiv</td></tr>
              <tr><td>style-utils</td><td>Utilities</td><td>Aktiv</td></tr>
              <tr><td>style-typography</td><td>Typography</td><td>Aktiv</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="style-elements-demo__section">
        <h2>Listen</h2>
        <div class="style-elements-demo__grid">
          <div class="style-elements-demo__preview">
            <h3>Diamond</h3>
            <ul class="list list-diamond">
              <li>Geometrischer Marker</li>
              <li>Am ersten Textabschnitt zentriert</li>
              <li>Auch für längere Listeneinträge geeignet, die über mehrere Zeilen laufen.</li>
            </ul>
          </div>

          <div class="style-elements-demo__preview">
            <h3>Status Plain</h3>
            <ul class="list list-status-plain">
              <li>Neutral ist der Standard</li>
              <li class="list-item-tick">Verfügbar</li>
              <li class="list-item-cross">Nicht verfügbar</li>
            </ul>
          </div>

          <div class="style-elements-demo__preview">
            <h3>Status Circle</h3>
            <ul class="list list-status-circle style-elements-demo__status-large">
              <li>Noch offen</li>
              <li class="list-item-tick">Erledigt</li>
              <li class="list-item-cross">Abgelehnt</li>
            </ul>
            <small>Indicator-Größe: 1.35em</small>
          </div>

          <div class="style-elements-demo__preview">
            <h3>Inline und Unstyled</h3>
            <ul class="list list-inline">
              <li class="list-inline-item">Start</li>
              <li class="list-inline-item">Produkte</li>
              <li class="list-inline-item">Kontakt</li>
            </ul>
            <ul class="list list-unstyled">
              <li>Ohne Marker</li>
              <li>Semantische Liste bleibt erhalten</li>
            </ul>
          </div>
        </div>
      </section>

      <section class="style-elements-demo__section">
        <h2>List Group</h2>
        <ul class="list-group">
          <li>Allgemeine Einstellungen</li>
          <li>Benachrichtigungen</li>
          <li>Datenschutz</li>
        </ul>
        <ul class="list-group list-group-flush">
          <li>Flush-Eintrag eins</li>
          <li>Flush-Eintrag zwei</li>
        </ul>
      </section>

      <section class="style-elements-demo__section">
        <h2>Bilder</h2>
        <figure>
          <svg class="img-fluid img-thumbnail figure-img style-elements-demo__thumbnail" viewBox="0 0 640 360" role="img" aria-labelledby="style-elements-image-title">
            <title id="style-elements-image-title">Abstrakte Nextrap Demo-Grafik</title>
            <rect width="640" height="360" fill="var(--nt-primary-subtle)" />
            <circle cx="220" cy="180" r="92" fill="var(--nt-primary)" />
            <rect x="330" y="112" width="160" height="136" rx="24" fill="var(--nt-accent)" />
          </svg>
          <figcaption>Responsive Bilddarstellung mit Thumbnail-Rahmen.</figcaption>
        </figure>
      </section>

      <section class="style-elements-demo__section">
        <h2>Container</h2>
        <div class="container style-elements-demo__preview">Zentrierter Container mit responsiver Maximalbreite.</div>
        <div class="container-fluid style-elements-demo__preview">Fluid Container über die verfügbare Breite.</div>
      </section>
    </div>
  `,
});
