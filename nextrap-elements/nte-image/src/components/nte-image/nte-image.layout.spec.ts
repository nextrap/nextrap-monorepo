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
  element.setAttribute('data-features', features);
  element.setAttribute('style', style);
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
