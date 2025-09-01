import { expect } from 'vitest';
import { NteMultiselectElement } from './nte-multiselect';

describe('nte-multiselect', () => {
  it('should create an element', () => {
    const el = new NteMultiselectElement();
    expect(el).toBeInstanceOf(NteMultiselectElement);
  });

  it.todo('write some real tests!');
});
