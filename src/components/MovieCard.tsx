import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface MovieCardProps {
  item: any;
  pathPrefix?: string;
  isTmdb?: boolean;
}

export const MovieCard = ({ item, pathPrefix = 'phim' }: MovieCardProps) => {
  const imageUrl = item.thumb_url || item.poster_url || '';
  const thumbUrl = imageUrl.startsWith('http') ? imageUrl : `https://phimimg.com/${imageUrl}`;
  
  return (
    <Link to={`/${pathPrefix}/${item.slug}`}>
      <motion.div 
        whileHover={{ scale: 1.05, zIndex: 10 }}
        transition={{ duration: 0.3 }}
        className="relative group rounded-md overflow-hidden bg-[#181818] cursor-pointer h-full"
      >
        <div className="aspect-video w-full">
          <img 
            src={thumbUrl} 
            alt={item.name} 
            className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-60"
            loading="lazy"
          />
        </div>
        
        {/* Hover Info */}
        <div className="absolute inset-0 flex flex-col justify-end p-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h3 className="text-white text-sm font-semibold truncate">{item.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-bold text-green-500">New</span>
            <span className="text-[10px] border border-gray-400 px-1 text-gray-300">{item.year}</span>
            <span className="text-[10px] text-gray-300 truncate">{item.episode_current || 'HD'}</span>
          </div>
        </div>
        
        {item.episode_current && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
            {item.episode_current}
          </div>
        )}
      </motion.div>
    </Link>
  );
}
