import { expect } from 'vitest';
import { NteTreeNodeElement } from './nte-tree-node';

describe('nte-tree-node', () => {
  it('should create an element', () => {
    const el = new NteTreeNodeElement();
    expect(el).toBeInstanceOf(NteTreeNodeElement);
  });

  it.todo('write some real tests!');
});
