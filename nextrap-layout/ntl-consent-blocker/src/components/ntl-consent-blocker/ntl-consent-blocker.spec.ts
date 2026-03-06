import { expect } from 'vitest';
import { NtlConsentBlockerElement } from './ntl-consent-blocker';

describe('ntl-consent-blocker', () => {
  it('should create an element', () => {
    const el = new NtlConsentBlockerElement();
    expect(el).toBeInstanceOf(NtlConsentBlockerElement);
  });

  it('should render default content when consent is not given', async () => {
    const el = new NtlConsentBlockerElement();

    // Trigger initial render
    const update = el.updateComplete;
    el.connectedCallback();
    await update;

    expect(el.shadowRoot?.querySelector('#content')).toBeTruthy();
    expect(el.shadowRoot?.querySelector('#consented-content')).toBeFalsy();
  });

  it('should render consented content when consent is given', async () => {
    const el = new NtlConsentBlockerElement();

    const update = el.updateComplete;
    el.connectedCallback();
    await update;

    // @state is private; in tests we can still toggle via bracket access.
    (el as any).consentGiven = true;
    await el.updateComplete;

    expect(el.shadowRoot?.querySelector('#content')).toBeFalsy();
    expect(el.shadowRoot?.querySelector('#consented-content')).toBeTruthy();
  });
});
