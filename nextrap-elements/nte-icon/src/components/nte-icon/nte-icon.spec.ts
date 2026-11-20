// Ein Funktionstest deckt die einmalige Font-Registrierung und den Wechsel der Bildquelle ab.
import { afterEach, expect, it, vi } from 'vitest';

// Test-DOM und die in jsdom fehlende Font-API werden nach der Prüfung zurückgesetzt.
afterEach(() => {
  document.body.replaceChildren();
  Reflect.deleteProperty(document, 'fonts');
  vi.unstubAllGlobals();
});

// Zwei Instanzen teilen den Font; src kann gesetzt und wieder entfernt werden.
it('registers one font and switches between host classes and an image', async () => {
  const add = vi.fn();
  const createFont = vi.fn(function () { return {} as FontFace; });
  vi.stubGlobal('FontFace', createFont);
  Object.defineProperty(document, 'fonts', { value: { add }, configurable: true });
  await import('./nte-icon');
  expect(createFont).not.toHaveBeenCalled();

  const first = document.createElement('nte-icon');
  first.className = 'bi bi-house size-lg';
  const second = document.createElement('nte-icon');
  document.body.append(first, second);
  await first.updateComplete;
  expect(createFont).toHaveBeenCalledTimes(1);
  expect(add).toHaveBeenCalledTimes(1);
  expect(first.hasAttribute('size')).toBe(false);

  first.src = '/logo.svg';
  await first.updateComplete;
  expect(first.getAttribute('src')).toBe('/logo.svg');
  expect(first.shadowRoot?.querySelector('img')?.getAttribute('src')).toBe('/logo.svg');

  first.removeAttribute('src');
  first.className = 'bi bi-star size-xl';
  await first.updateComplete;
  expect(first.shadowRoot?.querySelector('img')).toBeNull();
  expect(createFont).toHaveBeenCalledTimes(1);
});
