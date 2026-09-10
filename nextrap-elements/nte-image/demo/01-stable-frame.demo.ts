import '@trunkjs/content-pane';
import { defineDemo } from '@trunkjs/demo-viewer';
import '../index';
import { attachImages } from './image-fixtures';

// Zeigt denselben Bildwechsel in drei unabhängig konfigurierten Rahmen, ohne Default-Style-Import.
export default defineDemo({
  title: 'Stabile Bildfläche',
  navPath: ['NTE Image'],
  description: 'Hochformat, Querformat und Quadrat wechseln ohne Änderung der Rahmenhöhe.',
  css: null,
  wrapper_html: '<tj-content-pane>{{content}}</tj-content-pane>',
  afterRender: attachImages,
  markdown: `# Stabile Bildfläche

Die drei Bildformate wechseln alle zwei Sekunden. Die Texte unter den Bildern bleiben dabei an derselben Position. Alle Bilder füllen ihren Rahmen mit Object Fit.

## Standard: 16:9

---
{: layout="nte-image#ratio-default[data-features='slideshow arrows indicators'][interval='2000']"}



---
{: layout="/;"}

Dieser Text bleibt beim Bildwechsel stehen.

## Quadratischer Rahmen

---
{: layout="nte-image#ratio-square[data-features='slideshow arrows indicators'][interval='2000']" section-style="--nte-image-width: min(100%, 360px); --nte-image-aspect-ratio: 1 / 1;"}



---
{: layout="/;"}

Auch bei 1:1 bleibt die Fläche konstant.

## Feste Breite und Höhe

---
{: layout="nte-image#fixed-size[data-features='slideshow arrows indicators'][interval='2000']" section-style="width: min(100%, 640px); height: 240px;"}



---
{: layout="/;"}

Die explizite Höhe von 240 Pixeln hat Vorrang vor dem Seitenverhältnis.
`,
});
