"use client";

const DURATION = 575;
const EASING = "cubic-bezier(0.16, 1, 0.3, 1)";
const REVEAL = 350;
const HOLD = 64;

type VT = { ready: Promise<void>; finished: Promise<void> };
type Rect = { top: number; right: number; bottom: number; left: number };

let arrived: (() => void) | null = null;
let direction: "in" | "back" | null = null;
let revealed: HTMLElement[] = [];
let revealedRects: Rect[] = [];

function ease(t: number) {
  const [x1, y1, x2, y2] = [0.16, 1, 0.3, 1];
  const bez = (s: number, a: number, b: number) => 3 * a * s * (1 - s) ** 2 + 3 * b * s ** 2 * (1 - s) + s ** 3;
  let lo = 0, hi = 1;
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2;
    if (bez(mid, x1, x2) < t) lo = mid;
    else hi = mid;
  }
  return bez((lo + hi) / 2, y1, y2);
}

function timeFor(p: number) {
  if (p <= 0) return 0;
  for (let i = 1; i <= 200; i++) if (ease(i / 200) >= p) return i / 200;
  return 1;
}

function waitThen(wait: number, run: number, dir: "in" | "out"): Keyframe[] {
  const at = wait / (wait + run || 1);
  const hidden = { opacity: 0, transform: dir === "in" ? "translateY(14px)" : "translateY(8px)" };
  const shown = { opacity: 1, transform: "none" };
  const [from, to] = dir === "in" ? [hidden, shown] : [shown, hidden];
  return [
    { ...from, offset: 0 },
    { ...from, offset: at, easing: dir === "in" ? "cubic-bezier(0.2, 0.8, 0.2, 1)" : "ease-out" },
    { ...to, offset: 1 },
  ];
}

function compositeTravel(withHold = true) {
  const root = document.documentElement;
  for (const anim of document.getAnimations()) {
    const pseudo = (anim.effect as KeyframeEffect | null)?.pseudoElement ?? "";
    if (!pseudo.startsWith("::view-transition-group(flood-")) continue;
    const effect = anim.effect as KeyframeEffect;
    const frames = effect.getKeyframes();
    const first = frames[0];
    const last = frames[frames.length - 1];
    if (!first?.width || !last?.width) continue;
    const sx = parseFloat(String(first.width)) / parseFloat(String(last.width)) || 1;
    const sy = parseFloat(String(first.height)) / parseFloat(String(last.height)) || 1;
    const timing = effect.getComputedTiming();
    const easing = (first.easing as string) || "linear";
    anim.cancel();
    const path: Keyframe[] = [
      { transform: `${first.transform} scale(${sx}, ${sy})`, transformOrigin: "0 0", easing },
      { transform: String(last.transform), transformOrigin: "0 0" },
    ];
    const travel = withHold ? held(path, Number(timing.duration)) : { frames: path, duration: Number(timing.duration) };
    root.animate(travel.frames, { duration: travel.duration, fill: "both", pseudoElement: pseudo });
  }
}

function held(frames: Keyframe[], duration: number, easing = "linear") {
  const total = duration + HOLD;
  const h = HOLD / total;
  const first = { ...frames[0] };
  delete first.offset;
  const moved = frames.map((f, i) => ({
    ...f,
    offset: h + (1 - h) * (f.offset ?? i / (frames.length - 1)),
    ...(i === 0 ? { easing: f.easing ?? easing } : {}),
  }));
  return { frames: [{ ...first, offset: 0 }, ...moved], duration: total };
}

function cardRect(): (Rect & { radius: string }) | null {
  const card = document.querySelector<HTMLElement>('[data-flood="card"]');
  if (!card) return null;
  const r = card.getBoundingClientRect();
  return { top: r.top, right: r.right, bottom: r.bottom, left: r.left, radius: getComputedStyle(card).borderTopLeftRadius };
}

type Space = { w: number; h: number; dx: number; dy: number };

