import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { legacyHashes, meta, routes } from '../content/site';
import { Button } from './ui';

const SITE_URL = 'https://example.com'; /* placeholder: the deployment domain is not known yet */

function Logo() {
  return (
    <Link to={routes.home} className="logo" aria-label="Lily AI home">
      <span className="logo__tile">
        <img src="/assets/lily-mark-256.png" alt="" width="34" height="32" />
      </span>
      <span className="logo__word">
        Lily <b>AI</b>
      </span>
    </Link>
  );
}

const productLinks = [
  { to: routes.product, label: 'Product overview', desc: 'One intelligence, two ways to work a conversation' },
  { to: routes.modeA, label: 'Mode A — Autonomous Calling Agent', desc: 'Lily speaks in an in-app call. Beta', tone: 'a' },
  { to: routes.modeB, label: 'Mode B — Live Copilot', desc: 'Private assistance only you can see', tone: 'b' },
  { to: routes.how, label: 'How It Works', desc: 'Connect, listen, understand, assist, capture' },
];

const mainLinks = [
  { to: routes.solutions, label: 'Solutions' },
  { to: routes.technology, label: 'Platform' },
  { to: routes.security, label: 'Security' },
  { to: routes.about, label: 'About' },
  { to: routes.faq, label: 'FAQs' },
  { to: routes.contact, label: 'Contact' },
];

