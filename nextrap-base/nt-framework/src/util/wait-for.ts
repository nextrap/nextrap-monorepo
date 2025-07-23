// Function to return promise on a dedicated event

export function waitFor<T>(target: EventTarget, eventName: string, options?: AddEventListenerOptions): Promise<T> {
  return new Promise((resolve, reject) => {
    const handler = (event: Event) => {
      target.removeEventListener(eventName, handler, options);
      resolve(event as T);
    };
    target.addEventListener(eventName, handler, options);
  });
}

export function waitForDomContentLoaded(): Promise<void> {
  if (document.readyState === 'loading') {
    return new Promise((resolve) => {
      document.addEventListener('DOMContentLoaded', () => resolve());
    });
  }
  return Promise.resolve();
}

export function waitForLoad(): Promise<void> {
  if (document.readyState === 'complete') {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    window.addEventListener('load', () => resolve());
  });
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function waitForAnimationEnd(element: HTMLElement): Promise<AnimationEvent> {
  return new Promise((resolve) => {
    const handler = (event: AnimationEvent) => {
      element.removeEventListener('animationend', handler);
      resolve(event);
    };
    element.addEventListener('animationend', handler);
  });
}
