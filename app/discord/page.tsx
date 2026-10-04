import type { Metadata } from "next";
import { BackLink } from "@/components/back-link";
import { Shell } from "@/components/shell";
import { SiteFooter } from "@/components/site-footer";
import type { World } from "@/lib/schedule";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Discord",
  description: "Class and school Discord servers for Mission San Jose High.",
};

const servers: { label: string; href: string; world: World }[] = [
  { label: "C/O 28", href: "https://discord.gg/rpSkRX49U5", world: "lime" },
  { label: "C/O 27", href: "https://discord.gg/AmqGjECc7x", world: "sun" },
  { label: "C/O 26", href: "https://discord.gg/T5eC435k9c", world: "blue" },
  { label: "C/O 25", href: "https://discord.gg/McjFgVp2J3", world: "red" },
  { label: "School Server & C/O 23", href: "https://discord.gg/PMXTW2N5yJ", world: "violet" },
];

export default function DiscordPage() {
  return (
    <Shell world="cream">
      <main className="mx-auto w-full max-w-4xl px-4 pb-10 pt-5 sm:px-6 sm:pt-8">
        <BackLink />

        <h1 className="mt-8 font-display text-[clamp(5rem,30vw,13rem)] font-extrabold leading-[0.8] text-world-accent">
          Discord
        </h1>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {servers.map((s, i) => (
            <li key={s.href} data-world={s.world} className={cn(i === servers.length - 1 && "sm:col-span-2")}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-44 items-end justify-between gap-4 rounded-panel bg-world-bg p-6 text-world-fg transition-transform hover:-translate-y-1"
              >
                <span className="font-display text-6xl font-extrabold leading-[0.85] sm:text-7xl">{s.label}</span>
                <span className="text-4xl leading-none transition-transform group-hover:translate-x-1" aria-hidden>
                  ↗
                </span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>

        <SiteFooter>
          Think something should be linked here? Find me on Discord as <strong className="text-world-fg">@pokeshah</strong>.
        </SiteFooter>
      </main>
    </Shell>
  );
}
