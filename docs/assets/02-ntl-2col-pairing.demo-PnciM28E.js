/* empty css                */ /* empty css                */ import {
  b as p,
  r as s,
} from './_virtual_tdemo-client-27TqdLsd.js';
import { r as h } from './index-BR6EnczS.js';
import './main-IrpkTR0s.js';
import { n as l } from './nextrap-element-DPUCZMMu.js';
import { t as m } from './property-CGWbrx0V.js'; /* empty css              */
import { d as c } from './types-4rIte7rE.js';
const u =
  ':host{--gap: var(--nt-spacing-layout);--container-width: var(--nt-container-width, 100%);--inner-padding: var(--nt-space-3);--section-bg: transparent;--cols: 6;--breakpoint: md;background:var(--section-bg);display:block}#container{margin-left:var(--container-margin-left, auto);margin-right:var(--container-margin-right, auto);width:var(--container-render-width, var(--container-width));box-sizing:border-box}#wrapper{--aside-width: 100%;display:flex;flex-direction:column;flex-wrap:wrap;gap:var(--gap);align-items:stretch}#header,#footer,#top,#bottom{width:100%;box-sizing:border-box}#header:has(.slot-empty),#footer:has(.slot-empty),#top:has(.slot-empty),#bottom:has(.slot-empty){display:none}#top{order:0;flex:0 0 auto}#main{order:1;min-width:0}#aside{order:2;min-width:0}#bottom{order:3;flex:0 0 auto}:host([mode=mobile]) #container{margin-left:0;margin-right:0;width:100%}:host([mode=mobile].mobile-reverse) #aside{order:1}:host([mode=mobile].mobile-reverse) #main{order:2}:host([mode=desktop].desktop-reverse) #wrapper{flex-direction:row-reverse}:host([mode=desktop]) #wrapper{flex-direction:row;--main-width: calc(100% * var(--cols, 1) / 12)}:host([mode=desktop]) #wrapper:has(#aside>.slot-empty){flex-direction:column}:host([mode=desktop]) #wrapper:has(#aside>.slot-empty) #main{width:100%;flex-basis:100%}:host([mode=desktop]) #wrapper #main{width:var(--main-width);flex:0 0 var(--main-width);box-sizing:border-box;display:flex;flex-direction:column;justify-content:flex-start}:host([mode=desktop]) #wrapper #aside{flex:1 1 0;box-sizing:border-box}:host([mode=desktop]) #aside{width:auto;min-width:0;flex:1 1 0;box-sizing:border-box}:host([mode=desktop]) #aside:has(.slot-empty){display:none}';
var b = Object.getOwnPropertyDescriptor,
  v = (n, i, d, r) => {
    for (var e = r > 1 ? void 0 : r ? b(i, d) : i, t = n.length - 1, a; t >= 0; t--) (a = n[t]) && (e = a(e) || e);
    return e;
  };
let o = class extends l({ breakpoints: !0, subLayoutApply: !0, slotVisibility: !0, eventBinding: !1 }) {
  connectedCallback() {
    (super.connectedCallback(), this.classList.add('ntl-2col'));
  }
  render() {
    return p`
      <div part="container" id="container">
        <div part="header" id="header">
          <slot name="header" data-query="@var(--ntl-2col-header-selector) | :scope > .header"></slot>
        </div>
        <div part="wrapper" id="wrapper">
          <div part="top" id="top">
            <slot name="top" data-query="@var(--ntl-2col-top-selector) | :scope > .top"></slot>
          </div>
          <div part="main" id="main">
            <slot></slot>
          </div>
          <div part="aside" id="aside">
            <slot
              name="aside"
              data-query="@var(--ntl-2col-aside-selector) | :scope > .aside | :scope > p:has(img)"
              data-set-attribute-class="auto"
            ></slot>
          </div>
          <div part="bottom" id="bottom">
            <slot name="bottom" data-query="@var(--ntl-2col-bottom-selector) | :scope > .bottom"></slot>
          </div>
        </div>
        <div part="footer" id="footer">
          <slot name="footer" data-query="@var(--ntl-2col-footer-selector) | :scope > .footer"></slot>
        </div>
      </div>
    `;
  }
};
o.styles = [s(h), s(u)];
o = v([m('ntl-2col')], o);
const f = `# Accordion und NTL 2col
{: layout="1;.nte-accordion-demo"}

Diese Demo zeigt die Benutzung vollständig im \`trunkjs/content-pane\`-Markdown-Format.

## Accordion im Hauptinhalt
{: layout="ntl-2col" section-style="--cols: 7;"}

---
{: layout="nte-accordion[initial-open-index='0'][exclusive]"}

### Planung

Das Accordion steht in der Hauptspalte.

### Umsetzung

Der ergänzende Inhalt bleibt in der Seitenspalte sichtbar.

---
{: layout=".aside"}

Hier können Bild, Kontakt oder Zusatzinformationen stehen.

## Accordion in der Seitenspalte
{: layout="ntl-2col" section-style="--cols: 7;"}

Der ausführliche Inhalt bleibt links, während kompakte Details rechts aufklappbar sind.

---
{: layout="nte-accordion.aside[initial-open-index='0'][exclusive]"}

### Seitliche Info

Geeignet für Fakten und Downloads.

### Weitere Details

Auch ohne Bild bleibt die Seitenspalte sinnvoll nutzbar.
`,
  S = c({
    title: 'Accordion in NTL 2col',
    description: 'Pairing des Accordions in der Haupt- und Seitenspalte eines Zweispalten-Layouts',
    markdown: f,
    wrapper_html: '<tj-content-pane>{{content}}</tj-content-pane>',
  });
export { S as default };
