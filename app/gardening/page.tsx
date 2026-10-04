import type { Metadata } from "next";
import Image from "next/image";
import { Shell } from "@/components/shell";

const description = "Making Mission a little prettier, one plant at a time";

export const metadata: Metadata = {
  title: "MSJ Guerilla Gardening",
  description,
  openGraph: { title: "MSJ Guerilla Gardening", description, images: ["/rose.png"] },
};

export default function GardeningPage() {
  return (
    <Shell world="lime">
      <main className="mx-auto w-full max-w-3xl px-4 pb-16 pt-10 sm:px-6 sm:pt-16">
        <div className="relative px-2 font-display text-[clamp(4.5rem,23vw,11rem)] font-extrabold leading-[0.8]">
          <h1>
            guerilla
            <br />
            gardening
          </h1>
          <Image
            src="/rose.png"
            alt=""
            width={140}
            height={256}
            priority
            className="absolute right-[0.04em] -top-[0.1em] h-[1.05em] w-auto [image-rendering:pixelated]"
          />
        </div>

        <figure className="mt-10 rounded-panel bg-white p-6 sm:p-8">
          <blockquote className="text-xl leading-snug sm:text-2xl">
            <i>noun</i>. the act of gardening &ndash; raising food, plants, or flowers &ndash; on land that the
            gardeners do not have the legal rights to cultivate
          </blockquote>
          <figcaption className="mt-4 text-right text-sm text-black/60">
            &mdash;{" "}
            <a
              href="https://en.wikipedia.org/wiki/Guerrilla_gardening"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
            >
              Wikipedia
            </a>
          </figcaption>
        </figure>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <section data-world="green" className="rounded-panel bg-world-bg p-6 text-world-fg sm:p-8">
            <h2 className="font-display text-5xl font-extrabold leading-none">who are we?</h2>
            <p className="mt-4 text-lg leading-snug">
              we&rsquo;re a group of Mission students who like plants and think rules are just suggestions.
            </p>
          </section>

          <section data-world="violet" className="rounded-panel bg-world-bg p-6 text-world-fg sm:p-8">
            <h2 className="font-display text-5xl font-extrabold leading-none">how can i join?</h2>
            <p className="mt-4 text-lg leading-snug">
              plant a seed. water a flower. (avoid invasive species though&mdash;do your due diligence!)
            </p>
          </section>
        </div>

        <section
          data-world="sun"
          className="mt-3 flex flex-col items-center gap-6 rounded-panel bg-world-bg p-6 text-world-fg sm:flex-row sm:p-8"
        >
          <Image
            src="/qr-code.png"
            alt="QR code leading to this webpage"
            width={160}
            height={160}
            className="size-40 shrink-0 rounded-2xl bg-white p-2"
          />
          <p className="text-lg leading-snug">
            tell your friends, too. and if you plant something, send us a picture! you can find Adrian on Discord as{" "}
            <strong className="font-bold">drain#5012</strong>.
          </p>
        </section>
      </main>
    </Shell>
  );
}
