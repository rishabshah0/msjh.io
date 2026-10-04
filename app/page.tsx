import Image from "next/image";
import { LinkRow } from "@/components/link-row";
import { NowCard } from "@/components/now-card";
import { Shell } from "@/components/shell";
import { SiteFooter } from "@/components/site-footer";
import { activities, general, type LinkItem } from "@/lib/links";
import type { World } from "@/lib/schedule";

function Section({ world, title, items }: { world: World; title: string; items: LinkItem[] }) {
  return (
    <section data-world={world} className="rounded-panel bg-world-bg p-5 text-world-fg sm:p-8">
      <h2 className="font-display text-5xl font-extrabold leading-none xl:text-6xl">{title}</h2>
      <ul className="mt-6 border-t-2 border-world-line">
        {items.map((item) => (
          <LinkRow key={item.href} item={item} />
        ))}
      </ul>
    </section>
  );
}

export default function Home() {
  return (
    <Shell world="cream">
      <main className="mx-auto w-full max-w-6xl px-4 pb-10 pt-6 sm:px-6 sm:pt-10">
        <div className="grid gap-6 xl:grid-cols-2 xl:items-stretch">
          <div className="@container">
            <h1 className="-ml-[0.03em] -mt-[0.1em] w-[1.957em] font-display text-[length:min(52.8cqw,14rem)] font-extrabold leading-[0.8] text-world-accent xl:text-[length:52.8cqw]">
              <span className="block">MSJH</span>
              <span className="flex items-baseline justify-between">
                .io
                <span className="relative mr-[0.034em] block size-[0.74em] rounded-full bg-lime">
                  <Image
                    src="/favicon.ico"
                    alt=""
                    width={274}
                    height={274}
                    priority
                    className="absolute inset-[13%] size-[74%]"
                  />
                </span>
              </span>
            </h1>
          </div>

          <NowCard />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Section world="blue" title="General" items={general} />
          <Section world="sun" title="Student Activities" items={activities} />
        </div>

        <SiteFooter>
          Have something to add? Find me on Instagram as{" "}
          <a
            href="https://instagram.com/rishabshah0"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-world-accent underline decoration-world-line underline-offset-4 hover:decoration-current"
          >
            @rishabshah0 ↗
          </a>
        </SiteFooter>
      </main>
    </Shell>
  );
}
