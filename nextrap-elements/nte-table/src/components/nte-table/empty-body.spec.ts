import { afterEach, expect, it } from 'vitest';
import { NteTableElement } from './nte-table';

// Entfernt Tabellen samt Observern nach jedem Test.
afterEach(() => document.body.replaceChildren());

// Wartet auf den geplanten Geometrie- und Leerzustandsabgleich.
const layout = async (element: NteTableElement): Promise<void> => {
  await element.updateComplete;
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
};

// Nur Body-Zeilen zählen; Kopf und Footer bleiben beim Leerzustand unangetastet.
it('shows empty-body only while tbody has no rows and reacts to native mutations', async () => {
  const element = new NteTableElement();
  element.innerHTML = '<table><thead><tr><th>Name</th></tr></thead><tbody></tbody><tfoot><tr><td>Footer</td></tr></tfoot></table><div slot="empty-body">Keine Einträge</div>';
  document.body.append(element);
  await layout(element);
  const empty = element.renderRoot.querySelector<HTMLElement>('#empty-body')!;
  expect(empty.hidden).toBe(false);
  expect(empty.style.blockSize).toBe(element.height);
  expect(empty.querySelector('slot')?.name).toBe('empty-body');
  const body = element.querySelector('tbody')!;
  body.insertRow().insertCell().textContent = 'Ada';
  await layout(element);
  expect(empty.hidden).toBe(true);
  body.deleteRow(0);
  await layout(element);
  expect(empty.hidden).toBe(false);
  expect(element.querySelector('thead')?.textContent).toBe('Name');
  expect(element.querySelector('tfoot')?.textContent).toBe('Footer');
  element.querySelector('table')!.remove();
  element.refresh();
  // slotchange trennt die Quelltabelle und versteckt den Leerzustand.
  await layout(element);
  expect(empty.hidden).toBe(true);
});
