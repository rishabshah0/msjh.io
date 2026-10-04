"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Countdown } from "@/components/countdown";
import { headline, loadingHeadline, snapshot } from "@/lib/schedule";
import { useEffect, useLayoutEffect } from "react";
import { flood, floodArrived, warmFlood } from "@/lib/flood";
import { useNow } from "@/lib/use-now";

export function NowCard() {
  const now = useNow();
  const h = now ? headline(snapshot(now)) : loadingHeadline;
  const router = useRouter();

  useLayoutEffect(() => floodArrived(), []);
  const ready = now !== null;
  useEffect(() => {
    if (ready) warmFlood();
  }, [ready]);

  const open = (e: React.MouseEvent) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    flood(() => router.push("/s"));
  };

  return (
    <Link
      href="/s"
      onClick={open}
      data-flood="card"
      data-world={h.world}
      className="group flex flex-col rounded-panel bg-world-bg p-6 text-world-fg transition-colors duration-700 sm:p-8"
    >
      <div className="flex items-start justify-between gap-4">
        <h2 data-flood="title" className="font-display text-4xl font-bold leading-none sm:text-5xl">{h.title}</h2>
        <span
          className="relative text-3xl leading-none after:absolute after:inset-x-0 after:-bottom-1.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out group-hover:after:scale-x-100"
          aria-hidden
        >
          →
        </span>
      </div>

      <div className="mt-8 min-h-[6.5rem] flex-1 sm:min-h-[9rem]">
        {h.big ? (
          <Countdown value={h.big} unit={h.unit} size="card" />
        ) : (
          <p className="text-xl text-world-muted">{h.sub}</p>
        )}
      </div>

      {h.big && (
        <div className="mt-8">
          {h.progress !== null && (
            <div data-flood="bar" className="h-4 overflow-hidden rounded-full bg-world-soft" aria-hidden>
              <div
                className="h-full rounded-full bg-world-accent transition-[width] duration-1000 ease-linear"
                style={{ width: `${h.progress * 100}%` }}
              />
            </div>
          )}
          <p data-flood="range" className="mt-3 w-fit text-sm font-medium text-world-muted">{h.sub}</p>
        </div>
      )}
    </Link>
  );
}
