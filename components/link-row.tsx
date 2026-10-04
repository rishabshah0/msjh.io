import Link from "next/link";
import type { LinkItem } from "@/lib/links";

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

export function LinkRow({ item }: { item: LinkItem }) {
  const { label, href, tag, signup, internal } = item;
  const stretched = "outline-none after:absolute after:inset-0 after:rounded-2xl";

  const body = (
    <>
      <span className="block font-display text-[2.1rem] font-semibold leading-none">{label}</span>
      {tag && <span className="mt-1.5 block text-sm font-medium opacity-75">{tag}</span>}
    </>
  );

  return (
    <li className="border-b-2 border-world-line">
      <div className="group relative -mx-3 flex h-20 items-center gap-3 rounded-2xl px-3 transition-colors hover:bg-world-accent hover:text-world-accent-fg has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-world-fg">
        {internal ? (
          <Link href={href} className={`flex-1 ${stretched}`}>
            {body}
          </Link>
        ) : (
          <a href={href} {...external} className={`flex-1 ${stretched}`}>
            {body}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}

        {signup && (
          <a
            href={signup}
            {...external}
            className="relative z-10 shrink-0 rounded-full bg-world-fg px-4 py-2 text-sm font-semibold text-world-bg transition-transform hover:scale-105"
          >
            Sign up
          </a>
        )}

        <span
          className="w-7 shrink-0 text-right text-2xl leading-none transition-transform group-hover:translate-x-1"
          aria-hidden
        >
          {internal ? "→" : "↗"}
        </span>
      </div>
    </li>
  );
}
