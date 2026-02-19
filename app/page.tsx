"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useEffect } from "react";

const general = [
  { href: "/s",        text: "Countdown Schedule" },
  { href: "/map",      text: "Campus Map" },
  { href: "/school",   text: "School Homepage" },
  { href: "/bell",     text: "Bell Schedule" },
  { href: "/aeries",   text: "Student Aeries" },
  { href: "/dates",    text: "Important Dates" },
  { href: "/warriors", text: "MSJ Instagram" },
];

const activities = [
  { href: "/asb",       text: "ASB Website" },
  { href: "/ac",        text: "Academic Club Discord" },
  { href: "/cs",        text: "CS Club Homepage" },
  { href: "/cs/signup", text: "CS Club Signup",    indent: true },
  { href: "/bio",       text: "Biology Club Discord" },
  { href: "/ai",        text: "AI Club Discord" },
  { href: "/math",      text: "Math Club Discord" },
  { href: "/esports",   text: "E-Sports Club Discord" },
  { href: "/jp",        text: "Japan Club Discord" },
  { href: "/jp/signup", text: "Japan Club Signup", indent: true },
];

export default function Home() {
  const heroInnerRef = useRef<HTMLDivElement>(null);

  // ── Lerp scroll — desktop/mouse only ─────────────────────────────────────
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let current = 0;
    let target  = 0;
    let rafId:  number;
    const ease  = 0.072;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      target += e.deltaY * 0.7;
      target = Math.max(0, Math.min(target, document.body.scrollHeight - window.innerHeight));
    };

    const onScroll = () => {
      // Resync when keyboard / touch moves the page
      if (Math.abs(window.scrollY - current) > 60) {
        current = window.scrollY;
        target  = window.scrollY;
      }
    };

    const loop = () => {
      current += (target - current) * ease;
      if (Math.abs(target - current) < 0.05) current = target;
      window.scrollTo(0, current);
      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener("wheel",  onWheel,  { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("wheel",  onWheel);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // ── Hero parallax — driven by scroll, clamped to [0,1] ───────────────────
  useEffect(() => {
    const hero = heroInnerRef.current;
    if (!hero) return;

    const update = () => {
      // Only active while hero is in view (scrollY < ~62vh)
      const maxScroll = window.innerHeight * 0.62;
      const t = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      hero.style.transform = `translateY(${t * 50}px)`;
      hero.style.opacity   = String(Math.max(0, 1 - t / 0.75));
    };

    update(); // set initial state
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  // ── Scroll reveal — RAF-driven, works perfectly with lerp scroll ──────────
  // Checks every frame whether each element is in the reveal zone.
  // Adds .revealed when in view, removes it when fully above viewport,
  // so every scroll-down pass triggers the animation again.
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal, .reveal-up"));
    let rafId: number;

    const MARGIN = 40; // px from bottom of viewport to trigger reveal

    const check = () => {
      const vh = window.innerHeight;
      els.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const inView = rect.top < vh - MARGIN && rect.bottom > 0;
        const aboveViewport = rect.bottom < 0;

        if (inView && !el.classList.contains("revealed")) {
          el.style.transitionDelay = el.dataset.delay ?? "0s";
          el.classList.add("revealed");
        } else if (aboveViewport && el.classList.contains("revealed")) {
          // Fully scrolled past — reset so it animates again on next scroll-down
          el.style.transitionDelay = "0s";
          el.classList.remove("revealed");
        }
      });
      rafId = requestAnimationFrame(check);
    };

    rafId = requestAnimationFrame(check);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:         #F7F5F0;
          --border:     rgba(0,0,0,0.1);
          --text:       #18180F;
          --muted:      #8A8778;
          --accent:     #2D6A2D;
          --accent-dim: rgba(45,106,45,0.07);
        }

        html { scroll-behavior: auto; }

        body {
          background: var(--bg);
          color: var(--text);
          font-family: var(--font-mono), monospace;
          min-height: 100vh;
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
        }

        body::before {
          content: '';
          position: fixed; inset: 0;
          background-image: radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px);
          background-size: 28px 28px;
          pointer-events: none;
          z-index: 0;
        }

        .page {
          position: relative;
          z-index: 1;
          max-width: 760px;
          margin: 0 auto;
          padding: 0 1.5rem 7rem;
        }

        /* ── HERO ── */
        .hero {
          min-height: 62vh;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding-bottom: 3rem;
          position: relative;
        }

        /* parallax driven by JS — no CSS transition here to keep it crisp */
        .hero-inner {
          will-change: transform, opacity;
        }

        .hero-tag {
          font-size: 0.62rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 1.2rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          animation: heroTagIn 0.6s cubic-bezier(.25,.46,.45,.94) 0.1s both;
        }
        .hero-tag::before {
          content: '';
          display: block;
          width: 24px; height: 1px;
          background: var(--accent);
        }

        .hero-title {
          font-family: var(--font-syne), sans-serif;
          font-size: clamp(3.8rem, 13vw, 8.5rem);
          font-weight: 800;
          line-height: 0.88;
          letter-spacing: -0.03em;
          color: var(--text);
          animation: heroTitleIn 0.7s cubic-bezier(.16,1,.3,1) 0.2s both;
        }
        .hero-title .accent { color: var(--accent); }

        .hero-sub {
          margin-top: 1.8rem;
          display: flex;
          align-items: center;
          gap: 1.2rem;
          animation: heroSubIn 0.6s cubic-bezier(.16,1,.3,1) 0.42s both;
        }

        .logo-circle {
          width: 40px; height: 40px;
          border-radius: 50%;
          overflow: hidden;
          border: 1.5px solid var(--border);
          flex-shrink: 0;
          position: relative;
        }

        .hero-desc {
          font-size: 0.68rem;
          color: var(--muted);
          letter-spacing: 0.04em;
          line-height: 1.85;
        }

        .scroll-hint {
          position: absolute;
          bottom: 1rem; right: 0;
          font-size: 0.58rem;
          letter-spacing: 0.22em;
          color: var(--muted);
          text-transform: uppercase;
          writing-mode: vertical-rl;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .scroll-hint::after {
          content: '';
          display: block;
          width: 1px; height: 40px;
          background: linear-gradient(to bottom, var(--muted), transparent);
          animation: scrollDrop 2s ease-in-out infinite;
        }

        /* ── SECTION HEADING ── */
        .section-heading {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          margin: 3.5rem 0 0;
          padding-bottom: 0.8rem;
          border-bottom: 1px solid var(--border);
        }
        .section-heading-text {
          font-family: var(--font-syne), sans-serif;
          font-size: 0.58rem;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--accent);
          white-space: nowrap;
        }
        .section-heading-line {
          flex: 1; height: 1px;
          background: var(--border);
        }

        /* ── LINK ROWS ── */
        ul { list-style: none; }

        .link-row {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          padding: 0.95rem 0.5rem;
          text-decoration: none;
          color: var(--text);
          border-bottom: 1px solid var(--border);
          transition: padding-left 0.38s cubic-bezier(.16,1,.3,1);
          border-radius: 4px;
          position: relative;
          overflow: hidden;
          min-height: 48px;
        }
        .link-row::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 0;
          background: var(--accent-dim);
          transition: width 0.38s cubic-bezier(.16,1,.3,1);
        }

        @media (hover: hover) {
          .link-row:hover                   { padding-left: 1.1rem; }
          .link-row:hover::before           { width: 100%; }
          .link-row:hover .link-index       { color: var(--accent); }
          .link-row:hover .link-text        { color: var(--accent); }
          .link-row:hover .link-text.indent { color: var(--accent); }
          .link-row:hover .link-arrow       { opacity: 1; transform: translate(0,0); }
        }
        .link-row:active::before { width: 100%; }

        .link-index {
          font-size: 0.56rem;
          color: var(--muted);
          letter-spacing: 0.1em;
          min-width: 1.8rem;
          transition: color 0.2s;
          position: relative;
        }
        .link-text {
          font-family: var(--font-syne), sans-serif;
          font-size: clamp(1rem, 2.6vw, 1.3rem);
          font-weight: 700;
          flex: 1;
          transition: color 0.2s;
          position: relative;
        }
        .link-text.indent {
          font-family: var(--font-mono), monospace;
          font-size: 0.78rem;
          font-weight: 300;
          color: var(--muted);
          padding-left: 1.1rem;
        }
        .link-arrow {
          font-size: 0.85rem;
          color: var(--accent);
          opacity: 1;
          position: relative;
        }
        @media (hover: hover) {
          .link-arrow {
            opacity: 0;
            transform: translate(-8px, 4px);
            transition: opacity 0.2s, transform 0.32s cubic-bezier(.16,1,.3,1);
          }
        }

        /* ── FOOTER ── */
        footer {
          margin-top: 4.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 1.5rem;
        }
        .footer-note {
          font-size: 0.63rem;
          color: var(--muted);
          line-height: 1.9;
          letter-spacing: 0.03em;
        }
        .footer-note strong { color: var(--text); font-weight: 400; }
        .footer-note a      { color: var(--accent); text-decoration: none; }
        .footer-right {
          text-align: right;
          font-size: 0.6rem;
          color: var(--muted);
          line-height: 2;
        }
        .footer-right a {
          color: var(--accent);
          text-decoration: none;
          transition: opacity 0.2s;
        }
        .footer-right a:hover { opacity: 0.6; }

        /* ── SCROLL REVEAL ── */
        /* .reveal slides in from left; .reveal-up slides up */
        /* transition-delay is set/cleared by JS — not hardcoded here */
        .reveal {
          opacity: 0;
          transform: translateX(-24px);
          transition: opacity 0.45s cubic-bezier(.25,.46,.45,.94),
                      transform 0.45s cubic-bezier(.25,.46,.45,.94);
        }
        .reveal.revealed {
          opacity: 1;
          transform: translateX(0);
        }

        .reveal-up {
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 0.45s ease-out, transform 0.45s ease-out;
        }
        .reveal-up.revealed {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── KEYFRAMES ── */
        @keyframes heroTagIn {
          from { opacity: 0; transform: translateX(-16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes heroTitleIn {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroSubIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scrollDrop {
          0%, 100% { opacity: 0.7; transform: scaleY(1);    transform-origin: top; }
          50%       { opacity: 0.2; transform: scaleY(0.35); }
        }

        @media (max-width: 500px) {
          footer { flex-direction: column; }
          .footer-right { text-align: left; }
          .hero { min-height: 55vh; }
          .scroll-hint { display: none; }
        }
      `}</style>

      <div className="page">
        {/* HERO */}
        <div className="hero">
          <div className="hero-inner" ref={heroInnerRef}>
            <p className="hero-tag">Mission San Jose High School</p>

            <h1 className="hero-title">
              MSJ<span className="accent">H</span>
              <br />.io
            </h1>

            <div className="hero-sub">
              <div className="logo-circle">
                <Image unoptimized src="/favicon.ico" alt="MSJH" fill style={{ objectFit: "cover" }} />
              </div>
              <p className="hero-desc">
                Your unofficial campus hub.<br />
                Not affiliated with MSJH.
              </p>
            </div>
          </div>

          <span className="scroll-hint">scroll</span>
        </div>

        {/* GENERAL */}
        <div className="section-heading reveal-up">
          <span className="section-heading-text">General</span>
          <span className="section-heading-line" />
        </div>
        <ul>
          {general.map((link, i) => (
            <li
              key={link.href}
              className="reveal"
              data-delay={`${i * 0.055}s`}
            >
              <Link href={link.href} target="_blank" className="link-row">
                <span className="link-index">{String(i + 1).padStart(2, "0")}</span>
                <span className="link-text">{link.text}</span>
                <span className="link-arrow">↗</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* STUDENT ACTIVITIES */}
        <div className="section-heading reveal-up">
          <span className="section-heading-text">Student Activities</span>
          <span className="section-heading-line" />
        </div>
        <ul>
          {activities.map((link, i) => (
            <li
              key={link.href}
              className="reveal"
              data-delay={`${i * 0.055}s`}
            >
              <Link href={link.href} target="_blank" className="link-row">
                <span className="link-index">{String(i + 1).padStart(2, "0")}</span>
                <span className={`link-text${link.indent ? " indent" : ""}`}>{link.text}</span>
                <span className="link-arrow">↗</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* FOOTER */}
        <footer className="reveal-up">
          <p className="footer-note">
            Have something to add?<br />
            Find me on Instagram as{" "}
            <strong>
              <Link href="https://instagram.com/rishabshah0" target="_blank">@rishabshah0 ↗</Link>
            </strong>
          </p>
          <div className="footer-right">
            <Link href="https://github.com/pokeshah/msjh.io" target="_blank">
              Open source on GitHub ↗
            </Link>
            <br />
            <span>© 2026</span>
          </div>
        </footer>
      </div>
    </>
  );
}