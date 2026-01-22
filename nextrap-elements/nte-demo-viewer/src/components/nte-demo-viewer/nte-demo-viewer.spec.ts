import { expect } from 'vitest';
import { NteDemoViewerElement } from './nte-demo-viewer';

describe('nte-demo-viewer', () => {
  it('should create an element', () => {
    const el = new NteDemoViewerElement();
    expect(el).toBeInstanceOf(NteDemoViewerElement);
  });

  it.todo('write some real tests!');
});
