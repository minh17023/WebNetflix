import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getSeriesMovies, getSingleMovies, getAnimeMovies } from '../services/api';
import { MovieCard } from '../components/MovieCard';

export const Listing = () => {
  const location = useLocation();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getTitle = () => {
    if (location.pathname.includes('series')) return 'TV Series';
    if (location.pathname.includes('movies')) return 'Movies';
    if (location.pathname.includes('anime')) return 'Anime';
    return 'List';
  };

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        let res;
        if (location.pathname.includes('series')) res = await getSeriesMovies(page);
        else if (location.pathname.includes('movies')) res = await getSingleMovies(page);
        else if (location.pathname.includes('anime')) res = await getAnimeMovies(page);
        
        if (res) {
          setMovies(res.data.data.items);
          setTotalPages(res.data.data.params.pagination.totalItemsPerPage ? Math.ceil(res.data.data.params.pagination.totalItems / res.data.data.params.pagination.totalItemsPerPage) : 1);
        }
      } catch (error) {
        console.error("Error fetching list:", error);
      }
      setLoading(false);
      window.scrollTo(0, 0);
    };
    fetchMovies();
  }, [location.pathname, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6 text-white">{getTitle()}</h1>
      
      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {movies.map((movie: any) => (
              <MovieCard key={movie._id || movie.slug} item={movie} />
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center mt-10 space-x-4">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-4 py-2 bg-surface rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="flex items-center">Page {page}</span>
              <button 
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 bg-surface rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
