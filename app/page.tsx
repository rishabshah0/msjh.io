"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";

const general = [
  { href: "/s", text: "Countdown Schedule" },
  { href: "/map", text: "Campus Map" },
  { href: "/school", text: "School Homepage" },
  { href: "/bell", text: "Bell Schedule" },
  { href: "/aeries", text: "Student Aeries" },
  { href: "/dates", text: "Important Dates" },
  { href: "/warriors", text: "MSJ Instagram" },
];

const activities = [
  { href: "/asb", text: "ASB Website" },
  { href: "/ac", text: "Academic Club Discord" },
  { href: "/cs", text: "CS Club Homepage" },
  { href: "/cs/signup", text: "CS Club Signup", indent: true },
  { href: "/bio", text: "Biology Club Discord" },
  { href: "/ai", text: "AI Club Discord" },
  { href: "/math", text: "Math Club Discord" },
  { href: "/esports", text: "E-Sports Club Discord" },
  { href: "/jp", text: "Japan Club Discord" },
  { href: "/jp/signup", text: "Japan Club Signup", indent: true },
];

function LinkRow({
  href,
  text,
  indent,
  index,
}: {
  href: string;
  text: string;
  indent?: boolean;
  index: number;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.055, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Link href={href} target="_blank" className="link-row">
        <span className="link-index">{String(index + 1).padStart(2, "0")}</span>
        <span className={`link-text ${indent ? "indent" : ""}`}>{text}</span>
        <span className="link-arrow">↗</span>
      </Link>
    </motion.li>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="section-heading"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <span className="section-heading-text">{children}</span>
      <span className="section-heading-line" />
    </motion.div>
  );
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  // Smooth lerp scroll — desktop/mouse only, never touches touch events
  useEffect(() => {
    // Only activate on non-touch devices
    const isTouchDevice = () =>
      window.matchMedia("(pointer: coarse)").matches;

    if (isTouchDevice()) return;

    let current = 0;
    let target = 0;
    let rafId: number;
    let ticking = false;
    const ease = 0.072;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      target += e.deltaY * 0.7;
      target = Math.max(
        0,
        Math.min(target, document.body.scrollHeight - window.innerHeight)
      );
      if (!ticking) {
        ticking = true;
      }
    };

    const loop = () => {
      current += (target - current) * ease;
      if (Math.abs(target - current) < 0.05) current = target;
      window.scrollTo(0, current);
      rafId = requestAnimationFrame(loop);
    };

    // Re-sync if something else scrolls (keyboard, anchor links)
    const onScroll = () => {
      if (Math.abs(window.scrollY - current) > 60) {
        current = window.scrollY;
        target = window.scrollY;
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #F7F5F0;
          --surface: #EDEAE2;
          --border: rgba(0,0,0,0.1);
          --text: #18180F;
          --muted: #8A8778;
          --accent: #2D6A2D;
          --accent-dim: rgba(45,106,45,0.07);
        }

        html { scroll-behavior: auto; }

        body {
          background: var(--bg);
          color: var(--text);
          font-family: 'JetBrains Mono', monospace;
          min-height: 100vh;
          overflow-x: hidden;
          /* native momentum scroll on iOS */
          -webkit-overflow-scrolling: touch;
        }

        /* fine dot texture */
        body::before {
          content: '';
          position: fixed;
          inset: 0;
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

        .hero-tag {
          font-size: 0.62rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 1.2rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .hero-tag::before {
          content: '';
          display: block;
          width: 24px;
          height: 1px;
          background: var(--accent);
        }

        .hero-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(3.8rem, 13vw, 8.5rem);
          font-weight: 800;
          line-height: 0.88;
          letter-spacing: -0.03em;
          color: var(--text);
        }
        .hero-title .accent { color: var(--accent); }

        .hero-sub {
          margin-top: 1.8rem;
          display: flex;
          align-items: center;
          gap: 1.2rem;
        }

        .logo-circle {
          width: 40px;
          height: 40px;
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
          bottom: 1rem;
          right: 0;
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
          width: 1px;
          height: 40px;
          background: linear-gradient(to bottom, var(--muted), transparent);
          animation: scrollDrop 2s ease-in-out infinite;
        }
        @keyframes scrollDrop {
          0%, 100% { opacity: 0.7; transform: scaleY(1); transform-origin: top; }
          50% { opacity: 0.2; transform: scaleY(0.35); }
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
          font-family: 'Syne', sans-serif;
          font-size: 0.58rem;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--accent);
          white-space: nowrap;
        }
        .section-heading-line {
          flex: 1;
          height: 1px;
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
          /* bigger tap targets on mobile */
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
          .link-row:hover { padding-left: 1.1rem; }
          .link-row:hover::before { width: 100%; }
          .link-row:hover .link-index { color: var(--accent); }
          .link-row:hover .link-text { color: var(--accent); }
          .link-row:hover .link-arrow { opacity: 1; transform: translate(0, 0); }
        }

        /* tap highlight on touch */
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
          font-family: 'Syne', sans-serif;
          font-size: clamp(1rem, 2.6vw, 1.3rem);
          font-weight: 700;
          flex: 1;
          transition: color 0.2s;
          position: relative;
        }

        .link-text.indent {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.78rem;
          font-weight: 300;
          color: var(--muted);
          padding-left: 1.1rem;
        }
        @media (hover: hover) {
          .link-row:hover .link-text.indent { color: var(--accent); }
        }

        .link-arrow {
          font-size: 0.85rem;
          color: var(--accent);
          /* always visible on touch, hidden until hover on desktop */
          opacity: 1;
          transform: translate(0, 0);
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
        .footer-note a {
          color: var(--accent);
          text-decoration: none;
        }
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

        @media (max-width: 500px) {
          footer { flex-direction: column; }
          .footer-right { text-align: left; }
          .hero { min-height: 55vh; }
          .scroll-hint { display: none; }
        }
      `}</style>

      <div className="page">
        {/* HERO */}
        <div className="hero" ref={heroRef}>
          <motion.div style={{ y: heroY, opacity: heroOpacity }}>
            <motion.p
              className="hero-tag"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Mission San Jose High School
            </motion.p>

            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              MSJ<span className="accent">H</span>
              <br />.io
            </motion.h1>

            <motion.div
              className="hero-sub"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.42 }}
            >
              <div className="logo-circle">
                <Image unoptimized src="/favicon.ico" alt="MSJH" fill style={{ objectFit: "cover" }} />
              </div>
              <p className="hero-desc">
                Your unofficial campus hub.<br />
                Not affiliated with MSJH.
              </p>
            </motion.div>
          </motion.div>

          <span className="scroll-hint">scroll</span>
        </div>

        {/* GENERAL */}
        <SectionHeading>General</SectionHeading>
        <ul>
          {general.map((link, i) => (
            <LinkRow key={link.href} {...link} index={i} />
          ))}
        </ul>

        {/* STUDENT ACTIVITIES */}
        <SectionHeading>Student Activities</SectionHeading>
        <ul>
          {activities.map((link, i) => (
            <LinkRow key={link.href} {...link} index={i} />
          ))}
        </ul>

        {/* FOOTER */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
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
            <span>© 2025</span>
          </div>
        </motion.footer>
      </div>
    </>
  );
}