"use client";

import { useSyncExternalStore } from "react";

let current = Math.floor(Date.now() / 1000);

function subscribe(onChange: () => void) {
  let timer: ReturnType<typeof setTimeout>;

  const tick = () => {
    current = Math.floor(Date.now() / 1000);
    onChange();
    timer = setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
  };

  tick();
  return () => clearTimeout(timer);
}

const getSnapshot = () => current;
const getServerSnapshot = () => null;

export function useNow(): Date | null {
  const seconds = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return seconds === null ? null : new Date(seconds * 1000);
}
