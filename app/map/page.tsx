import type { Metadata } from "next";
import Image from "next/image";
import { BackLink } from "@/components/back-link";
import { Shell } from "@/components/shell";

export const metadata: Metadata = {
  title: "Campus map",
  description: "Building and room map of Mission San Jose High School.",
};

export default function MapPage() {
  return (
    <Shell world="sun">
      <main className="mx-auto w-full max-w-5xl px-4 pb-16 pt-5 sm:px-6 sm:pt-8">
        <BackLink />

        <header className="mt-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
          <h1 className="font-display text-[clamp(4.5rem,24vw,10rem)] font-extrabold leading-[0.8]">
            Campus
            <br />
            map
          </h1>
          <a
            href="/campus-map.jpg"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-world-fg px-5 py-3 font-semibold text-world-bg transition-transform hover:scale-105"
          >
            Open full size ↗
          </a>
        </header>

        <div className="mt-8 overflow-x-auto rounded-panel bg-white p-3 sm:p-6">
          <Image
            src="/campus-map.jpg"
            alt="Map of the Mission San Jose High School campus with building and room labels."
            width={876}
            height={678}
            priority
            className="h-auto w-[820px] max-w-none sm:w-full"
          />
        </div>
        <p className="mt-3 text-sm font-medium sm:hidden">Swipe sideways to pan the map.</p>
      </main>
    </Shell>
  );
}
