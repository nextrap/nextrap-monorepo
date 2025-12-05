import { expect } from 'vitest';
import { NteElementHighlighter } from './nte-element-highlighter';

describe('nte-element-highlighter', () => {
  it('should create an element', () => {
    const el = new NteElementHighlighter();
    expect(el).toBeInstanceOf(NteElementHighlighter);
  });
});
