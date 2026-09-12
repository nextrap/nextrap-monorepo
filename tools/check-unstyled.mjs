/**
 * Run after building the component/style packages into dist/<group>/<package>.
 * Unstyled exists so themes own all Light DOM CSS; keep that promise across
 * package boundaries and preserve the shared API when the SPA entry is loaded.
 */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(import.meta.url);
// Use the bundler installed with Vite, matching the repository's build toolchain.
const { build } = createRequire(require.resolve('vite/package.json'))('esbuild');
const { JSDOM } = require('jsdom');
const packages = ['nextrap-elements', 'nextrap-layout', 'nextrap-styles'].flatMap(group =>
  readdirSync(resolve(root, group)).filter(name => existsSync(resolve(root, group, name, 'package.json'))).map(name => `${group}/${name}`));
const aliases = Object.fromEntries(packages.flatMap(p => [
  [`@nextrap/${p.split('/')[1]}/unstyled`, resolve(root, 'dist', p, 'unstyled.js')],
  [`@nextrap/${p.split('/')[1]}`, resolve(root, 'dist', p, 'index.js')],
]));
aliases['@nextrap/nt-core'] = resolve(root, 'dist/nextrap-base/nt-core/index.js');
for (const p of packages) {
  const pkg = JSON.parse(readFileSync(resolve(root, p, 'package.json')));
  assert.equal(pkg.exports['./unstyled'].import, './unstyled.js', p);
  assert.ok(existsSync(resolve(root, 'dist', p, 'unstyled.d.ts')), `${p}: missing declarations`);
  const result = await build({
    stdin: { contents: `import * as plain from ${JSON.stringify(aliases[pkg.name + '/unstyled'])}; globalThis.plain = plain; globalThis.loadStyled = () => import(${JSON.stringify(aliases[pkg.name])});`, resolveDir: root },
    bundle: true, format: 'iife', write: false, alias: aliases, logLevel: 'silent',
  });
  const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', { url: 'https://example.org', runScripts: 'outside-only', pretendToBeVisual: true });
  try {
    const w = dom.window;
    w.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
    w.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
    w.IntersectionObserver = w.ResizeObserver;
    w.eval(result.outputFiles[0].text);
    assert.equal(w.document.querySelectorAll('style,link[rel=stylesheet]').length, 0, `${p}: unstyled injects CSS`);
    const styled = await w.loadStyled();
    assert.deepEqual(Object.keys(styled).sort(), Object.keys(w.plain).sort(), `${p}: different exports`);
    for (const key of Object.keys(w.plain)) assert.equal(styled[key], w.plain[key], `${p}: duplicate implementation`);
    const count = w.document.querySelectorAll('head style').length;
    await w.loadStyled();
    assert.equal(w.document.querySelectorAll('head style').length, count, `${p}: duplicate stylesheet`);
    console.log(`${pkg.name}: unstyled clean, API shared, ${count} default stylesheet(s)`);
  } finally { dom.window.close(); }
}
// A later API call must also remain free of global stylesheets (body portal).
const imageResult = await build({ stdin: { contents: `export {createFullsizeView} from './nextrap-elements/nte-image/src/components/nte-image/nte-image.utils.ts'`, resolveDir: root }, bundle: true, format: 'iife', globalName: 'imageAPI', write: false });
const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', { url: 'https://example.org', runScripts: 'outside-only', pretendToBeVisual: true });
try {
  dom.window.eval(imageResult.outputFiles[0].text);
  const img = dom.window.document.createElement('img'); img.src = 'https://example.org/image.png';
  dom.window.imageAPI.createFullsizeView(img, false);
  assert.ok(dom.window.document.querySelector('.nxa-fullsize-container'));
  assert.equal(dom.window.document.querySelectorAll('style,link[rel=stylesheet]').length, 0, 'fullsize view injects CSS');
  console.log('nte-image fullsize lifecycle: no Light DOM stylesheet');
} finally { dom.window.close(); }
// Exercise actual Nx template rendering, so future components inherit the contract.
const { createTreeWithEmptyWorkspace } = require('@nx/devkit/testing');
const { generateFiles, names } = require('@nx/devkit');
const tree = createTreeWithEmptyWorkspace();
const name = 'nte-unstyled-probe';
generateFiles(tree, resolve(root, 'nextrap-base/nt-nx-generators/src/generators/base-generator/files/base'), 'probe', { name, path: 'probe', elementClassName: names(name).className+'Element', className: names(name).className, mixinClassName: names(name).className+'Mixin', preparedNames: names(name), importPath: '@nextrap/'+name });
assert.ok(tree.exists('probe/unstyled.ts'));
assert.match(tree.read('probe/index.ts', 'utf8'), /export \* from '\.\/unstyled'/);
assert.equal(JSON.parse(tree.read('probe/package.json', 'utf8')).exports['./unstyled'].import, './unstyled.js');
console.log('Nx generator templates: unstyled contract rendered');
