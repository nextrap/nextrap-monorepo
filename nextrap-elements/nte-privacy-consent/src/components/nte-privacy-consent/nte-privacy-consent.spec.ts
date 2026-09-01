import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './nte-privacy-consent';
import { NtePrivacyConsent } from './nte-privacy-consent';

const createMemoryStorage = (): Storage => {
  const entries = new Map<string, string>();

  return {
    get length() {
      return entries.size;
    },
    clear: () => entries.clear(),
    getItem: (key: string) => entries.get(key) ?? null,
    key: (index: number) => Array.from(entries.keys())[index] ?? null,
    removeItem: (key: string) => entries.delete(key),
    setItem: (key: string, value: string) => entries.set(key, value),
  } as Storage;
};

describe('nte-privacy-consent', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: createMemoryStorage(),
    });
    window.localStorage.clear();
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: vi.fn(
        (query: string) =>
          ({
            matches: false,
            media: query,
            onchange: null,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            addListener: vi.fn(),
            removeListener: vi.fn(),
            dispatchEvent: vi.fn(),
          }) as MediaQueryList,
      ),
    });

    Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
      configurable: true,
      writable: true,
      value: vi.fn(function (this: HTMLDialogElement) {
        this.setAttribute('open', '');
      }),
    });
    Object.defineProperty(HTMLDialogElement.prototype, 'close', {
      configurable: true,
      writable: true,
      value: vi.fn(function (this: HTMLDialogElement) {
        this.removeAttribute('open');
        this.dispatchEvent(new Event('close'));
      }),
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('stores an accept-all decision and activates blocked resources', async () => {
    const element = document.createElement('nte-privacy-consent') as NtePrivacyConsent;
    element.setAttribute('policy-version', '2026-08');
    element.setAttribute('storage-key', 'privacy-test');
    element.innerHTML = `
      <script
        type="text/plain"
        data-consent-service="analytics"
        data-consent-label="Analytics"
      >window.analyticsLoaded = true;</script>
      <template
        data-consent-service="video"
        data-consent-label="Video"
      ><iframe title="Video"></iframe></template>
    `;

    const ready = new Promise<void>((resolve) =>
      element.addEventListener('consent-ready', () => resolve(), { once: true }),
    );
    document.body.append(element);
    await ready;

    const changed = new Promise<void>((resolve) =>
      element.addEventListener('consent-change', () => resolve(), { once: true }),
    );
    (element.shadowRoot?.querySelector('#accept-all') as HTMLButtonElement).click();
    await changed;

    const decision = JSON.parse(window.localStorage.getItem('privacy-test') ?? '{}');
    expect(decision.services).toEqual({ analytics: true, video: true });
    expect(element.querySelector('script[data-consent-service="analytics"] + script')).not.toBeNull();
    expect(element.querySelector('iframe[title="Video"]')).not.toBeNull();
  });

  it('offers direct rejection only with show-reject-all', async () => {
    const element = document.createElement('nte-privacy-consent') as NtePrivacyConsent;
    element.setAttribute('policy-version', '2026-08');
    element.setAttribute('storage', 'memory');
    element.setAttribute('show-reject-all', '');
    element.innerHTML = `
      <script type="text/plain" data-consent-service="maps" data-consent-label="Maps"></script>
    `;

    const ready = new Promise<void>((resolve) =>
      element.addEventListener('consent-ready', () => resolve(), { once: true }),
    );
    document.body.append(element);
    await ready;

    const reject = Array.from(element.shadowRoot?.querySelectorAll('button') ?? []).find(
      (button) => button.textContent?.trim() === 'Alle ablehnen',
    );
    expect(reject).toBeDefined();

    const changed = new Promise<void>((resolve) =>
      element.addEventListener('consent-change', () => resolve(), { once: true }),
    );
    reject?.click();
    await changed;
    expect(element.getDecision()?.services).toEqual({ maps: false });
  });

  it('restores a matching stored decision without prompting again', async () => {
    window.localStorage.setItem(
      'privacy-existing',
      JSON.stringify({
        schema: 1,
        policyVersion: '2026-08',
        services: { analytics: false },
        decidedAt: '2026-08-28T12:00:00.000Z',
      }),
    );

    const element = document.createElement('nte-privacy-consent') as NtePrivacyConsent;
    element.setAttribute('policy-version', '2026-08');
    element.setAttribute('storage-key', 'privacy-existing');
    element.innerHTML = `
      <script type="text/plain" data-consent-service="analytics" data-consent-label="Analytics"></script>
    `;

    const ready = new Promise<void>((resolve) =>
      element.addEventListener('consent-ready', () => resolve(), { once: true }),
    );
    document.body.append(element);
    await ready;

    expect(element.getDecision()?.services).toEqual({ analytics: false });
    expect(HTMLDialogElement.prototype.showModal).not.toHaveBeenCalled();
  });
});
