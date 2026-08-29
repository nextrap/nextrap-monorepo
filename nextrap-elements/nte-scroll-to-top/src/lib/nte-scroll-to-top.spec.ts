import { afterEach, describe, expect, it, vi } from 'vitest';

import './nte-scroll-to-top';

describe('nte-scroll-to-top', () => {
  afterEach(() => {
    document.body.replaceChildren();
    vi.restoreAllMocks();
  });

  it('renders an accessible native button', async () => {
    const element = document.createElement('nte-scroll-to-top');
    element.setAttribute('aria-label', 'Back to top');
    document.body.append(element);
    await element.updateComplete;

    const button = element.shadowRoot?.querySelector('button');
    expect(button?.getAttribute('aria-label')).toBe('Back to top');
    expect(button?.getAttribute('type')).toBe('button');
  });

  it('scrolls to the top with the configured behavior', async () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
    const element = document.createElement('nte-scroll-to-top');
    element.scrollBehavior = 'auto';
    document.body.append(element);
    await element.updateComplete;

    element.shadowRoot?.querySelector('button')?.click();

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' });
  });
});
