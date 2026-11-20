// Der vorhandene Viewer rendert Markdown; Content Pane übernimmt die Inhaltsanordnung.
import '@trunkjs/content-pane';
import { defineDemo } from '@trunkjs/demo-viewer';
import '../index';
import style from './main.scss?inline';

// Eine lokale Data-URL demonstriert den Bildmodus ohne zusätzliche Netzwerkabhängigkeit.
const image = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#315cd5"/><path d="m8 16 5 5 11-11" fill="none" stroke="white" stroke-width="3"/></svg>',
);

// Jede Gruppe zeigt direkt eine öffentliche API-Variante ohne erläuternden Begleittext.
export default defineDemo({
  title: 'Icons',
  description: 'Bilder, Bootstrap Icons, Größen und Buttons',
  markdown: `## Icons

<div class="icon-demo-row">
  <nte-icon class="bi bi-house" label="Startseite"></nte-icon>
  <nte-icon class="bi-heart-fill" label="Favorit"></nte-icon>
  <nte-icon class="bi-search" label="Suchen"></nte-icon>
  <nte-icon class="bi-check-circle-fill" label="Bestätigt"></nte-icon>
  <nte-icon class="bi-arrow-right" label="Weiter"></nte-icon>
</div>

## Bild

<nte-icon src="${image}" height="2rem" label="Bestätigt"></nte-icon>

## Größen

<div class="icon-demo-row">
  <nte-icon class="bi-star-fill" size="xs" label="XS"></nte-icon>
  <nte-icon class="bi-star-fill" size="sm" label="SM"></nte-icon>
  <nte-icon class="bi-star-fill" size="md" label="MD"></nte-icon>
  <nte-icon class="bi-star-fill" size="lg" label="LG"></nte-icon>
  <nte-icon class="bi-star-fill" size="xl" label="XL"></nte-icon>
  <nte-icon class="bi-star-fill" size="xxl" label="XXL"></nte-icon>
  <nte-icon class="bi-star-fill" height="48px" label="48 Pixel"></nte-icon>
</div>

## Text und Farbe

<p class="icon-demo-emphasis"><nte-icon class="bi-heart-fill"></nte-icon> Mit Textgröße und Textfarbe</p>

## Buttons

<div class="icon-demo-row">
  <button type="button"><nte-icon class="bi-download"></nte-icon> Download</button>
  <button type="button" aria-label="Suchen"><nte-icon class="bi-search"></nte-icon></button>
  <a href="#icons"><nte-icon class="bi-arrow-up"></nte-icon> Nach oben</a>
</div>

## Platzhalter

<div class="icon-demo-row">
  <nte-icon class="bi-cloud-download" placeholder="·" label="Download"></nte-icon>
  <nte-icon class="bi-check-lg" placeholder="" label="Fertig"></nte-icon>
</div>`,
  wrapper_html: '<tj-content-pane>{{content}}</tj-content-pane>',
  css: [style],
});
