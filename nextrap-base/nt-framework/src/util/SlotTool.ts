/**
 * Working with slots in shadow DOM.
 *
 * Functions:
 * - Reliably check if a slot has content (set empty attribute if not)
 */
export class SlotTool {
  /**
   * Checks recursively if the element is visible.
   *
   * @param el
   */
  public static isVisible(el: Element): boolean {
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') return false;

    if (el instanceof HTMLElement && (el.offsetWidth > 0 || el.offsetHeight > 0)) {
      return true;
    }

    // display: contents oder inline Container → rekursiv prüfen
    if (!el.children) return false;

    // @ts-expect-error: children is not defined on Element, but HTMLElement
    for (const child of el.children) {
      if (this.isVisible(child)) return true;
    }

    return false;
  }

  public static isEmptySlot(slot: HTMLSlotElement): boolean {
    const assignedElements = slot.assignedElements({ flatten: true });
    if (assignedElements.length === 0) {
      return true;
    }

    // Check if all assigned elements are not visible
    return assignedElements.every((el) => !this.isVisible(el));
  }

  public static observeEmptySlots(element: HTMLElement): void {
    // Check if the element has a shadow root
    const shadowRoot = element.shadowRoot;
    if (!shadowRoot) {
      console.warn('Element has no shadow root', element);
      return;
    }
    // Get all slots in the shadow root
    const slots = shadowRoot.querySelectorAll('slot');
    slots.forEach((slot) => {
      // Initial check
      if (this.isEmptySlot(slot as HTMLSlotElement)) {
        slot.setAttribute('empty', '');
      } else {
        slot.removeAttribute('empty');
      }

      // Listen for changes
      slot.onslotchange = () => {
        if (this.isEmptySlot(slot as HTMLSlotElement)) {
          slot.setAttribute('empty', '');
        } else {
          slot.removeAttribute('empty');
        }
      };
    });
  }
}
