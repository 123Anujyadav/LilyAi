import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { CardGrid, FinalCta, HonestStatus, ModeCards, PageHero } from '../components/blocks';
import { AgentDemo, CapabilityBento, CopilotDemo, Frame, Pipeline, Playground, RoleExplorer, StepsPath } from '../components/demos';
import { Accordion, Badge, Button, Notice, Reveal, SectionHead } from '../components/ui';
import {
  aboutCards,
  betaNote,
  callStates,
  faqs,
  pillars,
  pipelineTech,
  privacyDoc,
  routes,
  securityCards,
  solutionsIndividuals,
  solutionsTeams,
  techApp,
  techCards,
  techScope,
  termsDoc,
} from '../content/site';
import SpotlightCard from '../reactbits/SpotlightCard';

/* ============ PRODUCT ============ */
const phases = [
  {
    k: 'Before',
    body: 'Your tone profile, approved phrases, playbooks, client notes and knowledge base are loaded as context — your way of working, ready before the call starts.',
  },
  {
    k: 'During',
    body: 'Live transcription, contextual understanding and assistance in the moment — spoken in Mode A, whispered privately to you in Mode B.',
  },
  {
    k: 'After',
    body: 'A structured summary, action items and a follow-up draft, with the conversation saved to your searchable history.',
  },
];