function snapshotSpace(): Space {
  const root = document.documentElement;
  const group = getComputedStyle(root, "::view-transition-group(root)");
  const space = { w: parseFloat(group.width) || innerWidth, h: parseFloat(group.height) || innerHeight, dx: 0, dy: 0 };
  const title = document.querySelector('[data-flood="title"]');
  const anim = document
    .getAnimations()
    .find((a) => (a.effect as KeyframeEffect | null)?.pseudoElement === "::view-transition-group(flood-title)");
  if (title && anim) {
    const frames = (anim.effect as KeyframeEffect).getKeyframes();
    const end = new DOMMatrix(String(frames[frames.length - 1].transform));
    const r = title.getBoundingClientRect();
    space.dx = end.e - r.left;
    space.dy = end.f - r.top;
  }
  return space;
}

const shift = (r: Rect, s: Space): Rect => ({
  top: r.top + s.dy,
  right: r.right + s.dx,
  bottom: r.bottom + s.dy,
  left: r.left + s.dx,
});

const inset = (r: Rect, radius: string, s: Space) => {
  const b = shift(r, s);
  return `inset(${b.top}px ${s.w - b.right}px ${s.h - b.bottom}px ${b.left}px round ${radius})`;
};
const FULL = "inset(0px 0px 0px 0px round 0px)";

function progressToReach(from: Rect, el: Rect, s: Space) {
  const a = shift(from, s);
  const b = shift(el, s);
  const need = [
    a.top > b.bottom ? 1 - b.bottom / a.top : 0,
    a.bottom < b.top ? (b.top - a.bottom) / (s.h - a.bottom) : 0,
    a.left > b.right ? 1 - b.right / a.left : 0,
    a.right < b.left ? (b.left - a.right) / (s.w - a.right) : 0,
  ];
  return Math.min(1, Math.max(...need));
}

export function flood(navigate: () => void, dir: "in" | "back" = "in") {
  const doc = document as Document & { startViewTransition?: (update: () => Promise<void>) => VT };
  if (!doc.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    navigate();
    return;
  }

  const root = document.documentElement;
  const cls = dir === "in" ? "flood" : "flood-back";
  const from = dir === "in" ? cardRect() : null;

  direction = dir;
  root.classList.add(cls);
  if (dir === "back") nameReveals();
  const transition = doc.startViewTransition(
    () =>
      new Promise<void>((resolve) => {
        arrived = resolve;
        navigate();
        setTimeout(resolve, 3000);
      }),
  );

  transition.ready
    .then(() => {
      const space = snapshotSpace();
      compositeTravel();
      if (dir === "in") {
        if (!from) return;
        const grow = held([{ clipPath: inset(from, from.radius, space) }, { clipPath: FULL }], DURATION, EASING);
        root.animate(grow.frames, { duration: grow.duration, fill: "both", pseudoElement: "::view-transition-new(root)" });
        for (const el of revealed) {
          const at = HOLD + timeFor(progressToReach(from, el.getBoundingClientRect(), space)) * DURATION;
          root.animate(waitThen(at, REVEAL, "in"), {
            duration: at + REVEAL,
            fill: "both",
            pseudoElement: `::view-transition-new(${el.style.viewTransitionName})`,
          });
        }
      } else {
        const card = cardRect();
        if (!card) return;
        const old = "::view-transition-old(root)";
        const shrink = held([{ clipPath: FULL }, { clipPath: inset(card, card.radius, space) }], DURATION, EASING);
        root.animate(shrink.frames, { duration: shrink.duration, fill: "both", pseudoElement: old });
        revealed.forEach((el, i) => {
          const need = progressToReach(card, revealedRects[i], space);
          const end = need === 0 ? 150 : Math.max(75, timeFor(1 - need) * DURATION);
          const duration = Math.min(175, end);
          root.animate(waitThen(HOLD + end - duration, duration, "out"), {
            duration: HOLD + end,
            fill: "both",
            pseudoElement: `::view-transition-old(${el.style.viewTransitionName})`,
          });
        });
        const handOff = held([{ opacity: 1 }, { opacity: 1, offset: 0.75 }, { opacity: 0 }], DURATION);
        root.animate(handOff.frames, { duration: handOff.duration, fill: "both", pseudoElement: old });
      }
    })
    .catch(() => {});

  transition.finished.finally(() => {
    root.classList.remove(cls);
    revealed.forEach((el) => (el.style.viewTransitionName = ""));
    revealed = [];
    revealedRects = [];
    direction = null;
  });
}

