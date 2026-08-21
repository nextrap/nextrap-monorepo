import { NteDialog } from '@nextrap/nte-dialog';
import { html } from 'lit';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NteDialogComponent } from './nte-dialog-component';

class TestDialog extends NteDialogComponent<{ id: string }, string> {
  protected override renderTitle() {
    return 'Edit';
  }

  protected override renderDialog() {
    return html`<p class="body">${this.input.id}</p>`;
  }

  submitValue(value: string) {
    this.submit(value);
  }

  abortDialog() {
    this.abort();
  }
}

customElements.define('nte-test-dialog', TestDialog);

describe('nte-dialog-component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('renders title and body in light DOM and resolves submitted data', async () => {
    const el = document.createElement('nte-test-dialog') as TestDialog;
    document.body.append(el);

    vi.spyOn(NteDialog.prototype, 'showModal').mockImplementation(() => undefined);
    vi.spyOn(NteDialog.prototype, 'close').mockResolvedValue(undefined);

    const open = el.open({ id: '42' });
    await el.updateComplete;

    expect(el.shadowRoot).toBeNull();
    expect(el.querySelector('[slot="title"]')?.textContent).toContain('Edit');
    expect(el.querySelector('.body')?.textContent).toBe('42');

    el.submitValue('saved');
    await expect(open).resolves.toEqual({ submitted: true, data: 'saved' });
  });

  it('resolves aborted without data', async () => {
    const el = document.createElement('nte-test-dialog') as TestDialog;
    document.body.append(el);

    vi.spyOn(NteDialog.prototype, 'showModal').mockImplementation(() => undefined);
    vi.spyOn(NteDialog.prototype, 'close').mockResolvedValue(undefined);

    const open = el.open({ id: '42' });
    await el.updateComplete;

    el.abortDialog();
    await expect(open).resolves.toEqual({ submitted: false });
  });
});
