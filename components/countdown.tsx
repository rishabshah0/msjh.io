import { cn } from "@/lib/utils";

const sizes = {
  card: {
    short: "text-[clamp(6rem,27vw,11rem)]",
    long: "text-[clamp(4.25rem,18vw,8rem)]",
  },
  page: {
    short: "text-[clamp(7rem,37vw,17rem)]",
    long: "text-[clamp(5rem,25vw,12rem)]",
  },
} as const;

export function Countdown({
  value,
  unit,
  size,
  className,
}: {
  value: string;
  unit: string;
  size: keyof typeof sizes;
  className?: string;
}) {
  const long = value.length > 5;

  return (
    <p className={cn("flex flex-wrap items-baseline gap-x-3 gap-y-1", className)}>
      <span
        role="timer"
        data-flood="count"
        className={cn(sizes[size][long ? "long" : "short"], "font-display font-bold leading-[0.8] tabular-nums")}
      >
        {value}
      </span>
      {unit && <span data-flood="unit" className="font-display text-3xl font-semibold leading-none text-world-muted">{unit}</span>}
    </p>
  );
}
