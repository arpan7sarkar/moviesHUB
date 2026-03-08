import React from 'react';
import { useDiscoverQuery } from '../../features/movies/movieApi';
import ContentRow from './ContentRow';

const GenreRecommendationRow = ({ genre, mediaType }) => {
  const { data, isLoading, isError } = useDiscoverQuery({
    mediaType,
    with_genres: genre.id,
    sort_by: 'popularity.desc',
    include_adult: false,
    page: 1,
  });

  if (!isLoading && (!data?.results || data.results.length === 0)) {
    return null;
  }

  return (
    <ContentRow
      title={`More ${genre.name} ${mediaType === 'movie' ? 'Movies' : 'Shows'}`}
      items={data?.results}
      isLoading={isLoading}
      isError={isError}
      mediaType={mediaType}
      seeAllLink={`/discover/${mediaType}?with_genres=${genre.id}`}
    />
  );
};

export default React.memo(GenreRecommendationRow);
