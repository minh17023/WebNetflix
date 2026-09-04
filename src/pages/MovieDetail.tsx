import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails } from '../services/api';

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
    <div className="pb-20 bg-[#141414] min-h-screen">
      {/* Video Player Section */}
      <div className="w-full bg-black relative mt-[72px] md:mt-0">
        <div className="max-w-[1600px] mx-auto relative aspect-video md:aspect-[21/9] max-h-[85vh]">
          {currentEpisode ? (
            <iframe 
              src={currentEpisode.link_embed} 
              className="w-full h-full absolute inset-0"
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
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mt-8 md:mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Info */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl md:text-4xl text-white mb-2 drop-shadow-md font-bold tracking-tight">
              {info.name}
            </h1>
            <h2 className="text-lg text-gray-400 mb-6 font-medium italic">{info.origin_name}</h2>
            
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300 mb-8 font-medium">
              <span className="text-green-500 font-bold">98% Match</span>
              <span>{info.year}</span>
              <span className="px-1.5 py-0.5 border border-gray-600 rounded text-xs">{info.time}</span>
              <span className="px-1.5 py-0.5 border border-gray-600 rounded text-xs text-white">{info.quality}</span>
              <span className="px-1.5 py-0.5 border border-gray-600 rounded text-xs">{info.lang}</span>
            </div>
            
            <div className="text-gray-200 text-sm md:text-base leading-relaxed mb-8">
              <div dangerouslySetInnerHTML={{ __html: info.content }} />
            </div>

            <div className="flex flex-col gap-3 text-sm text-gray-400 border-t border-gray-800 pt-6">
              <p><span className="text-gray-500">Quốc gia:</span> <span className="text-white hover:underline cursor-pointer">{info.country?.[0]?.name}</span></p>
              <p>
                <span className="text-gray-500">Thể loại:</span>{' '}
                {info.category?.map((c: any, i: number) => (
                  <span key={c.id}>
                    <span className="text-white hover:underline cursor-pointer">{c.name}</span>
                    {i < info.category.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </p>
              {info.actor && info.actor[0] !== "Đang cập nhật" && (
                <p><span className="text-gray-500">Diễn viên:</span> <span className="text-white">{info.actor.join(', ')}</span></p>
              )}
            </div>
          </div>

          {/* Sidebar Info (Episodes) */}
          <div className="lg:col-span-1">
            <div className="bg-[#181818] rounded-md p-6 sticky top-24 shadow-lg border border-gray-800/50">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                Danh sách tập
              </h3>
              
              {episodes && episodes.map((server: any, idx: number) => (
                <div key={idx} className="mb-6 last:mb-0">
                  <p className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">{server.server_name}</p>
                  <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {server.server_data.map((ep: any) => (
                      <button
                        key={ep.slug}
                        onClick={() => setCurrentEpisode(ep)}
                        className={`py-2 px-1 rounded flex items-center justify-center text-sm font-medium transition-all ${
                          currentEpisode?.slug === ep.slug 
                            ? 'bg-[#E50914] text-white shadow-md transform scale-105' 
                            : 'bg-[#2b2b2b] text-gray-300 hover:bg-gray-200 hover:text-black'
                        }`}
                      >
                        {ep.name.replace('Tập ', '')}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
