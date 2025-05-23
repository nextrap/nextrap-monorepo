import { Debouncer } from '@nextrap/framework';

export type Breakpoint = {
  name: string;
  minWidth: number;
}


export const breakpoints: Record<string, Breakpoint> = {
  xs: { name: 'xs', minWidth: 0 },
  sm: { name: 'sm', minWidth: 576 },
  md: { name: 'md', minWidth: 768 },
  lg: { name: 'lg', minWidth: 992 },
  xl: { name: 'xl', minWidth: 1200 },
  xxl: { name: 'xxl', minWidth: 1400 }
}

export let currentBreakpoint: Breakpoint = breakpoints["xs"];

function calculateCurrentBreakpoint() {
  // Walk through the breakpoints and find the first one that matches
  const width = window.innerWidth;
  let curBreakpoint = breakpoints["xs"]; // Default to the smallest breakpoint
  for (const key in breakpoints) {
    const breakpoint = breakpoints[key];
    if (width >= breakpoint.minWidth) {
      curBreakpoint = breakpoint;
    }
  }
  return curBreakpoint;
}


/**
 * Check if the current window size is bigger than the given breakpoint
 *
 * Accepts
 * - a string with the name of the breakpoint (e.g. "xs", "sm", "md", "lg", "xl", "xxl")
 * - a number with the width in pixels (e.g. 768) or "768px"
 * - a Breakpoint object with the name and minWidth properties
 *
 * @param breakpoint
 */
export function isBiggerThanBreakpoint(breakpoint: Breakpoint | string | number) : boolean {
  if (typeof  breakpoint === "string" && breakpoint.endsWith("px")) {
    breakpoint = parseInt(breakpoint.replace("px", ""));
  }
  if (typeof breakpoint === "string") {
    breakpoint = breakpoints[breakpoint];
    if (!breakpoint) {
      throw new Error(`Breakpoint ${breakpoint} not found. Defined breakpoints are: ${Object.keys(breakpoints).join(", ")}`);
    }
  } else if (typeof breakpoint === "number") {
    breakpoint = { name: "c", minWidth: breakpoint } as Breakpoint;
  }
  return window.innerWidth >= breakpoint.minWidth;

}

/**
 * Register the breakpoint change breakpoint-changed event
 */
if ( ! window.__nextrap_current_breakpoint) {
  window.__nextrap_current_breakpoint = calculateCurrentBreakpoint();
  const deboucer = new Debouncer(500);
  window.addEventListener('resize', async () => {
    await deboucer.wait();
    if (currentBreakpoint !== calculateCurrentBreakpoint()) {
      currentBreakpoint = calculateCurrentBreakpoint();
      window.__nextrap_current_breakpoint = currentBreakpoint;
      // Trigger a custom event to notify other parts of the application
      const event = new CustomEvent('breakpoint-changed', {
        detail: { breakpoint: currentBreakpoint }
      });
      console.log("Breakpoint changed", currentBreakpoint);
      window.dispatchEvent(event);
    }
  })
}


declare global {
  interface Window {
    __nextrap_current_breakpoint?: Breakpoint;
  }
}