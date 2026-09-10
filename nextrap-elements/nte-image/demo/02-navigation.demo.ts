import '@trunkjs/content-pane';
import { defineDemo } from '@trunkjs/demo-viewer';
import '../index';

// Prüft Navigation ohne Hover sowie die bewusst deaktivierte Pfeil-Option im gleichen Demo-Kontext.
export default defineDemo({
  title: 'Navigation',
  navPath: ['NTE Image'],
  description: 'Sichtbare Buttons auf Desktop und Touch-Geräten, Tastaturbedienung und Opt-in.',
  // Zeigt die Feature-Konfiguration aus einem Stylesheet; die weiteren Beispiele verwenden Inline-Styles.
  css: `.image-navigation-theme {
    --nte-image-features: slideshow arrows indicators;
    --nte-image-interval: 60s;
    --nte-image-width: min(100%, 640px);
  }`,
  wrapper_html: '<tj-content-pane>{{content}}</tj-content-pane>',
  markdown: `# Navigation

Die Pfeile sind sofort sichtbar. Mit Tab fokussieren und mit Enter oder Leertaste auslösen; auf einem Touch-Gerät antippen. Automatischer Wechsel erst nach einer Minute.

## Vor und zurück – Konfiguration über eine CSS-Klasse

![Demobild 1](https://cdn.leuffen.de//leu-stock/v2/386/c_gfedcba/AdobeStock_222010919.webp)
![Demobild 2](https://cdn.leuffen.de//leu-stock/v2/381/137-45_gfedcba/AdobeStock_408818677.webp)
![Demobild 3](https://cdn.leuffen.de//leu-stock/v2/360/B_gfedcba/AdobeStock_352102788.webp)
{: layout="nte-image#navigation" section-class="image-navigation-theme"}

## Schmaler Rahmen

![Demobild 1](https://cdn.leuffen.de//leu-stock/v2/386/c_gfedcba/AdobeStock_222010919.webp)
![Demobild 2](https://cdn.leuffen.de//leu-stock/v2/381/137-45_gfedcba/AdobeStock_408818677.webp)
![Demobild 3](https://cdn.leuffen.de//leu-stock/v2/360/B_gfedcba/AdobeStock_352102788.webp)
{: layout="nte-image#navigation-narrow" section-style="--nte-image-features: slideshow arrows; --nte-image-interval: 60000ms; --nte-image-width: min(100%, 280px); --nte-image-aspect-ratio: 4 / 3;"}

## Ohne Pfeile

![Demobild 1](https://cdn.leuffen.de//leu-stock/v2/386/c_gfedcba/AdobeStock_222010919.webp)
![Demobild 2](https://cdn.leuffen.de//leu-stock/v2/381/137-45_gfedcba/AdobeStock_408818677.webp)
![Demobild 3](https://cdn.leuffen.de//leu-stock/v2/360/B_gfedcba/AdobeStock_352102788.webp)
{: layout="nte-image#navigation-disabled" section-style="--nte-image-features: slideshow indicators; --nte-image-interval: 60000ms; --nte-image-width: min(100%, 640px);"}

Ohne das Feature arrows werden keine Pfeile angezeigt. Die Indikatoren erlauben weiterhin die Bildauswahl.
`,
});
