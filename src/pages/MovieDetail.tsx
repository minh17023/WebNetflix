import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieDetails } from '../services/api';
import { Play, Calendar, Clock, Globe, Film } from 'lucide-react';
import { motion } from 'framer-motion';

export const MovieDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentEpisode, setCurrentEpisode] = useState<any>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        if (!slug) return;
        setLoading(true);
        const res = await getMovieDetails(slug);
        setMovie(res.data);
        if (res.data.episodes && res.data.episodes.length > 0) {
          const firstServer = res.data.episodes[0];
          if (firstServer.server_data && firstServer.server_data.length > 0) {
            setCurrentEpisode(firstServer.server_data[0]);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching detail:", error);
        setLoading(false);
      }
    };
    fetchDetail();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;
  }

  if (!movie || !movie.movie) return <div className="text-center py-20 text-xl">Movie not found</div>;

  const { movie: info, episodes } = movie;

  return (
    <div className="pb-20">
      {/* Video Player / Backdrop Section */}
      <div className="relative w-full aspect-video md:aspect-[21/9] bg-black max-h-[70vh]">
        {currentEpisode ? (
          <iframe 
            src={currentEpisode.link_embed} 
            className="w-full h-full"
            allowFullScreen
            title={info.name}
          />
        ) : (
          <div className="absolute inset-0">
            <img 
              src={info.poster_url} 
              alt={info.name}
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 flex items-center justify-center text-white">
              No video available
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="md:col-span-2">
            <h1 className="text-3xl md:text-5xl font-bold mb-2">{info.name}</h1>
            <h2 className="text-xl text-gray-400 mb-6">{info.origin_name}</h2>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-6">
              <span className="flex items-center"><Calendar className="w-4 h-4 mr-1"/> {info.year}</span>
              <span className="flex items-center"><Clock className="w-4 h-4 mr-1"/> {info.time}</span>
              <span className="flex items-center"><Globe className="w-4 h-4 mr-1"/> {info.country?.[0]?.name}</span>
              <span className="px-2 py-1 bg-surface rounded text-xs text-primary font-bold">{info.quality} {info.lang}</span>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 border-b border-gray-700 pb-2">Overview</h3>
              <div className="text-gray-300 leading-relaxed text-sm md:text-base" dangerouslySetInnerHTML={{ __html: info.content }}></div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 border-b border-gray-700 pb-2">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {info.category?.map((c: any) => (
                  <span key={c.id} className="px-3 py-1 bg-surface rounded-full text-sm text-gray-300">{c.name}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="bg-surface rounded-lg p-6 h-fit">
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2 flex items-center">
              <Film className="w-5 h-5 mr-2" />
              Episodes
            </h3>
            
            {episodes && episodes.map((server: any, idx: number) => (
              <div key={idx} className="mb-4">
                <p className="text-sm text-gray-400 mb-2">{server.server_name}</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {server.server_data.map((ep: any) => (
                    <button
                      key={ep.slug}
                      onClick={() => setCurrentEpisode(ep)}
                      className={`py-1.5 px-2 rounded text-xs md:text-sm transition-colors ${
                        currentEpisode?.slug === ep.slug 
                          ? 'bg-primary text-white font-bold' 
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {ep.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
