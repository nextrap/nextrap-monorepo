import { expect } from 'vitest';
import { NtlHero } from './ntl-hero';

describe('ntl-hero', () => {
  it('should create an element', () => {
    const el = new NtlHero();
    expect(el).toBeInstanceOf(NtlHero);
  });

  it.todo('write some real tests!');
});
