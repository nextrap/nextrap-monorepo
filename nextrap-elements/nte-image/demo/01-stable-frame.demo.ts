import '@trunkjs/content-pane';
import { defineDemo } from '@trunkjs/demo-viewer';
import '../index';

// Zeigt denselben Bildwechsel in drei unabhängig konfigurierten Rahmen, ohne Default-Style-Import.
export default defineDemo({
  title: 'Stabile Bildfläche',
  navPath: ['NTE Image'],
  description: 'Drei Bilder wechseln ohne Änderung der Rahmenhöhe.',
  css: null,
  wrapper_html: '<tj-content-pane>{{content}}</tj-content-pane>',
  markdown: `# Stabile Bildfläche

Die drei Bilder wechseln alle zwei Sekunden. Die Texte unter den Bildern bleiben dabei an derselben Position. Alle Bilder füllen ihren Rahmen mit Object Fit.

## Standard: 16:9

![Demobild 1](https://cdn.leuffen.de//leu-stock/v2/386/c_gfedcba/AdobeStock_222010919.webp)
![Demobild 2](https://cdn.leuffen.de//leu-stock/v2/381/137-45_gfedcba/AdobeStock_408818677.webp)
![Demobild 3](https://cdn.leuffen.de//leu-stock/v2/360/B_gfedcba/AdobeStock_352102788.webp)
{: layout="nte-image#ratio-default" section-style="--nte-image-features: slideshow arrows indicators; --nte-image-interval: 2000ms;"}

Dieser Text bleibt beim Bildwechsel stehen.

## Quadratischer Rahmen

![Demobild 1](https://cdn.leuffen.de//leu-stock/v2/386/c_gfedcba/AdobeStock_222010919.webp)
![Demobild 2](https://cdn.leuffen.de//leu-stock/v2/381/137-45_gfedcba/AdobeStock_408818677.webp)
![Demobild 3](https://cdn.leuffen.de//leu-stock/v2/360/B_gfedcba/AdobeStock_352102788.webp)
{: layout="nte-image#ratio-square" section-style="--nte-image-features: slideshow arrows indicators; --nte-image-interval: 2000ms; --nte-image-width: min(100%, 360px); --nte-image-aspect-ratio: 1 / 1;"}

Auch bei 1:1 bleibt die Fläche konstant.

## Feste Breite und Höhe

![Demobild 1](https://cdn.leuffen.de//leu-stock/v2/386/c_gfedcba/AdobeStock_222010919.webp)
![Demobild 2](https://cdn.leuffen.de//leu-stock/v2/381/137-45_gfedcba/AdobeStock_408818677.webp)
![Demobild 3](https://cdn.leuffen.de//leu-stock/v2/360/B_gfedcba/AdobeStock_352102788.webp)
{: layout="nte-image#fixed-size" section-style="--nte-image-features: slideshow arrows indicators; --nte-image-interval: 2000ms; width: min(100%, 640px); height: 240px;"}

Die explizite Höhe von 240 Pixeln hat Vorrang vor dem Seitenverhältnis.
`,
});
