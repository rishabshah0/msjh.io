'use client';

import { useState, useEffect, useRef } from 'react';

interface ScheduleItem {
  label: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  type: 'period' | 'break';
}

const schedule: ScheduleItem[] = [
  { label: "Period 1", startHour: 8,  startMinute: 30, endHour: 9,  endMinute: 22, type: 'period' },
  { label: "Period 2", startHour: 9,  startMinute: 28, endHour: 10, endMinute: 20, type: 'period' },
  { label: "Break",    startHour: 10, startMinute: 20, endHour: 10, endMinute: 25, type: 'break'  },
  { label: "Read",     startHour: 10, startMinute: 31, endHour: 10, endMinute: 50, type: 'break'  },
  { label: "Period 3", startHour: 10, startMinute: 50, endHour: 11, endMinute: 42, type: 'period' },
  { label: "Period 4", startHour: 11, startMinute: 48, endHour: 12, endMinute: 40, type: 'period' },
  { label: "Lunch",    startHour: 12, startMinute: 40, endHour: 13, endMinute: 15, type: 'break'  },
  { label: "Period 5", startHour: 13, startMinute: 21, endHour: 14, endMinute: 13, type: 'period' },
  { label: "Period 6", startHour: 14, startMinute: 19, endHour: 15, endMinute: 11, type: 'period' },
];

function toMin(h: number, m: number) { return h * 60 + m; }
function fmt12(h: number, m: number) {
  const ap = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ap}`;
}
function fmtClock(d: Date) {
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
}
function fmtCountdown(ms: number) {
  if (ms <= 0) return '—';
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${String(sec).padStart(2, '0')}s`;
  return `${sec}s`;
}

