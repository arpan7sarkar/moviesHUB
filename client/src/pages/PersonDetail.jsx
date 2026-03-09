import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiExternalLink, FiInstagram, FiTwitter, FiFacebook,
  FiFilm, FiTv, FiUser, FiStar,
} from 'react-icons/fi';
import { useGetPersonDetailsQuery } from '../features/movies/movieApi';
import PageTransition from '../components/layout/PageTransition';
import DetailSkeleton from '../components/skeletons/DetailSkeleton';
import ContentRow from '../components/media/ContentRow';
import { resolvePoster, handlePosterError, getBlurBackground } from '../utils/mediaFallbacks';

/* ─── Filmography Tab Button ──────────────────────────────────────── */
const TabButton = ({ active, onClick, icon: Icon, label, count }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer
      ${active
        ? 'bg-accent/15 text-accent border border-accent/30'
        : 'bg-white/5 text-text-muted border border-border/30 hover:text-text-primary hover:bg-white/10'
      }`}
  >
    <Icon size={15} />
    <span>{label}</span>
    {count > 0 && (
      <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${active ? 'bg-accent/20 text-accent' : 'bg-white/10 text-text-muted'}`}>
        {count}
      </span>
    )}
  </button>
);

/* ─── Filmography Row ─────────────────────────────────────────────── */
const FilmographyItem = ({ credit, mediaType }) => {
  const year = (credit.release_date || credit.first_air_date)?.substring(0, 4) || '—';
  const title = credit.title || credit.name;
  const route = mediaType === 'movie' ? `/movies/${credit.id}` : `/tv/${credit.id}`;

  return (
    <Link
      to={route}
      className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/[0.04] transition-colors group"
    >
      {/* Poster Thumbnail */}
      <div className="w-10 h-14 rounded-lg overflow-hidden bg-elevated border border-border/20 flex-shrink-0">
        <img
          src={resolvePoster(credit.poster_path, 'w92')}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={handlePosterError}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text-primary truncate group-hover:text-accent transition-colors">{title}</p>
        {credit.character && (
          <p className="text-xs text-text-muted truncate">as {credit.character}</p>
        )}
        {credit.job && (
          <p className="text-xs text-text-muted truncate">{credit.job}</p>
        )}
      </div>

      {/* Year + Rating */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {credit.vote_average > 0 && (
          <span className="flex items-center gap-1 text-xs text-accent font-mono">
            <FiStar size={11} className="fill-current" />
            {credit.vote_average.toFixed(1)}
          </span>
        )}
        <span className="text-text-muted text-xs font-mono w-10 text-right">{year}</span>
      </div>
    </Link>
  );
};

/* ─── Main PersonDetail Component ─────────────────────────────────── */
const PersonDetail = () => {
  const { id } = useParams();
  const [showFullBio, setShowFullBio] = useState(false);
  const [filmographyTab, setFilmographyTab] = useState('movies');
  const [profileLoaded, setProfileLoaded] = useState(false);

  const { data: person, isLoading, isError } = useGetPersonDetailsQuery(id);

  // Known For — top 10 by popularity
  const knownFor = useMemo(() => {
    if (!person?.combined_credits?.cast) return [];
    return person.combined_credits.cast
      .filter((c) => c.vote_count > 50)
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 10);
  }, [person]);

  // Full Filmography grouped & sorted
  const filmography = useMemo(() => {
    if (!person?.combined_credits) return { movies: [], tv: [] };

    const allCast = person.combined_credits.cast || [];
    const allCrew = person.combined_credits.crew || [];

    // Combine & deduplicate
    const combined = [...allCast, ...allCrew];
    const seen = new Set();
    const unique = combined.filter((c) => {
      const key = `${c.id}-${c.media_type}-${c.character || c.job || ''}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const movies = unique
      .filter((c) => c.media_type === 'movie')
      .sort((a, b) => {
        const yearA = a.release_date ? parseInt(a.release_date.substring(0, 4)) : 0;
        const yearB = b.release_date ? parseInt(b.release_date.substring(0, 4)) : 0;
        return yearB - yearA;
      });

    const tv = unique
      .filter((c) => c.media_type === 'tv')
      .sort((a, b) => {
        const yearA = a.first_air_date ? parseInt(a.first_air_date.substring(0, 4)) : 0;
        const yearB = b.first_air_date ? parseInt(b.first_air_date.substring(0, 4)) : 0;
        return yearB - yearA;
      });

    return { movies, tv };
  }, [person]);

  // Social links
  const socialLinks = useMemo(() => {
    if (!person?.external_ids) return [];
    const ids = person.external_ids;
    const links = [];
    if (ids.instagram_id) links.push({ id: 'instagram', icon: <FiInstagram />, url: `https://instagram.com/${ids.instagram_id}` });
    if (ids.twitter_id) links.push({ id: 'twitter', icon: <FiTwitter />, url: `https://twitter.com/${ids.twitter_id}` });
    if (ids.facebook_id) links.push({ id: 'facebook', icon: <FiFacebook />, url: `https://facebook.com/${ids.facebook_id}` });
    if (person.homepage) links.push({ id: 'homepage', icon: <FiExternalLink />, url: person.homepage });
    return links;
  }, [person]);

  const activeFilmography = filmographyTab === 'movies' ? filmography.movies : filmography.tv;

  React.useEffect(() => {
    setProfileLoaded(false);
  }, [id]);

  if (isLoading) return <PageTransition><DetailSkeleton /></PageTransition>;

  if (isError || !person) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-primary flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-display text-text-primary mb-4">Person not found</h1>
            <Link to="/" className="btn-primary px-6 py-2">Go Home</Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  const age = person.birthday
    ? Math.floor((new Date() - new Date(person.birthday)) / (365.25 * 24 * 60 * 60 * 1000))
    : null;

  return (
    <PageTransition>
      <main className="min-h-screen bg-primary pt-[4.5rem] md:pt-20 pb-20">
        <div className="container-custom px-4 md:px-8">
          <div className="flex flex-col md:flex-row gap-10 md:gap-16">

            {/* ═══════════ LEFT COLUMN: Profile & Info ═══════════ */}
            <motion.div
              className="md:w-72 lg:w-80 flex-shrink-0 flex flex-col items-center md:items-start"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Circular Profile Image */}
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-elevated border-4 border-border/30 mb-8">
                <img
                  src={resolvePoster(person.profile_path, 'w780')}
                  alt={person.name}
                  loading="lazy"
                  onLoad={() => setProfileLoaded(true)}
                  onError={handlePosterError}
                  className={`w-full h-full object-cover transition-all duration-500 ${
                    profileLoaded ? 'blur-0 scale-100 opacity-100' : 'blur-xl scale-[1.03] opacity-75'
                  }`}
                  style={getBlurBackground('detail')}
                />
              </div>

              {/* Name (mobile only) */}
              <h1 className="text-3xl font-display font-black text-text-primary mb-4 tracking-tight md:hidden text-center">
                {person.name}
              </h1>

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div className="flex gap-3 mb-8 justify-center md:justify-start">
                  {socialLinks.map(link => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-elevated border border-border/50 flex items-center justify-center text-text-primary hover:text-accent hover:border-accent transition-all text-lg shadow-lg"
                    >
                      {link.icon}
                    </a>
                  ))}
                </div>
              )}

              {/* Personal Info Card */}
              <div className="w-full space-y-5 bg-white/[0.02] border border-border/15 rounded-2xl p-6">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-accent/80 mb-2">Personal Info</h3>

                <div>
                  <p className="text-text-muted text-[11px] uppercase font-black tracking-widest mb-1">Known For</p>
                  <p className="text-text-primary font-medium text-sm">{person.known_for_department || '—'}</p>
                </div>

                <div>
                  <p className="text-text-muted text-[11px] uppercase font-black tracking-widest mb-1">Gender</p>
                  <p className="text-text-primary font-medium text-sm">
                    {person.gender === 1 ? 'Female' : person.gender === 2 ? 'Male' : 'Other'}
                  </p>
                </div>

                {person.birthday && (
                  <div>
                    <p className="text-text-muted text-[11px] uppercase font-black tracking-widest mb-1">Birthday</p>
                    <p className="text-text-primary font-medium text-sm">
                      {new Date(person.birthday).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    {age && !person.deathday && (
                      <p className="text-text-muted text-xs mt-0.5">({age} years old)</p>
                    )}
                  </div>
                )}

                {person.deathday && (
                  <div>
                    <p className="text-text-muted text-[11px] uppercase font-black tracking-widest mb-1">Death</p>
                    <p className="text-text-primary font-medium text-sm">
                      {new Date(person.deathday).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                )}

                {person.place_of_birth && (
                  <div>
                    <p className="text-text-muted text-[11px] uppercase font-black tracking-widest mb-1">Place of Birth</p>
                    <p className="text-text-primary font-medium text-sm">{person.place_of_birth}</p>
                  </div>
                )}

                {person.also_known_as?.length > 0 && (
                  <div>
                    <p className="text-text-muted text-[11px] uppercase font-black tracking-widest mb-1">Also Known As</p>
                    <p className="text-text-primary font-medium text-sm">{person.also_known_as.slice(0, 3).join(', ')}</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* ═══════════ RIGHT COLUMN: Bio, Known For, Filmography ═══════════ */}
            <div className="flex-1 min-w-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                {/* Name (desktop) */}
                <h1 className="hidden md:block text-4xl lg:text-6xl font-display font-black text-text-primary mb-6 tracking-tight">
                  {person.name}
                </h1>

                {/* Biography */}
                {person.biography && (
                  <div className="mb-14">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-accent/80 mb-4">Biography</h3>
                    <div className="relative">
                      <p className={`text-text-secondary text-base md:text-lg leading-relaxed ${!showFullBio && person.biography.length > 600 ? 'line-clamp-6' : ''}`}>
                        {person.biography}
                      </p>
                      {person.biography.length > 600 && (
                        <button
                          onClick={() => setShowFullBio(!showFullBio)}
                          className="text-accent font-bold mt-3 hover:text-accent-hover transition-colors text-sm cursor-pointer"
                        >
                          {showFullBio ? 'Show Less' : 'Read More'}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Known For Horizontal Row */}
                {knownFor.length > 0 && (
                  <div className="mb-14">
                    <ContentRow
                      title="Known For"
                      items={knownFor}
                      mediaType="movie"
                    />
                  </div>
                )}

                {/* ═══════════ Full Filmography ═══════════ */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex items-center gap-6 mb-6">
                    <h2 className="text-2xl md:text-3xl font-display font-black text-text-primary tracking-tighter uppercase italic">
                      Filmography
                    </h2>
                    <div className="h-[2px] flex-1 bg-gradient-to-r from-accent/40 via-border/20 to-transparent" />
                  </div>

                  {/* Tab Buttons */}
                  <div className="flex gap-3 mb-6">
                    <TabButton
                      active={filmographyTab === 'movies'}
                      onClick={() => setFilmographyTab('movies')}
                      icon={FiFilm}
                      label="Movies"
                      count={filmography.movies.length}
                    />
                    <TabButton
                      active={filmographyTab === 'tv'}
                      onClick={() => setFilmographyTab('tv')}
                      icon={FiTv}
                      label="TV Shows"
                      count={filmography.tv.length}
                    />
                  </div>

                  {/* Filmography List */}
                  <div className="border border-border/10 rounded-2xl bg-white/[0.01] divide-y divide-border/10 max-h-[600px] overflow-y-auto no-scrollbar">
                    {activeFilmography.length > 0 ? (
                      activeFilmography.map((credit, i) => (
                        <FilmographyItem
                          key={`${credit.id}-${credit.character || credit.job || i}`}
                          credit={credit}
                          mediaType={filmographyTab === 'movies' ? 'movie' : 'tv'}
                        />
                      ))
                    ) : (
                      <div className="text-center py-16 text-text-muted">
                        <p>No {filmographyTab === 'movies' ? 'movie' : 'TV'} credits found.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </PageTransition>
  );
};

export default PersonDetail;
