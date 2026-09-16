import { useEffect, useState } from "react";

import { FLAVOR_TRANSITION_MS } from "./cup-motion";

// requested keeps the last selection during an animation, including rapid arrows.
// active/previous describe the two flavors currently visible on screen.
export function useFlavorTransition(initial: number) {
  const [requested, setRequested] = useState(initial);
  const [scene, setScene] = useState({
    active: initial,
    previous: null as number | null,
    serial: 0,
  });

  useEffect(() => {
    if (scene.previous !== null || requested === scene.active) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setScene((current) => ({
      active: requested,
      previous: reduce ? null : current.active,
      serial: current.serial + 1,
    }));
  }, [requested, scene.active, scene.previous]);

  useEffect(() => {
    if (scene.previous === null) return;
    const finish = () =>
      setScene((current) => ({ ...current, previous: null }));
    const timer = window.setTimeout(finish, FLAVOR_TRANSITION_MS);
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const changed = () => {
      if (media.matches) finish();
    };
    media.addEventListener("change", changed);
    return () => {
      window.clearTimeout(timer);
      media.removeEventListener("change", changed);
    };
  }, [scene.previous, scene.serial]);

  return { ...scene, setActive: setRequested };
}
