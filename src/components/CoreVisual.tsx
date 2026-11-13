import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import type { CoreVariant } from '../three/CoreScene';

const CoreScene = lazy(() => import('../three/CoreScene'));

type Capability = { webgl: boolean; reduced: boolean; low: boolean };

function detect(): Capability {
  if (typeof window === 'undefined') return { webgl: false, reduced: true, low: true };
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let webgl = false;
  try {
    const c = document.createElement('canvas');
    webgl = !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    webgl = false;
  }
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  const small = window.matchMedia('(max-width: 760px)').matches;
  const low = small || (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4 || !!nav.connection?.saveData;
  return { webgl, reduced, low };
}

/* Static, CSS-only version of the core. Shown instantly, kept under the canvas while it
   loads, and used on its own for reduced motion or when WebGL is unavailable. */
export function CoreFallback({ variant = 'both' }: { variant?: CoreVariant }) {
  return (
    <div className={`core-fallback core-fallback--${variant}`} aria-hidden="true">
      <span className="core-fallback__glow" />
      <span className="core-fallback__ring core-fallback__ring--1" />
      <span className="core-fallback__ring core-fallback__ring--2" />
      <span className="core-fallback__ring core-fallback__ring--3" />
      <span className="core-fallback__orb" />
      <svg className="core-fallback__paths" viewBox="0 0 800 800" fill="none">
        {variant !== 'b' && <path d="M400 400 C 520 340, 600 260, 800 200" stroke="url(#fa)" strokeWidth="2" />}
        {variant !== 'a' && <path d="M400 400 C 300 440, 200 520, 260 640 S 420 760, 470 800" stroke="url(#fb)" strokeWidth="2" />}
        <defs>
          <linearGradient id="fa" x1="400" y1="400" x2="800" y2="200" gradientUnits="userSpaceOnUse">
            <stop stopColor="#39d8f2" />
            <stop offset="1" stopColor="#39d8f2" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="fb" x1="400" y1="400" x2="470" y2="800" gradientUnits="userSpaceOnUse">
            <stop stopColor="#b9aeff" />
            <stop offset="1" stopColor="#b9aeff" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export default function CoreVisual({
  variant = 'both',
  offset = [0, 0],
  mobileOffset,
  scrollLinked = false,
  className = '',
}: {
  variant?: CoreVariant;
  offset?: [number, number];
  mobileOffset?: [number, number];
  scrollLinked?: boolean;
  className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(0);
  const [cap, setCap] = useState<Capability | null>(null);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => setCap(detect()), []);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setMounted(true);
      },
      { rootMargin: '200px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!scrollLinked) return;
    const onScroll = () => {
      const el = host.current;
      if (!el) return;
      const h = el.offsetHeight || 1;
      scrollRef.current = Math.min(1, Math.max(0, window.scrollY / h));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [scrollLinked]);

  useEffect(() => {
    if (!mounted) return;
    const t = window.setTimeout(() => setReady(true), 500);
    return () => window.clearTimeout(t);
  }, [mounted]);

  const use3d = !!cap && cap.webgl && !cap.reduced;
  const small = typeof window !== 'undefined' && window.matchMedia('(max-width: 860px)').matches;
  const off = small && mobileOffset ? mobileOffset : offset;

  return (
    <div ref={host} className={`core-visual ${className} ${use3d && ready ? 'is-live' : ''}`} aria-hidden="true">
      <div className="core-visual__fallback" style={{ transform: `translate(${off[0] * 50}%, ${-off[1] * 50}%)` }}>
        <CoreFallback variant={variant} />
      </div>
      {use3d && mounted && (
        <Suspense fallback={null}>
          <div className="core-visual__canvas">
            <CoreScene
              variant={variant}
              quality={cap.low ? 'low' : 'high'}
              active={visible}
              scrollRef={scrollLinked ? scrollRef : undefined}
              offset={off}
            />
          </div>
        </Suspense>
      )}
    </div>
  );
}
