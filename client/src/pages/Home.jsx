import PageTransition from '../components/layout/PageTransition';
import HeroSlider from '../components/media/HeroSlider';
import ContentRow from '../components/media/ContentRow';
import {
  useGetTrendingQuery,
  useGetListQuery,
  useDiscoverQuery,
} from '../features/movies/movieApi';

const Home = () => {
  // Step 5.3: All content rows
  const trending = useGetTrendingQuery({ mediaType: 'all', timeWindow: 'day' });
  const topRatedMovies = useGetListQuery({ mediaType: 'movie', listType: 'top_rated' });
  const popularMovies = useGetListQuery({ mediaType: 'movie', listType: 'popular' });
  const popularTv = useGetListQuery({ mediaType: 'tv', listType: 'popular' });
  const topRatedTv = useGetListQuery({ mediaType: 'tv', listType: 'top_rated' });
  const actionMovies = useDiscoverQuery({ mediaType: 'movie', with_genres: '28', sort_by: 'popularity.desc' });
  const indianCinema = useDiscoverQuery({ mediaType: 'movie', with_origin_country: 'IN', sort_by: 'popularity.desc' });
  const bestAnime = useDiscoverQuery({ mediaType: 'tv', with_origin_country: 'JP', with_genres: '16', sort_by: 'popularity.desc' });

  return (
    <PageTransition>
      <main className="min-h-screen bg-primary">
        {/* Hero Slider */}
        <HeroSlider />

        {/* Content Rows */}
        <div className="flex flex-col -mt-10 relative z-10 ">
          <ContentRow
            title="Trending Now"
            items={trending.data?.results}
            isLoading={trending.isLoading}
            isError={trending.isError}
            seeAllLink="/movies"
          />

          <ContentRow
            title="Top Rated Movies"
            items={topRatedMovies.data?.results}
            isLoading={topRatedMovies.isLoading}
            isError={topRatedMovies.isError}
            mediaType="movie"
            seeAllLink="/movies"
          />

          <ContentRow
            title="Popular Movies"
            items={popularMovies.data?.results}
            isLoading={popularMovies.isLoading}
            isError={popularMovies.isError}
            mediaType="movie"
            seeAllLink="/movies"
          />

          <ContentRow
            title="Popular TV Shows"
            items={popularTv.data?.results}
            isLoading={popularTv.isLoading}
            isError={popularTv.isError}
            mediaType="tv"
            seeAllLink="/tv"
          />

          <ContentRow
            title="Top Rated TV"
            items={topRatedTv.data?.results}
            isLoading={topRatedTv.isLoading}
            isError={topRatedTv.isError}
            mediaType="tv"
            seeAllLink="/tv"
          />

          <ContentRow
            title="Action Movies"
            items={actionMovies.data?.results}
            isLoading={actionMovies.isLoading}
            isError={actionMovies.isError}
            mediaType="movie"
            seeAllLink="/movies"
          />

          <ContentRow
            title="Indian Cinema"
            items={indianCinema.data?.results}
            isLoading={indianCinema.isLoading}
            isError={indianCinema.isError}
            mediaType="movie"
            seeAllLink="/movies"
          />

          <ContentRow
            title="Best Anime"
            items={bestAnime.data?.results}
            isLoading={bestAnime.isLoading}
            isError={bestAnime.isError}
            mediaType="tv"
            seeAllLink="/tv"
          />
        </div>
      </main>
    </PageTransition>
  );
};

export default Home;