function Nav() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [drop, setDrop] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    setMenu(false);
    setDrop(false);
  }, [pathname]);

  useEffect(() => {
    if (!drop) return;
    const click = (e: MouseEvent) => {
      if (!dropRef.current?.contains(e.target as Node)) setDrop(false);
    };
    const key = (e: KeyboardEvent) => e.key === 'Escape' && setDrop(false);
    document.addEventListener('mousedown', click);
    document.addEventListener('keydown', key);
    return () => {
      document.removeEventListener('mousedown', click);
      document.removeEventListener('keydown', key);
    };
  }, [drop]);

  /* Mobile menu: lock scroll, trap focus, close on Escape */
  useEffect(() => {
    if (!menu) return;
    document.body.style.overflow = 'hidden';
    const focusables = () =>
      Array.from(panel.current?.querySelectorAll<HTMLElement>('a,button') ?? []).filter((el) => !el.hasAttribute('disabled'));
    focusables()[0]?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenu(false);
        menuBtn.current?.focus();
      }
      if (e.key !== 'Tab') return;
      const f = [menuBtn.current!, ...focusables()];
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', key);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', key);
    };
  }, [menu]);

  const productActive = productLinks.some((l) => l.to === pathname);
  /* Pages with a light hero need dark nav text until the bar turns solid */
  const onLight = ([routes.security, routes.privacy, routes.terms] as string[]).includes(pathname) && !scrolled && !menu;

  return (
    <>
    <header className={`nav ${scrolled || menu ? 'nav--solid' : ''} ${onLight ? 'nav--light' : ''}`}>
      <nav className="nav__bar wrap" aria-label="Main">
        <Logo />
        <ul className="nav__links">
          <li>
            <div className="nav__drop" ref={dropRef} onMouseEnter={() => setDrop(true)} onMouseLeave={() => setDrop(false)}>
              <button
                className={`nav__link nav__link--btn ${productActive ? 'is-active' : ''}`}
                aria-expanded={drop}
                aria-controls="nav-product"
                onClick={() => setDrop((d) => !d)}
              >
                Product
                <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                  <path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </button>
              <div id="nav-product" className={`nav__menu ${drop ? 'is-open' : ''}`}>
                {productLinks.map((l) => (
                  <NavLink key={l.to} to={l.to} className={`nav__menu-item ${l.tone ? `nav__menu-item--${l.tone}` : ''}`} tabIndex={drop ? 0 : -1}>
                    <span>{l.label}</span>
                    <small>{l.desc}</small>
                  </NavLink>
                ))}
              </div>
            </div>
          </li>
          {mainLinks.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`}>
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="nav__actions">
          <span className="nav__cta">
            <Button to={routes.product} size="sm">
              Explore Lily AI
            </Button>
          </span>
          <button
            ref={menuBtn}
            className="nav__toggle"
            aria-expanded={menu}
            aria-controls="mobile-menu"
            aria-label={menu ? 'Close menu' : 'Open menu'}
            onClick={() => setMenu((m) => !m)}
          >
            <span className={`burger ${menu ? 'is-open' : ''}`} aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>
      </nav>
    </header>
    <div id="mobile-menu" ref={panel} className={`mobile ${menu ? 'is-open' : ''}`} hidden={!menu}>
      <div className="mobile__inner wrap">
        <p className="mobile__label">Product</p>
        {productLinks.map((l, i) => (
          <NavLink key={l.to} to={l.to} className="mobile__link" style={{ transitionDelay: `${60 + i * 40}ms` }}>
            {l.label}
          </NavLink>
        ))}
        <p className="mobile__label">Company</p>
        {mainLinks.map((l, i) => (
          <NavLink key={l.to} to={l.to} className="mobile__link" style={{ transitionDelay: `${220 + i * 40}ms` }}>
            {l.label}
          </NavLink>
        ))}
        <div className="mobile__cta">
          <Button to={routes.product}>Explore Lily AI</Button>
        </div>
      </div>
    </div>
    </>
  );
}

function Footer() {
  const cols = [
    {
      h: 'Product',
      links: [
        [routes.product, 'Product overview'],
        [routes.how, 'How It Works'],
        [routes.technology, 'Platform'],
      ],
    },
    {
      h: 'Modes',
      links: [
        [routes.modeA, 'Mode A — Autonomous Calling'],
        [routes.modeB, 'Mode B — Live Copilot'],
        [routes.solutions, 'Solutions'],
      ],
    },
    {
      h: 'Company',
      links: [
        [routes.about, 'About'],
        [routes.faq, 'FAQs'],
        [routes.contact, 'Contact'],
      ],
    },
    {
      h: 'Legal',
      links: [
        [routes.security, 'Security & Privacy'],
        [routes.privacy, 'Privacy Policy'],
        [routes.terms, 'Terms & Conditions'],
      ],
    },
  ];
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__top">
          <div className="footer__brand">
            <Logo />
            <p>Your identical twin on every call. Listening. Thinking. Briefing you live.</p>
          </div>
          {cols.map((c) => (
            <nav key={c.h} aria-label={c.h} className="footer__col">
              <h2>{c.h}</h2>
              <ul>
                {c.links.map(([to, label]) => (
                  <li key={to}>
                    <Link to={to}>{label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="footer__status">
          <span>Private by design</span>
          <span>English + Hindi/Hinglish</span>
          <span>Mode A in Beta</span>
          <span>In-app calls only</span>
        </div>
        <div className="footer__base">
          <span>© 2026 Lily AI. Real-time conversational intelligence.</span>
          <span>Photography: Pexels. People pictured are models, not Lily AI customers.</span>
        </div>
      </div>
    </footer>
  );
}

function useSeo() {
  const { pathname } = useLocation();
  useEffect(() => {
    const m = meta[pathname] ?? { title: 'Page not found — Lily AI', description: 'This page does not exist.' };
    document.title = m.title;
    const set = (sel: string, attr: string, value: string) => {
      let el = document.head.querySelector<HTMLElement>(sel);
      if (!el) {
        el = document.createElement(sel.startsWith('link') ? 'link' : 'meta');
        const [, k, v] = sel.match(/\[(.+?)="(.+?)"\]/)!;
        el.setAttribute(k, v);
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };
    set('meta[name="description"]', 'content', m.description);
    set('meta[property="og:title"]', 'content', m.title);
    set('meta[property="og:description"]', 'content', m.description);
    set('meta[property="og:url"]', 'content', SITE_URL + pathname);
    set('link[rel="canonical"]', 'href', SITE_URL + pathname);
    set('meta[name="robots"]', 'content', meta[pathname] ? 'index,follow' : 'noindex');
  }, [pathname]);
}

export default function Layout() {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const main = useRef<HTMLElement>(null);
  const first = useRef(true);
  useSeo();

  /* Old single-file links such as /#modea keep working */
  useEffect(() => {
    const key = hash.replace('#', '');
    if (pathname === '/' && key && legacyHashes[key] && key !== 'home') navigate(legacyHashes[key], { replace: true });
  }, [pathname, hash, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (first.current) {
      first.current = false;
      return;
    }
    main.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main" ref={main} tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
