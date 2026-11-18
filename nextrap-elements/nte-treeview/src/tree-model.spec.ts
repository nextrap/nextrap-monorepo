import { describe, expect, it, vi } from 'vitest';

import { TreeModel } from './tree-model';

/** Sichert verschachtelte Änderungen und das Beenden eines TreeModel-Abos ab. */
describe('TreeModel', () => {
  /** Meldet Änderungen in Unterknoten und benachrichtigt nach Abmeldung nicht weiter. */
  it('notifies subscribers about nested mutations until they unsubscribe', () => {
    const model = new TreeModel([
      {
        id: 'root',
        label: 'Root',
        children: [{ id: 'child', label: 'Child' }],
      },
    ]);
    const listener = vi.fn();
    const unsubscribe = model.subscribe(listener);

    model.children[0].children![0].label = 'Updated child';

    expect(listener).toHaveBeenCalledOnce();

    unsubscribe();
    model.children[0].label = 'Updated root';

    expect(listener).toHaveBeenCalledOnce();
  });
});
