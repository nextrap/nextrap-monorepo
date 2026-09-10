import '@trunkjs/content-pane';
import { defineDemo } from '@trunkjs/demo-viewer';
import '../index';
import { attachImages } from './image-fixtures';

// Prüft Navigation ohne Hover sowie die bewusst deaktivierte Pfeil-Option im gleichen Demo-Kontext.
export default defineDemo({
  title: 'Navigation',
  navPath: ['NTE Image'],
  description: 'Sichtbare Buttons auf Desktop und Touch-Geräten, Tastaturbedienung und Opt-in.',
  css: null,
  wrapper_html: '<tj-content-pane>{{content}}</tj-content-pane>',
  afterRender: attachImages,
  markdown: `# Navigation

Die Pfeile sind sofort sichtbar. Mit Tab fokussieren und mit Enter oder Leertaste auslösen; auf einem Touch-Gerät antippen. Automatischer Wechsel erst nach einer Minute.

## Vor und zurück

---
{: layout="nte-image#navigation[data-features='slideshow arrows indicators'][interval='60000']" section-style="--nte-image-width: min(100%, 640px);"}



---
{: layout="/;"}

## Schmaler Rahmen

---
{: layout="nte-image#navigation-narrow[data-features='slideshow arrows'][interval='60000']" section-style="--nte-image-width: min(100%, 280px); --nte-image-aspect-ratio: 4 / 3;"}



---
{: layout="/;"}

## Ohne Pfeile

---
{: layout="nte-image#navigation-disabled[data-features='slideshow indicators'][interval='60000']" section-style="--nte-image-width: min(100%, 640px);"}



---
{: layout="/;"}

Ohne das Feature arrows werden keine Pfeile angezeigt. Die Indikatoren erlauben weiterhin die Bildauswahl.
`,
});
