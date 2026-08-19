import type { NteDialog } from '../lib/nte-dialog';

/**
 * Example for a dialog that already exists in the document.
 *
 * <nte-dialog id="settings-dialog">
 *   <h2>Settings</h2>
 *   <p>Settings content</p>
 * </nte-dialog>
 */
export function openSettingsDialog(): void {
  const dialog = document.getElementById('settings-dialog') as NteDialog | null;
  dialog?.showModal();
}

export function closeSettingsDialog(): void {
  const dialog = document.getElementById('settings-dialog') as NteDialog | null;
  void dialog?.close();
}
