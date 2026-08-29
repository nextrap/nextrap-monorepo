import type { NteTableElement, NteTableRemote } from '../components/nte-table/nte-table';

export interface NteTablePluginContext {
  readonly host: NteTableElement;
  readonly remote: NteTableRemote;
  readonly table: HTMLTableElement;
  refresh(): void;
}

export interface NteTablePlugin {
  connect(context: NteTablePluginContext): void;
  disconnect(): void;
  refresh?(): void;
}

export type NteTablePluginFactory = () => NteTablePlugin;

export class NteTablePluginRegistry {
  private readonly _factories = new Map<string, NteTablePluginFactory>();

  public register(name: string, factory: NteTablePluginFactory): void {
    const normalizedName = name.trim().toLowerCase();
    if (!normalizedName) throw new TypeError('A table plugin name must not be empty.');
    this._factories.set(normalizedName, factory);
  }

  public unregister(name: string): boolean {
    return this._factories.delete(name.trim().toLowerCase());
  }

  public create(name: string): NteTablePlugin | null {
    return this._factories.get(name.trim().toLowerCase())?.() ?? null;
  }

  public has(name: string): boolean {
    return this._factories.has(name.trim().toLowerCase());
  }
}

export const nteTablePluginRegistry = new NteTablePluginRegistry();
