// Der Demo Viewer verarbeitet das Markdown mit Content Pane.
import '@trunkjs/content-pane';
import { defineDemo } from '@trunkjs/demo-viewer';
import '../index';
import style from './main.scss?inline';

// Die Bild-Demo benötigt keine zusätzliche Datei oder Netzwerkquelle.
const image = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#315cd5"/><path d="m8 16 5 5 11-11" fill="none" stroke="white" stroke-width="3"/></svg>',
);

// Beispiele verwenden nur src, Klassen, CSS und native ARIA-Attribute.
export default defineDemo({
  title: 'Icons',
  markdown: `## Icons

<div class="icon-demo-row" aria-hidden="true">
  <nte-icon class="bi bi-house"></nte-icon>
  <nte-icon class="bi bi-heart-fill"></nte-icon>
  <nte-icon class="bi bi-search"></nte-icon>
  <nte-icon src="${image}"></nte-icon>
</div>

## Größen

<div class="icon-demo-row" aria-hidden="true">
  <nte-icon class="bi bi-star-fill size-xs"></nte-icon>
  <nte-icon class="bi bi-star-fill size-sm"></nte-icon>
  <nte-icon class="bi bi-star-fill size-md"></nte-icon>
  <nte-icon class="bi bi-star-fill size-lg"></nte-icon>
  <nte-icon class="bi bi-star-fill size-xl"></nte-icon>
  <nte-icon class="bi bi-star-fill size-xxl"></nte-icon>
  <nte-icon class="bi bi-star-fill" style="--nte-icon-size: 48px; color: #315cd5"></nte-icon>
</div>

## Buttons

<button type="button"><nte-icon class="bi bi-download" aria-hidden="true"></nte-icon> Download</button>
<button type="button" aria-label="Suchen"><nte-icon class="bi bi-search" aria-hidden="true"></nte-icon></button>`,
  wrapper_html: '<tj-content-pane>{{content}}</tj-content-pane>',
  css: [style],
});
