/**
 * Method decorator to bind event listeners automatically on `connectedCallback`
 * and clean them up on `disconnectedCallback`.
 *
 * @param event - Single event or array of events to listen for.
 * @param target - "this" (default) or "document" as event target.
 *
 * Usage:
 *
 * @eventListener("click")
 * onClick(e: Event) { ... }
 *
 * @eventListener(["keydown", "keyup"], document)
 * onKey(e: KeyboardEvent) { ... }
 *
 * @param options - Optional event listener options.
 * @returns A method decorator that sets up event listeners.
 */
export function eventListener(event: string, target: 'this' | Document = 'this', options?: AddEventListenerOptions) {
  return function (proto: any, prop: string, descriptor: PropertyDescriptor) {
    const origConnected = proto.connectedCallback;
    const origDisconnected = proto.disconnectedCallback;

    proto.connectedCallback = function () {
      const targetEl = target === 'this' ? this : target;
      const events = Array.isArray(event) ? event : [event];

      this.__eventListenerRemovers ??= [];

      for (const e of events) {
        // Bind the method to the current instance (so "this" works inside the method)
        const boundFn = this[prop].bind(this);
        targetEl.addEventListener(e, boundFn);
        this.__eventListenerRemovers.push(() => targetEl.removeEventListener(e, boundFn));
      }

      origConnected?.call(this);
    };

    proto.disconnectedCallback = function () {
      this.__eventListenerRemovers?.forEach((fn: () => void) => fn());
      this.__eventListenerRemovers = [];

      origDisconnected?.call(this);
    };
  };
}
