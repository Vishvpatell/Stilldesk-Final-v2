import { useRef } from "react";

/**
 * Finds the inner elements a scroll scene animates (a path, a list of steps...) ONCE per mounted section,
 * and looks them up again if React re-created them. If something expected is missing it returns null, so the scene
 * skips that frame instead of crashing, and (in development only) says what was missing, so a real markup bug is
 * not silently hidden.
 */
type Nodes = Record<string, unknown>;
const live = (v: unknown): boolean => (v instanceof Element ? v.isConnected : Array.isArray(v) ? v.every(live) : true);

export function useSceneNodes<T extends Nodes>(find: (root: HTMLElement) => T | null) {
  const cache = useRef<{ root: HTMLElement; nodes: T } | null>(null);
  const warned = useRef(false);

  return (root: HTMLElement): T | null => {
    const c = cache.current;
    if (c && c.root === root && Object.values(c.nodes).every(live)) return c.nodes;
    const nodes = root.isConnected ? find(root) : null;
    if (!nodes) {
      cache.current = null;
      if (process.env.NODE_ENV !== "production" && root.isConnected && !warned.current) {
        warned.current = true;
        console.warn(`[Stilldesk] A scroll scene (#${root.id || "unnamed"}) could not find an element it animates. The scene is paused: check its markup.`);
      }
      return null;
    }
    cache.current = { root, nodes };
    return nodes;
  };
}
