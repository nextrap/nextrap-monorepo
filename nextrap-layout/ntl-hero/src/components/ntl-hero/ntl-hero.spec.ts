import { expect } from 'vitest';
import { NtlHeroElement } from './ntl-hero';

describe('ntl-hero', () => {
  it('should create an element', () => {
    const el = new NtlHeroElement();
    expect(el).toBeInstanceOf(NtlHeroElement);
  });

  it.todo('write some real tests!');
});
