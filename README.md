# MSJH.io

An unofficial hub for Mission San Jose High School: a live bell-schedule countdown, the campus map,
and links to school pages and clubs.

Built with Next.js (static export), React and Tailwind CSS. Use [bun](https://bun.sh).

```bash
bun install
bun dev          # http://localhost:3000
bun run build    # static site in out/
bun run preview  # serve out/ locally
bun run typecheck
```

## Where things live

- `lib/schedule.ts`: the bell schedule. Update the times here when the schedule changes.
- `lib/links.ts`: the links on the home page.
- `public/_redirects`: short links (`/bell`, `/asb`, ...) served by the host.
- `app/globals.css`: colour tokens and the "world" colourways each page uses.
- `lib/flood.ts`: the home card to schedule page transition.

## Deploying

`bun run build` writes a fully static site to `out/`; deploy that folder. `_redirects` is copied
into it.
