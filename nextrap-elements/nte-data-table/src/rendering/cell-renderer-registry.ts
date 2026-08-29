import type { TableCellContent } from '../definitions/table-definition';

export type NteDataTableCellRenderer = (value: unknown) => TableCellContent;

export class NteDataTableCellRendererRegistry {
  private readonly renderers = new Map<string, NteDataTableCellRenderer>();
  public register(name: string, renderer: NteDataTableCellRenderer): void {
    const key = name.trim().toLowerCase();
    if (!key) throw new TypeError('A cell renderer preset name must not be empty.');
    this.renderers.set(key, renderer);
  }
  public unregister(name: string): boolean { return this.renderers.delete(name.trim().toLowerCase()); }
  public get(name: string): NteDataTableCellRenderer | null { return this.renderers.get(name.trim().toLowerCase()) ?? null; }
  public has(name: string): boolean { return this.renderers.has(name.trim().toLowerCase()); }
}

export const nteDataTableCellRendererRegistry = new NteDataTableCellRendererRegistry();
nteDataTableCellRendererRegistry.register('text', (value) => value == null ? '' : String(value));
nteDataTableCellRendererRegistry.register('number', (value) => typeof value === 'number' ? new Intl.NumberFormat().format(value) : String(value ?? ''));
nteDataTableCellRendererRegistry.register('date', (value) => value == null ? '' : new Intl.DateTimeFormat().format(new Date(value as string | number | Date)));
nteDataTableCellRendererRegistry.register('boolean', (value) => Boolean(value) ? '✓' : '–');
nteDataTableCellRendererRegistry.register('json', (value) => JSON.stringify(value));
