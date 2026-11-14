import type { ReactNode } from 'react';
import { honestStatus, routes } from '../content/site';
import SpotlightCard from '../reactbits/SpotlightCard';
import CoreVisual from './CoreVisual';
import { FieldVisual, Magnetic, Tilt } from './motion';
import { Badge, Bars, Button, DemoLabel, Reveal } from './ui';

export function PageHero({
  kicker,
  title,
  sub,
  core,
  badges,
  children,
  tone = 'dark',
}: {
  kicker: ReactNode;
  title: ReactNode;
  sub?: ReactNode;
  core?: 'both' | 'a' | 'b';
  badges?: ReactNode;
  children?: ReactNode;
  tone?: 'dark' | 'light';
}) {
  return (
    <section className={`pagehero ${tone === 'light' ? 'theme-light pagehero--light' : 'atmos'} ${core ? 'pagehero--core' : ''}`}>
      {core && <CoreVisual className="pagehero__visual" variant={core} offset={[0.5, 0]} mobileOffset={[0.4, 0.6]} />}
      {core && <div className="hero__scrim" aria-hidden="true" />}
      {!core && tone === 'dark' && <FieldVisual className="field--hero" />}
      <div className="wrap pagehero__content">
        <p className="kicker">{kicker}</p>
        {badges && <div className="pagehero__badges">{badges}</div>}
        <h1>{title}</h1>
        {sub && <p className="pagehero__sub">{sub}</p>}
        {children}
      </div>
    </section>
  );
}

export function CopilotMini() {
  return (
    <div className="mock mock--b">
      <div className="mock__bar">
        <Badge tone="b">Mode B · Live Copilot</Badge>
        <span className="mock__private">Private to you</span>
      </div>
      <div className="mock__split">
        <div className="mock__call" aria-hidden="true">
          <span className="mock__face">C</span>
          <Bars n={7} tone="a" />
        </div>
        <div className="mock__panel">
          <div className="msg msg--other">
            <small>Client · live transcript</small>
            <p>My concern is support after we sign.</p>
          </div>
          <div className="msg msg--suggest">
            <small>Lily suggests — only you see this</small>
            <p>Offer the onboarding outline from your playbook and name the support path clearly.</p>
          </div>
        </div>
      </div>
      <DemoLabel />
    </div>
  );
}

export function AgentMini() {
  return (
    <div className="mock mock--a">
      <div className="mock__bar">
        <Badge tone="a">Mode A · Autonomous Agent</Badge>
        <Badge tone="beta">Beta</Badge>
      </div>
      <div className="mock__agent">
        <div className="mock__orb" aria-hidden="true">
          <span />
          <Bars n={9} tone="a" />
        </div>
        <div className="msg msg--lily">
          <small>Lily AI · speaking in the call</small>
          <p>Hello, I'm Lily, an AI assistant calling on behalf of my owner.</p>
        </div>
        <div className="mock__controls" aria-hidden="true">
          <span>Whisper</span>
          <span>Take over</span>
          <span>End</span>
        </div>
      </div>
      <DemoLabel />
    </div>
  );
}

export function ModeCards({ compact = false }: { compact?: boolean }) {
  return (
    <div className="modes">
      <Reveal fx="left">
        <Tilt max={5}>
        <SpotlightCard className="mode mode--a" spotlightColor="rgba(57, 216, 242, 0.22)">
          <div className="mode__tags">
            <Badge tone="a">Mode A</Badge>
            <Badge tone="beta">Beta</Badge>
          </div>
          <h3>Autonomous Calling Agent</h3>
          <p>
            Lily joins a live in-app call and <strong>speaks as an AI agent</strong> — announcing itself as AI first, following your playbook, and
            handling interruptions while you listen, whisper guidance, take over, or end the session.
          </p>
          {!compact && (
            <ul className="ticks">
              <li>Listening · Thinking · Speaking · Interrupted states</li>
              <li>Owner whisper, takeover &amp; end controls</li>
              <li>Guests join by room code or browser link</li>
            </ul>
          )}
          <Button to={routes.modeA} size="sm" arrow>
            Explore Autonomous Calling
          </Button>
        </SpotlightCard>
        </Tilt>
      </Reveal>
      <Reveal fx="right" delay={120}>
        <Tilt max={5}>
        <SpotlightCard className="mode mode--b" spotlightColor="rgba(185, 174, 255, 0.24)">
          <div className="mode__tags">
            <Badge tone="b">Mode B</Badge>
          </div>
          <h3>Live Copilot</h3>
          <p>
            Lily <strong>never speaks to the other party</strong>. Only you see the live transcript, sentiment and tone cues, private suggested
            replies, and relevant knowledge — then a summary, action items and a follow-up draft when the call ends.
          </p>
          {!compact && (
            <ul className="ticks">
              <li>Live transcription &amp; private suggestions</li>
              <li>Sentiment and tone indicators</li>
              <li>Summary, actions &amp; follow-up draft</li>
            </ul>
          )}
          <Button to={routes.modeB} size="sm" variant="ghost" arrow>
            Explore Live Copilot
          </Button>
        </SpotlightCard>
        </Tilt>
      </Reveal>
    </div>
  );
}

/* Verifiable facts only. This replaces the "trusted by" pattern: Lily has no customer logos to show. */
export function HonestStatus({ title = 'Honest status' }: { title?: string }) {
  return (
    <Reveal className="status">
      <h3 className="status__title">{title}</h3>
      <ul>
        {honestStatus.map((s) => (
          <li key={s.title}>
            <b>{s.title}</b>
            <span>{s.body}</span>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

export function FinalCta({
  variant = 'both',
  title = 'Make every conversation count.',
  sub = 'Meet the next generation of real-time conversational intelligence.',
  to = routes.product,
  label = 'Discover Lily AI',
}: {
  variant?: 'both' | 'a' | 'b';
  title?: string;
  sub?: string;
  to?: string;
  label?: string;
}) {
  return (
    <section className="final atmos">
      <CoreVisual className="final__visual" variant={variant} />
      <div className="wrap final__content">
        <Reveal>
          <h2>{title}</h2>
          <p>{sub}</p>
          <Magnetic>
            <Button to={to}>{label}</Button>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}

export function CardGrid({ items, cols = 3 }: { items: { title: string; body: ReactNode }[]; cols?: 2 | 3 }) {
  return (
    <ul className={`cards cards--${cols}`}>
      {items.map((c, i) => (
        <Reveal as="li" key={c.title} delay={(i % cols) * 90} className="card">
          <h3>{c.title}</h3>
          <p>{c.body}</p>
        </Reveal>
      ))}
    </ul>
  );
}
