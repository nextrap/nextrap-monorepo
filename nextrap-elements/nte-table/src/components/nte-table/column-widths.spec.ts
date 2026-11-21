import { describe, expect, it } from 'vitest';
import { resolveColumnWidths } from './column-widths';

// Reine Geometrie benötigt weder Browser-Messungen noch Tabellen-DOM.
describe('resolveColumnWidths', () => {
  it('allocates pixels before percentages and weighted remainder', () => {
    expect(resolveColumnWidths([{ width: '100px' }, { width: '20%' }, { width: '1fr' }, { width: '2fr' }], 1000))
      .toEqual([100, 180, 240, 480]);
  });
  it('defaults to equal fractional widths and recalculates for a new viewport', () => {
    expect(resolveColumnWidths([{}, {}], 400)).toEqual([200, 200]);
    expect(resolveColumnWidths([{}, {}], 600)).toEqual([300, 300]);
  });
  it('redistributes excess after a fractional maximum is reached', () => {
    expect(resolveColumnWidths([{ maxWidth: 100 }, {}], 500)).toEqual([100, 400]);
  });
  it('redistributes around simultaneous minimum and maximum constraints', () => {
    expect(resolveColumnWidths([{ minWidth: 80 }, { minWidth: 0, maxWidth: 10 }], 100)).toEqual([90, 10]);
  });
  it('allows minimum-width overflow and leaves space after all maxima', () => {
    expect(resolveColumnWidths([{ minWidth: 200 }, { minWidth: 200 }], 100)).toEqual([200, 200]);
    expect(resolveColumnWidths([{ maxWidth: 100 }, { maxWidth: 100 }], 500)).toEqual([100, 100]);
  });
  it('clamps pixels before resolving percentages and retains percentage overflow', () => {
    expect(resolveColumnWidths([{ width: 400, maxWidth: 100 }, { width: '50%' }, {}], 500)).toEqual([100, 200, 200]);
    expect(resolveColumnWidths([{ width: '80%' }, { width: '80%' }], 1000)).toEqual([800, 800]);
  });
});
