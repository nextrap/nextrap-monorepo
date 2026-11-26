import type { TreeNode } from './tree-model';

/** Prüft ein Namenssegment ohne reguläre Ausdrücke oder exponentielles Backtracking. */
function matchesSegment(pattern: string, value: string): boolean {
  let p = 0;
  let v = 0;
  let star = -1;
  let retry = 0;
  while (v < value.length) {
    if (pattern[p] === '*') {
      star = p++;
      retry = v;
    } else if (pattern[p] === '?' || pattern[p] === value[v]) {
      p++;
      v++;
    } else if (star !== -1) {
      p = star + 1;
      v = ++retry;
    } else {
      return false;
    }
  }
  while (pattern[p] === '*') p++;
  return p === pattern.length;
}

/** Ein ganzes **-Segment umfasst null oder mehr Verzeichnisebenen. */
function matchesPath(pattern: readonly string[], path: string): boolean {
  const segments = path.split('/');
  let matches = new Array<boolean>(segments.length + 1).fill(false);
  matches[0] = true;
  for (const part of pattern) {
    const next = new Array<boolean>(segments.length + 1).fill(false);
    if (part === '**') {
      next[0] = matches[0];
      for (let i = 1; i <= segments.length; i++) {
        next[i] = matches[i] || next[i - 1];
      }
    } else {
      for (let i = 1; i <= segments.length; i++) {
        next[i] = matches[i - 1] && matchesSegment(part, segments[i - 1]);
      }
    }
    matches = next;
  }
  return matches[segments.length];
}

/** Bereitet die ODER-Liste einmal pro Renderdurchlauf vor; leere Filter zeigen alles. */
export function compileGlobFilter(
  patterns: readonly string[],
): ((node: TreeNode, path: string) => boolean) | undefined {
  const matchers = patterns.filter((pattern) => pattern !== '').map((pattern) => {
    if (!pattern.includes('/')) return (node: TreeNode) => matchesSegment(pattern, node.label);
    const parts = pattern.split('/');
    return (_node: TreeNode, path: string) => matchesPath(parts, path);
  });
  if (!matchers.length) return undefined;
  return (node, path) => matchers.some((matches) => matches(node, path));
}
