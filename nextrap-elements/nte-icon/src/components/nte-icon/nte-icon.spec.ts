// Die öffentliche Web-Component-API wird mit echtem Lit und der veröffentlichten Nextrap-Basis geprüft.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { NteIcon, NteIconLoadState } from './nte-icon';

// Kontrollierte Font-Downloads erlauben Tests von Pending-Zuständen und späteren Quellwechseln.
function deferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((onResolve, onReject) => {
    resolve = onResolve;
    reject = onReject;
  });
  return { promise, resolve, reject };
}

// jsdom besitzt attachInternals, implementiert dessen ARIA-Setter jedoch noch nicht zuverlässig.
interface SemanticDefaults {
  role: string | null;
  ariaLabel: string | null;
  ariaHidden: string | null;
  ariaBusy: string | null;
}

// Ein sichtbarer Zustand muss auch nach dem asynchronen Lit-Render vorliegen.
async function expectState(icon: NteIcon, expected: NteIconLoadState) {
  await vi.waitFor(() => expect(icon.loadingState).toBe(expected));
  await icon.updateComplete;
  await Promise.resolve();
  expect(icon.getAttribute('loading-state')).toBe(expected);
}

// Die Tests betrachten Darstellung, Events und ARIA-Defaults ohne private Komponentenfelder.
describe('nte-icon', () => {
  let target: Document;
  let request: ReturnType<typeof deferred<FontFace>>;
  let font: FontFace;
  let construct: ReturnType<typeof vi.fn>;
  let fetch: ReturnType<typeof vi.fn>;
  let semantics: WeakMap<HTMLElement, SemanticDefaults>;

  // Ein frisches ownerDocument isoliert den öffentlichen dokumentweiten Font-Cache pro Test.
  beforeEach(async () => {
    request = deferred<FontFace>();
    font = { load: vi.fn(() => request.promise) } as unknown as FontFace;
    construct = vi.fn(function () { return font; });
    fetch = vi.fn();
    vi.stubGlobal('FontFace', construct);
    vi.stubGlobal('fetch', fetch);
    vi.spyOn(HTMLImageElement.prototype, 'complete', 'get').mockReturnValue(false);
    semantics = new WeakMap();
    vi.spyOn(HTMLElement.prototype, 'attachInternals').mockImplementation(function (this: HTMLElement) {
      const defaults: SemanticDefaults = { role: null, ariaLabel: null, ariaHidden: null, ariaBusy: null };
      semantics.set(this, defaults);
      return defaults as unknown as ElementInternals;
    });
    target = document.implementation.createHTMLDocument('NTE Icon');
    Object.defineProperty(target, 'fonts', { value: { add: vi.fn() } });
    await import('./nte-icon');
  });

  // Lifecycle-Cleanup läuft noch mit den Test-Browser-APIs, bevor diese zurückgesetzt werden.
  afterEach(() => {
    target.body.replaceChildren();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  // Elemente entstehen über die öffentliche Registry und werden erst nach Konfiguration verbunden.
  function icon(attributes: Record<string, string> = {}) {
    const element = document.createElement('nte-icon');
    for (const [name, value] of Object.entries(attributes)) {
      element.setAttribute(name, value);
    }
    target.body.append(element);
    return element;
  }

  // Die Registrierung und eine leere Instanz verursachen keinen Font- oder Fetch-Request.
  it('does not request a font on import or for an empty element', async () => {
    expect(construct).not.toHaveBeenCalled();
    const element = icon();
    await expectState(element, 'empty');
    expect(construct).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
    expect(element.shadowRoot?.querySelector('[part="icon"], [part="placeholder"]')).toBeNull();
    expect(element.shadowRoot?.querySelector('slot[NO-DEFAULT-SLOT]')).not.toBeNull();
  });

  // Bilder haben Vorrang vor vorhandenen Bootstrap-Klassen und benötigen keine Icon-Schrift.
  it('renders a src image without loading fonts even when an icon class is present', async () => {
    const element = icon({ src: '/brand.svg', class: 'bi bi-house', label: 'Brand' });
    await expectState(element, 'loading');
    const image = element.shadowRoot?.querySelector('img');
    expect(image?.getAttribute('src')).toBe('/brand.svg');
    expect(image?.getAttribute('alt')).toBe('');
    expect(image?.hidden).toBe(true);
    expect(element.shadowRoot?.querySelector('[part="placeholder"]')?.textContent).toBe('…');
    expect(construct).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
  });

  // Mehrere Instanzen warten auf dieselbe Schrift und zeigen vor deren Bereitschaft kein Glyph.
  it('shares one font request and replaces placeholders only after the font is ready', async () => {
    const first = icon({ class: 'bi bi-house', placeholder: '?' });
    const second = icon({ class: 'bi bi-check' });
    const onLoad = vi.fn();
    first.addEventListener('nte-icon-load', onLoad);
    await expectState(first, 'loading');
    await expectState(second, 'loading');
    expect(construct).toHaveBeenCalledTimes(1);
    expect(first.shadowRoot?.querySelector('[part="icon"]')).toBeNull();
    expect(first.shadowRoot?.querySelector('[part="placeholder"]')?.textContent).toBe('?');
    expect(semantics.get(first)?.ariaBusy).toBe('true');

    request.resolve(font);
    await expectState(first, 'loaded');
    await expectState(second, 'loaded');
    expect(first.shadowRoot?.querySelector('[part="placeholder"]')).toBeNull();
    expect(first.shadowRoot?.querySelector('[part="icon"]')?.classList.contains('bi-house')).toBe(true);
    expect(second.shadowRoot?.querySelector('[part="icon"]')?.classList.contains('bi-check')).toBe(true);
    await vi.waitFor(() => expect(onLoad).toHaveBeenCalledTimes(1));
    const event = onLoad.mock.calls[0][0] as CustomEvent;
    expect(event.detail).toEqual({ source: 'font' });
    expect(event.bubbles).toBe(true);
    expect(event.composed).toBe(true);
    expect(semantics.get(first)?.ariaBusy).toBe('false');

    const later = icon({ class: 'bi bi-star' });
    await expectState(later, 'loaded');
    expect(construct).toHaveBeenCalledTimes(1);
  });

  // Ein verspäteter Font-Abschluss darf die mittlerweile ausgewählte Bildquelle nicht ersetzen.
  it('ignores a pending font result after switching to an image', async () => {
    const element = icon({ class: 'bi bi-house' });
    const onLoad = vi.fn();
    element.addEventListener('nte-icon-load', onLoad);
    await expectState(element, 'loading');
    element.src = '/new.svg';
    await element.updateComplete;
    request.resolve(font);
    await Promise.resolve();
    await Promise.resolve();
    await element.updateComplete;

    expect(element.loadingState).toBe('loading');
    expect(element.shadowRoot?.querySelector('[part="icon"]')).toBeNull();
    expect(onLoad).not.toHaveBeenCalled();
    element.shadowRoot?.querySelector('img')?.dispatchEvent(new Event('load'));
    await expectState(element, 'loaded');
    await vi.waitFor(() => expect(onLoad).toHaveBeenCalledTimes(1));
    expect((onLoad.mock.calls[0][0] as CustomEvent).detail).toEqual({ source: 'image' });
  });

  // Getrennte Instanzen senden keine verspäteten Events und nutzen beim Reconnect denselben Font.
  it('suppresses events while disconnected and reuses the font after reconnecting', async () => {
    const element = icon({ class: 'bi bi-house' });
    const onLoad = vi.fn();
    element.addEventListener('nte-icon-load', onLoad);
    await expectState(element, 'loading');
    element.remove();
    request.resolve(font);
    await Promise.resolve();
    await Promise.resolve();
    await element.updateComplete;
    expect(onLoad).not.toHaveBeenCalled();

    target.body.append(element);
    await expectState(element, 'loaded');
    await vi.waitFor(() => expect(onLoad).toHaveBeenCalledTimes(1));
    expect(construct).toHaveBeenCalledTimes(1);
  });

  // Ladefehler bleiben als Placeholder sichtbar; spätere Instanzen dürfen keinen Retry-Sturm erzeugen.
  it('renders the placeholder and emits one error event when a font fails', async () => {
    const element = icon({ class: 'bi bi-house', placeholder: '!' });
    const onError = vi.fn();
    element.addEventListener('nte-icon-error', onError);
    await expectState(element, 'loading');
    const failure = new Error('Font download failed');
    request.reject(failure);
    await expectState(element, 'error');
    expect(element.shadowRoot?.querySelector('[part="placeholder"]')?.textContent).toBe('!');
    expect(element.shadowRoot?.querySelector('[part="icon"]')).toBeNull();
    await vi.waitFor(() => expect(onError).toHaveBeenCalledTimes(1));
    expect((onError.mock.calls[0][0] as CustomEvent).detail).toEqual({ source: 'font', error: failure });

    const later = icon({ class: 'bi bi-star' });
    await expectState(later, 'error');
    expect(construct).toHaveBeenCalledTimes(1);
  });

  // Erfolgreiche Bilder ersetzen den Placeholder und melden die tatsächlich verwendete Quelle.
  it('reveals an image after load and emits only one success event', async () => {
    const element = icon({ src: '/icon.svg' });
    const onLoad = vi.fn();
    element.addEventListener('nte-icon-load', onLoad);
    await expectState(element, 'loading');
    const image = element.shadowRoot?.querySelector('img');
    image?.dispatchEvent(new Event('load'));
    await expectState(element, 'loaded');
    expect(image?.hidden).toBe(false);
    expect(element.shadowRoot?.querySelector('[part="placeholder"]')).toBeNull();
    image?.dispatchEvent(new Event('load'));
    await vi.waitFor(() => expect(onLoad).toHaveBeenCalledTimes(1));
    expect((onLoad.mock.calls[0][0] as CustomEvent).detail).toEqual({ source: 'image' });
    expect(construct).not.toHaveBeenCalled();
  });

  // Defekte Bilder bleiben verborgen und können auch ohne sichtbaren Placeholder verwendet werden.
  it('handles image failures without exposing a broken image', async () => {
    const element = icon({ src: '/missing.svg', placeholder: '' });
    const onError = vi.fn();
    element.addEventListener('nte-icon-error', onError);
    await expectState(element, 'loading');
    const image = element.shadowRoot?.querySelector('img');
    image?.dispatchEvent(new Event('error'));
    await expectState(element, 'error');
    expect(image?.hidden).toBe(true);
    expect(element.shadowRoot?.querySelector('[part="placeholder"]')).toBeNull();
    await vi.waitFor(() => expect(onError).toHaveBeenCalledTimes(1));
    const detail = (onError.mock.calls[0][0] as CustomEvent).detail;
    expect(detail.source).toBe('image');
    expect(detail.error).toBeInstanceOf(Error);
    expect(detail.error.message).toContain('/missing.svg');
    expect(construct).not.toHaveBeenCalled();
  });

  // Bereits eingeplante native Events eines ersetzten Bildes gehören weiterhin zur alten Quelle.
  it('ignores stale image events after changing src', async () => {
    const element = icon({ src: '/first.svg' });
    const onLoad = vi.fn();
    const onError = vi.fn();
    element.addEventListener('nte-icon-load', onLoad);
    element.addEventListener('nte-icon-error', onError);
    await expectState(element, 'loading');
    const oldImage = element.shadowRoot?.querySelector('img');

    element.src = '/second.svg';
    await element.updateComplete;
    const newImage = element.shadowRoot?.querySelector('img');
    expect(newImage).not.toBe(oldImage);
    oldImage?.dispatchEvent(new Event('load'));
    oldImage?.dispatchEvent(new Event('error'));
    await element.updateComplete;
    expect(element.loadingState).toBe('loading');
    expect(onLoad).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();

    newImage?.dispatchEvent(new Event('load'));
    await expectState(element, 'loaded');
    await vi.waitFor(() => expect(onLoad).toHaveBeenCalledTimes(1));
    expect(onError).not.toHaveBeenCalled();
    expect(newImage?.getAttribute('src')).toBe('/second.svg');
  });

  // Entfernte HTML-Attribute wechseln sauber zur verbleibenden Quelle oder zur leeren Instanz.
  it('handles removed string attributes without retaining a stale source', async () => {
    const element = icon({
      src: '/first.svg', class: 'bi bi-house', label: 'Startseite', height: '2em', placeholder: '?',
    });
    await expectState(element, 'loading');
    element.removeAttribute('src');
    await element.updateComplete;
    await expectState(element, 'loading');
    expect(element.shadowRoot?.querySelector('img')).toBeNull();
    expect(construct).toHaveBeenCalledTimes(1);

    for (const name of ['class', 'label', 'height', 'placeholder']) {
      element.removeAttribute(name);
    }
    await expectState(element, 'empty');
    request.resolve(font);
    await Promise.resolve();
    await Promise.resolve();
    await element.updateComplete;
    expect(element.shadowRoot?.querySelector('[part="icon"], [part="image"], [part="placeholder"]')).toBeNull();
    expect(semantics.get(element)?.ariaHidden).toBe('true');
  });

  // Änderungen gewöhnlicher Klassen dürfen ein bereits geladenes Icon nicht neu laden.
  it('updates the icon class while preserving the shared font and ignoring unrelated classes', async () => {
    const element = icon({ class: 'bi bi-house' });
    await expectState(element, 'loading');
    request.resolve(font);
    await expectState(element, 'loaded');
    element.setAttribute('class', 'bi bi-star text-primary');
    await element.updateComplete;
    await expectState(element, 'loaded');
    expect(element.shadowRoot?.querySelector('[part="icon"]')?.classList.contains('bi-star')).toBe(true);
    expect(element.classList.contains('style-default')).toBe(true);
    expect(construct).toHaveBeenCalledTimes(1);
  });

  // Dekorative Icons bleiben unsichtbar für Assistive Technology, beschriftete tragen eine Bild-Semantik.
  it('uses decorative defaults and reacts to an accessible label', async () => {
    const element = icon();
    await element.updateComplete;
    expect(semantics.get(element)).toMatchObject({ role: 'img', ariaHidden: 'true', ariaLabel: null });
    element.label = 'Favorit';
    await element.updateComplete;
    expect(semantics.get(element)).toMatchObject({ role: 'img', ariaHidden: 'false', ariaLabel: 'Favorit' });
    element.label = '';
    await element.updateComplete;
    expect(semantics.get(element)?.ariaHidden).toBe('true');
  });

  // Autorenseitige ARIA-Attribute bleiben erhalten und aktivieren die zugängliche Icon-Semantik.
  it('respects explicit author labels and does not overwrite aria-hidden', async () => {
    const element = icon({ 'aria-label': 'Startseite', 'aria-hidden': 'true' });
    await element.updateComplete;
    expect(semantics.get(element)?.ariaHidden).toBe('false');
    expect(element.getAttribute('aria-label')).toBe('Startseite');
    expect(element.getAttribute('aria-hidden')).toBe('true');
    element.removeAttribute('aria-label');
    element.setAttribute('aria-labelledby', 'navigation-label');
    await element.updateComplete;
    expect(semantics.get(element)?.ariaHidden).toBe('false');
    expect(element.getAttribute('aria-labelledby')).toBe('navigation-label');
  });
});
