import { afterEach, expect } from 'vitest';
import { NteConsentBlockerElement } from './nte-consent-blocker';

// Räumt den gemeinsamen Dokumentzustand auf, damit Template-Selektoren keine Folgetests beeinflussen.
afterEach(() => {
  document.body.replaceChildren();
});

describe('nte-consent-blocker', () => {
  it('should create an element', () => {
    const el = new NteConsentBlockerElement();
    expect(el).toBeInstanceOf(NteConsentBlockerElement);
  });

  // Übernimmt ein externes Template als wiederverwendbare Kopie ohne dessen ID zu duplizieren.
  it('copies a default template referenced by CSS selector', async () => {
    const source = document.createElement('template');
    source.id = 'map-template';
    source.innerHTML = '<iframe title="Map" src="https://example.com/map"></iframe>';
    document.body.appendChild(source);

    const element = new NteConsentBlockerElement();
    element.style.setProperty('--default-template-selector', '#map-template');
    document.body.appendChild(element);
    await element.updateComplete;

    const copiedTemplate = element.querySelector<HTMLTemplateElement>(':scope > template');
    expect(copiedTemplate).not.toBe(source);
    expect(copiedTemplate?.id).toBe('');
    expect(copiedTemplate?.content.querySelector('iframe')?.getAttribute('src')).toBe('https://example.com/map');
    expect(source.isConnected).toBe(true);
  });

  // Behält ein direkt angegebenes Template als höchste Priorität gegenüber dem CSS-Default.
  it('keeps a direct template instead of copying the default template', async () => {
    const source = document.createElement('template');
    source.id = 'map-template';
    source.innerHTML = '<p>Default</p>';
    document.body.appendChild(source);

    const element = new NteConsentBlockerElement();
    const directTemplate = document.createElement('template');
    directTemplate.innerHTML = '<p>Direct</p>';
    element.appendChild(directTemplate);
    element.style.setProperty('--default-template-selector', '#map-template');
    document.body.appendChild(element);
    await element.updateComplete;

    expect(element.querySelectorAll(':scope > template')).toHaveLength(1);
    expect(element.querySelector(':scope > template')).toBe(directTemplate);
    expect(directTemplate.content.textContent).toBe('Direct');
  });
});
