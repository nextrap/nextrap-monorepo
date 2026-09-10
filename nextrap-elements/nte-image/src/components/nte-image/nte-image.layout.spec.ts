import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './nte-image';
import type { NteImage } from './nte-image';

// Isoliert Timer und Größenbeobachtung, ohne die reale Komponente oder Navigation zu ersetzen.
beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal('ResizeObserver', class {
    observe() {}
    disconnect() {}
    unobserve() {}
  });
});

// Entfernt verbundene Komponenten vor dem Zurücksetzen ihrer Timer.
afterEach(() => {
  document.body.replaceChildren();
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

// Erzeugt bewusst unterschiedliche Bildformate und konfiguriert die öffentliche Feature-API.
async function mount(style = '', features = 'slideshow arrows'): Promise<NteImage> {
  const element = document.createElement('nte-image');
  element.setAttribute('style', style);
  element.style.setProperty('--nte-image-features', features);
  for (const [width, height] of [[1200, 600], [400, 900]]) {
    const image = document.createElement('img');
    image.width = width;
    image.height = height;
    image.alt = `${width} × ${height}`;
    element.append(image);
  }
  document.body.append(element);
  await element.updateComplete;
  return element;
}

// Prüft die regressionsgefährdeten Grenzen zwischen Theme-Konfiguration, DOM und Navigation.
describe('nte-image layout and navigation', () => {
  it('does not overwrite stylesheet sizing with inline defaults', async () => {
    const element = await mount('--nte-image-aspect-ratio: 4 / 3;');
    expect(element.style.width).toBe('');
    expect(element.style.height).toBe('');
    expect(element.style.getPropertyValue('--nte-image-aspect-ratio')).toBe('4 / 3');
  });

  it('preserves explicit dimensions after connecting and changing slides', async () => {
    const element = await mount('width: 640px; height: 360px;');
    element.nextSlide();
    await element.updateComplete;
    expect(element.style.width).toBe('640px');
    expect(element.style.height).toBe('360px');
  });

  it('renders working non-submit navigation buttons on touch devices', async () => {
    const element = await mount();
    element.isMobileDevice = true;
    await element.updateComplete;
    const next = element.shadowRoot!.querySelector<HTMLButtonElement>('.next')!;
    const prev = element.shadowRoot!.querySelector<HTMLButtonElement>('.prev')!;
    expect(next.type).toBe('button');
    expect(prev.type).toBe('button');
    expect(next.getAttribute('aria-label')).toBeTruthy();
    expect(prev.getAttribute('aria-label')).toBeTruthy();
    next.click();
    expect(element.getCurrentSlideIndex()).toBe(1);
    prev.click();
    expect(element.getCurrentSlideIndex()).toBe(0);
  });

  it('keeps the selected slide and never injects slideshow styles into the document', async () => {
    const styles = Array.from(document.head.querySelectorAll('style'));
    const element = await mount();
    element.nextSlide();
    element.attachSlideshowStyles();
    expect(element.querySelectorAll('img.active')).toHaveLength(1);
    expect(element.getCurrentSlideIndex()).toBe(1);
    expect(Array.from(document.head.querySelectorAll('style'))).toEqual(styles);
  });

  it('respects the arrows opt-in and fits all image formats', async () => {
    const element = await mount('', 'slideshow');
    expect(element.shadowRoot!.querySelector('.navigation-arrows')).toBeNull();
    element.cropImages();
    for (const image of element.querySelectorAll('img')) {
      expect(image.style.objectFit).toBe('cover');
      expect(image.style.width).toBe('100%');
      expect(image.style.height).toBe('100%');
    }
  });
});

// Sichert die CSS-Kaskade und das Umschalten laufender Features ohne alte Konfigurationsattribute ab.
describe('nte-image CSS configuration', () => {
  it('updates navigation and stops autoplay after an inline style change', async () => {
    const element = await mount('--nte-image-interval: 100ms;');
    await vi.advanceTimersByTimeAsync(150);
    expect(element.getCurrentSlideIndex()).toBe(1);
    element.style.setProperty('--nte-image-features', 'none');
    await Promise.resolve();
    await element.updateComplete;
    expect(element.shadowRoot!.querySelector('.navigation-arrows')).toBeNull();
    expect(element.classList.contains('single-image')).toBe(true);
    const index = element.getCurrentSlideIndex();
    await vi.advanceTimersByTimeAsync(500);
    expect(element.getCurrentSlideIndex()).toBe(index);
  });

  it('reads stylesheet configuration and reacts to class changes', async () => {
    const sheet = document.createElement('style');
    sheet.textContent = '.image-test-gallery { --nte-image-features: slideshow arrows; --nte-image-interval: 2s; } .image-test-static { --nte-image-features: none; }';
    document.body.append(sheet);
    const element = await mount();
    element.style.removeProperty('--nte-image-features');
    element.classList.add('image-test-gallery');
    await Promise.resolve();
    await element.updateComplete;
    expect(element.shadowRoot!.querySelector('.next')).not.toBeNull();
    expect(element.slidesShowConfig.interval).toBe(2000);
    element.classList.replace('image-test-gallery', 'image-test-static');
    await Promise.resolve();
    await element.updateComplete;
    expect(element.shadowRoot!.querySelector('.next')).toBeNull();
  });

  it('refreshes changed stylesheet values and rejects invalid intervals', async () => {
    const sheet = document.createElement('style');
    sheet.textContent = '.image-test-refresh { --nte-image-features: slideshow; --nte-image-interval: 3s; }';
    document.body.append(sheet);
    const element = await mount();
    element.style.removeProperty('--nte-image-features');
    element.classList.add('image-test-refresh');
    element.refreshStyles();
    expect(element.slidesShowConfig.interval).toBe(3000);
    sheet.textContent = '.image-test-refresh { --nte-image-features: slideshow arrows; --nte-image-interval: -2s; }';
    element.refreshStyles();
    await element.updateComplete;
    expect(element.slidesShowConfig.interval).toBe(5000);
    expect(element.shadowRoot!.querySelector('.next')).not.toBeNull();
  });

  it('removes hover pause and fullscreen handlers when the CSS feature selection changes', async () => {
    const element = await mount('', 'slideshow fullsize');
    element.dispatchEvent(new MouseEvent('mouseenter'));
    expect(element.isPaused).toBe(true);
    element.style.setProperty('--nte-image-features', 'slideshow dont-pause-on-hover');
    await Promise.resolve();
    await element.updateComplete;
    element.dispatchEvent(new MouseEvent('mouseenter'));
    expect(element.isPaused).toBe(false);
    expect(element.fullSize).toBe(false);
    expect(element.classList.contains('fullsize')).toBe(false);
  });

  it('ignores legacy attributes and discovers images added after connection', async () => {
    const element = document.createElement('nte-image');
    element.setAttribute('data-features', 'fullsize');
    element.setAttribute('interval', '1');
    document.body.append(element);
    await element.updateComplete;
    expect(element.fullSize).toBe(false);
    element.append(document.createElement('img'), document.createElement('img'));
    await Promise.resolve();
    await element.updateComplete;
    expect(element.slidesShowConfig.enabled).toBe(true);
    expect(element.slidesShowConfig.interval).toBe(5000);
    expect(element.shadowRoot!.querySelector('.next')).not.toBeNull();
  });
});
