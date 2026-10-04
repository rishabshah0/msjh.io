"use client";

import { useEffect, useRef } from "react";
import type { World } from "@/lib/schedule";

export function Shell({ world, children }: { world: World; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    const previous = { world: root.dataset.world, theme: meta?.content };

    root.dataset.world = world;
    const bg = ref.current && getComputedStyle(ref.current).getPropertyValue("--w-bg").trim();
    if (meta && bg) meta.content = bg;

    return () => {
      if (previous.world) root.dataset.world = previous.world;
      if (meta && previous.theme) meta.content = previous.theme;
    };
  }, [world]);

  return (
    <div
      ref={ref}
      data-world={world}
      className="min-h-dvh bg-world-bg text-world-fg transition-colors duration-700"
    >
      {children}
    </div>
  );
}
