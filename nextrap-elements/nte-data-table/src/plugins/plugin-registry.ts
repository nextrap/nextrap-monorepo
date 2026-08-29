import type { NteDataTableElement, NteDataTableRemote } from '../components/nte-data-table/nte-data-table';

export interface NteDataTablePluginContext {
  readonly host: NteDataTableElement;
  readonly remote: NteDataTableRemote;
  readonly table: HTMLTableElement;
  refresh(): void;
}

export interface NteDataTablePlugin {
  connect(context: NteDataTablePluginContext): void;
  disconnect(): void;
  refresh?(): void;
}

export type NteDataTablePluginFactory = () => NteDataTablePlugin;

export class NteDataTablePluginRegistry {
  private readonly _factories = new Map<string, NteDataTablePluginFactory>();

  public register(name: string, factory: NteDataTablePluginFactory): void {
    const normalizedName = name.trim().toLowerCase();
    if (!normalizedName) throw new TypeError('A data-table plugin name must not be empty.');
    this._factories.set(normalizedName, factory);
  }

  public unregister(name: string): boolean {
    return this._factories.delete(name.trim().toLowerCase());
  }

  public create(name: string): NteDataTablePlugin | null {
    return this._factories.get(name.trim().toLowerCase())?.() ?? null;
  }

  public has(name: string): boolean {
    return this._factories.has(name.trim().toLowerCase());
  }
}

export const nteDataTablePluginRegistry = new NteDataTablePluginRegistry();
