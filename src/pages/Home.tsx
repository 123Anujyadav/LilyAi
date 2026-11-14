import { useEffect, useRef } from 'react';
import { AgentMini, CopilotMini, FinalCta, HonestStatus, ModeCards } from '../components/blocks';
import { CapabilityBento, CopilotDemo, ModeSwitcher, Pipeline, Playground, RoleExplorer, StepsPath } from '../components/demos';
import { FieldVisual, Magnetic, Tilt, usePointerVars } from '../components/motion';
import { Button, Reveal, SectionHead } from '../components/ui';
import { callStates, pipelineHome, problems, reliability, routes, securityHome, ticker } from '../content/site';
import BlurText from '../reactbits/BlurText';

/* The owner's orb film as the hero background. Plays muted and looped, pauses when
   off-screen, and shows the still poster for reduced motion or if the file fails. */
function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      v.removeAttribute('autoplay');
      v.pause();
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.1 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <div className="hero__film" aria-hidden="true">
      <video ref={ref} autoPlay muted loop playsInline preload="metadata" poster="/assets/hero-orb-poster.jpg">
        <source src="/assets/hero-orb.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

function Hero() {
  const line1 = ['Your', 'identical', 'twin'];
  const line2 = ['on', 'every', 'call.'];
  const ref = usePointerVars<HTMLElement>();
  return (
    <section ref={ref} className="hero atmos" aria-labelledby="hero-title">
      <HeroVideo />
      <div className="hero__scrim" aria-hidden="true" />
      <div className="hero__chips" aria-hidden="true">
        <div className="hchip hchip--1">
          <i />
          <span>
            <b>Listening</b>
            Live transcript running
          </span>
        </div>
        <div className="hchip hchip--2">
          <i />
          <span>
            <b>Briefing you live</b>
            Private suggestion ready
          </span>
        </div>
        <div className="hchip hchip--3">
          <i />
          <span>
            <b>English + Hindi / Hinglish</b>
            Designed bilingual support
          </span>
        </div>
      </div>
      <div className="wrap hero__content">
        <p className="kicker kicker--live">
          <i aria-hidden="true" />
          Real-time conversational intelligence
        </p>
        <h1 id="hero-title" className="hero__title" aria-label="Your identical twin on every call.">
          <span className="hero__line" aria-hidden="true">
            {line1.map((w, i) => (
              <span key={w} className="hero__word" style={{ animationDelay: `${120 + i * 90}ms` }}>
                {w}
              </span>
            ))}
          </span>
          <span className="hero__line hero__line--accent" aria-hidden="true">
            {line2.map((w, i) => (
              <span key={w} className="hero__word" style={{ animationDelay: `${420 + i * 90}ms` }}>
                {w}
              </span>
            ))}
          </span>
        </h1>
        <p className="hero__lead">
          Meet Lily AI — real-time conversational intelligence that listens, understands context, and helps you make every conversation count.
        </p>
        <div className="hero__tag">
          <BlurText text="Listening. Thinking. Briefing you live." delay={140} trigger="load" animateBy="words" direction="bottom" />
        </div>
        <div className="hero__cta">
          <Magnetic>
            <Button to={routes.product}>Explore Lily AI</Button>
          </Magnetic>
          <Button to={routes.how} variant="ghost" arrow>
            Discover how it works
          </Button>
        </div>
        <ul className="hero__paths" aria-label="Two modes">
          <li className="hero__path hero__path--a">
            <i aria-hidden="true" />
            <span>
              <b>Mode A · Beta</b> An agent that speaks for you, in-app
            </span>
          </li>
          <li className="hero__path hero__path--b">
            <i aria-hidden="true" />
            <span>
              <b>Mode B</b> A live copilot only you can see
            </span>
          </li>
        </ul>
        <p className="hero__note">
          Two modes, one intelligence. Mode A is currently in Beta — see the honest status notes throughout this site.
        </p>
      </div>
    </section>
  );
}