export default function ScheduleTimer() {
  const [now, setNow] = useState<Date | null>(null);
  const activeRef = useRef<HTMLDivElement>(null);
  const scrolled  = useRef(false);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (now && !scrolled.current && activeRef.current) {
      scrolled.current = true;
      setTimeout(() => activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
    }
  }, [now]);

  const curMin   = now ? now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60 : -1;
  const dayStart = toMin(schedule[0].startHour, schedule[0].startMinute);
  const dayEnd   = toMin(schedule[schedule.length - 1].endHour, schedule[schedule.length - 1].endMinute);
  const dayPct   = curMin < 0 ? 0 : Math.min(1, Math.max(0, (curMin - dayStart) / (dayEnd - dayStart)));
  const isAllDone   = now !== null && curMin >= dayEnd;
  const isPreSchool = now !== null && curMin < dayStart;

  const items = schedule.map(item => {
    const s = toMin(item.startHour, item.startMinute);
    const e = toMin(item.endHour, item.endMinute);
    const isActive = curMin >= s && curMin < e;
    const isDone   = curMin >= e;
    const pct      = isActive ? (curMin - s) / (e - s) : 0;
    const endMs    = (e - curMin) * 60000;
    const startMs  = (s - curMin) * 60000;
    return { ...item, isActive, isDone, pct, endMs, startMs };
  });

  const activeIdx  = items.findIndex(i => i.isActive);
  const nextIdx    = items.findIndex(i => !i.isDone && !i.isActive);
  const activeItem = activeIdx >= 0 ? items[activeIdx] : null;
  const nextItem   = nextIdx   >= 0 ? items[nextIdx]   : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;500;600;700;800&family=Barlow:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html, body {
          background: #F4F6F2;
          color: #18181A;
          font-family: 'Barlow', sans-serif;
          min-height: 100vh;
          -webkit-overflow-scrolling: touch;
        }

        :root {
          --green:      #2D6A2D;
          --green-bg:   #EEF5EE;
          --green-mid:  #A8CDA8;
          --green-lite: #C6DEC6;
          --green-text: #4A8C4A;
          --sage:       #7DAD7D;
          --ink:        #18181A;
          --muted:      #5A6B5A;
          --faint:      #8FA98F;
          --border:     #D5E2D5;
          --bg:         #F4F6F2;
          --surface:    #FFFFFF;
        }

        .page {
          max-width: 860px;
          margin: 0 auto;
          padding-bottom: 5rem;
        }

        /* ── HEADER ── */
        .header {
          padding: 1.5rem 1.5rem 1rem;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          border-bottom: 1.5px solid var(--border);
        }

        .header-school {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--faint);
        }
        .header-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(2rem, 6vw, 3.2rem);
          font-weight: 700;
          line-height: 1;
          letter-spacing: -0.01em;
          margin-top: 0.15rem;
          color: var(--ink);
        }

        .header-right { text-align: right; flex-shrink: 0; }
        .header-clock {
          font-variant-numeric: tabular-nums;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(1.2rem, 3.5vw, 1.8rem);
          font-weight: 300;
          letter-spacing: 0.01em;
          color: var(--ink);
          line-height: 1;
        }
        .header-date {
          font-size: 0.6rem;
          color: var(--faint);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-top: 0.25rem;
        }

        /* ── DAY PROGRESS ── */
        .day-bar-wrap {
          padding: 0.6rem 1.5rem 0.5rem;
          border-bottom: 1.5px solid var(--border);
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .day-bar-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 0.62rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--faint);
          white-space: nowrap;
        }
        .day-bar-track {
          flex: 1;
          height: 4px;
          background: var(--border);
          border-radius: 4px;
          overflow: hidden;
        }
        .day-bar-fill {
          height: 100%;
          background: var(--green);
          border-radius: 4px;
          transition: width 1s linear;
        }
        .day-bar-pct {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 0.62rem;
          font-weight: 600;
          color: var(--green);
          letter-spacing: 0.05em;
          white-space: nowrap;
        }

        /* ── HERO ── */
        .hero {
          margin: 1rem 1.5rem;
          border-radius: 14px;
          overflow: hidden;
        }

        /* Active period hero */
        .hero-active {
          background: var(--green);
          color: #fff;
          padding: 1.5rem;
          border-radius: 14px;
        }
        .hero-active-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
        }
        .hero-eyebrow {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          opacity: 0.7;
          margin-bottom: 0.3rem;
        }
        .hero-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(2.2rem, 7vw, 4rem);
          font-weight: 800;
          line-height: 0.9;
          text-transform: uppercase;
          letter-spacing: -0.01em;
        }
        .hero-range {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(0.8rem, 2vw, 1rem);
          opacity: 0.65;
          margin-top: 0.4rem;
          letter-spacing: 0.04em;
        }
        .hero-countdown { text-align: right; flex-shrink: 0; }
        .hero-countdown-num {
          font-variant-numeric: tabular-nums;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(2rem, 6vw, 3.5rem);
          font-weight: 300;
          line-height: 0.9;
          letter-spacing: -0.02em;
        }
        .hero-countdown-lbl {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 0.6rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          opacity: 0.6;
          margin-top: 0.3rem;
        }
        .hero-period-bar { margin-top: 1.2rem; }
        .hero-period-bar-meta {
          display: flex;
          justify-content: space-between;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 0.6rem;
          letter-spacing: 0.08em;
          opacity: 0.55;
          margin-bottom: 0.4rem;
        }
        .hero-period-bar-track {
          height: 3px;
          background: rgba(255,255,255,0.2);
          border-radius: 3px;
          overflow: hidden;
        }
        .hero-period-bar-fill {
          height: 100%;
          background: rgba(255,255,255,0.85);
          border-radius: 3px;
          transition: width 1s linear;
        }

        /* Up next hero */
        .hero-next {
          background: var(--green-bg);
          border: 1.5px solid var(--green-lite);
          border-radius: 14px;
          padding: 1.3rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        .hero-next .hero-eyebrow { color: var(--green); opacity: 1; }
        .hero-next .hero-name    { color: var(--ink); font-size: clamp(1.6rem, 5vw, 2.8rem); }
        .hero-next .hero-range   { color: var(--muted); opacity: 1; }
        .hero-next .hero-countdown-num { color: var(--green); }
        .hero-next .hero-countdown-lbl { color: var(--muted); opacity: 1; }

        /* Pre-school / All Done hero */
        .hero-status {
          background: var(--surface);
          border: 1.5px solid var(--border);
          border-radius: 14px;
          padding: 2rem 1.5rem;
          text-align: center;
        }
        .hero-status-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(1.6rem, 5vw, 2.5rem);
          font-weight: 700;
          text-transform: uppercase;
          color: var(--ink);
          line-height: 1;
        }
        .hero-status-sub {
          font-size: clamp(0.8rem, 2vw, 0.95rem);
          color: var(--muted);
          margin-top: 0.5rem;
          letter-spacing: 0.02em;
        }
        .hero-status-next {
          margin-top: 1rem;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 0.75rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--green);
        }

        /* ── SCHEDULE LIST ── */
        .schedule { padding: 0 1.5rem; }
        .sched-header {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--faint);
          padding: 1.2rem 0 0.6rem;
          border-bottom: 1.5px solid var(--border);
        }

        .sched-row {
          display: grid;
          grid-template-columns: 1.8rem 1fr auto;
          align-items: center;
          gap: 0.75rem;
          padding: 0.85rem 0;
          border-bottom: 1px solid var(--border);
          transition: opacity 0.3s;
        }
        .sched-row.is-done { opacity: 0.4; }
        .sched-row.is-active {
          opacity: 1;
          background: var(--green-bg);
          border-radius: 10px;
          border-color: transparent;
          margin: 0.25rem -0.75rem;
          padding: 0.85rem 0.75rem;
        }

        .sched-num {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.06em;
          color: var(--faint);
          text-align: right;
          flex-shrink: 0;
        }
        .sched-row.is-active .sched-num { color: var(--green); }

        .sched-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(1.1rem, 3.5vw, 1.5rem);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.01em;
          line-height: 1;
          color: var(--ink);
        }
        .sched-row.is-break .sched-name {
          font-weight: 400;
          color: var(--muted);
          font-size: clamp(0.9rem, 2.5vw, 1.15rem);
        }
        .sched-row.is-active .sched-name { color: var(--green); }

        .sched-time {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 0.65rem;
          color: var(--faint);
          letter-spacing: 0.04em;
          margin-top: 0.1rem;
        }
        .sched-row.is-active .sched-time { color: var(--sage); }

        .sched-right { text-align: right; flex-shrink: 0; }

        .badge {
          display: inline-block;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 0.58rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          padding: 0.18rem 0.5rem;
          border-radius: 3px;
          margin-bottom: 0.25rem;
        }
        .badge-now  { background: var(--green); color: #fff; }
        .badge-next { background: var(--green-bg); color: var(--green); border: 1px solid var(--green-lite); }

        .sched-val {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(0.95rem, 2.8vw, 1.25rem);
          font-weight: 400;
          letter-spacing: -0.01em;
          line-height: 1;
          color: var(--ink);
        }
        .sched-row.is-active .sched-val { color: var(--green); font-weight: 600; }

        .sched-val-lbl {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 0.52rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--faint);
          margin-top: 0.1rem;
        }
        .sched-row.is-active .sched-val-lbl { color: var(--sage); }

        .done-mark {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 0.65rem;
          letter-spacing: 0.08em;
          color: var(--green-mid);
        }

        .active-bar {
          height: 3px;
          background: var(--green-lite);
          border-radius: 3px;
          margin: 0 -0.75rem 0.25rem;
          overflow: hidden;
        }
        .active-bar-fill {
          height: 100%;
          background: var(--green);
          border-radius: 3px;
          transition: width 1s linear;
        }

        @media (min-width: 600px) {
          .header, .day-bar-wrap, .schedule { padding-left: 2rem; padding-right: 2rem; }
          .hero { margin-left: 2rem; margin-right: 2rem; }
          .sched-row.is-active { margin-left: -1rem; margin-right: -1rem; padding-left: 1rem; padding-right: 1rem; }
          .active-bar { margin-left: -1rem; margin-right: -1rem; }
        }
      `}</style>

      <div className="page">

        {/* HEADER */}
        <div className="header">
          <div>
            <div className="header-school">Mission San Jose High</div>
            <div className="header-title">Schedule</div>
          </div>
          {now && (
            <div className="header-right">
              <div className="header-clock">{fmtClock(now)}</div>
              <div className="header-date">
                {now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
            </div>
          )}
        </div>

        {/* DAY PROGRESS */}
        <div className="day-bar-wrap">
          <span className="day-bar-label">8:30 AM</span>
          <div className="day-bar-track">
            <div className="day-bar-fill" style={{ width: `${dayPct * 100}%` }} />
          </div>
          <span className="day-bar-label">3:11 PM</span>
          <span className="day-bar-pct">{Math.round(dayPct * 100)}%</span>
        </div>

        {/* HERO */}
        <div className="hero">
          {isAllDone ? (
            <div className="hero-status">
              <div className="hero-status-title">School&rsquo;s Out</div>
              <div className="hero-status-sub">The school day is over. Rest up.</div>
              <div className="hero-status-next">Back at 8:30 AM tomorrow</div>
            </div>
          ) : isPreSchool ? (
            <div className="hero-status">
              <div className="hero-status-title">Good Morning</div>
              <div className="hero-status-sub">School starts at 8:30 AM</div>
              <div className="hero-status-next">
                {nextItem && `Period 1 in ${fmtCountdown(nextItem.startMs)}`}
              </div>
            </div>
          ) : activeItem ? (
            <div className="hero-active">
              <div className="hero-active-top">
                <div>
                  <div className="hero-eyebrow">Now in Progress</div>
                  <div className="hero-name">{activeItem.label}</div>
                  <div className="hero-range">{fmt12(activeItem.startHour, activeItem.startMinute)} – {fmt12(activeItem.endHour, activeItem.endMinute)}</div>
                </div>
                <div className="hero-countdown">
                  <div className="hero-countdown-num">{fmtCountdown(activeItem.endMs)}</div>
                  <div className="hero-countdown-lbl">remaining</div>
                </div>
              </div>
              <div className="hero-period-bar">
                <div className="hero-period-bar-meta">
                  <span>{fmt12(activeItem.startHour, activeItem.startMinute)}</span>
                  <span>{Math.round(activeItem.pct * 100)}% through</span>
                  <span>{fmt12(activeItem.endHour, activeItem.endMinute)}</span>
                </div>
                <div className="hero-period-bar-track">
                  <div className="hero-period-bar-fill" style={{ width: `${activeItem.pct * 100}%` }} />
                </div>
              </div>
            </div>
          ) : nextItem ? (
            <div className="hero-next">
              <div>
                <div className="hero-eyebrow">Up Next</div>
                <div className="hero-name">{nextItem.label}</div>
                <div className="hero-range">{fmt12(nextItem.startHour, nextItem.startMinute)} – {fmt12(nextItem.endHour, nextItem.endMinute)}</div>
              </div>
              <div className="hero-countdown">
                <div className="hero-countdown-num">{fmtCountdown(nextItem.startMs)}</div>
                <div className="hero-countdown-lbl">until start</div>
              </div>
            </div>
          ) : null}
        </div>

        {/* SCHEDULE LIST */}
        <div className="schedule">
          <div className="sched-header">Full Day</div>
          {items.map((item, i) => {
            const isNext = i === nextIdx;
            const ms = item.isActive ? item.endMs : item.startMs;
            return (
              <div key={i}>
                <div
                  ref={item.isActive ? activeRef : undefined}
                  className={`sched-row ${item.isActive ? 'is-active' : ''} ${item.isDone ? 'is-done' : ''} ${item.type === 'break' ? 'is-break' : ''}`}
                >
                  <span className="sched-num">{String(i + 1).padStart(2, '0')}</span>
                  <div className="sched-body">
                    <div className="sched-name">{item.label}</div>
                    <div className="sched-time">{fmt12(item.startHour, item.startMinute)} – {fmt12(item.endHour, item.endMinute)}</div>
                  </div>
                  <div className="sched-right">
                    {item.isActive && <div className="badge badge-now">Now</div>}
                    {!item.isActive && isNext && <div className="badge badge-next">Next</div>}
                    {!item.isDone && (
                      <>
                        <div className="sched-val">{fmtCountdown(ms)}</div>
                        <div className="sched-val-lbl">{item.isActive ? 'left' : 'away'}</div>
                      </>
                    )}
                    {item.isDone && <span className="done-mark">✓</span>}
                  </div>
                </div>
                {item.isActive && (
                  <div className="active-bar">
                    <div className="active-bar-fill" style={{ width: `${item.pct * 100}%` }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}