import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  agentStates,
  type AgentState,
  capabilities,
  pillars,
  playgroundReplies,
  roles,
  routes,
  steps,
} from '../content/site';
import { Badge, Bars, Button, DemoLabel, TabPanel, Tabs } from './ui';

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function useInView<T extends HTMLElement>(threshold = 0.35) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

/* Window chrome shared by every simulated interface */
export function Frame({
  title,
  status,
  tone = 'b',
  children,
  className = '',
}: {
  title: ReactNode;
  status?: ReactNode;
  tone?: 'a' | 'b';
  children: ReactNode;
  className?: string;
}) {
  return (
    <figure className={`frame frame--${tone} ${className}`}>
      <div className="frame__bar">
        <span className="frame__title">
          <i className="frame__dot" aria-hidden="true" />
          {title}
        </span>
        {status}
      </div>
      <div className="frame__body">{children}</div>
      <figcaption className="frame__cap">
        <DemoLabel />
      </figcaption>
    </figure>
  );
}

/* ---------- Mode B: copilot conversation ---------- */
const copilotScript = [
  { kind: 'other', who: 'Client', text: 'We like the proposal, but the timeline feels tight for our team.' },
  { kind: 'other', who: 'Client', text: 'Could you hold the current pricing if we sign this month?' },
  {
    kind: 'suggest',
    who: 'Lily suggests — only you see this',
    text: 'Acknowledge the timeline concern first, offer a phased start, then confirm the pricing point from your playbook before agreeing to anything.',
  },
  {
    kind: 'capture',
    who: 'Captured for your summary',
    text: 'Client concern: timeline. Open point: pricing hold for signing this month. Follow-up draft will be prepared after the call.',
  },
] as const;

const stageOf = ['Listen', 'Understand', 'Assist', 'Capture'];