function Ticker() {
  const row = [...ticker, ...ticker];
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__track">
        {row.map((t, i) => (
          <span key={i}>
            {t}
            <i />
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Ticker />

      {/* See Lily in action */}
      <section className="section">
        <div className="wrap">
          <SectionHead
            kicker="Watch Lily AI"
            title="See Lily in action."
            sub="One view for each mode: Lily assisting a live call privately from behind the scenes, and Lily speaking on a call herself. Both are illustrative interface simulations."
          />
          <div className="action-grid">
            <Reveal fx="left">
              <Tilt>
                <div className="action action--b">
              <CopilotMini />
              <div className="action__cap">
                <h3>The copilot only you can see</h3>
                <p>On a live call, Lily's private panel listens, reads the moment and prepares a suggestion — visible to no one but you.</p>
                <Button to={routes.modeB} variant="ghost" size="sm" arrow>
                  Explore Live Copilot
                </Button>
              </div>
                </div>
              </Tilt>
            </Reveal>
            <Reveal fx="right" delay={120}>
              <Tilt>
                <div className="action action--a">
              <AgentMini />
              <div className="action__cap">
                <h3>The agent that speaks for you</h3>
                <p>
                  Lily joins an in-app call, announces itself as AI, and speaks from your playbook — while you listen in, ready to whisper guidance
                  or take over.
                </p>
                <Button to={routes.modeA} variant="ghost" size="sm" arrow>
                  Explore Autonomous Calling
                </Button>
              </div>
                </div>
              </Tilt>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="section theme-light">
        <div className="wrap problem">
          <div className="problem__lead">
            <SectionHead
              kicker="The problem"
              title="Every call leaves value on the table."
              sub="Important conversations move fast. The details, the tone, the follow-up — too much depends on memory in the moment."
            />
          </div>
          <ol className="problem__list">
            {problems.map((p, i) => (
              <Reveal as="li" key={p.n} delay={i * 80} className="problem__item">
                <span className="problem__n" aria-hidden="true">
                  {p.n}
                </span>
                <div>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Meet Lily */}
      <section className="section section--depth atmos has-field">
        <FieldVisual tone="lavender" />
        <div className="wrap meet">
          <SectionHead
            kicker="Meet Lily AI"
            title="Meet the intelligence behind every conversation."
            sub="Lily listens, understands context, assists in the moment, and captures what matters. Press play to watch a copilot moment unfold."
          />
          <Reveal fx="tilt">
            <CopilotDemo />
          </Reveal>
        </div>
      </section>

      {/* Two modes */}
      <section className="section">
        <div className="wrap">
          <SectionHead kicker="Two intelligent modes" title="Two ways to make every conversation smarter." align="center" />
          <ModeCards />
          <Reveal fx="tilt">
            <ModeSwitcher />
          </Reveal>
        </div>
      </section>

      {/* How it works */}
      <section className="section theme-light section--ice">
        <div className="wrap">
          <SectionHead kicker="How it works" title="From live conversation to intelligent action." />
          <StepsPath />
          <Reveal className="section__more">
            <Button to={routes.how} variant="ghost" arrow>
              See each stage in detail
            </Button>
          </Reveal>
        </div>
      </section>

      {/* Capabilities */}
      <section className="section">
        <div className="wrap">
          <SectionHead kicker="Capabilities" title="Everything a live conversation needs." />
          <Reveal>
            <CapabilityBento />
          </Reveal>
        </div>
      </section>

      {/* Personalization */}
      <section className="section section--raised">
        <div className="wrap">
          <SectionHead
            kicker="The differentiator"
            title="Trained on you, not just data."
            sub="Generic AI note-takers summarize what happened. Lily AI is designed to use your communication preferences, playbooks, and conversation history to provide more relevant assistance. Switch each source on and off and watch the reply change."
          />
          <Reveal fx="tilt">
            <Playground />
          </Reveal>
        </div>
      </section>

      {/* Use cases */}
      <section className="section theme-light">
        <div className="wrap">
          <SectionHead kicker="Use cases" title="Wherever business happens on a call." />
          <Reveal fx="zoom">
            <RoleExplorer idBase="home-roles" />
          </Reveal>
          <Reveal className="section__more">
            <Button to={routes.solutions} variant="ghost" arrow>
              See all solutions
            </Button>
          </Reveal>
        </div>
      </section>

      {/* Platform */}
      <section className="section section--depth atmos has-field">
        <FieldVisual tone="cyan" />
        <div className="wrap">
          <SectionHead
            kicker="The platform"
            title="Engineered for real-time conversations."
            sub="A private voice platform built for one job — live conversation — with no outside AI company ever receiving your calls."
          />
          <Reveal>
            <Pipeline items={pipelineHome.map((title) => ({ title }))} />
          </Reveal>
          <Reveal className="reliability">
            <div>
              <h3>Reliability layer underneath</h3>
              <p>{reliability}</p>
            </div>
            <ol className="statechain" aria-label="Call states">
              {callStates.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </Reveal>
          <Reveal className="section__more">
            <Button to={routes.technology} variant="ghost" arrow>
              Explore the platform
            </Button>
          </Reveal>
        </div>
      </section>

      {/* Security */}
      <section className="section theme-light">
        <div className="wrap">
          <SectionHead kicker="Privacy & security" title="Your conversations deserve responsible intelligence." />
          <ul className="trio">
            {securityHome.map((c, i) => (
              <Reveal as="li" key={c.title} delay={i * 90} className="trio__item">
                <span className="trio__n" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </Reveal>
            ))}
          </ul>
          <HonestStatus />
          <Reveal className="section__more">
            <Button to={routes.security}>Explore Privacy and Security</Button>
          </Reveal>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
