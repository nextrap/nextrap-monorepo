import { describe, expect, it } from 'vitest';
import { NteInputTags } from './nte-input-tags';

describe('NteInputTags', () => {
  it('instantiates the component', () => {
    const element = new NteInputTags();
    expect(element).toBeInstanceOf(NteInputTags);
  });

  it('renders pills when value is provided', async () => {
    const element = document.createElement('nte-input-tags') as NteInputTags;
    element.value = 'alpha,beta';
    document.body.appendChild(element);
    await element.updateComplete;

    const pills = element.shadowRoot?.querySelectorAll('.pill');
    expect(pills?.length).toBe(2);

    document.body.removeChild(element);
  });
});