export function CopilotDemo({ showStages = true }: { showStages?: boolean }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.4);
  const [shown, setShown] = useState(1);
  const [playing, setPlaying] = useState(false);
  const started = useRef(false);

  const play = () => {
    if (reducedMotion()) {
      setShown(copilotScript.length);
      return;
    }
    setShown(1);
    setPlaying(true);
  };

  useEffect(() => {
    if (inView && !started.current) {
      started.current = true;
      play();
    }
  }, [inView]);

  useEffect(() => {
    if (!playing) return;
    if (shown >= copilotScript.length) {
      setPlaying(false);
      return;
    }
    const t = window.setTimeout(() => setShown((s) => s + 1), 1500);
    return () => window.clearTimeout(t);
  }, [playing, shown]);

  return (
    <div ref={ref} className="copilot">
      <Frame
        title="Live Copilot — private to you only"
        tone="b"
        status={
          <button className="frame__action" onClick={play} disabled={playing}>
            {playing ? 'Playing…' : shown >= copilotScript.length ? '↻ Replay' : '▶ Play'}
          </button>
        }
      >
        <div className="copilot__grid">
          <div className="copilot__call" aria-hidden="true">
            <div className="copilot__avatar">
              <span>C</span>
              <Bars n={9} tone="a" paused={!playing && shown >= copilotScript.length} />
            </div>
            <p>Client · in call</p>
          </div>
          <div className="copilot__feed">
            {copilotScript.slice(0, shown).map((m, i) => (
              <div key={i} className={`msg msg--${m.kind}`}>
                <small>{m.who}</small>
                <p>{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </Frame>
      {showStages && (
        <ol className="stages" aria-label="What Lily is doing">
          {stageOf.map((s, i) => (
            <li key={s} className={shown > i ? 'is-on' : ''}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              {s}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

/* ---------- Mode A: agent state machine ---------- */
const stateOrder: AgentState[] = ['Listening', 'Thinking', 'Speaking', 'Interrupted'];

export function AgentDemo() {
  const [state, setState] = useState<AgentState>('Listening');
  const [auto, setAuto] = useState(true);
  const [ref, inView] = useInView<HTMLDivElement>(0.3);

  useEffect(() => {
    if (!auto || !inView || reducedMotion()) return;
    const t = window.setInterval(() => setState((s) => stateOrder[(stateOrder.indexOf(s) + 1) % stateOrder.length]), 2800);
    return () => window.clearInterval(t);
  }, [auto, inView]);

  return (
    <div ref={ref}>
      <Frame
        title="In-app call · room guest joined via browser link"
        tone="a"
        status={
          <span className="frame__state" aria-live="polite">
            State: {state}
          </span>
        }
      >
        <div className="agent">
          <div className={`agent__orb agent__orb--${state.toLowerCase()}`} aria-hidden="true">
            <span />
            <Bars n={11} tone="a" paused={state === 'Listening' || state === 'Interrupted'} />
          </div>
          <div className="agent__feed">
            <div className="msg msg--lily">
              <small>Lily AI · announces itself first</small>
              <p>Hello, I'm Lily, an AI assistant calling on behalf of my owner. Is now a good time for a brief conversation?</p>
            </div>
            <div className="msg msg--other">
              <small>Participant</small>
              <p>Yes — but I only have a few minutes, and I wanted to ask about pricing first.</p>
            </div>
          </div>
          <div className="agent__states" role="group" aria-label="Agent state">
            {stateOrder.map((s) => (
              <button
                key={s}
                className={`chip ${s === state ? 'is-on' : ''}`}
                aria-pressed={s === state}
                onClick={() => {
                  setAuto(false);
                  setState(s);
                }}
              >
                {s === 'Interrupted' ? 'Interrupted — barge-in' : s}
              </button>
            ))}
          </div>
          <p className="agent__text">{agentStates[state]}</p>
          <div className="agent__controls">
            <span className="agent__controls-label">Owner controls</span>
            <span className="chip chip--static">Whisper guidance to Lily</span>
            <span className="chip chip--static">Take over the call</span>
            <span className="chip chip--static">End session</span>
          </div>
        </div>
      </Frame>
    </div>
  );
}

/* ---------- Mode A vs Mode B: who hears what ---------- */
export function ModeSwitcher() {
  const [mode, setMode] = useState<'a' | 'b'>('a');
  const a = mode === 'a';
  return (
    <div className={`switcher switcher--${mode}`}>
      <div className="switcher__head">
        <Tabs
          idBase="modes"
          label="Compare Mode A and Mode B"
          variant="segment"
          value={mode}
          onChange={(k) => setMode(k as 'a' | 'b')}
          items={[
            { key: 'a', label: 'Mode A — Agent speaks' },
            { key: 'b', label: 'Mode B — Copilot whispers' },
          ]}
        />
        <p className="switcher__note">
          {a
            ? 'Lily speaks to the other participant — you supervise, whisper, or take over.'
            : 'Lily never speaks to the other party — everything here is visible only to you.'}
        </p>
      </div>
      <TabPanel idBase="modes" active={mode} className="switcher__panel">
        <div className="who" aria-hidden="true">
          <div className="who__node who__node--you">
            <b>You</b>
            <span>{a ? 'Listening in, in control' : 'On the call yourself'}</span>
          </div>
          <div className={`who__link who__link--left ${a ? 'is-dashed' : 'is-private'}`}>
            <span>{a ? 'Whisper · take over · end' : 'Private suggestions'}</span>
          </div>
          <div className="who__node who__node--lily">
            <i />
            <b>Lily</b>
          </div>
          <div className={`who__link who__link--right ${a ? 'is-voice' : 'is-muted'}`}>
            <span>{a ? 'Speaks as an AI agent' : 'Listens only — never speaks'}</span>
          </div>
          <div className="who__node who__node--other">
            <b>Other participant</b>
            <span>{a ? 'Hears Lily' : 'Hears only you'}</span>
          </div>
        </div>
        <p className="sr-only">
          {a
            ? 'Diagram: in Mode A, Lily speaks to the other participant as an AI agent while you listen in and can whisper guidance, take over, or end the session.'
            : 'Diagram: in Mode B, Lily listens to the conversation and sends private suggestions only to you. The other participant hears only you.'}
        </p>
        {a ? (
          <div className="switcher__sample">
            <div className="msg msg--lily">
              <small>Lily AI · speaking in the call</small>
              <p>Hello, I'm Lily, an AI assistant calling on behalf of my owner. Shall we start with the timeline you mentioned?</p>
            </div>
            <div className="switcher__chips">
              <Badge tone="a">Speaking</Badge>
              <Badge>Listening</Badge>
              <Badge>Thinking</Badge>
              <Badge>Interrupted</Badge>
              <Badge tone="beta">Beta</Badge>
            </div>
          </div>
        ) : (
          <div className="switcher__sample">
            <div className="msg msg--other">
              <small>Client · live transcript</small>
              <p>The numbers look reasonable. My concern is support after we sign.</p>
            </div>
            <div className="msg msg--suggest">
              <small>Lily suggests — only you see this</small>
              <p>
                Offer the onboarding outline from your playbook, name the support path clearly, and ask what response time they expect — before
                discussing terms.
              </p>
            </div>
            <div className="switcher__chips">
              <Badge tone="b">Sentiment: Engaged</Badge>
              <Badge>Tone: Cautious</Badge>
              <Badge>Private to you only</Badge>
            </div>
          </div>
        )}
        <DemoLabel />
      </TabPanel>
    </div>
  );
}

/* ---------- Personalization playground ---------- */
export function Playground() {
  const [on, setOn] = useState({ voice: true, playbook: true, history: false });
  const k = (on.voice ? 1 : 0) + (on.playbook ? 2 : 0) + (on.history ? 4 : 0);
  const parts = pillars.filter((p) => on[p.key as keyof typeof on]).map((p) => p.title.replace('Learns ', ''));
  return (
    <div className="playground">
      <div className="playground__controls">
        <p className="playground__q">
          The client asks: <strong>“Can you do better on price?”</strong>
        </p>
        {pillars.map((p) => {
          const key = p.key as keyof typeof on;
          return (
            <label key={p.key} className={`toggle ${on[key] ? 'is-on' : ''}`}>
              <span className="toggle__text">
                <b>{p.title}</b>
                <span>{p.toggle}</span>
              </span>
              <input type="checkbox" role="switch" checked={on[key]} onChange={(e) => setOn({ ...on, [key]: e.target.checked })} />
              <span className="toggle__track" aria-hidden="true" />
            </label>
          );
        })}
      </div>
      <div className="playground__out">
        <div className="playground__sources" aria-hidden="true">
          {pillars.map((p) => (
            <span key={p.key} className={on[p.key as keyof typeof on] ? 'is-on' : ''}>
              {p.title.replace('Learns your ', '')}
            </span>
          ))}
        </div>
        <div className="msg msg--suggest playground__reply" key={k} aria-live="polite">
          <small>Lily suggests — only you see this</small>
          <p>{playgroundReplies[k]}</p>
        </div>
        <p className="playground__shaped">
          {parts.length ? (
            <>
              Shaped by: <b>{parts.join(' · ')}</b>
            </>
          ) : (
            'Generic — no personalization switched on yet. Try the switches.'
          )}
        </p>
        <DemoLabel>Illustrative product concept. Personalization adapts how Lily behaves; it does not retrain Lily.</DemoLabel>
      </div>
    </div>
  );
}

/* ---------- Role explorer ---------- */
export function RoleExplorer({ idBase, cta = true }: { idBase: string; cta?: boolean }) {
  const [key, setKey] = useState(roles[0].key);
  const role = roles.find((r) => r.key === key)!;
  return (
    <div className="roles">
      <p className="roles__label" id={`${idBase}-label`}>
        I'm looking for help with:
      </p>
      <Tabs idBase={idBase} label="Choose a conversation type" value={key} onChange={setKey} items={roles.map((r) => ({ key: r.key, label: r.tab }))} />
      <TabPanel idBase={idBase} active={key} className="roles__stage">
        <div className="roles__photo">
          <img key={role.image} src={role.image} alt={role.alt} loading="lazy" decoding="async" width="1200" height="800" />
        </div>
        <div className="roles__body" key={role.key}>
          <h3>{role.title}</h3>
          <p>{role.body}</p>
          <div className="roles__rec">
            <span>Recommended setup</span>
            <div>
              {role.mode === 'both' && <Badge tone="a">Mode A · Beta</Badge>}
              <Badge tone="b">Mode B — Live Copilot</Badge>
            </div>
          </div>
          <p className="roles__note">Illustrative photography — the people pictured are models, not Lily AI customers.</p>
          {cta && (
            <Button to={routes.product} variant="ghost" size="sm" arrow>
              See it on the Product tour
            </Button>
          )}
        </div>
      </TabPanel>
    </div>
  );
}

/* ---------- Pipeline diagram ---------- */
export function Pipeline({ items }: { items: { title: string; sub?: string }[] }) {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [ref, inView] = useInView<HTMLOListElement>(0.4);
  useEffect(() => {
    if (!auto || !inView || reducedMotion()) return;
    const t = window.setInterval(() => setActive((a) => (a + 1) % items.length), 1600);
    return () => window.clearInterval(t);
  }, [auto, inView, items.length]);
  return (
    <ol ref={ref} className="pipeline" aria-label="Conversation pipeline">
      {items.map((it, i) => (
        <li key={it.title} className={`pipeline__node ${i === active ? 'is-active' : ''} ${i < active ? 'is-done' : ''}`}>
          <button
            onMouseEnter={() => {
              setAuto(false);
              setActive(i);
            }}
            onFocus={() => {
              setAuto(false);
              setActive(i);
            }}
            onClick={() => {
              setAuto(false);
              setActive(i);
            }}
            aria-current={i === active ? 'step' : undefined}
          >
            <span className="pipeline__n">{String(i + 1).padStart(2, '0')}</span>
            <b>{it.title}</b>
            {it.sub && <small>{it.sub}</small>}
          </button>
        </li>
      ))}
    </ol>
  );
}

/* ---------- Scroll-linked five-stage path ---------- */
export function StepsPath({ detail = false }: { detail?: boolean }) {
  const ref = useRef<HTMLOListElement>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const calc = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const v = (vh * 0.72 - r.top) / (r.height + vh * 0.1);
      setP(Math.min(1, Math.max(0, v)));
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(calc);
    };
    calc();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <ol ref={ref} className={`path ${detail ? 'path--detail' : ''}`} style={{ ['--p' as string]: p }}>
      <span className="path__line" aria-hidden="true">
        <i />
      </span>
      {steps.map((s, i) => (
        <li key={s.n} className={`path__step ${p >= (i + 0.35) / steps.length ? 'is-on' : ''}`}>
          <span className="path__dot" aria-hidden="true" />
          <span className="path__n">{s.n}</span>
          <h3>{s.title}</h3>
          <p>{detail ? s.long : s.short}</p>
        </li>
      ))}
    </ol>
  );
}

/* ---------- Capabilities bento ---------- */
const capVisual: Record<string, ReactNode> = {
  transcription: (
    <div className="mini mini--lines" aria-hidden="true">
      <i style={{ width: '82%' }} />
      <i style={{ width: '64%' }} />
      <i style={{ width: '90%' }} />
      <i className="is-live" style={{ width: '38%' }} />
    </div>
  ),
  coaching: (
    <div className="mini mini--suggest" aria-hidden="true">
      <small>Only you see this</small>
      <i style={{ width: '92%' }} />
      <i style={{ width: '70%' }} />
    </div>
  ),
  sentiment: (
    <div className="mini mini--chips" aria-hidden="true">
      <span className="is-on">Engaged</span>
      <span>Cautious</span>
      <span>Tense</span>
    </div>
  ),
  languages: (
    <div className="mini mini--lang" aria-hidden="true">
      <span>English</span>
      <span>Hindi / Hinglish</span>
    </div>
  ),
  actions: (
    <div className="mini mini--checks" aria-hidden="true">
      <span>Send revised timeline</span>
      <span>Confirm pricing hold</span>
      <span>Draft follow-up</span>
    </div>
  ),
};

export function CapabilityBento() {
  return (
    <ul className="bento">
      {capabilities.map((c, i) => (
        <li key={c.key} className={`bento__cell bento__cell--${c.key}`} style={{ ['--i' as string]: i }}>
          {capVisual[c.key]}
          <h3>{c.title}</h3>
          <p>{c.body}</p>
        </li>
      ))}
    </ul>
  );
}
