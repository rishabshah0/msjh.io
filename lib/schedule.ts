export type BlockKind = "period" | "break" | "lunch";
export type World = "cream" | "green" | "blue" | "violet" | "lime" | "sun" | "red" | "night";

export interface Block {
  label: string;
  start: number;
  end: number;
  kind: BlockKind;
}

const at = (h: number, m: number) => (h * 60 + m) * 60;

export const schedule: Block[] = [
  { label: "Period 1", start: at(8, 30),  end: at(9, 23),   kind: "period" },
  { label: "Period 2", start: at(9, 29),  end: at(10, 22),  kind: "period" },
  { label: "Break",    start: at(10, 22), end: at(10, 27),  kind: "break" },
  { label: "Read",     start: at(10, 33), end: at(10, 52),  kind: "break" },
  { label: "Period 3", start: at(10, 52), end: at(11, 45),  kind: "period" },
  { label: "Period 4", start: at(11, 51), end: at(12, 44),  kind: "period" },
  { label: "Lunch",    start: at(12, 44), end: at(13, 19),  kind: "lunch" },
  { label: "Period 5", start: at(13, 25), end: at(14, 18),  kind: "period" },
  { label: "Period 6", start: at(14, 24), end: at(15, 17),  kind: "period" },
];

export const dayStart = schedule[0].start;
export const dayEnd = schedule[schedule.length - 1].end;

export function fmtTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

export function fmtRange(b: Block) {
  return `${fmtTime(b.start)} – ${fmtTime(b.end)}`;
}

export function fmtCountdown(seconds: number) {
  const s = Math.max(0, Math.ceil(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = String(s % 60).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${ss}` : `${m}:${ss}`;
}

export function fmtShort(seconds: number) {
  const m = Math.floor(seconds / 60);
  if (m >= 60) return `${Math.floor(m / 60)}h ${m % 60}m`;
  return m > 0 ? `${m}m` : "<1m";
}

export interface BlockState extends Block {
  index: number;
  state: "done" | "active" | "upcoming";
  progress: number;
  secondsLeft: number;
  secondsUntilStart: number;
}

export interface Snapshot {
  phase: "before" | "active" | "between" | "after";
  dayProgress: number;
  blocks: BlockState[];
  active: BlockState | null;
  next: BlockState | null;
}

export function snapshot(date: Date): Snapshot {
  const now = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();

  const blocks = schedule.map<BlockState>((b, index) => {
    const state = now >= b.end ? "done" : now >= b.start ? "active" : "upcoming";
    return {
      ...b,
      index,
      state,
      progress: state === "active" ? (now - b.start) / (b.end - b.start) : 0,
      secondsLeft: b.end - now,
      secondsUntilStart: b.start - now,
    };
  });

  const active = blocks.find((b) => b.state === "active") ?? null;
  const next = blocks.find((b) => b.state === "upcoming") ?? null;

  const phase: Snapshot["phase"] =
    now >= dayEnd ? "after" : now < dayStart ? "before" : active ? "active" : "between";

  return {
    phase,
    dayProgress: Math.min(1, Math.max(0, (now - dayStart) / (dayEnd - dayStart))),
    blocks,
    active,
    next,
  };
}

export interface Headline {
  world: World;
  title: string;
  big: string;
  unit: string;
  sub: string;
  progress: number | null;
}

const worldFor: Record<BlockKind, World> = { period: "green", break: "lime", lunch: "violet" };

export const loadingHeadline: Headline = {
  world: "night",
  title: "Schedule",
  big: "--:--",
  unit: "",
  sub: "",
  progress: null,
};

export function headline(s: Snapshot): Headline {
  switch (s.phase) {
    case "active": {
      const b = s.active!;
      return {
        world: worldFor[b.kind],
        title: b.label,
        big: fmtCountdown(b.secondsLeft),
        unit: "left",
        sub: fmtRange(b),
        progress: b.progress,
      };
    }
    case "between": {
      const b = s.next!;
      return {
        world: "red",
        title: `Next: ${b.label}`,
        big: fmtCountdown(b.secondsUntilStart),
        unit: "to go",
        sub: fmtRange(b),
        progress: null,
      };
    }
    case "before": {
      const b = s.next!;
      return {
        world: "night",
        title: b.label,
        big: fmtCountdown(b.secondsUntilStart),
        unit: "until the bell",
        sub: `School starts at ${fmtTime(dayStart)}`,
        progress: null,
      };
    }
    case "after":
      return {
        world: "night",
        title: "School’s out",
        big: "",
        unit: "",
        sub: `Back at ${fmtTime(dayStart)} tomorrow`,
        progress: null,
      };
  }
}
