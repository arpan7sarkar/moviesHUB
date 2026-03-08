import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiX, FiPlay } from 'react-icons/fi';
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
    if (!form.tmdbId) newErrors.tmdbId = 'TMDB ID is required';
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (form.genres.length === 0) newErrors.genres = 'Select at least one genre';
    if (form.voteAverage && (isNaN(form.voteAverage) || form.voteAverage < 0 || form.voteAverage > 10)) {
      newErrors.voteAverage = 'Rating must be between 0 and 10';
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
      setSubmitError(err?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  const isSaving = isCreating || isUpdating;

  if (isEditMode && isLoadingMovie) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-elevated rounded-lg animate-pulse" />
        <div className="bg-secondary border border-border rounded-xl p-6 space-y-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-elevated rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* ───── Header ───── */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/movies')}
          className="p-2 rounded-lg border border-border text-text-muted hover:bg-elevated hover:text-text-primary transition-all cursor-pointer"
        >
          <FiArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary">
            {isEditMode ? 'Edit Movie' : 'Add New Movie'}
          </h1>
          <p className="text-sm text-text-muted mt-0.5">
            {isEditMode ? 'Update movie details below.' : 'Fill in the details to add a movie to the catalog.'}
          </p>
        </div>
      </div>

      {/* ───── Submit Error ───── */}
      {submitError && (
        <div className="flex items-center gap-3 px-4 py-3 bg-danger/10 border border-danger/20 rounded-lg text-sm text-danger">
          <span>{submitError}</span>
          <button onClick={() => setSubmitError('')} className="ml-auto cursor-pointer">
            <FiX size={16} />
          </button>
        </div>
      )}

      {/* ───── Form ───── */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-secondary border border-border rounded-xl p-6 space-y-5">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
            Basic Information
          </h2>

          {/* Row: TMDB ID + Title */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                TMDB ID <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                name="tmdbId"
                value={form.tmdbId}
                onChange={handleChange}
                placeholder="e.g. 550"
                className={`w-full px-4 py-2.5 bg-primary border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none transition-colors ${
                  errors.tmdbId ? 'border-danger focus:border-danger' : 'border-border focus:border-accent/50'
                }`}
              />
              {errors.tmdbId && <p className="text-xs text-danger mt-1">{errors.tmdbId}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Title <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Movie title"
                className={`w-full px-4 py-2.5 bg-primary border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none transition-colors ${
                  errors.title ? 'border-danger focus:border-danger' : 'border-border focus:border-accent/50'
                }`}
              />
              {errors.title && <p className="text-xs text-danger mt-1">{errors.title}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Movie synopsis or description"
              className="w-full px-4 py-2.5 bg-primary border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors resize-none"
            />
          </div>

          {/* Row: Poster Path + Release Date + Rating */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Poster Path
              </label>
              <input
                type="text"
                name="posterPath"
                value={form.posterPath}
                onChange={handleChange}
                placeholder="/path/to/poster.jpg"
                className="w-full px-4 py-2.5 bg-primary border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors"
              />
              <p className="text-[11px] text-text-muted mt-1">TMDB poster path (e.g. /6Wdl9N6dL0Hi0T1qJLWSz6gMLbd.jpg)</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Release Date
              </label>
              <input
                type="date"
                name="releaseDate"
                value={form.releaseDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-primary border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Rating (0–10)
              </label>
              <input
                type="number"
                name="voteAverage"
                value={form.voteAverage}
                onChange={handleChange}
                step="0.1"
                min="0"
                max="10"
                placeholder="e.g. 8.5"
                className={`w-full px-4 py-2.5 bg-primary border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none transition-colors ${
                  errors.voteAverage ? 'border-danger focus:border-danger' : 'border-border focus:border-accent/50'
                }`}
              />
              {errors.voteAverage && <p className="text-xs text-danger mt-1">{errors.voteAverage}</p>}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full sm:w-auto px-4 py-2.5 bg-primary border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent/50 transition-colors cursor-pointer"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ───── Genre Multi-Select ───── */}
        <div className="bg-secondary border border-border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
              Genres <span className="text-danger">*</span>
            </h2>
            {form.genres.length > 0 && (
              <span className="text-xs text-accent font-medium">
                {form.genres.length} selected
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {GENRE_OPTIONS.map((genre) => {
              const isSelected = form.genres.includes(genre);
              return (
                <button
                  key={genre}
                  type="button"
                  onClick={() => toggleGenre(genre)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-accent/15 text-accent border-accent/30 shadow-sm'
                      : 'bg-primary text-text-muted border-border hover:border-text-muted hover:text-text-secondary'
                  }`}
                >
                  {genre}
                </button>
              );
            })}
          </div>
          {errors.genres && <p className="text-xs text-danger">{errors.genres}</p>}
        </div>

        {/* ───── Trailer ───── */}
        <div className="bg-secondary border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
            Trailer
          </h2>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              YouTube URL
            </label>
            <input
              type="text"
              name="trailerUrl"
              value={form.trailerUrl}
              onChange={handleChange}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-4 py-2.5 bg-primary border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>

          {/* Live Preview */}
          {youtubeId ? (
            <div className="rounded-xl overflow-hidden border border-border bg-black aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title="Trailer Preview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          ) : form.trailerUrl ? (
            <div className="flex items-center gap-2 px-4 py-3 bg-warning/10 border border-warning/20 rounded-lg text-sm text-warning">
              <FiPlay size={14} />
              <span>Could not detect a valid YouTube URL. Supported formats: youtube.com/watch?v=, youtu.be/, youtube.com/embed/</span>
            </div>
          ) : null}
        </div>

        {/* ───── Poster Preview ───── */}
        {form.posterPath && (
          <div className="bg-secondary border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
              Poster Preview
            </h2>
            <div className="w-32 h-48 rounded-lg overflow-hidden border border-border bg-elevated">
              <img
                src={`https://image.tmdb.org/t/p/w342${form.posterPath}`}
                alt="Poster preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </div>
        )}

        {/* ───── Actions ───── */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-accent text-primary font-semibold rounded-lg hover:bg-accent-hover transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm cursor-pointer"
          >
            <FiSave size={16} />
            {isSaving ? 'Saving...' : isEditMode ? 'Update Movie' : 'Create Movie'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/movies')}
            className="px-6 py-2.5 border border-border rounded-lg text-sm font-medium text-text-primary hover:bg-elevated transition-all cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default MovieForm;
