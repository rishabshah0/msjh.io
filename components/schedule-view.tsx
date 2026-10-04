"use client";

import { useLayoutEffect } from "react";
import { BackLink } from "@/components/back-link";
import { Countdown } from "@/components/countdown";
import { Shell } from "@/components/shell";
import { fmtRange, fmtShort, headline, loadingHeadline, snapshot, type BlockState } from "@/lib/schedule";
import { useRouter } from "next/navigation";
import { flood, floodArrived } from "@/lib/flood";
import { useNow } from "@/lib/use-now";
import { cn } from "@/lib/utils";

export function ScheduleView() {
  const now = useNow();
  const snap = now ? snapshot(now) : null;
  const h = snap ? headline(snap) : loadingHeadline;

  useLayoutEffect(() => floodArrived(), []);

  const router = useRouter();
  const back = (e: React.MouseEvent) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    flood(() => router.push("/"), "back");
  };

  return (
    <Shell world={h.world}>
      <main className="mx-auto w-full max-w-4xl px-5 pb-16 pt-5 sm:px-8 sm:pt-8">
        <div className="flex items-center justify-between gap-4">
          <div data-flood-reveal className="w-fit">
            <BackLink onClick={back} />
          </div>
          <div data-flood-reveal className="min-h-11 text-right">
            {now && (
              <>
                <p className="text-xl font-semibold leading-none tabular-nums">
                  {now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit" })}
                </p>
                <p className="mt-1 text-sm text-world-muted">
                  {now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                </p>
              </>
            )}
          </div>
        </div>

        <section className="mt-12 sm:mt-20">
          <h1 data-flood="title" className="w-fit font-display text-4xl font-bold leading-none sm:text-6xl">{h.title}</h1>

          <div className="mt-6 min-h-[6rem] sm:min-h-[10rem]">
            {h.big ? (
              <Countdown value={h.big} unit={h.unit} size="page" />
            ) : (
              <p className="text-xl text-world-muted">{h.sub}</p>
            )}
          </div>

          {h.progress !== null && (
            <div data-flood="bar" className="mt-6 h-4 overflow-hidden rounded-full bg-world-soft" aria-hidden>
              <div
                className="h-full rounded-full bg-world-accent transition-[width] duration-1000 ease-linear"
                style={{ width: `${h.progress * 100}%` }}
              />
            </div>
          )}
          {h.big && (
            <p data-flood="range" className="mt-4 w-fit text-base font-medium text-world-muted">
              {h.sub}
            </p>
          )}
        </section>

        {snap && (
          <section className="mt-16 sm:mt-24">
            <h2 data-flood-reveal className="w-fit font-display text-5xl font-extrabold leading-none sm:text-6xl">
              Today
            </h2>
            <ol className="mt-6 grid gap-2" aria-label="Full day">
              {snap.blocks.map((b) => (
                <Block key={b.label} block={b} isNext={snap.phase !== "active" && snap.next?.index === b.index} />
              ))}
            </ol>
          </section>
        )}
      </main>
    </Shell>
  );
}

const colour: Record<BlockState["kind"], string> = {
  period: "bg-cream text-ink",
  break: "bg-lime text-ink",
  lunch: "bg-sun text-ink",
};

function Block({ block, isNext }: { block: BlockState; isNext: boolean }) {
  const active = block.state === "active";
  const minutes = Math.round((block.end - block.start) / 60);

  return (
    <li
      data-flood-reveal
      aria-current={active ? "time" : undefined}
      style={{ minHeight: `${Math.max(4, minutes * 0.14)}rem` }}
      className={cn(
        "rounded-3xl transition-[opacity,background-color] duration-500",
        active ? "bg-ink text-cream" : colour[block.kind],
        block.state === "done" && "opacity-40",
      )}
    >
      <div className="flex items-start justify-between gap-4 p-5">
        <div>
          <p className="font-display text-4xl font-bold leading-none">{block.label}</p>
          <p className="mt-2 text-sm font-medium tabular-nums opacity-75">{fmtRange(block)}</p>
        </div>
        <p className="shrink-0 text-right font-display text-3xl font-semibold leading-none tabular-nums">
          {active ? `${fmtShort(block.secondsLeft)} left` : isNext ? "Next" : `${minutes} min`}
        </p>
      </div>

      {active && (
        <div className="mx-5 mb-5 h-3 overflow-hidden rounded-full bg-cream/20" aria-hidden>
          <div
            className="h-full rounded-full bg-lime transition-[width] duration-1000 ease-linear"
            style={{ width: `${block.progress * 100}%` }}
          />
        </div>
      )}
    </li>
  );
}
