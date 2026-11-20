// Die Font-Lifecycle-Tests verwenden echte Dokumente und kontrollierte Browser-Font-Requests.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import glyphStyle from '../scss/_bootstrap-icons.scss?inline';

// Ein zurückgehaltener Download macht konkurrierende Aufrufe und Fehler deterministisch prüfbar.
function deferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((onResolve, onReject) => {
    resolve = onResolve;
    reject = onReject;
  });
  return { promise, resolve, reject };
}

// Jedes Dokument erhält einen eigenen FontFaceSet-Ersatz ohne Netzwerkzugriff.
function fontDocument() {
  const target = document.implementation.createHTMLDocument('Icon fonts');
  const add = vi.fn();
  Object.defineProperty(target, 'fonts', { value: { add }, configurable: true });
  return { target, add };
}

// Der öffentliche Loader muss einen Download dokumentweit und über Module hinweg teilen.
describe('loadBootstrapIconFont', () => {
  let module: typeof import('./bootstrap-icon-font');
  let originalUrl: string;
  let request: ReturnType<typeof deferred<FontFace>>;
  let font: FontFace;
  let load: ReturnType<typeof vi.fn>;
  let construct: ReturnType<typeof vi.fn>;

  // Neue Modulinstanzen testen denselben öffentlichen Contract wie doppelt gebündelte Packages.
  beforeEach(async () => {
    vi.resetModules();
    request = deferred<FontFace>();
    load = vi.fn(() => request.promise);
    font = { load } as unknown as FontFace;
    construct = vi.fn(function () { return font; });
    vi.stubGlobal('FontFace', construct);
    module = await import('./bootstrap-icon-font');
    originalUrl = module.NTE_ICON_CONFIG.bootstrapIconsFontUrl;
  });

  // Globale Anwenderkonfiguration darf nicht zwischen unabhängigen Tests verändert bleiben.
  afterEach(() => {
    module.NTE_ICON_CONFIG.bootstrapIconsFontUrl = originalUrl;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  // Ein Runtime-Import allein darf keine Schrift erzeugen oder anfordern.
  it('does not start a font request when imported', () => {
    expect(construct).not.toHaveBeenCalled();
    expect(load).not.toHaveBeenCalled();
    expect(module.NTE_ICON_CONFIG.bootstrapIconsFontUrl).toBe(
      'https://cdn.leuffen.de/hyperpage-components/v1.0/fonts/bootstrap-icons.woff2',
    );
  });

  // Gleichzeitige und spätere Nutzer erhalten dieselbe Schrift, ohne globales CSS zu injizieren.
  it('shares one pending and completed download within a document', async () => {
    const { target, add } = fontDocument();
    const first = module.loadBootstrapIconFont(target);
    const second = module.loadBootstrapIconFont(target);

    expect(first).toBe(second);
    expect(construct).toHaveBeenCalledTimes(1);
    expect(load).toHaveBeenCalledTimes(1);
    expect(add).not.toHaveBeenCalled();

    request.resolve(font);
    await expect(first).resolves.toBe(font);
    expect(add).toHaveBeenCalledExactlyOnceWith(font);
    expect(module.loadBootstrapIconFont(target)).toBe(first);
    expect(target.querySelectorAll('style, link')).toHaveLength(0);
  });

  // Unabhängige Package-Kopien müssen Konfiguration und laufenden Download gemeinsam verwenden.
  it('deduplicates across independently evaluated module copies', async () => {
    const { target, add } = fontDocument();
    const first = module.loadBootstrapIconFont(target);

    vi.resetModules();
    const copy = await import('./bootstrap-icon-font');
    expect(copy.NTE_ICON_CONFIG).toBe(module.NTE_ICON_CONFIG);
    expect(copy.loadBootstrapIconFont(target)).toBe(first);
    expect(construct).toHaveBeenCalledTimes(1);

    request.resolve(font);
    await first;
    expect(add).toHaveBeenCalledTimes(1);
  });

  // Der erste Nutzer fixiert die URL, damit spätere Änderungen keine zweite Font-Instanz erzeugen.
  it('uses the global override before first use and keeps an active request stable', async () => {
    const { target } = fontDocument();
    module.NTE_ICON_CONFIG.bootstrapIconsFontUrl = 'https://assets.example.test/icons.woff2';
    const first = module.loadBootstrapIconFont(target);
    module.NTE_ICON_CONFIG.bootstrapIconsFontUrl = 'https://assets.example.test/later.woff2';

    expect(construct).toHaveBeenCalledWith(
      'bootstrap-icons',
      'url("https://assets.example.test/icons.woff2")',
      expect.objectContaining({ style: 'normal', weight: 'normal' }),
    );
    expect(module.loadBootstrapIconFont(target)).toBe(first);
    expect(construct).toHaveBeenCalledTimes(1);
    request.resolve(font);
    await first;
  });

  // Ein kaputter CDN-Request darf durch weitere Icons nicht zu einer Request-Schleife werden.
  it('caches a rejected request without registering a broken font', async () => {
    const { target, add } = fontDocument();
    const failure = new Error('CDN unavailable');
    const first = module.loadBootstrapIconFont(target);
    const rejection = expect(first).rejects.toBe(failure);
    request.reject(failure);
    await rejection;

    const retry = module.loadBootstrapIconFont(target);
    expect(retry).toBe(first);
    await expect(retry).rejects.toBe(failure);
    expect(construct).toHaveBeenCalledTimes(1);
    expect(load).toHaveBeenCalledTimes(1);
    expect(add).not.toHaveBeenCalled();
  });

  // Ein separates Dokument benötigt seinen eigenen FontFaceSet-Eintrag.
  it('registers the font separately for separate documents', async () => {
    const firstDocument = fontDocument();
    const secondDocument = fontDocument();
    const first = module.loadBootstrapIconFont(firstDocument.target);
    const second = module.loadBootstrapIconFont(secondDocument.target);
    expect(first).not.toBe(second);

    request.resolve(font);
    await Promise.all([first, second]);
    expect(firstDocument.add).toHaveBeenCalledExactlyOnceWith(font);
    expect(secondDocument.add).toHaveBeenCalledExactlyOnceWith(font);
  });

  // Nicht unterstützte Browser liefern einen behandelbaren Fehler statt eines Hängers.
  it('rejects when the CSS Font Loading API is unavailable', async () => {
    vi.stubGlobal('FontFace', undefined);
    const { target } = fontDocument();
    await expect(module.loadBootstrapIconFont(target)).rejects.toThrow('CSS Font Loading');
    expect(construct).not.toHaveBeenCalled();
  });

  // Eine leere Konfiguration darf keinen sinnlosen Netzwerkzugriff auslösen.
  it('rejects an empty font URL before constructing a FontFace', async () => {
    module.NTE_ICON_CONFIG.bootstrapIconsFontUrl = '   ';
    const { target } = fontDocument();
    await expect(module.loadBootstrapIconFont(target)).rejects.toThrow('bootstrapIconsFontUrl');
    expect(construct).not.toHaveBeenCalled();
  });
});

// Die mit der Live-CDN-Schrift abgeglichenen historischen Namen müssen verwendbar bleiben.
describe('bundled Bootstrap icon mappings', () => {
  it('maps all 43 historical aliases to encoded canonical glyphs', () => {
    const css = glyphStyle;
    const glyphs = new Map(
      [...css.matchAll(/\.bi-([a-z0-9-]+)::before\s*\{\s*content:\s*"([^"]+)"/g)]
        .map((match) => [match[1], match[2]]),
    );
    // ThemeJS2 behält diese Klassen, während die CDN-Schrift ihre alten Codepoints entfernt hat.
    const aliases = {
    'cloud-haze-1': 'cloud-haze',
    'envelope-check-1': 'envelope-check',
    'envelope-dash-1': 'envelope-dash',
    'envelope-exclamation-1': 'envelope-exclamation',
    'envelope-slash-1': 'envelope-slash',
    'envelope-x-1': 'envelope-x',
    'mortorboard-fill': 'mortarboard-fill',
    'mortorboard': 'mortarboard',
    'send-exclamation-1': 'send-exclamation',
    'terminal-dash-1': 'terminal-dash',
    'displayport-1': 'displayport',
    'ssd-fill': 'device-ssd-fill',
    'ssd': 'device-ssd',
    'filetype-ppt-1': 'filetype-ppt',
    'filetype-xls-1': 'filetype-xls',
    '1-circle-1': '1-circle',
    '1-circle-fill-1': '1-circle-fill',
    '2-circle-1': '2-circle',
    '2-circle-fill-1': '2-circle-fill',
    '3-circle-1': '3-circle',
    '3-circle-fill-1': '3-circle-fill',
    '4-circle-1': '4-circle',
    '4-circle-fill-1': '4-circle-fill',
    '5-circle-1': '5-circle',
    '5-circle-fill-1': '5-circle-fill',
    '6-circle-1': '6-circle',
    '6-circle-fill-1': '6-circle-fill',
    '7-circle-1': '7-circle',
    '7-circle-fill-1': '7-circle-fill',
    '8-circle-1': '8-circle',
    '8-circle-fill-1': '8-circle-fill',
    '9-circle-1': '9-circle',
    '9-circle-fill-1': '9-circle-fill',
    'c-circle-1': 'c-circle',
    'c-circle-fill-1': 'c-circle-fill',
    'cc-circle-1': 'cc-circle',
    'cc-circle-fill-1': 'cc-circle-fill',
    'h-circle-1': 'h-circle',
    'h-circle-fill-1': 'h-circle-fill',
    'p-circle-1': 'p-circle',
    'p-circle-fill-1': 'p-circle-fill',
    'r-circle-1': 'r-circle',
    'r-circle-fill-1': 'r-circle-fill',
    };

    expect(glyphs.size).toBe(1996);
    expect(new Set(glyphs.values()).size).toBe(1953);
    for (const [alias, canonical] of Object.entries(aliases)) {
      expect(glyphs.has(canonical), canonical).toBe(true);
      expect(glyphs.get(alias), alias).toBe(glyphs.get(canonical));
    }
    expect(css).not.toContain('@font-face');
    expect(css).not.toContain('url(');
  });
});
