import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Play, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { getSeriesMovies, getSingleMovies, getAnimeMovies, getHomeMovies, getMovieDetails } from '../services/api';
import { MovieCard } from '../components/MovieCard';
import { motion, AnimatePresence } from 'framer-motion';

export const Home = () => {
  const [heroMovies, setHeroMovies] = useState<any[]>([]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [newMovies, setNewMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [movies, setMovies] = useState([]);
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [homeRes, seriesRes, singleRes, animeRes] = await Promise.all([
          getHomeMovies(),
          getSeriesMovies(1),
          getSingleMovies(1),
          getAnimeMovies(1)
        ]);
        
        const heroList = homeRes.data.data?.items || [];
        if (heroList.length > 0) {
          const heroCandidates = heroList.slice(0, 5); // Take top 5 for banner
          setNewMovies(heroList.slice(5, 17));
          
          // Fetch full detail for the hero movies to get the landscape thumb_url
          const detailPromises = heroCandidates.map((m: any) => 
            getMovieDetails(m.slug).then(res => res.data.movie).catch(() => m)
          );
          const detailedHeroes = await Promise.all(detailPromises);
          setHeroMovies(detailedHeroes);
        }

        setSeries(seriesRes.data.data.items.slice(0, 12));
        setMovies(singleRes.data.data.items.slice(0, 12));
        setAnime(animeRes.data.data.items.slice(0, 12));
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const nextHero = () => {
    setCurrentHeroIndex((prev) => (prev + 1) % heroMovies.length);
  };

  const prevHero = () => {
    setCurrentHeroIndex((prev) => (prev - 1 + heroMovies.length) % heroMovies.length);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-[#141414]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E50914]"></div></div>;
  }

  const heroMovie = heroMovies[currentHeroIndex];

  return (
    <div className="pb-10 bg-[#141414] min-h-screen">
      {/* Hero Section */}
      {heroMovie && (
        <div className="relative h-[85vh] w-full group/hero">
          <AnimatePresence mode='wait'>
            <motion.div 
              key={heroMovie._id || heroMovie.slug}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              <img 
                src={(heroMovie.thumb_url || heroMovie.poster_url)?.startsWith('http') ? (heroMovie.thumb_url || heroMovie.poster_url) : `https://phimimg.com/${heroMovie.thumb_url || heroMovie.poster_url}`} 
                alt={heroMovie.name}
                className="w-full h-full object-cover object-center md:object-[center_20%]"
              />
              {/* Dark vignette left and bottom */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-48 md:h-64 bg-gradient-to-t from-[#141414] via-[#141414]/80 to-transparent" />
            </motion.div>
          </AnimatePresence>
          
          {/* Banner Controls */}
          {heroMovies.length > 1 && (
            <>
              <button onClick={prevHero} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/60 p-2 rounded-full opacity-0 group-hover/hero:opacity-100 transition-opacity">
                <ChevronLeft className="text-white w-8 h-8" />
              </button>
              <button onClick={nextHero} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/60 p-2 rounded-full opacity-0 group-hover/hero:opacity-100 transition-opacity">
                <ChevronRight className="text-white w-8 h-8" />
              </button>
              
              <div className="absolute bottom-[10%] right-12 z-30 flex gap-2">
                {heroMovies.map((_, idx) => (
                  <div key={idx} className={`w-2.5 h-2.5 rounded-full ${idx === currentHeroIndex ? 'bg-white' : 'bg-gray-500/50'}`} />
                ))}
              </div>
            </>
          )}

          <div className="absolute bottom-[20%] md:bottom-[25%] left-4 md:left-12 max-w-xl md:max-w-2xl z-10 pointer-events-none">
            <div className="flex items-center gap-2 mb-2 md:mb-4">
               <span className="text-[#E50914] text-2xl md:text-4xl font-black tracking-widest">N</span>
               <span className="text-gray-300 text-xs md:text-sm tracking-[0.3em] font-bold shadow-black drop-shadow-md">S E R I E S</span>
            </div>
            
            <motion.h1 
              key={`title-${heroMovie._id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-2 md:mb-4 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] line-clamp-2 md:line-clamp-3"
              style={{ fontFamily: "'Playfair Display', serif", lineHeight: 1.1 }}
            >
              {heroMovie.name}
            </motion.h1>
            
            <div className="flex items-center mb-2 md:mb-4">
              <div className="bg-red-600 text-white text-[10px] font-bold px-1 py-0.5 rounded mr-2">TOP<br/>10</div>
              <span className="text-white font-bold text-sm md:text-xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">#{currentHeroIndex + 1} in TV Shows Today</span>
            </div>

            <motion.p 
              key={`desc-${heroMovie._id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xs md:text-lg text-white mb-4 md:mb-6 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] line-clamp-2 md:line-clamp-3 font-medium"
            >
              {heroMovie.origin_name} ({heroMovie.year}). Một bộ phim hấp dẫn và đầy kịch tính đang chờ bạn khám phá.
            </motion.p>
            
            <motion.div 
              key={`btn-${heroMovie._id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex gap-2 md:gap-3 pointer-events-auto"
            >
              <Link to={`/phim/${heroMovie.slug}`} className="flex items-center justify-center px-4 md:px-8 py-1.5 md:py-2.5 bg-white text-black font-bold rounded shadow hover:bg-white/80 transition-colors">
                <Play className="w-4 h-4 md:w-6 md:h-6 mr-1 md:mr-2" fill="currentColor" />
                Play
              </Link>
              <Link to={`/phim/${heroMovie.slug}`} className="flex items-center justify-center px-4 md:px-8 py-1.5 md:py-2.5 bg-[#6d6d6e]/70 text-white font-bold rounded shadow hover:bg-[#6d6d6e]/50 transition-colors">
                <Info className="w-4 h-4 md:w-6 md:h-6 mr-1 md:mr-2" />
                More Info
              </Link>
            </motion.div>
          </div>
        </div>
      )}

      {/* Movie Rows */}
      <div className="pl-4 md:pl-12 -mt-12 md:-mt-16 relative z-20 space-y-8 md:space-y-12">
        <MovieRow title="Crowd Pleasers" movies={newMovies} isLarge={true} />
        <MovieRow title="Trending Now" movies={series} />
        <MovieRow title="New Releases" movies={movies} />
        <MovieRow title="Anime Collection" movies={anime} />
      </div>
    </div>
  );
};

const MovieRow = ({ title, movies, isLarge = false }: { title: string, movies: any[], isLarge?: boolean }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isMoved, setIsMoved] = useState(false);

  const handleClick = (direction: 'left' | 'right') => {
    setIsMoved(true);
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth + 100 : scrollLeft + clientWidth - 100;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (!movies || movies.length === 0) return null;
  
  return (
    <div className="relative group">
      <h2 className="text-lg md:text-xl font-bold text-[#e5e5e5] mb-2 hover:text-white transition-colors cursor-pointer">{title}</h2>
      
      <div className="relative">
        <button 
          onClick={() => handleClick('left')}
          className={`absolute top-0 bottom-0 left-0 bg-black/50 w-12 z-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70 ${!isMoved && 'hidden'}`}
        >
          <ChevronLeft className="text-white w-8 h-8" />
        </button>

        <div ref={rowRef} className="flex gap-2 overflow-x-auto pb-4 pt-2 hide-scrollbar snap-x scroll-smooth">
          {movies.map((movie) => (
            <div key={movie._id || movie.slug} className={`flex-none snap-start ${isLarge ? 'w-[45vw] md:w-[25vw] lg:w-[18vw]' : 'w-[40vw] md:w-[22vw] lg:w-[15vw]'}`}>
              <MovieCard item={movie} />
            </div>
          ))}
        </div>

        <button 
          onClick={() => handleClick('right')}
          className="absolute top-0 bottom-0 right-0 bg-black/50 w-12 z-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70"
        >
          <ChevronRight className="text-white w-8 h-8" />
        </button>
      </div>
    </div>
  );
};
