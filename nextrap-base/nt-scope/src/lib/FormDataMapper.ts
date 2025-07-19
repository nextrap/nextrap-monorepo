/**
 * FormDataMapper
 *
 * A utility class for serializing and populating form data from DOM trees,
 * including native elements, custom elements, and shadow DOM structures.
 *
 * Supports nested keys like "user.name", "user[0].email", "section[field]" etc.
 */
export class FormDataMapper {
  private root: HTMLElement | HTMLElement[];

  /**
   * @param root One or more root elements to scan for form fields
   * @param scanShadowDOM Whether to include shadow DOM in the search (default: false)
   */
  constructor(
    root: HTMLElement | HTMLElement[],
    private scanShadowDOM = false,
  ) {
    this.root = root;
  }

  /**
   * Collects all elements with a value and name/id attribute, traversing shadow DOM.
   * Builds a nested object representing the form state.
   *
   * @returns Structured data object representing form values
   */
  getData(): Record<string, any> {
    const data: Record<string, any> = {};
    const elements = this.getFormElements();

    elements.forEach((el) => {
      const key = (el.getAttribute('name') || el.id || '').trim();
      if (!key) return;

      const value = (el as any).value;
      if (value === undefined) return;

      this.setValue(data, key, value);
    });

    return data;
  }

  /**
   * Sets values into the form elements using a nested data object.
   * Fields are matched by name or id, and must support a writable `value` property.
   *
   * @param data Object containing values to assign to form fields
   */
  setData(data: Record<string, any>): void {
    const elements = this.getFormElements();

    elements.forEach((el) => {
      const key = (el.getAttribute('name') || el.id || '').trim();
      if (!key) return;

      const value = this.getValue(data, key);
      if (value !== undefined) {
        try {
          (el as any).value = value;
        } catch (_) {
          // Skip read-only or non-assignable value properties
        }
      }
    });
  }

  /**
   * Recursively scans root elements and their children (including shadow roots)
   * for elements that expose a `value` property and have a `name` or `id`.
   *
   * Supports custom elements, shadow DOM, and native inputs.
   *
   * @returns Array of matched HTMLElement instances
   */
  private getFormElements(): HTMLElement[] {
    const result: HTMLElement[] = [];
    const roots = Array.isArray(this.root) ? this.root : [this.root];

    const traverse = (node: Element | ShadowRoot) => {
      if (
        typeof (node as any).value !== 'undefined' &&
        typeof (node as any).value !== 'function' &&
        !(node as HTMLInputElement).disabled &&
        ((node as HTMLElement).getAttribute('name') || (node as HTMLElement).id)
      ) {
        result.push(node as HTMLElement);
      }

      // Recursively traverse shadow root if present
      if (this.scanShadowDOM && (node as Element).shadowRoot instanceof ShadowRoot) {
        traverse((node as Element).shadowRoot!);
      }

      // Traverse child nodes
      node.childNodes.forEach((child) => {
        if (child instanceof Element) traverse(child);
      });
    };

    roots.forEach((r) => traverse(r));
    return result;
  }

  /**
   * Assigns a value into a nested object structure using path notation.
   *
   * Supports dot (`.`) and bracket (`[]`) syntax.
   *
   * @param obj Object to mutate
   * @param path String path like "user[0].email"
   * @param value Value to set
   */
  private setValue(obj: any, path: string, value: any): void {
    const keys = this.parsePath(path);
    let target = obj;

    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!(k in target)) {
        target[k] = typeof keys[i + 1] === 'number' ? [] : {};
      }
      target = target[k];
    }

    target[keys[keys.length - 1]] = value;
  }

  /**
   * Retrieves a value from a nested object structure using path notation.
   *
   * @param obj Source object
   * @param path Path like "section.user[1].name"
   * @returns The resolved value or undefined
   */
  private getValue(obj: any, path: string): any {
    const keys = this.parsePath(path);
    let target = obj;
    for (const k of keys) {
      if (target == null) return undefined;
      target = target[k];
    }
    return target;
  }

  /**
   * Parses a dotted/bracketed path string into an array of keys.
   *
   * Examples:
   *  - "user[0].email" → ['user', 0, 'email']
   *  - "section[name]" → ['section', 'name']
   *
   * @param path The path string to parse
   * @returns Array of keys (string or number)
   */
  private parsePath(path: string): (string | number)[] {
    const parts: (string | number)[] = [];
    path.replace(/\[(\w+)\]|([^.[]+)/g, (_, m1, m2) => {
      const key = m1 || m2;
      parts.push(/^\d+$/.test(key) ? +key : key);
      return '';
    });
    return parts;
  }
}
