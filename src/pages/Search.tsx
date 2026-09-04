import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMovies } from '../services/api';
import { MovieCard } from '../components/MovieCard';

export const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Reset page when query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  useEffect(() => {
    const fetchSearch = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const res = await searchMovies(query, 24, currentPage);
        setResults(res.data.data?.items || []);
        
        // PhimAPI usually returns pagination info in data.data.params.pagination
        const pagination = res.data.data?.params?.pagination;
        if (pagination) {
          setTotalPages(pagination.totalPages || Math.ceil(pagination.totalItems / pagination.totalItemsPerPage) || 1);
        } else {
          // Fallback if no pagination info
          setTotalPages(res.data.data?.items?.length === 24 ? currentPage + 1 : currentPage);
        }
        
        setLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (error) {
        console.error("Error searching:", error);
        setLoading(false);
      }
    };
    fetchSearch();
  }, [query, currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-white">
        Kết quả tìm kiếm cho: "{query}"
      </h1>
      
      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E50914]"></div></div>
      ) : results.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {results.map((movie: any) => (
              <MovieCard key={movie._id || movie.slug} item={movie} />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-6 mt-12 mb-8">
            <button 
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-6 py-2 bg-[#2b2b2b] text-white rounded font-medium disabled:opacity-50 hover:bg-gray-700 transition-colors"
            >
              Trang trước
            </button>
            <span className="text-gray-400 font-medium">
              Trang {currentPage} / {totalPages}
            </span>
            <button 
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              className="px-6 py-2 bg-[#2b2b2b] text-white rounded font-medium disabled:opacity-50 hover:bg-gray-700 transition-colors"
            >
              Trang sau
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-20 text-gray-400">
          Không tìm thấy phim nào phù hợp.
        </div>
      )}
    </div>
  );
};
