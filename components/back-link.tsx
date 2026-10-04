import Link from "next/link";

export function BackLink({ onClick }: { onClick?: (e: React.MouseEvent) => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border-2 border-current px-4 py-2 text-sm font-semibold transition-colors hover:bg-world-fg hover:text-world-bg"
    >
      <span aria-hidden>←</span> MSJH.io
    </Link>
  );
}
