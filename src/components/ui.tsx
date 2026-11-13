import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

export function Button({
  to,
  children,
  variant = 'primary',
  size = 'md',
  arrow = false,
  ...rest
}: {
  to?: string;
  children: ReactNode;
  variant?: 'primary' | 'ghost' | 'quiet';
  size?: 'md' | 'sm';
  arrow?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const cls = `btn btn--${variant} btn--${size}`;
  const inner = (
    <>
      <span>{children}</span>
      {arrow && (
        <svg className="btn__arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </>
  );
  if (to)
    return (
      <Link className={cls} to={to}>
        {inner}
      </Link>
    );
  return (
    <button className={cls} {...rest}>
      {inner}
    </button>
  );
}

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'a' | 'b' | 'beta' | 'neutral' | 'demo' }) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}

/* Every simulated interface carries this label so it is never mistaken for recorded product footage. */
export function DemoLabel({ children = 'Illustrative demo — not a live recording' }: { children?: ReactNode }) {
  return (
    <span className="demo-label">
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
        <circle cx="6" cy="6" r="5" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <path d="M6 5.2v3.2M6 3.4v.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
      {children}
    </span>
  );
}

export function SectionHead({
  kicker,
  title,
  sub,
  align = 'left',
  as = 'h2',
  children,
}: {
  kicker?: ReactNode;
  title: ReactNode;
  sub?: ReactNode;
  align?: 'left' | 'center';
  as?: 'h1' | 'h2';
  children?: ReactNode;
}) {
  const H = as;
  return (
    <Reveal className={`head head--${align}`}>
      {kicker && <p className="kicker">{kicker}</p>}
      <H className="head__title">{title}</H>
      {sub && <p className="head__sub">{sub}</p>}
      {children}
    </Reveal>
  );
}

/* Reveals once when scrolled into view. Content is visible by default if JS or IO is missing. */
export function Reveal({
  children,
  className = '',
  delay = 0,
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'li' | 'section' | 'article';
}) {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<'idle' | 'pre' | 'in'>('idle');
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) {
      setState('in');
      return;
    }
    setState('pre');
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState('in');
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Comp = Tag as 'div';
  return (
    <Comp
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`reveal ${state === 'pre' ? 'reveal--pre' : ''} ${state === 'in' ? 'reveal--in' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Comp>
  );
}

/* Accessible tabs: roving tabindex, arrow keys, Home/End. */
export function Tabs<T extends { key: string; label: ReactNode }>({
  items,
  value,
  onChange,
  label,
  variant = 'pill',
  idBase,
  orientation = 'horizontal',
}: {
  items: T[];
  value: string;
  onChange: (key: string) => void;
  label: string;
  variant?: 'pill' | 'segment' | 'list';
  idBase: string;
  orientation?: 'horizontal' | 'vertical';
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: KeyboardEvent, i: number) => {
    const prev = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
    const next = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';
    let n = -1;
    if (e.key === next) n = (i + 1) % items.length;
    else if (e.key === prev) n = (i - 1 + items.length) % items.length;
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = items.length - 1;
    if (n < 0) return;
    e.preventDefault();
    onChange(items[n].key);
    refs.current[n]?.focus();
  };
  return (
    <div className={`tabs tabs--${variant}`} role="tablist" aria-label={label} aria-orientation={orientation}>
      {items.map((it, i) => {
        const on = it.key === value;
        return (
          <button
            key={it.key}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            id={`${idBase}-tab-${it.key}`}
            aria-selected={on}
            aria-controls={`${idBase}-panel`}
            tabIndex={on ? 0 : -1}
            className={`tabs__tab ${on ? 'is-on' : ''}`}
            onClick={() => onChange(it.key)}
            onKeyDown={(e) => onKey(e, i)}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}

export function TabPanel({ idBase, active, children, className = '' }: { idBase: string; active: string; children: ReactNode; className?: string }) {
  return (
    <div role="tabpanel" id={`${idBase}-panel`} aria-labelledby={`${idBase}-tab-${active}`} tabIndex={0} className={className}>
      {children}
    </div>
  );
}

export function Accordion({ items }: { items: { q: string; a: ReactNode }[] }) {
  const base = useId();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="accordion">
      {items.map((it, i) => {
        const on = open === i;
        return (
          <div className={`accordion__item ${on ? 'is-open' : ''}`} key={it.q}>
            <h3 className="accordion__h">
              <button
                id={`${base}-q${i}`}
                aria-expanded={on}
                aria-controls={`${base}-a${i}`}
                onClick={() => setOpen(on ? null : i)}
                className="accordion__btn"
              >
                <span>{it.q}</span>
                <span className="accordion__icon" aria-hidden="true" />
              </button>
            </h3>
            <div id={`${base}-a${i}`} role="region" aria-labelledby={`${base}-q${i}`} className="accordion__panel" hidden={!on}>
              <p>{it.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Notice({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="notice" role="note">
      <strong>{title}</strong> {children}
    </div>
  );
}

/* Animated signal bars; purely decorative */
export function Bars({ n = 12, tone = 'a', paused = false }: { n?: number; tone?: 'a' | 'b'; paused?: boolean }) {
  return (
    <div className={`bars bars--${tone} ${paused ? 'is-paused' : ''}`} aria-hidden="true">
      {Array.from({ length: n }, (_, i) => (
        <i key={i} style={{ animationDelay: `${(i * 137) % 900}ms`, height: `${30 + ((i * 53) % 70)}%` }} />
      ))}
    </div>
  );
}
