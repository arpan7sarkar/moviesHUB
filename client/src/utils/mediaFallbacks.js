export const PLACEHOLDER_POSTER = '/placeholder-poster.webp';
export const TINY_BLUR_THUMB =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxNicgaGVpZ2h0PScyNCcgdmlld0JveD0nMCAwIDE2IDI0Jz48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9J2cnIHgxPScwJyB4Mj0nMScgeTE9JzAnIHkyPScxJz48c3RvcCBzdG9wLWNvbG9yPScjMWExOTI4Jy8+PHN0b3Agb2Zmc2V0PScxJyBzdG9wLWNvbG9yPScjMjgyODM2Jy8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9JzE2JyBoZWlnaHQ9JzI0JyBmaWxsPSd1cmwoI2cpJy8+PC9zdmc+";
export const TINY_BLUR_DETAIL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSczMicgaGVpZ2h0PSc0OCcgdmlld0JveD0nMCAwIDMyIDQ4Jz48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9J2cnIHgxPScwJyB4Mj0nMScgeTE9JzAnIHkyPScxJz48c3RvcCBzdG9wLWNvbG9yPScjMTExODI3Jy8+PHN0b3Agb2Zmc2V0PScxJyBzdG9wLWNvbG9yPScjMWYyOTM3Jy8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9JzMyJyBoZWlnaHQ9JzQ4JyBmaWxsPSd1cmwoI2cpJy8+PC9zdmc+";

const INLINE_POSTER_FALLBACK =
  "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='450' viewBox='0 0 300 450'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' x2='1' y1='0' y2='1'%3E%3Cstop stop-color='%23111827'/%3E%3Cstop offset='1' stop-color='%231f2937'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='300' height='450' fill='url(%23g)'/%3E%3Crect x='42' y='60' width='216' height='330' rx='16' fill='none' stroke='%23d4a853' stroke-opacity='0.28'/%3E%3Ctext x='50%25' y='52%25' fill='%23d1d5db' font-size='20' font-family='Inter,Arial,sans-serif' text-anchor='middle'%3EPoster Unavailable%3C/text%3E%3C/svg%3E";

export const resolvePoster = (path, size = 'w300') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : PLACEHOLDER_POSTER;

export const getBlurBackground = (variant = 'thumb') => ({
  backgroundImage: `url(${variant === 'detail' ? TINY_BLUR_DETAIL : TINY_BLUR_THUMB})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
});

export const handlePosterError = (event) => {
  const { currentTarget } = event;
  if (!currentTarget) return;
  if (currentTarget.src.includes(PLACEHOLDER_POSTER)) {
    currentTarget.src = INLINE_POSTER_FALLBACK;
    return;
  }
  currentTarget.src = PLACEHOLDER_POSTER;
};
