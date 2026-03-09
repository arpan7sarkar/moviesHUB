import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiSave, FiX, FiPlay, FiInfo, FiLayers, FiYoutube, FiImage, FiAlertCircle } from 'react-icons/fi';
import {
  useGetAdminMovieByIdQuery,
  useCreateMovieMutation,
  useUpdateMovieMutation,
} from '../../features/admin/adminApi';

const GENRE_OPTIONS = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
  'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music',
  'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western',
];

const CATEGORY_OPTIONS = [
  { value: 'general', label: 'General' },
  { value: 'featured', label: 'Featured' },
  { value: 'trending', label: 'Trending' },
  { value: 'popular', label: 'Popular' },
  { value: 'top_rated', label: 'Top Rated' },
  { value: 'upcoming', label: 'Upcoming' },
];

const initialFormState = {
  tmdbId: '',
  title: '',
  posterPath: '',
  description: '',
  releaseDate: '',
  genres: [],
  category: 'general',
  trailerUrl: '',
  voteAverage: '',
};

/** Extract YouTube video ID from various URL formats */
const extractYouTubeId = (url) => {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\s]+)/,
    /(?:youtu\.be\/)([^?\s]+)/,
    /(?:youtube\.com\/embed\/)([^?\s]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

const MovieForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const { data: existingMovie, isLoading: isLoadingMovie } = useGetAdminMovieByIdQuery(id, {
    skip: !id,
  });

  const [createMovie, { isLoading: isCreating }] = useCreateMovieMutation();
  const [updateMovie, { isLoading: isUpdating }] = useUpdateMovieMutation();

  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  // Populate form when editing
  useEffect(() => {
    if (existingMovie && isEditMode) {
      setForm({
        tmdbId: existingMovie.tmdbId || '',
        title: existingMovie.title || '',
        posterPath: existingMovie.posterPath || '',
        description: existingMovie.description || '',
        releaseDate: existingMovie.releaseDate || '',
        genres: existingMovie.genres || [],
        category: existingMovie.category || 'general',
        trailerUrl: existingMovie.trailerUrl || '',
        voteAverage: existingMovie.voteAverage || '',
      });
    }
  }, [existingMovie, isEditMode]);

  const youtubeId = useMemo(() => extractYouTubeId(form.trailerUrl), [form.trailerUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const toggleGenre = (genre) => {
    setForm((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre],
    }));
    if (errors.genres) {
      setErrors((prev) => ({ ...prev, genres: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.tmdbId) newErrors.tmdbId = 'TMDB ID IS REQUIRED';
    if (!form.title.trim()) newErrors.title = 'TITLE IS REQUIRED';
    if (form.genres.length === 0) newErrors.genres = 'SELECT AT LEAST ONE CLASSIFICATION';
    if (form.voteAverage && (isNaN(form.voteAverage) || form.voteAverage < 0 || form.voteAverage > 10)) {
      newErrors.voteAverage = 'RATING MUST BE BETWEEN 0 AND 10';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validate()) return;

    const payload = {
      ...form,
      tmdbId: Number(form.tmdbId),
      voteAverage: form.voteAverage ? Number(form.voteAverage) : undefined,
    };

    try {
      if (isEditMode) {
        await updateMovie({ id, ...payload }).unwrap();
      } else {
        await createMovie(payload).unwrap();
      }
      navigate('/admin/movies');
    } catch (err) {
      setSubmitError(err?.data?.message || 'CRITICAL FAILURE IN DATA TRANSMISSION. CHECK LOGS.');
    }
  };

  const isSaving = isCreating || isUpdating;

  if (isEditMode && isLoadingMovie) {
    return (
      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="animate-pulse space-y-4">
            <div className="h-4 w-32 bg-elevated rounded-full" />
            <div className="h-12 w-64 bg-elevated rounded-2xl" />
        </div>
        <div className="bg-secondary/40 border border-border/40 rounded-[2.5rem] p-10 h-[600px] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* ───── Page Header ───── */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row md:items-center gap-6"
      >
        <button
          onClick={() => navigate('/admin/movies')}
          className="w-14 h-14 rounded-2xl bg-secondary/60 border border-border/40 flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/40 transition-all cursor-pointer active:scale-90"
        >
          <FiArrowLeft size={24} />
        </button>
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">
            {isEditMode ? 'Protocol Update' : 'Initialize Project'}
          </p>
          <h1 className="text-4xl md:text-5xl font-display font-black text-text-primary uppercase italic tracking-tighter">
            {isEditMode ? 'Update' : 'Creative'} <span className="text-accent">Entry</span>
          </h1>
        </div>
      </motion.div>

      {/* ───── Submit Error ───── */}
      <AnimatePresence>
        {submitError && (
            <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-4 px-6 py-4 bg-danger/10 border border-danger/20 rounded-2xl text-xs font-black uppercase tracking-widest text-danger italic"
            >
                <FiAlertCircle size={20} />
                <span>{submitError}</span>
                <button onClick={() => setSubmitError('')} className="ml-auto cursor-pointer hover:scale-110 transition-transform">
                    <FiX size={18} />
                </button>
            </motion.div>
        )}
      </AnimatePresence>

      {/* ───── Form ───── */}
      <form onSubmit={handleSubmit} className="space-y-8 pb-20">
        
        {/* Basic Intelligence Section */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-secondary/20 backdrop-blur-xl border border-border/20 rounded-[2.5rem] p-8 md:p-12 space-y-10 shadow-premium"
        >
          <div className="flex items-center gap-3 border-b border-border/10 pb-6">
                <FiInfo className="text-accent" size={20} />
                <h2 className="text-sm font-black text-text-muted uppercase tracking-[0.3em] italic">
                    Core Intelligence
                </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* TMDB ID */}
            <div className="md:col-span-4">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-3 italic">
                Nexus Identifier (TMDB) <span className="text-danger">*</span>
              </label>
              <div className="relative group">
                   <FiLayers size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" />
                   <input
                        type="number"
                        name="tmdbId"
                        value={form.tmdbId}
                        onChange={handleChange}
                        placeholder="E.G. 550"
                        className={`w-full pl-14 pr-6 py-4 bg-primary/40 border rounded-2xl text-sm font-bold text-text-primary placeholder:text-text-muted/30 focus:outline-none transition-all ${
                        errors.tmdbId ? 'border-danger focus:ring-4 focus:ring-danger/5 shadow-[0_0_15px_rgba(var(--danger-rgb),0.1)]' : 'border-border/40 focus:border-accent/40 focus:ring-4 focus:ring-accent/5'
                        }`}
                    />
              </div>
              {errors.tmdbId && <p className="text-[10px] font-black text-danger mt-2 ml-1 italic tracking-widest">{errors.tmdbId}</p>}
            </div>

            {/* Title */}
            <div className="md:col-span-8">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-3 italic">
                Project Title <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="CINEMATIC TITLE HERE"
                className={`w-full px-6 py-4 bg-primary/40 border rounded-2xl text-sm font-black uppercase tracking-tight text-text-primary placeholder:text-text-muted/30 focus:outline-none transition-all italic ${
                  errors.title ? 'border-danger focus:ring-4 focus:ring-danger/5 shadow-[0_0_15px_rgba(var(--danger-rgb),0.1)]' : 'border-border/40 focus:border-accent/40 focus:ring-4 focus:ring-accent/5'
                }`}
              />
              {errors.title && <p className="text-[10px] font-black text-danger mt-2 ml-1 italic tracking-widest">{errors.title}</p>}
            </div>

            {/* Description */}
            <div className="md:col-span-12">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-3 italic">
                    Narrative Summary
                </label>
                <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={6}
                placeholder="ELABORATE ON THE CINEMATIC VISION..."
                className="w-full px-8 py-6 bg-primary/40 border border-border/40 rounded-3xl text-sm font-medium leading-relaxed text-text-primary placeholder:text-text-muted/30 focus:outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all resize-none"
                />
            </div>

            {/* Detailed Stats Row */}
            <div className="md:col-span-4">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-3 italic">
                Deployment Date
              </label>
              <input
                type="date"
                name="releaseDate"
                value={form.releaseDate}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-primary/40 border border-border/40 rounded-2xl text-xs font-black uppercase tracking-widest text-text-primary focus:outline-none focus:border-accent/40 transition-all cursor-pointer"
              />
            </div>

            <div className="md:col-span-4">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-3 italic">
                Critical Rating (0–10)
              </label>
              <input
                type="number"
                name="voteAverage"
                value={form.voteAverage}
                onChange={handleChange}
                step="0.1"
                min="0"
                max="10"
                placeholder="E.G. 8.5"
                className={`w-full px-6 py-4 bg-primary/40 border rounded-2xl text-sm font-black text-text-primary placeholder:text-text-muted/30 focus:outline-none transition-all ${
                  errors.voteAverage ? 'border-danger focus:ring-4 focus:ring-danger/5 shadow-[0_0_15px_rgba(var(--danger-rgb),0.1)]' : 'border-border/40 focus:border-accent/40 focus:ring-4 focus:ring-accent/5'
                }`}
              />
              {errors.voteAverage && <p className="text-[10px] font-black text-danger mt-2 ml-1 italic tracking-widest">{errors.voteAverage}</p>}
            </div>

            <div className="md:col-span-4">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-3 italic">
                Allocation Sector
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-primary/40 border border-border/40 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-text-primary focus:outline-none focus:border-accent/40 transition-all cursor-pointer appearance-none"
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-primary text-text-primary">
                    {opt.label.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Media Assets Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Classifications */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-secondary/20 backdrop-blur-xl border border-border/20 rounded-[2.5rem] p-8 md:p-10 space-y-8 shadow-premium"
            >
                <div className="flex items-center justify-between border-b border-border/10 pb-6">
                    <h2 className="text-sm font-black text-text-muted uppercase tracking-[0.3em] italic flex items-center gap-3">
                        <FiLayers className="text-accent" /> Classifications
                    </h2>
                    {form.genres.length > 0 && (
                        <span className="text-[10px] font-black text-accent uppercase tracking-widest bg-accent/10 px-3 py-1 rounded-full border border-accent/20 italic">
                            {form.genres.length} Matrix Linked
                        </span>
                    )}
                </div>

                <div className="flex flex-wrap gap-2.5">
                    {GENRE_OPTIONS.map((genre) => {
                    const isSelected = form.genres.includes(genre);
                    return (
                        <button
                        key={genre}
                        type="button"
                        onClick={() => toggleGenre(genre)}
                        className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] border transition-all duration-300 cursor-pointer ${
                            isSelected
                            ? 'bg-accent text-primary border-accent shadow-[0_5px_15px_rgba(var(--accent-rgb),0.3)]'
                            : 'bg-primary/20 text-text-muted/60 border-border/40 hover:border-accent/40 hover:text-text-primary'
                        }`}
                        >
                        {genre}
                        </button>
                    );
                    })}
                </div>
                {errors.genres && <p className="text-[10px] font-black text-danger italic tracking-widest">{errors.genres}</p>}
            </motion.div>

            {/* Visual Assets */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-secondary/20 backdrop-blur-xl border border-border/20 rounded-[2.5rem] p-8 md:p-10 space-y-8 shadow-premium"
            >
                <div className="flex items-center gap-3 border-b border-border/10 pb-6">
                    <FiImage className="text-accent" size={20} />
                    <h2 className="text-sm font-black text-text-muted uppercase tracking-[0.3em] italic">
                        Visual Assets
                    </h2>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-3 italic">
                            Poster Manifest Path
                        </label>
                        <input
                            type="text"
                            name="posterPath"
                            value={form.posterPath}
                            onChange={handleChange}
                            placeholder="/MANIFEST/PATH.JPG"
                            className="w-full px-6 py-4 bg-primary/40 border border-border/40 rounded-2xl text-[11px] font-mono text-text-primary placeholder:text-text-muted/30 focus:outline-none focus:border-accent/40 transition-all font-bold"
                        />
                    </div>

                    <AnimatePresence>
                        {form.posterPath && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex gap-6 items-end bg-black/10 p-5 rounded-3xl border border-white/5"
                            >
                                <div className="w-24 h-36 rounded-2xl overflow-hidden border border-border/40 bg-elevated shadow-card">
                                    <img
                                        src={`https://image.tmdb.org/t/p/w342${form.posterPath}`}
                                        alt="Render"
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                </div>
                                <div className="space-y-2 pb-2">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Visual Render</p>
                                    <p className="text-[9px] font-bold text-text-muted/60 font-mono italic">Sector: tmdb.org/t/p/w342</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>

        {/* Transmission & Data Feed Section */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-secondary/20 backdrop-blur-xl border border-border/20 rounded-[2.5rem] p-8 md:p-12 space-y-10 shadow-premium"
        >
          <div className="flex items-center gap-3 border-b border-border/10 pb-6">
                <FiYoutube className="text-accent" size={20} />
                <h2 className="text-sm font-black text-text-muted uppercase tracking-[0.3em] italic">
                    Data Transmission Feed
                </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5 space-y-6">
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-3 italic">
                        YouTube Transmission URL
                    </label>
                    <input
                    type="text"
                    name="trailerUrl"
                    value={form.trailerUrl}
                    onChange={handleChange}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-6 py-4 bg-primary/40 border border-border/40 rounded-2xl text-[11px] font-mono text-text-primary placeholder:text-text-muted/30 focus:outline-none focus:border-accent/40 transition-all font-bold"
                    />
                </div>
                
                {!youtubeId && form.trailerUrl && (
                    <div className="flex items-center gap-3 px-5 py-3 bg-warning/5 border border-warning/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-warning italic">
                        <FiPlay size={16} />
                        <span>Invalid Feed Key Detected</span>
                    </div>
                )}
            </div>

            <div className="lg:col-span-7">
                {youtubeId ? (
                <div className="rounded-[2.5rem] overflow-hidden border border-white/10 bg-black aspect-video shadow-2xl group relative">
                    <iframe
                        src={`https://www.youtube.com/embed/${youtubeId}`}
                        title="Trailer Transmission"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute inset-0 pointer-events-none border-4 border-accent/20 rounded-[2.5rem] mix-blend-overlay" />
                </div>
                ) : (
                    <div className="rounded-[2.5rem] border border-dashed border-border/40 bg-white/2 flex flex-col items-center justify-center aspect-video text-text-muted/30">
                        <FiYoutube size={48} className="mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-[0.4em]">Awaiting Data Feed</p>
                    </div>
                )}
            </div>
          </div>
        </motion.div>

        {/* ───── Transmission Controls ───── */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10"
        >
          <button
            type="submit"
            disabled={isSaving}
            className="group flex items-center justify-center gap-4 px-12 py-5 bg-accent text-primary font-black uppercase tracking-[0.2em] text-xs rounded-3xl hover:scale-105 active:scale-95 transition-all shadow-[0_15px_40px_rgba(var(--accent-rgb),0.4)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer italic overflow-hidden relative min-w-[280px]"
          >
            <AnimatePresence mode="wait">
                {isSaving ? (
                    <motion.div key="saving" className="flex items-center gap-3" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        Encrypting...
                    </motion.div>
                ) : (
                    <motion.div key="save" className="flex items-center gap-3" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                        <FiSave size={18} />
                        {isEditMode ? 'Commit Changes' : 'Execute Creation'}
                    </motion.div>
                )}
            </AnimatePresence>
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/admin/movies')}
            className="px-10 py-5 bg-white/5 border border-border/20 rounded-3xl text-xs font-black uppercase tracking-[0.2em] text-text-muted hover:text-text-primary hover:bg-white/10 hover:border-text-primary/20 transition-all cursor-pointer active:scale-95 italic"
          >
            Abort Protocol
          </button>
        </motion.div>
      </form>
    </div>
  );
};

export default MovieForm;