export function Product() {
  return (
    <>
      <PageHero
        kicker="Product"
        core="both"
        title="One intelligence. Two ways to work a conversation."
        sub="Lily AI is a real-time conversational intelligence platform: an elegant app connected to Lily's own private platform, where listening, understanding and voice come together in the moment."
      >
        <div className="hero__cta">
          <Button to={routes.modeA}>Explore Mode A</Button>
          <Button to={routes.modeB} variant="ghost" arrow>
            Explore Mode B
          </Button>
        </div>
      </PageHero>

      <section className="section">
        <div className="wrap">
          <SectionHead kicker="Two modes" title="Speak for you, or stay beside you." />
          <ModeCards compact />
        </div>
      </section>

      <section className="section theme-light">
        <div className="wrap">
          <SectionHead kicker="The journey" title="Conversation intelligence, before, during and after" />
          <ol className="phases">
            {phases.map((p, i) => (
              <Reveal as="li" key={p.k} delay={i * 110} className="phases__item">
                <span className="phases__k">{p.k}</span>
                <p>{p.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--raised">
        <div className="wrap">
          <SectionHead
            kicker="Personalization"
            title="Trained on you, not just data."
            sub="Generic assistants answer from general knowledge. Lily's suggestions are shaped by three things you control. Try switching each one on and off, and watch the reply Lily would prepare for you change."
          />
          <Reveal>
            <Playground />
          </Reveal>
          <ul className="pillars">
            {pillars.map((p, i) => (
              <Reveal as="li" key={p.key} delay={i * 90}>
                <span>{p.n}</span>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHead kicker="Capabilities" title="Everything a live conversation needs." />
          <Reveal>
            <CapabilityBento />
          </Reveal>
          <Reveal className="section__more">
            <Notice title="Honest status:">
              {betaNote} Calling regular phone numbers requires a separate telephone carrier arrangement, and is not live. Lily does not capture
              ordinary mobile call audio — no phone app can.
            </Notice>
          </Reveal>
        </div>
      </section>
      <FinalCta title="See how a conversation flows." sub="Five stages connect your call to Lily's intelligence and back — in real time." to={routes.how} label="How It Works" />
    </>
  );
}

/* ============ MODE A ============ */
const joinFlow = [
  ['Join in-app', 'Participants enter with a room code in the Lily app or through a browser guest link.'],
  ['Consent first', 'Guests see a consent notice before joining the call.'],
  ['AI announces itself', 'Lily states that it is an AI assistant at the start of the conversation.'],
  ['You stay the owner', 'Listen live, whisper guidance, take over speaking yourself, or end the session.'],
];

export function ModeA() {
  return (
    <>
      <PageHero
        kicker="Mode A"
        core="a"
        badges={
          <>
            <Badge tone="a">Autonomous Calling Agent</Badge>
            <Badge tone="beta">Beta</Badge>
          </>
        }
        title="The autonomous calling agent that speaks — as you."
        sub="Lily participates in a live in-app conversation and speaks as an AI agent, following your playbook while you stay in control."
      >
        <p className="pagehero__note">{betaNote}</p>
      </PageHero>

      <section className="section">
        <div className="wrap split">
          <div>
            <SectionHead
              kicker="On the call"
              title="Four states. Always interruptible."
              sub="Select a state to see what Lily is doing. When the participant speaks over a reply, the current speech is cut and that reply is discarded."
            />
          </div>
          <Reveal>
            <AgentDemo />
          </Reveal>
        </div>
      </section>

      <section className="section theme-light">
        <div className="wrap">
          <SectionHead kicker="Joining a call" title="In-app only, with consent at the door." />
          <ol className="flow">
            {joinFlow.map(([t, b], i) => (
              <Reveal as="li" key={t} delay={i * 90} className="flow__item">
                <span className="flow__n">{String(i + 1).padStart(2, '0')}</span>
                <h3>{t}</h3>
                <p>{b}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--raised">
        <div className="wrap">
          <CardGrid
            items={[
              {
                title: 'Playbook-led',
                body: 'Follows your instructions, approved phrases and client context — relevant knowledge is recalled at every turn, keeping answers grounded in your material.',
              },
              {
                title: 'Interruptible by design',
                body: 'Every reply is tracked individually, so an interrupted answer stops cleanly and its audio is discarded — Lily never talks over the other person.',
              },
              {
                title: 'You stay the owner',
                body: 'Listen live, send private whisper instructions Lily can act on, take over speaking yourself, or end and revoke the session instantly.',
              },
            ]}
          />
          <Reveal className="section__more">
            <Notice title="Beta and telephony limits:">
              Joining is in-app only: participants enter with a room code in the Lily app or through a browser guest link, where they see a consent
              notice before joining. Mode A voice in live calls remains Beta until it has been verified live with real callers. Calling regular
              phone numbers requires a separate telephone carrier arrangement, and is not live.
            </Notice>
          </Reveal>
        </div>
      </section>
      <FinalCta variant="a" title="Prefer to stay on the call yourself?" sub="Mode B keeps Lily silent to everyone but you." to={routes.modeB} label="Explore Live Copilot" />
    </>
  );
}

/* ============ MODE B ============ */
export function ModeB() {
  return (
    <>
      <PageHero
        kicker="Mode B"
        core="b"
        badges={<Badge tone="b">Live Copilot</Badge>}
        title="The live copilot only you can see."
        sub="Lily silently assists during your conversation. It never speaks to the other participant — every transcript line, cue and suggestion is private to you."
      />

      <section className="section">
        <div className="wrap">
          <SectionHead kicker="During the call" title="Your call. Your screen only." />
          <Reveal>
            <CopilotDemo />
          </Reveal>
        </div>
      </section>

      <section className="section theme-light">
        <div className="wrap hears">
          <Reveal className="hears__col hears__col--you">
            <p className="kicker">What you see</p>
            <ul>
              <li>Live transcript, in English or Hindi/Hinglish conversation</li>
              <li>Sentiment and tone cues</li>
              <li>Private suggested replies shaped by your tone profile and playbook</li>
              <li>Relevant knowledge retrieved from your notes and history</li>
            </ul>
          </Reveal>
          <Reveal className="hears__col hears__col--them" delay={120}>
            <p className="kicker">What the other participant hears</p>
            <p className="hears__big">Only you.</p>
            <p>Lily does not speak to the other participant in this mode.</p>
          </Reveal>
        </div>
      </section>

      <section className="section section--raised">
        <div className="wrap split">
          <div>
            <SectionHead
              kicker="After the call"
              title="A complete post-call brief."
              sub="Summary, action items and a follow-up draft generated when the conversation ends."
            />
          </div>
          <Reveal>
            <Frame title="Post-call brief" tone="b">
              <div className="brief">
                <div>
                  <small>Summary</small>
                  <p>Client is positive on the proposal. Concerns raised: delivery timeline and support after signing.</p>
                </div>
                <div>
                  <small>Action items</small>
                  <ul className="ticks">
                    <li>Share a phased start option</li>
                    <li>Confirm pricing position from the playbook</li>
                    <li>Send the onboarding outline</li>
                  </ul>
                </div>
                <div>
                  <small>Follow-up draft</small>
                  <p>Ready for you to review and send.</p>
                </div>
              </div>
            </Frame>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <CardGrid
            items={[
              { title: 'Live transcription', body: "What's being said, as it's said — in English or Hindi/Hinglish conversation." },
              { title: 'Private suggested replies', body: 'Contextual suggestions shaped by your tone profile, playbook and retrieved knowledge.' },
              { title: 'Post-call brief', body: 'Summary, action items and a follow-up draft generated when the conversation ends.' },
            ]}
          />
        </div>
      </section>
      <FinalCta variant="b" title="Want Lily to take the call?" sub="Mode A speaks as an AI agent in an in-app conversation. Currently in Beta." to={routes.modeA} label="Explore Autonomous Calling" />
    </>
  );
}

/* ============ HOW IT WORKS ============ */
export function HowItWorks() {
  return (
    <>
      <PageHero
        kicker="How it works"
        title="From live conversation to intelligent action."
        sub="Five stages connect your call to Lily's intelligence and back — in real time."
      />
      <section className="section theme-light section--ice">
        <div className="wrap">
          <StepsPath detail />
        </div>
      </section>
      <section className="section section--depth atmos">
        <div className="wrap">
          <SectionHead kicker="Under the stages" title="One signal, followed turn by turn." sub="Hover or focus a stage to follow the signal through the platform." />
          <Reveal>
            <Pipeline items={pipelineTech} />
          </Reveal>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <SectionHead kicker="You stay in control" title="Supported ways to connect." />
          <CardGrid
            cols={2}
            items={[
              { title: 'Mode B copilot session', body: "Open a copilot session and Lily works through the app and your phone's microphone." },
              { title: 'Mode A in-app call (Beta)', body: 'Start an in-app call. Guests join by room code or browser guest link after a consent notice.' },
            ]}
          />
          <Reveal className="section__more">
            <Notice title="Not supported:">Regular cellular calls are not captured. An interruption stops the reply in progress, in both modes.</Notice>
          </Reveal>
        </div>
      </section>
      <FinalCta title="Explore the platform." sub="One private platform, designed end to end for live conversation." to={routes.technology} label="Platform & technology" />
    </>
  );
}

/* ============ SOLUTIONS ============ */
function UseList({ title, items }: { title: string; items: string[][] }) {
  return (
    <div className="uselist">
      <h2>{title}</h2>
      <ul>
        {items.map(([t, b], i) => (
          <Reveal as="li" key={t} delay={i * 60}>
            <h3>{t}</h3>
            <p>{b}</p>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}

export function Solutions() {
  return (
    <>
      <PageHero
        kicker="Solutions"
        title="Wherever business happens on a call."
        sub="No case studies, no invented customers — just the conversations Lily is designed for."
      />
      <section className="section theme-light">
        <div className="wrap">
          <Reveal>
            <RoleExplorer idBase="sol-roles" />
          </Reveal>
        </div>
      </section>
      <section className="section">
        <div className="wrap uselists">
          <UseList title="For individuals" items={solutionsIndividuals} />
          <UseList title="For teams & enterprises" items={solutionsTeams} />
        </div>
      </section>
      <FinalCta title="Talk to us about your conversations." sub="Early access is arranged directly with the Lily AI team." to={routes.contact} label="Contact" />
    </>
  );
}

/* ============ TECHNOLOGY ============ */
export function Technology() {
  return (
    <>
      <PageHero
        kicker="How Lily works"
        title="Engineered for real-time conversations."
        sub="One private platform, designed end to end for live conversation — fast, careful, and always under your control."
      />
      <section className="section section--depth atmos">
        <div className="wrap">
          <SectionHead kicker="The pipeline" title="From your voice to the reply." />
          <Reveal>
            <Pipeline items={pipelineTech} />
          </Reveal>
          <Reveal className="reliability">
            <div>
              <h3>Guided conversation flow</h3>
              <p>{techCards[0].body}</p>
            </div>
            <ol className="statechain" aria-label="Call states">
              {callStates.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <ul className="techgrid">
            {techCards.slice(1).map((c, i) => (
              <Reveal as="li" key={c.title} delay={i * 90}>
                <SpotlightCard className="techcard" spotlightColor="rgba(57, 216, 242, 0.18)">
                  <h3>{c.title}</h3>
                  <p>{c.body}</p>
                </SpotlightCard>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
      <section className="section theme-light">
        <div className="wrap scope">
          <Reveal className="scope__col">
            <p className="kicker">Implemented vs. not yet</p>
            <h2>{techScope.title}</h2>
            <p>{techScope.body}</p>
          </Reveal>
          <Reveal className="scope__col scope__col--app" delay={120}>
            <h3>{techApp.title}</h3>
            <p>{techApp.body}</p>
            <Button to={routes.contact} variant="ghost" size="sm" arrow>
              Get in touch
            </Button>
          </Reveal>
        </div>
      </section>
      <FinalCta title="Responsible by design." sub="See the consent, export and deletion controls." to={routes.security} label="Security & Privacy" />
    </>
  );
}

/* ============ SECURITY ============ */
export function Security() {
  return (
    <>
      <PageHero
        tone="light"
        kicker="Security & privacy"
        title="Your conversations deserve responsible intelligence."
        sub="Designed controls, stated plainly — with no certifications or audits claimed that haven't happened."
      />
      <section className="section theme-light" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <ol className="controls">
            {securityCards.map((c, i) => (
              <Reveal as="li" key={c.title} delay={(i % 2) * 90}>
                <span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h2>{c.title}</h2>
                  <p>{c.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <SectionHead kicker="Read the documents" title="The plain-language policies." />
          <div className="doclinks">
            <Link to={routes.privacy} className="doclink">
              <span>Privacy Policy</span>
              <small>What Lily processes, consent, retention and your controls</small>
            </Link>
            <Link to={routes.terms} className="doclink">
              <span>Terms &amp; Conditions</span>
              <small>Using Lily AI, current limitations and your content</small>
            </Link>
          </div>
          <HonestStatus />
        </div>
      </section>
    </>
  );
}

/* ============ ABOUT ============ */
export function About() {
  return (
    <>
      <PageHero
        kicker="About"
        title="Conversations are where work actually happens."
        sub="Lily AI exists because the most important moments in business — the negotiation, the interview, the difficult client call — happen live, spoken, and unscripted."
      />
      <section className="section theme-light">
        <div className="wrap room">
          <Reveal className="room__photo">
            <img src="/assets/role-client.webp" alt="A small team meeting around a table beside bright windows" loading="lazy" width="1200" height="1600" />
            <p>Illustrative photo. The people pictured are models, not Lily AI customers.</p>
          </Reveal>
          <Reveal className="room__text" delay={120}>
            <p className="kicker">Designed for live conversation</p>
            <h2>The room is where Lily works</h2>
            <p>
              Lily is built for the live, spoken, unscripted moment — not the write-up afterwards. Every design choice starts from the conversation
              itself: listen first, understand in context, assist in the moment, and capture what matters before it fades.
            </p>
            <p>
              That is why the copilot stays private, why the agent announces itself, and why unfinished capabilities carry honest labels on this
              site.
            </p>
          </Reveal>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <ul className="beliefs">
            {aboutCards.map((c, i) => (
              <Reveal as="li" key={c.title} delay={(i % 2) * 100}>
                <span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h2>{c.title}</h2>
                <p>{c.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
      <FinalCta title="Talk to us about Lily AI." sub="Early access is arranged directly with the Lily AI team." to={routes.contact} label="Contact" />
    </>
  );
}

/* ============ CONTACT ============ */
export function Contact() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState('');

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Record<string, string> = {};
    if (!String(data.get('name') || '').trim()) next.name = 'Enter your name.';
    const email = String(data.get('email') || '').trim();
    if (!email) next.email = 'Enter your work email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter an email in the format name@company.com.';
    if (!String(data.get('message') || '').trim()) next.message = 'Enter a message.';
    setErrors(next);
    if (Object.keys(next).length) {
      setStatus('');
      const first = e.currentTarget.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`);
      first?.focus();
      return;
    }
    /* No backend is connected. Never report a successful send. */
    setStatus('Not sent — this form is not connected to a mail service yet, so nothing was transmitted or stored. This honesty is deliberate.');
  };

  const field = (name: string) => ({
    name,
    id: `cf-${name}`,
    'aria-invalid': !!errors[name] || undefined,
    'aria-describedby': errors[name] ? `cf-${name}-err` : undefined,
  });
  const err = (name: string) =>
    errors[name] ? (
      <p className="form__err" id={`cf-${name}-err`}>
        {errors[name]}
      </p>
    ) : null;

  return (
    <>
      <PageHero kicker="Contact" title="Talk to us about Lily AI." sub="Early access to the app is arranged directly with the Lily AI team." />
      <section className="section theme-light">
        <div className="wrap contact">
          <div className="contact__aside">
            <Notice title="Frontend preview:">
              this form is not yet connected to a mail service, so submitting it does not send anything yet. The fields below show exactly what
              we'll ask for when the inbox opens — nothing you type here is transmitted or stored.
            </Notice>
            <h2>What to expect</h2>
            <ul className="ticks">
              <li>No app-store listing exists yet</li>
              <li>Mode A is in Beta and runs in in-app calls</li>
              <li>Mode B works through the app and your phone's microphone</li>
            </ul>
          </div>
          <form className="form" onSubmit={submit} noValidate aria-describedby="form-status">
            <div className="form__row">
              <label htmlFor="cf-name">Name</label>
              <input {...field('name')} autoComplete="name" placeholder="Your name" required />
              {err('name')}
            </div>
            <div className="form__row">
              <label htmlFor="cf-email">Work email</label>
              <input {...field('email')} type="email" autoComplete="email" placeholder="you@company.com" required />
              {err('email')}
            </div>
            <div className="form__row">
              <label htmlFor="cf-company">
                Company <span>(optional)</span>
              </label>
              <input {...field('company')} autoComplete="organization" placeholder="Company or independent" />
            </div>
            <div className="form__row">
              <label htmlFor="cf-type">Inquiry type</label>
              <select {...field('type')} defaultValue="Product question">
                <option>Product question</option>
                <option>Mode A — Autonomous Calling</option>
                <option>Mode B — Live Copilot</option>
                <option>Getting set up</option>
                <option>Privacy &amp; security</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form__row">
              <label htmlFor="cf-message">Message</label>
              <textarea {...field('message')} rows={5} placeholder="How can we help?" required />
              {err('message')}
            </div>
            <Button type="submit">Submit inquiry</Button>
            <p id="form-status" className="form__status" role="status" aria-live="polite">
              {status}
            </p>
          </form>
        </div>
      </section>
    </>
  );
}

/* ============ FAQ ============ */
export function Faq() {
  return (
    <>
      <PageHero kicker="FAQs" title="Questions, answered honestly." />
      <section className="section theme-light">
        <div className="wrap faq">
          <Accordion items={faqs.map(([q, a]) => ({ q, a }))} />
          <aside className="faq__aside">
            <h2>Still have a question?</h2>
            <p>Early access and product questions are handled directly by the Lily AI team.</p>
            <Button to={routes.contact} variant="ghost" size="sm" arrow>
              Contact
            </Button>
          </aside>
        </div>
      </section>
    </>
  );
}

/* ============ LEGAL ============ */
type Doc = { intro: string; sections: { h: string; p?: string; list?: string[] }[] };
function Legal({ title, doc, other }: { title: string; doc: Doc; other: { to: string; label: string } }) {
  return (
    <>
      <PageHero tone="light" kicker="Legal" title={title} sub={doc.intro} />
      <section className="section theme-light" style={{ paddingTop: 0 }}>
        <div className="wrap legal">
          <nav aria-label="On this page" className="legal__toc">
            <h2>On this page</h2>
            <ul>
              {doc.sections.map((s, i) => (
                <li key={s.h}>
                  <a href={`#s${i}`}>{s.h}</a>
                </li>
              ))}
            </ul>
            <Link to={other.to}>{other.label} →</Link>
          </nav>
          <article className="legal__body">
            {doc.sections.map((s, i) => (
              <section key={s.h} id={`s${i}`}>
                <h2>{s.h}</h2>
                {s.p && <p>{s.p}</p>}
                {s.list && (
                  <ul>
                    {s.list.map((l) => (
                      <li key={l}>{l}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </article>
        </div>
      </section>
    </>
  );
}

export const Privacy = () => <Legal title="Privacy Policy" doc={privacyDoc} other={{ to: routes.terms, label: 'Terms & Conditions' }} />;
export const Terms = () => <Legal title="Terms & Conditions" doc={termsDoc} other={{ to: routes.privacy, label: 'Privacy Policy' }} />;

/* ============ 404 ============ */
export function NotFound() {
  return (
    <PageHero kicker="404" core="both" title="This page is off the call." sub="The page you were looking for does not exist or has moved.">
      <div className="hero__cta">
        <Button to={routes.home}>Back to home</Button>
        <Button to={routes.faq} variant="ghost" arrow>
          Read the FAQs
        </Button>
      </div>
    </PageHero>
  );
}
