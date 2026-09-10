import assert from 'node:assert/strict';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import { createServer } from 'vite';

// Prüft reale Slots, Link-Wrapper und Regionen-Geometrie mit dem öffentlichen Sass-Vertrag.
const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const root = resolve(packageRoot, '../..');
const sass = await import(process.env.NTL_TEST_SASS || 'sass-embedded');
const compile = text => sass.compileString(text, {loadPaths: [root, resolve(root, 'node_modules')]}).css;
const api = `${packageRoot}/index.scss`;
assert.equal(compile(`@use '${api}';`).trim(), '');
for (const value of ['false', 'none']) {
  assert.doesNotMatch(compile(`@use '${api}' as card; .scope { @include card.default-style($modifierClasses: ${value}); }`), /\.(with-|img-)/);
}
assert.throws(() => compile(`@use '${api}' as card; .scope { @include card.with-region-bleed(unknown); }`));
assert.throws(() => compile(`@use '${api}' as card; .scope { @include card.with-region-bleed(image, unknown); }`));
const css = compile(`
  @use '${api}' as card;
  .theme-test nte-card.style-default { @include card.default-style($innerPadding: 24px, $gap: 16px, $border: 2px solid black, $border-radius: 0); }
  .theme-test nte-card.all-bleed { @each $region in (image, header, content, footer) { @include card.with-region-bleed($region); } }
  .theme-test nte-card.header-inline { @include card.with-region-bleed(header, inline); }
  .theme-test nte-card.overlay-mixin { @include card.with-image-overlay(); }
`);
for (const name of ['with-image-overlay','with-image-fullsize','with-region-bleed','with-image-bleed','with-header-bleed','with-content-bleed','with-footer-bleed']) {
  assert.ok(css.includes(`.theme-test nte-card.style-default.${name}`), name);
}
// Vite lädt die echten TS-Quellen. Der Inline-Sass-Adapter erlaubt dieselben Prüfungen mit Dart oder JS Sass.
const server = await createServer({
  configFile: false,
  root,
  optimizeDeps: { noDiscovery: true, include: ['lit', '@trunkjs/browser-utils', '@trunkjs/content-pane'] },
  resolve: {
    alias: {
      '@nextrap/nt-core': resolve(root, 'nextrap-base/nt-core/index.ts'),
      '@nextrap/style-reset': resolve(root, 'nextrap-styles/style-reset/index.ts'),
    },
  },
  plugins: [
    {
      name: 'ntl-spacing-fixture',
      enforce: 'pre',
      resolveId(id, importer) {
        if (id.endsWith('.scss?inline') || id.endsWith('.scss')) {
          return '\0card-spacing-scss:' + resolve(importer ? dirname(importer) : root, id.replace(/\?inline$/, '')) + '.js';
        }
      },
      async load(id) {
        if (id.startsWith('\0card-spacing-scss:')) {
          const filename = id.slice('\0card-spacing-scss:'.length, -3).replace(/\?inline$/, '');
          const value = sass.compile(filename, { loadPaths: [resolve(root, 'node_modules')] }).css;
          return `export default ${JSON.stringify(value)};`;
        }
      },
      configureServer(vite) {
        vite.middlewares.use('/__spacing', (_request, response) => {
          response.setHeader('Content-Type', 'text/html');
          response.end(
            `<!doctype html><html><head><style>body{margin:0} nte-card{--breakpoint:initial} nte-card > *{margin:0;min-height:20px;box-sizing:border-box} ${css}</style></head><body><script type="module">import '/nextrap-elements/nte-card/index.ts'; window.ready = customElements.whenDefined('nte-card');</script></body></html>`,
          );
        });
      },
    },
  ],
  server: { host: '127.0.0.1', port: 0 },
});
let browser;
try {
  await server.listen();
  browser = await puppeteer.launch({
    executablePath: process.env.CHROME_BIN,
    headless: true,
    args: process.env.NTL_CHROME_ARGS ? JSON.parse(process.env.NTL_CHROME_ARGS) : [],
  });
  const page = await browser.newPage();
  page.on('pageerror', (error) => console.error(error.message));
  await page.goto(server.resolvedUrls.local[0] + '__spacing');
  await page.waitForFunction(() => customElements.get('nte-card'));

  // Alle Slot-Belegungen werden nach dem echten SlotVisibilityMixin ausgewertet, nicht per CSS simuliert.
  const result = await page.evaluate(async () => {
    const issues = [];
    let cases = 0;
    const parts = ['image', 'header', 'content', 'footer'];
    document.body.className = 'theme-test';
    const near = (actual, expected, label) => { if (Math.abs(actual - expected) > 0.8) issues.push(`${label}: ${actual} != ${expected}`); };
    const settle = async el => {
      await el.updateComplete;
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    };
    const make = (mask, variant, gap, linked) => {
      const el = document.createElement('nte-card');
      el.className = `style-default ${variant}`;
      el.style.setProperty('--gap', `${gap}px`);
      for (let i=0; i<4; i++) {
        if (!(mask & (1<<i))) continue;
        const child = document.createElement(i === 0 ? 'img' : 'div');
        if (i === 0) { child.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="240"/>'; child.alt = ''; }
        else child.textContent = parts[i];
        if (i !== 2) child.slot = parts[i];
        el.append(child);
      }
      if (linked) { const a = document.createElement('a'); a.slot = 'link'; a.href = '#target'; el.append(a); }
      document.body.append(el);
      return el;
    };
    for (const width of [360, 1000]) {
      document.body.style.width = `${width}px`;
      for (const gap of [0,16,40]) for (const linked of [false,true]) {
        for (const variant of ['', ...parts.map(p => `with-${p}-bleed`), 'all-bleed', 'header-inline', 'with-image-fullsize', 'with-image-fullsize with-image-bleed']) {
          for (let mask=0; mask<16; mask++) {
            const el = make(mask, variant, gap, linked);
            await settle(el);
            const sr = el.shadowRoot, wrapper = sr.getElementById('wrapper');
            const visible = parts.filter(p => getComputedStyle(sr.getElementById(p)).display !== 'none');
            const expectedParts = parts.filter((_,i) => mask & (1<<i));
            const label = `${width}/${gap}/${linked}/${variant}/${mask}`;
            if (visible.join() !== expectedParts.join()) issues.push(`${label}: Slot-Sichtbarkeit`);
            if (el.getAttribute('data-card-regions') !== expectedParts.join(' ')) issues.push(`${label}: Belegungszustand`);
            if (!mask) {
              if (getComputedStyle(wrapper).display !== 'none') issues.push(`${label}: leerer Rahmen`);
              near(el.getBoundingClientRect().height, 0, `${label}/leere Klickfläche`);
            } else {
              const wr = wrapper.getBoundingClientRect();
              const bleed = p => variant === 'all-bleed' || variant.split(' ').includes(`with-${p}-bleed`);
              for (const p of visible) {
                const rect = sr.getElementById(p).getBoundingClientRect();
                const inline = bleed(p) || (variant === 'header-inline' && p === 'header');
                near(rect.left-wr.left-2, inline ? 0 : 24, `${label}/${p}/links`);
                near(wr.right-2-rect.right, inline ? 0 : 24, `${label}/${p}/rechts`);
              }
              if ((mask & 1) && variant.includes('with-image-fullsize')) { const ir = sr.getElementById('image').getBoundingClientRect(); near(ir.height, ir.width * 1.5, `${label}/natürliche Bildhöhe`); }
              const first = visible[0], last = visible.at(-1);
              near(sr.getElementById(first).getBoundingClientRect().top-wr.top-2, bleed(first) ? 0 : 24, `${label}/oben`);
              near(wr.bottom-2-sr.getElementById(last).getBoundingClientRect().bottom, bleed(last) ? 0 : 24, `${label}/unten`);
              for (let i=1;i<visible.length;i++) near(sr.getElementById(visible[i]).getBoundingClientRect().top-sr.getElementById(visible[i-1]).getBoundingClientRect().bottom,gap,`${label}/Gap`);
            }
            el.remove(); cases++;
          }
        }
        for (const variant of ['with-image-overlay', 'img-overlay', 'overlay-mixin']) for (let mask=0;mask<16;mask++) {
          const el=make(mask,variant,gap,linked); await settle(el);
          const sr=el.shadowRoot, wr=sr.getElementById('wrapper').getBoundingClientRect();
          if (mask&1) {
            const im=sr.getElementById('image').getBoundingClientRect();
            near(im.left,wr.left+2,'Overlay Bild links'); near(im.right,wr.right-2,'Overlay Bild rechts'); near(im.top,wr.top+2,'Overlay Bild oben');
            if(mask&4){const cr=sr.getElementById('content').getBoundingClientRect(); near(cr.left,im.left,'Overlay Content links');near(cr.top,im.top,'Overlay Content oben');near(cr.right,im.right,'Overlay Content rechts');near(cr.bottom,im.bottom,'Overlay Content unten');}
            const tails=['header','footer'].filter((p,i)=>mask&(i===0?2:8)); let end=im.bottom;
            for(const p of tails){const r=sr.getElementById(p).getBoundingClientRect();near(r.top-end,gap,'Overlay Gap');end=r.bottom;}
            near(wr.bottom-2-end,tails.length?24:0,'Overlay unten');
          } else if(mask && getComputedStyle(sr.getElementById('wrapper')).display !== 'flex') issues.push('Overlay ohne Bild bleibt Grid');
          el.remove();cases++;
        }
      }
    }
    // Dynamische Textknoten sowie verschachtelte leere Slots dürfen äußeren Content nicht ausblenden.
    const el=make(0,'with-content-bleed',16,false); await settle(el);
    el.append(document.createTextNode('Text')); await settle(el);
    if(el.getAttribute('data-card-regions')!=='content') issues.push('Textknoten nicht erkannt');
    const inner=document.createElement('nte-card');el.append(inner);await settle(el);
    if(getComputedStyle(el.shadowRoot.getElementById('content')).display==='none') issues.push('Verschachtelte leere Card blendet äußeren Content aus');
    el.replaceChildren();await settle(el);
    if(getComputedStyle(el.shadowRoot.getElementById('wrapper')).display!=='none') issues.push('Dynamisch geleerter Rahmen');
    el.remove();
    return {cases,issues};
  });
  assert.deepEqual(result.issues, [], JSON.stringify(result.issues.slice(0,40),null,2));
  console.log(`OK: ${result.cases} Card-Geometriefälle einschließlich Bleed/Overlay sowie dynamische Slots`);
} finally {
  await browser?.close();
  await server.close();
}
