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

  // Erzeugt die Maps-Vorschau und den Consent-Hinweis direkt in den vorgesehenen Slots, wenn kein Selector gesetzt ist.
  it('adds built-in background and pre-consent content without selectors', async () => {
    const element = new NteConsentBlockerElement();
    document.body.appendChild(element);
    await element.updateComplete;

    const background = element.querySelector<HTMLImageElement>(':scope > img[slot="background"]');
    const consentButton = element.querySelector<HTMLButtonElement>(
      ':scope > button[slot="pre-consent"][data-action="consent"]',
    );
    const consentDescription = element.querySelector<HTMLParagraphElement>(':scope > p[slot="pre-consent"]');

    expect(background?.src).toContain('/google-maps/maps-preview.jpg');
    expect(background?.loading).toBe('lazy');
    expect(consentButton?.textContent).toBe('Daten von Google laden');
    expect(consentDescription?.textContent).toContain('wird der externe Inhalt geladen');
  });

  // Kopiert globale Background- und Consent-Vorlagen in ihre Slots und lässt die Quellen für weitere Instanzen bestehen.
  it('copies background and pre-consent templates referenced by CSS selectors', async () => {
    const backgroundSource = document.createElement('template');
    backgroundSource.id = 'background-template';
    backgroundSource.innerHTML = '<img alt="Custom preview" src="https://example.com/preview.jpg">';
    const consentSource = document.createElement('template');
    consentSource.id = 'pre-consent-template';
    consentSource.innerHTML = '<button data-action="consent">Custom consent</button><p>Custom description</p>';
    document.body.append(backgroundSource, consentSource);

    const element = new NteConsentBlockerElement();
    element.style.setProperty('--default-background-selector', '#background-template');
    element.style.setProperty('--default-pre-consent-selector', '#pre-consent-template');
    document.body.appendChild(element);
    await element.updateComplete;

    expect(element.querySelector(':scope > img[slot="background"]')?.getAttribute('src')).toBe(
      'https://example.com/preview.jpg',
    );
    expect(element.querySelector(':scope > button[slot="pre-consent"]')?.textContent).toBe('Custom consent');
    expect(element.querySelector(':scope > p[slot="pre-consent"]')?.textContent).toBe('Custom description');
    expect(backgroundSource.isConnected).toBe(true);
    expect(consentSource.isConnected).toBe(true);
  });

  // Verhindert, dass globale Defaults bereits direkt am Element gesetzte Slot-Inhalte überschreiben.
  it('keeps direct background and pre-consent content instead of copying selector defaults', async () => {
    const source = document.createElement('template');
    source.id = 'shared-template';
    source.innerHTML = '<p>Shared default</p>';
    document.body.appendChild(source);

    const element = new NteConsentBlockerElement();
    const background = document.createElement('img');
    background.slot = 'background';
    background.alt = 'Direct preview';
    const preConsent = document.createElement('button');
    preConsent.slot = 'pre-consent';
    preConsent.textContent = 'Direct consent';
    element.append(background, preConsent);
    element.style.setProperty('--default-background-selector', '#shared-template');
    element.style.setProperty('--default-pre-consent-selector', '#shared-template');
    document.body.appendChild(element);
    await element.updateComplete;

    expect(element.querySelectorAll(':scope > [slot="background"]')).toHaveLength(1);
    expect(element.querySelector(':scope > [slot="background"]')).toBe(background);
    expect(element.querySelectorAll(':scope > [slot="pre-consent"]')).toHaveLength(1);
    expect(element.querySelector(':scope > [slot="pre-consent"]')).toBe(preConsent);
  });
});
