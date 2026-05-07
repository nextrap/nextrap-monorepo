import { expect } from 'vitest';
import { NtlFormElement } from './ntl-form';

describe('ntl-form', () => {
  it('should create an element', () => {
    const el = new NtlFormElement();
    expect(el).toBeInstanceOf(NtlFormElement);
  });

  it.todo('write some real tests!');
});
