import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FiArrowRight,
  FiBookmark,
  FiClock,
  FiCompass,
  FiHeart,
  FiLayers,
  FiPlayCircle,
  FiSearch,
  FiTrendingUp,
} from 'react-icons/fi';

const featureCards = [
  {
    icon: FiSearch,
    eyebrow: 'Discovery Engine',
    title: 'Search across movies, TV shows, and people in one flow.',
    copy:
      'Jump from broad discovery to exact titles without switching screens or losing context.',
  },
  {
    icon: FiBookmark,
    eyebrow: 'Decision Memory',
    title: 'Turn quick finds into a watchlist that stays actionable.',
    copy:
      'Save what looks promising now, then come back with your shortlist already organized.',
  },
  {
    icon: FiClock,
    eyebrow: 'Viewing History',
    title: 'Keep a living record of what you watched and when.',
    copy:
      'History, favorites, and watchlist work together so your next pick gets smarter over time.',
  },
];

const workflowSteps = [
  {
    label: '01',
    title: 'Discover signal, not noise',
    copy: 'Trending, top-rated, regional picks, anime, and genre rails make the catalog easier to read.',
  },
  {
    label: '02',
    title: 'Build your private queue',
    copy: 'Save titles, compare them later, and keep your next watch choices visible instead of forgotten.',
  },
  {
    label: '03',
    title: 'Return with context',
    copy: 'Favorites and history give you a persistent memory layer across sessions and devices.',
  },
];

const PlatformLanding = () => {
  const { isAuthenticated } = useSelector((state) => state.auth || {});

  return (
    <section className="relative overflow-hidden py-14 md:py-20">
      <div className="pointer-events-none absolute inset-x-0 top-4 h-72 bg-[radial-gradient(circle_at_top,rgba(212,168,83,0.16),transparent_62%)]" />
      <div className="pointer-events-none absolute right-0 top-28 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(212,168,83,0.1),transparent_68%)] blur-3xl" />

      <div className="container-custom relative">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
          <div className="rounded-[30px] border border-border/60 bg-secondary/55 p-6 backdrop-blur-xl md:p-8 lg:p-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">
              <FiCompass size={13} />
              Entertainment command center
            </span>

            <h2 className="mt-5 max-w-4xl font-display text-4xl leading-none text-text-primary sm:text-5xl lg:text-6xl">
              A product-style home for finding, sorting, and remembering what to watch next.
            </h2>

            <p className="mt-5 max-w-3xl text-base leading-8 text-text-secondary md:text-lg">
              CineVault is not just a catalog. It is the operating layer between discovery and decision, built
              to help users search faster, save better picks, and keep their watch momentum alive.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-border/60 bg-primary/45 p-4">
                <p className="text-[11px] uppercase tracking-[0.24em] text-text-muted">Core value</p>
                <p className="mt-2 font-display text-2xl text-text-primary">Find faster</p>
                <p className="mt-2 text-sm leading-6 text-text-secondary">Search, trend rails, and category-driven browsing.</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-primary/45 p-4">
                <p className="text-[11px] uppercase tracking-[0.24em] text-text-muted">Retention loop</p>
                <p className="mt-2 font-display text-2xl text-text-primary">Save smarter</p>
                <p className="mt-2 text-sm leading-6 text-text-secondary">Watchlist and favorites keep intent visible.</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-primary/45 p-4">
                <p className="text-[11px] uppercase tracking-[0.24em] text-text-muted">Replay value</p>
                <p className="mt-2 font-display text-2xl text-text-primary">Return ready</p>
                <p className="mt-2 text-sm leading-6 text-text-secondary">History reconnects every session with context.</p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to={isAuthenticated ? '/movies' : '/register'} className="btn-primary inline-flex items-center gap-2 px-6 py-3">
                {isAuthenticated ? 'Browse catalog' : 'Create account'}
                <FiArrowRight size={16} />
              </Link>
              <Link
                to={isAuthenticated ? '/watchlist' : '/register'}
                className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-elevated/40 px-6 py-3 text-sm font-medium text-text-primary transition-colors hover:border-accent/40 hover:bg-elevated"
              >
                {isAuthenticated ? 'Open watchlist' : 'Create your queue'}
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[30px] border border-border/60 bg-gradient-to-br from-secondary via-primary to-primary p-6 md:p-8">
            <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-accent">Platform snapshot</p>
                <h3 className="mt-2 font-display text-3xl text-text-primary">Why the product lands</h3>
              </div>
              <div className="rounded-full border border-border/60 bg-secondary/60 p-3 text-accent">
                <FiLayers size={18} />
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="rounded-2xl border border-border/60 bg-secondary/55 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-text-muted">Universal search</p>
                    <p className="mt-2 text-lg font-semibold text-text-primary">Movies, TV, and people from one search layer.</p>
                  </div>
                  <FiSearch className="shrink-0 text-accent" size={18} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/60 bg-secondary/45 p-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-accent/12 p-3 text-accent">
                      <FiHeart size={18} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Favorites</p>
                      <p className="mt-1 font-semibold text-text-primary">Keep standout titles close.</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-border/60 bg-secondary/45 p-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-accent/12 p-3 text-accent">
                      <FiBookmark size={18} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Watchlist</p>
                      <p className="mt-1 font-semibold text-text-primary">Turn interest into a usable queue.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border/60 bg-[linear-gradient(135deg,rgba(212,168,83,0.14),rgba(255,255,255,0.03))] p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-text-muted">Retention layer</p>
                    <p className="mt-2 text-lg font-semibold text-text-primary">History closes the loop after every viewing session.</p>
                  </div>
                  <div className="rounded-full border border-accent/35 bg-accent/10 p-3 text-accent">
                    <FiTrendingUp size={18} />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border/60 bg-primary/55 p-5">
                <p className="font-branding text-4xl uppercase leading-none tracking-[0.12em] text-accent/85">Discover. Save. Return.</p>
                <p className="mt-3 max-w-xl text-sm leading-7 text-text-secondary">
                  The homepage should explain the product before it asks users to browse. This section frames CineVault as a
                  premium utility, not just another poster wall.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {featureCards.map(({ icon: Icon, eyebrow, title, copy }) => (
            <article
              key={eyebrow}
              className="rounded-[26px] border border-border/60 bg-secondary/40 p-6 backdrop-blur-md transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] uppercase tracking-[0.22em] text-text-muted">{eyebrow}</span>
                <div className="rounded-full bg-accent/12 p-2.5 text-accent">
                  <Icon size={16} />
                </div>
              </div>
              <h3 className="mt-5 text-2xl leading-8 text-text-primary">{title}</h3>
              <p className="mt-4 text-sm leading-7 text-text-secondary">{copy}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-[32px] border border-border/60 bg-primary/60 p-6 md:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[11px] uppercase tracking-[0.24em] text-accent">How the product works</p>
              <h3 className="mt-3 font-display text-3xl text-text-primary md:text-4xl">
                A clear workflow from discovery to playback decisions.
              </h3>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/50 px-4 py-2 text-sm text-text-secondary">
              <FiPlayCircle size={16} className="text-accent" />
              Built for browsing sessions that usually end in indecision
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {workflowSteps.map((step) => (
              <div key={step.label} className="rounded-[24px] border border-border/60 bg-secondary/40 p-6">
                <div className="font-branding text-4xl tracking-[0.12em] text-accent/90">{step.label}</div>
                <h4 className="mt-4 text-2xl text-text-primary">{step.title}</h4>
                <p className="mt-3 text-sm leading-7 text-text-secondary">{step.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformLanding;
