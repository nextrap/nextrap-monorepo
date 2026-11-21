/** Layout-Eingaben bleiben unabhängig von DOM, Datenmodell und Benutzerzustand. */
export interface ColumnWidthInput {
  width?: string | number;
  minWidth?: number;
  maxWidth?: number;
}

/** Löst Pixel, Prozent vom Pixel-Rest und gewichtete Restanteile mit Grenzen auf. */
export function resolveColumnWidths(columns: readonly ColumnWidthInput[], available: number): number[] {
  const specs = columns.map(column => {
    const min = Number.isFinite(column.minWidth) ? Math.max(0, column.minWidth!) : 48;
    const max = Number.isFinite(column.maxWidth) ? Math.max(min, column.maxWidth!) : Infinity;
    const value = String(column.width ?? '1fr').trim();
    const match = /^(\d+(?:\.\d+)?)(px|%|fr)?$/.exec(value);
    const amount = match ? Number(match[1]) : 1;
    const unit = match ? match[2] ?? 'px' : 'fr';
    return { min, max, amount, unit };
  });
  const clamp = (index: number, value: number): number => Math.min(specs[index].max, Math.max(specs[index].min, value));
  const widths = specs.map((spec, index) => spec.unit === 'px' ? clamp(index, spec.amount) : 0);
  const percentageBase = Math.max(0, available - widths.reduce((sum, width) => sum + width, 0));
  specs.forEach((spec, index) => {
    if (spec.unit === '%') widths[index] = clamp(index, percentageBase * spec.amount / 100);
  });
  const flexible = specs.flatMap((spec, index) => spec.unit === 'fr' ? [index] : []);
  const remaining = Math.max(0, available - widths.reduce((sum, width) => sum + width, 0));
  // Ein gemeinsamer Faktor verteilt Restplatz gewichtet; begrenzte Spalten geben Überschüsse frei.
  let low = 0;
  let high = Math.max(1, remaining);
  const total = (factor: number): number => flexible.reduce((sum, index) => sum + clamp(index, specs[index].amount * factor), 0);
  while (total(high) < remaining && high < Number.MAX_SAFE_INTEGER) high *= 2;
  for (let iteration = 0; iteration < 80; iteration++) {
    const middle = (low + high) / 2;
    if (total(middle) < remaining) low = middle;
    else high = middle;
  }
  for (const index of flexible) widths[index] = clamp(index, specs[index].amount * high);
  return widths;
}
