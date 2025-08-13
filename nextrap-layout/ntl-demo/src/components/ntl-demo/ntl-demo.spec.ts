import { expect } from 'vitest';
import { NtlDemoElement } from './ntl-demo';

describe('ntl-demo', () => {
  it('should create an element', () => {
    const el = new NtlDemoElement();
    expect(el).toBeInstanceOf(NtlDemoElement);
  });

  it.todo('write some real tests!');
});
