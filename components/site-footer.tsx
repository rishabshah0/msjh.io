const link = "font-medium text-world-accent underline decoration-world-line underline-offset-4 hover:decoration-current";

export function SiteFooter({ children }: { children: React.ReactNode }) {
  return (
    <footer className="mt-16 flex flex-col gap-2 border-t border-world-line pt-6 text-sm text-world-muted sm:flex-row sm:justify-between">
      <p>{children}</p>
      <p>
        <a href="https://github.com/pokeshah/msjh.io" target="_blank" rel="noopener noreferrer" className={link}>
          Open source on GitHub ↗
        </a>{" "}
        · © 2026 · Unofficial, not endorsed by the school.
      </p>
    </footer>
  );
}
