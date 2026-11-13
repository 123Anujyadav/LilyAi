import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { routes } from './content/site';
import Home from './pages/Home';

/* Interior pages are split out of the initial bundle */
const page = (name: keyof typeof import('./pages/interior')) =>
  lazy(() => import('./pages/interior').then((m) => ({ default: m[name] })));

const Product = page('Product');
const ModeA = page('ModeA');
const ModeB = page('ModeB');
const HowItWorks = page('HowItWorks');
const Solutions = page('Solutions');
const Technology = page('Technology');
const Security = page('Security');
const About = page('About');
const Contact = page('Contact');
const Faq = page('Faq');
const Privacy = page('Privacy');
const Terms = page('Terms');
const NotFound = page('NotFound');

export default function App() {
  return (
    <Suspense fallback={<div className="route-fallback" aria-busy="true" />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path={routes.home} element={<Home />} />
          <Route path={routes.product} element={<Product />} />
          <Route path={routes.modeA} element={<ModeA />} />
          <Route path={routes.modeB} element={<ModeB />} />
          <Route path={routes.how} element={<HowItWorks />} />
          <Route path={routes.solutions} element={<Solutions />} />
          <Route path={routes.technology} element={<Technology />} />
          <Route path={routes.security} element={<Security />} />
          <Route path={routes.about} element={<About />} />
          <Route path={routes.contact} element={<Contact />} />
          <Route path={routes.faq} element={<Faq />} />
          <Route path={routes.privacy} element={<Privacy />} />
          <Route path={routes.terms} element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
