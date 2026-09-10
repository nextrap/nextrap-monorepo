import assert from 'node:assert/strict';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import { createServer } from 'vite';

// Prüft die tatsächliche Web Component mit kompilierten öffentlichen Mixins in einem echten Browser.
// CHROME_BIN gibt einen lokal installierten Chromium/Chrome an; es wird kein Browser heruntergeladen.
const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const root = resolve(packageRoot, '../..');
const sass = await import(process.env.NTL_TEST_SASS || 'sass-embedded');
const compile = (text) => sass.compileString(text, { loadPaths: [root, resolve(root, 'node_modules')] }).css;
const api = `${packageRoot}/index.scss`;
assert.equal(compile(`@use '${api}';`).trim(), '', 'Der Sass-Entrypoint darf kein CSS ausgeben');
// Registrierung ist vollständig, am aktuellen Style gescoped und explizit abschaltbar.
const helperNames = [
  'with-reverse', 'with-mobile-reverse', 'with-desktop-reverse', 'with-alternating',
  'with-breakout-start', 'with-breakout-end', 'with-background-and-divider',
  'with-image-auto-objectfit', 'with-wrapper-bg-color', 'with-justify',
  'with-justify-top', 'with-justify-center', 'with-justify-bottom', 'with-main-sticky-top',
  ...['left', 'center', 'right', 'justify', 'start', 'end'].map(x => `with-main-text-${x}`),
  'with-main-top', 'with-main-center', 'with-main-bottom',
];
const scoped = compile(`@use '${api}' as two; .theme-custom ntl-2col.style-custom { @include two.default-style(); }`);
for (const name of helperNames) assert.ok(scoped.includes(`.theme-custom ntl-2col.style-custom.${name}`), name);
for (const setting of ['false', 'none']) {
  const disabled = compile(`@use '${api}' as two; .style-custom { @include two.default-style($modifierClasses: ${setting}); }`);
  assert.doesNotMatch(disabled, /\.(?:with-|reverse|mobile-reverse|desktop-reverse|breakout-)/);
}
const css = compile(`
  @use '${api}' as two;
  ntl-2col.style-default { @include two.default-style($innerPadding: 24px, $gap: 16px, $border: 1px solid black, $objectFit: none, $justify: none); }
  .mobile-mixin { @include two.with-mobile-reverse(); }
  .desktop-mixin { @include two.with-desktop-reverse(); }
  .reverse-mixin { @include two.with-reverse(); }
  .alternating ntl-2col { @include two.with-alternating(); }
  .divider { @include two.with-background-and-divider($gap: 16px, $divider-color: black); }
`);

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
          return '\0spacing-scss:' + resolve(importer ? dirname(importer) : root, id.replace(/\?inline$/, '')) + '.js';
        }
      },
      async load(id) {
        if (id.startsWith('\0spacing-scss:')) {
          const filename = id.slice('\0spacing-scss:'.length, -3).replace(/\?inline$/, '');
          const value = sass.compile(filename, { loadPaths: [resolve(root, 'node_modules')] }).css;
          return `export default ${JSON.stringify(value)};`;
        }
      },
      configureServer(vite) {
        vite.middlewares.use('/__spacing', (_request, response) => {
          response.setHeader('Content-Type', 'text/html');
          response.end(
            `<!doctype html><html><head><style>body{margin:0} ntl-2col{--container-width:100%;--breakpoint:initial} ntl-2col > *{margin:0;min-height:20px;box-sizing:border-box} ${css}</style></head><body><script type="module">import '/nextrap-layout/ntl-2col/index.ts'; window.ready = customElements.whenDefined('ntl-2col');</script></body></html>`,
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
  await page.waitForFunction(() => customElements.get('ntl-2col'));

  // Alle Slot-Belegungen werden nach dem echten SlotVisibilityMixin ausgewertet, nicht per CSS simuliert.
  const result = await page.evaluate(async () => {
    const issues = [];
    let cases = 0;
    const close = (actual, expected, message) => {
      if (Math.abs(actual - expected) > 0.75) issues.push(`${message}: ${actual} != ${expected}`);
    };
    const settle = async (el, mode) => {
      await el.updateComplete;
      el.setAttribute('mode', mode);
      await new Promise(requestAnimationFrame);
      await new Promise(requestAnimationFrame);
    };
    const variants = [
      '',
      'reverse',
      'reverse-mobile',
      'reverse-desktop',
      'mobile-mixin',
      'desktop-mixin',
      'reverse-mixin',
      'mobile-reverse',
      'desktop-reverse',
      'with-reverse',
      'with-mobile-reverse',
      'with-desktop-reverse',
    ];
    for (const mode of ['mobile', 'desktop']) {
      document.body.style.width = mode === 'mobile' ? '390px' : '1000px';
      for (const gap of [0, 16, 40])
        for (const variant of variants)
          for (const alternating of [false, true])
            for (const mask of Array.from({ length: 16 }, (_, i) => i)) {
              const parent = document.createElement('div');
              parent.className = alternating && mask % 2 ? 'alternating' : '';
              const odd = document.createElement('ntl-2col');
              parent.append(odd);
              const el = document.createElement('ntl-2col');
              el.className = `style-default divider ${variant} ${alternating && !(mask % 2) ? 'with-alternating' : ''}`;
              el.style.setProperty('--gap', `${gap}px`);
              el.style.setProperty('--cols', '6');
              for (const slot of ['header', 'footer']) {
                const child = document.createElement('div');
                child.slot = slot;
                child.textContent = slot;
                el.append(child);
              }
              ['top', '', 'aside', 'bottom'].forEach((slot, i) => {
                if (!(mask & (1 << i))) return;
                const child = document.createElement('div');
                if (slot) child.slot = slot;
                if (slot === 'aside') child.className = mask % 2 ? 'aside' : 'aside p-0';
                child.textContent = slot || 'main';
                el.append(child);
              });
              parent.append(el);
              document.body.append(parent);
              await settle(el, mode);
              const label = `${mode}/${gap}/${variant || 'default'}/alt=${alternating}/${mask}`;
              const sr = el.shadowRoot;
              const wrapper = sr.querySelector('#wrapper');
              if (!mask) {
                if (getComputedStyle(wrapper).display !== 'none') issues.push(`${label}: leerer Wrapper sichtbar`);
              } else {
                const wr = wrapper.getBoundingClientRect();
                const ws = getComputedStyle(wrapper);
                const regions = ['top', 'main', 'aside', 'bottom']
                  .map((id) => sr.getElementById(id))
                  .filter((node) => getComputedStyle(node).display !== 'none');
                if (regions.length !== mask.toString(2).replace(/0/g, '').length)
                  issues.push(`${label}: Slot-Sichtbarkeit falsch`);
                const rects = regions.map((node) => ({ id: node.id, rect: node.getBoundingClientRect() }));
                for (const node of regions)
                  for (const side of ['Top', 'Bottom', 'Left', 'Right'])
                    close(
                      parseFloat(getComputedStyle(node)[`padding${side}`]),
                      0,
                      `${label}/${node.id}/padding${side}`,
                    );
                close(
                  Math.min(...rects.map((x) => x.rect.left)) - wr.left - parseFloat(ws.borderLeftWidth),
                  24,
                  `${label}/Rand links`,
                );
                close(
                  wr.right - Math.max(...rects.map((x) => x.rect.right)) - parseFloat(ws.borderRightWidth),
                  24,
                  `${label}/Rand rechts`,
                );
                close(
                  Math.min(...rects.map((x) => x.rect.top)) - wr.top - parseFloat(ws.borderTopWidth),
                  24,
                  `${label}/Rand oben`,
                );
                close(
                  wr.bottom - Math.max(...rects.map((x) => x.rect.bottom)) - parseFloat(ws.borderBottomWidth),
                  24,
                  `${label}/Rand unten`,
                );
                const sorted = [...rects].sort((a, b) => a.rect.top - b.rect.top || a.rect.left - b.rect.left);
                const rows = [];
                for (const item of sorted) {
                  let row = rows.find((r) => Math.abs(r[0].rect.top - item.rect.top) < 0.75);
                  if (!row) rows.push((row = []));
                  row.push(item);
                }
                for (let i = 1; i < rows.length; i++)
                  close(
                    rows[i][0].rect.top - Math.max(...rows[i - 1].map((x) => x.rect.bottom)),
                    gap,
                    `${label}/Zeilen-Gap`,
                  );
                for (const row of rows)
                  for (let i = 1; i < row.length; i++)
                    close(row[i].rect.left - row[i - 1].rect.right, gap, `${label}/Spalten-Gap`);
                for (const item of rects.filter((x) => ['top', 'bottom'].includes(x.id)))
                  close(
                    item.rect.width,
                    wr.width - 48 - parseFloat(ws.borderLeftWidth) - parseFloat(ws.borderRightWidth),
                    `${label}/${item.id}/volle Breite`,
                  );
                if ((mask & 6) === 6) {
                  const main = rects.find((x) => x.id === 'main').rect,
                    aside = rects.find((x) => x.id === 'aside').rect;
                  const reversed =
                    mode === 'mobile'
                      ? ['reverse', 'reverse-mobile', 'mobile-mixin', 'reverse-mixin', 'mobile-reverse', 'with-reverse', 'with-mobile-reverse'].includes(
                          variant,
                        )
                      : ['reverse', 'reverse-desktop', 'desktop-mixin', 'reverse-mixin', 'desktop-reverse', 'with-reverse', 'with-desktop-reverse'].includes(
                          variant,
                        ) !== alternating;
                  if ((mode === 'mobile' ? aside.top < main.top : aside.left < main.left) !== reversed)
                    issues.push(`${label}/falsche Reihenfolge`);
                  if (mode === 'desktop') {
                    const after = getComputedStyle(sr.getElementById('aside'), '::after');
                    const scale = Number(after.transform.match(/matrix\(([^,]+)/)?.[1] || 1);
                    close(scale, reversed ? -1 : 1, `${label}/Divider-Seite`);
                    close(parseFloat(after.borderLeftWidth), gap === 0 ? 0 : 1, `${label}/Divider bei Null-Gap`);
                  }
                } else if (mask & 4 && mode === 'desktop') {
                  const content = getComputedStyle(sr.getElementById('aside'), '::after').content;
                  if (!['none', 'normal'].includes(content)) issues.push(`${label}/verwaister Divider`);
                }
              }
              close(
                sr.getElementById('header').getBoundingClientRect().width,
                el.getBoundingClientRect().width,
                `${label}/Header`,
              );
              close(
                sr.getElementById('footer').getBoundingClientRect().width,
                el.getBoundingClientRect().width,
                `${label}/Footer`,
              );
              parent.remove();
              cases++;
            }
    }

    // Text- und vertikale Ausrichtung bleiben kombinierbar und lassen Aside unverändert.
    for (const mode of ['mobile', 'desktop']) {
      document.body.style.width = mode === 'mobile' ? '390px' : '1000px';
      for (const align of ['left', 'center', 'right', 'justify', 'start', 'end']) {
        for (const [position, justify] of [['top', 'flex-start'], ['center', 'center'], ['bottom', 'flex-end']]) {
          const el = document.createElement('ntl-2col');
          el.className = 'style-default';
          el.innerHTML = '<div>Main</div><div slot="aside" style="height:180px">Aside</div>';
          document.body.append(el);
          await settle(el, mode);
          const asideBefore = getComputedStyle(el.shadowRoot.getElementById('aside')).justifyContent;
          el.classList.add(`with-main-text-${align}`, `with-main-${position}`);
          const main = el.shadowRoot.getElementById('main');
          main.style.minHeight = '180px';
          const cs = getComputedStyle(main);
          if (cs.textAlign !== align || cs.justifyContent !== justify)
            issues.push(`${mode}/${align}/${position}: Main-Ausrichtung falsch`);
          const mr = main.getBoundingClientRect();
          const cr = el.firstElementChild.getBoundingClientRect();
          const expected = position === 'top' ? mr.top : position === 'bottom' ? mr.bottom - cr.height : mr.top + (mr.height - cr.height) / 2;
          close(cr.top, expected, `${mode}/${align}/${position}: Main-Inhaltsposition`);
          if (getComputedStyle(el.shadowRoot.getElementById('aside')).justifyContent !== asideBefore)
            issues.push(`${mode}/${align}/${position}: Aside verändert`);
          el.remove();
          cases++;
        }
      }
    }

    // Dynamisches Entfernen und Wiederbelegen aktualisiert den realen Slot-Leerzustand.
    const dynamic = document.createElement('ntl-2col');
    dynamic.className = 'style-default';
    document.body.append(dynamic);
    await settle(dynamic, 'mobile');
    dynamic.append(document.createTextNode('Main'));
    await settle(dynamic, 'mobile');
    if (getComputedStyle(dynamic.shadowRoot.getElementById('wrapper')).display === 'none')
      issues.push('Dynamischer Main bleibt unsichtbar');
    dynamic.replaceChildren();
    await settle(dynamic, 'mobile');
    if (getComputedStyle(dynamic.shadowRoot.getElementById('wrapper')).display !== 'none')
      issues.push('Dynamisch geleerter Wrapper bleibt sichtbar');
    dynamic.remove();
    return { cases, issues };
  });
  assert.deepEqual(result.issues, [], JSON.stringify(result.issues.slice(0, 30), null, 2));
  console.log(`OK: ${result.cases} Browser-Geometriefälle sowie dynamische Slot-Belegung`);
} finally {
  await browser?.close();
  await server.close();
}