function onScreenReveals() {
  return [...document.querySelectorAll<HTMLElement>("[data-flood-reveal]")].filter((el) => {
    const r = el.getBoundingClientRect();
    return r.bottom > 0 && r.top < innerHeight;
  });
}

function nameReveals() {
  revealed = onScreenReveals();
  revealedRects = revealed.map((el) => el.getBoundingClientRect());
  revealed.forEach((el, i) => (el.style.viewTransitionName = `flood-reveal-${i}`));
}

let warmed = false;
const WARM_RUNS = 4;
const WARM_DURATION = 60;
const WARM_GIVE_UP = 15000;

export function warmFlood() {
  if (warmed) return;
  warmed = true;
  const doc = document as Document & {
    startViewTransition?: (update: () => void) => VT & { skipTransition: () => void };
    activeViewTransition?: unknown;
  };
  if (!doc.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const root = document.documentElement;
  const started = performance.now();
  let left = WARM_RUNS;
  let overHoverable = false;
  let current: { skipTransition: () => void } | null = null;
  let stopped = false;

  const hoverableAt = (x: number, y: number) =>
    [...document.querySelectorAll<HTMLElement>("a, button")].some((el) => {
      const r = el.getBoundingClientRect();
      return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    });

  const stop = () => {
    stopped = true;
    current?.skipTransition();
    window.removeEventListener("pointermove", onMove, true);
    window.removeEventListener("pointerdown", onPress, true);
  };

  const onMove = (e: PointerEvent) => {
    const was = overHoverable;
    overHoverable = hoverableAt(e.clientX, e.clientY);
    if (overHoverable) current?.skipTransition();
    else if (was) requestAnimationFrame(run);
  };

  const onPress = (e: PointerEvent) => {
    const warming = current !== null;
    stop();
    if (!warming) return;
    const { clientX: x, clientY: y } = e;
    window.addEventListener(
      "click",
      (click) => {
        if (click.target !== document.documentElement) return;
        requestAnimationFrame(() => document.elementFromPoint(x, y)?.closest<HTMLElement>("a, button")?.click());
      },
      { capture: true, once: true },
    );
  };

  const run = () => {
    if (stopped || current || overHoverable) return;
    if (left <= 0 || performance.now() - started > WARM_GIVE_UP) return stop();
    if (document.hidden || doc.activeViewTransition || direction) return void setTimeout(run, 200);
    const card = cardRect();
    if (!card) return stop();

    root.classList.add("flood-warm");
    const t = doc.startViewTransition!(() => {});
    current = t;
    let completed = false;
    t.ready
      .then(() => {
        const space = snapshotSpace();
        compositeTravel(false);
        const a = root.animate(
          { clipPath: [inset(card, card.radius, space), FULL] },
          { duration: WARM_DURATION, easing: EASING, pseudoElement: "::view-transition-new(root)" },
        );
        a.finished.then(() => (completed = true)).catch(() => {});
      })
      .catch(() => {});
    t.finished.finally(() => {
      root.classList.remove("flood-warm");
      current = null;
      if (completed) left--;
      requestAnimationFrame(run);
    });
  };

  window.addEventListener("pointermove", onMove, true);
  window.addEventListener("pointerdown", onPress, true);
  requestAnimationFrame(() => requestAnimationFrame(run));
}

export function floodArrived() {
  if (!arrived) return;
  if (direction === "in") nameReveals();
  arrived();
  arrived = null;
}
