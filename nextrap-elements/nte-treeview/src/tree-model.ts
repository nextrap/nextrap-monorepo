import type { TreeItemCurrent } from './components/nte-treeview-item';

/** Beschreibt einen Link, einen Ordner oder einen verlinkten Elternpunkt. */
export interface TreeNode {
  /** Unter Geschwistern eindeutiger, während der Lebensdauer stabiler Schlüssel. */
  readonly id: string;
  label: string;
  href?: string;
  target?: string;
  rel?: string;
  current?: TreeItemCurrent;
  /** Steuert ausschließlich den Unterbaum unabhängig vom Link. */
  expanded?: boolean;
  /** Reaktive Zusatzwerte für die optionalen Center-/End-Renderer. */
  meta?: Record<string, string | number | boolean | null>;
  children?: TreeNode[];
}

/** Verwendung und Änderungsvertrag: siehe ../examples/README.md.
 * Teilt einen beobachtbaren Baum zwischen Anwendung und TreeView. */
export class TreeModel {
  public readonly children: TreeNode[];
  private readonly _listeners = new Set<() => void>();
  private readonly _proxies = new WeakMap<object, object>();

  /** Übernimmt eine Kopie; spätere Änderungen erfolgen an tree.children. */
  constructor(children: TreeNode[] = []) {
    this.children = this._observe(this._copyNodes(children));
  }

  /** Meldet Änderungen synchron; Lit fasst daraus resultierende Renderzyklen zusammen. */
  public subscribe(listener: () => void): () => void {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }

  /** Kopiert ausschließlich die öffentlichen Daten ohne fremde Objektprototypen. */
  private _copyNodes(nodes: TreeNode[]): TreeNode[] {
    return nodes.map((node) => ({
      ...node,
      ...(node.meta ? { meta: { ...node.meta } } : {}),
      ...(node.children ? { children: this._copyNodes(node.children) } : {}),
    }));
  }

  /** Beobachtet auch nachträglich eingefügte Unterordner und Array-Operationen. */
  private _observe<T extends object>(value: T): T {
    const cached = this._proxies.get(value);
    if (cached) return cached as T;

    const proxy = new Proxy(value, {
      get: (target, key) => {
        const result = Reflect.get(target, key);
        return result !== null && typeof result === 'object' ? this._observe(result) : result;
      },
      set: (target, key, next) => {
        const previous = Reflect.get(target, key);
        const written = Reflect.set(target, key, next);
        if (written && !Object.is(previous, next)) this._notify();
        return written;
      },
      deleteProperty: (target, key) => {
        const existed = Reflect.has(target, key);
        const deleted = Reflect.deleteProperty(target, key);
        if (deleted && existed) this._notify();
        return deleted;
      },
    });
    this._proxies.set(value, proxy);
    this._proxies.set(proxy, proxy);
    return proxy;
  }

  /** Informiert nur noch angebundene Ansichten über die geänderten Daten. */
  private _notify(): void {
    this._listeners.forEach((listener) => listener());
  }
}
