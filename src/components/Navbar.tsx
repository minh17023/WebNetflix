import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCategories, getCountries } from '../services/api';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  
  // Dropdown states
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Fetch filter data
    Promise.all([getCategories(), getCountries()]).then(([catRes, countRes]) => {
      setCategories(catRes.data.data?.items || catRes.data || []);
      setCountries(countRes.data.data?.items || countRes.data || []);
    }).catch(err => console.error(err));

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const years = Array.from({ length: 15 }, (_, i) => new Date().getFullYear() - i);

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-colors duration-500 ${isScrolled || isMobileMenuOpen ? 'bg-[#141414]' : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent'}`}
      onMouseLeave={() => setActiveDropdown(null)}
    >
      <div className="px-4 md:px-12 flex items-center h-[68px]">
        {/* Logo and primary nav */}
        <div className="flex items-center gap-8">
          <Link to="/" className="text-[#E50914] text-2xl md:text-3xl font-black tracking-wider uppercase" style={{fontFamily: 'Arial, sans-serif'}}>
            PHIMFLIX
          </Link>
          <nav className="hidden md:flex gap-5 text-sm font-medium">
            <Link to="/" className="text-[#e5e5e5] hover:text-[#b3b3b3] transition-colors">Home</Link>
            <Link to="/series" className="text-[#e5e5e5] hover:text-[#b3b3b3] transition-colors">Shows</Link>
            <Link to="/movies" className="text-[#e5e5e5] hover:text-[#b3b3b3] transition-colors">Movies</Link>
            
            <div className="relative" onMouseEnter={() => setActiveDropdown('the-loai')}>
              <button className="flex items-center text-[#e5e5e5] hover:text-[#b3b3b3] transition-colors">
                Thể loại <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              {activeDropdown === 'the-loai' && (
                <div className="absolute top-full left-0 mt-4 w-[400px] bg-black/90 border border-gray-800 rounded shadow-xl p-4 gap-2">
                  <div className="absolute -top-2 left-8 w-4 h-4 bg-black/90 border-t border-l border-gray-800 rotate-45"></div>
                  <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                    {categories.map(c => (
                      <Link key={c.slug} to={`/search?q=${c.name}`} className="text-sm text-gray-300 hover:text-white hover:underline truncate">{c.name}</Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quốc gia Dropdown */}
            <div className="relative" onMouseEnter={() => setActiveDropdown('quoc-gia')}>
              <button className="flex items-center text-[#e5e5e5] hover:text-[#b3b3b3] transition-colors">
                Quốc gia <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              {activeDropdown === 'quoc-gia' && (
                <div className="absolute top-full left-0 mt-4 w-[400px] bg-black/90 border border-gray-800 rounded shadow-xl p-4 gap-2">
                  <div className="absolute -top-2 left-8 w-4 h-4 bg-black/90 border-t border-l border-gray-800 rotate-45"></div>
                  <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                    {countries.map(c => (
                      <Link key={c.slug} to={`/search?q=${c.name}`} className="text-sm text-gray-300 hover:text-white hover:underline truncate">{c.name}</Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Năm phát hành Dropdown */}
            <div className="relative" onMouseEnter={() => setActiveDropdown('nam')}>
              <button className="flex items-center text-[#e5e5e5] hover:text-[#b3b3b3] transition-colors">
                Năm <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              {activeDropdown === 'nam' && (
                <div className="absolute top-full left-0 mt-4 w-56 bg-black/90 border border-gray-800 rounded shadow-xl p-4 gap-2">
                  <div className="absolute -top-2 left-8 w-4 h-4 bg-black/90 border-t border-l border-gray-800 rotate-45"></div>
                  <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                    {years.map(y => (
                      <Link key={y} to={`/search?q=${y}`} className="text-sm text-gray-300 hover:text-white hover:underline">{y}</Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right nav & Mobile Menu Button */}
        <div className="ml-auto flex items-center gap-6">
          {/* Search bar */}
          <div className="relative">
            <div className={`flex items-center bg-black/50 border transition-all duration-300 ${isSearchOpen ? 'border-white px-2 py-1 w-48 md:w-64' : 'border-transparent w-0'}`}>
              <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-white hover:text-gray-300">
                <Search className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              {isSearchOpen && (
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Titles, people, genres" 
                  className="bg-transparent text-white text-sm outline-none w-full ml-2"
                  autoFocus
                />
              )}
            </div>
          </div>

          <button className="hidden md:block text-white hover:text-gray-300">
            <Bell className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          
          <div className="hidden md:flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 rounded bg-gray-600 overflow-hidden">
               <img src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <span className="text-white text-xs border-transparent border-t-4 border-l-4 border-r-4 border-t-white mt-2 hidden md:block group-hover:rotate-180 transition-transform" style={{width: 0, height: 0, borderLeftColor: 'transparent', borderRightColor: 'transparent'}}></span>
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-white ml-4">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#141414] border-t border-gray-800 p-4"
          >
            <nav className="flex flex-col space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar pr-2 pb-4">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-white font-medium text-lg">Home</Link>
              <Link to="/series" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-white font-medium text-lg">Shows</Link>
              <Link to="/movies" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-white font-medium text-lg">Movies</Link>
              
              <div className="border-t border-gray-800 pt-4 mt-2">
                <div className="text-gray-500 text-sm mb-3 uppercase tracking-wider font-bold">Thể loại</div>
                <div className="grid grid-cols-2 gap-3">
                   {categories.map(c => (
                     <Link key={c.slug} to={`/search?q=${c.name}`} onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-gray-300 hover:text-white truncate">{c.name}</Link>
                   ))}
                </div>
              </div>

              <div className="border-t border-gray-800 pt-4 mt-2">
                <div className="text-gray-500 text-sm mb-3 uppercase tracking-wider font-bold">Quốc gia</div>
                <div className="grid grid-cols-2 gap-3">
                   {countries.map(c => (
                     <Link key={c.slug} to={`/search?q=${c.name}`} onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-gray-300 hover:text-white truncate">{c.name}</Link>
                   ))}
                </div>
              </div>

              <div className="border-t border-gray-800 pt-4 mt-2">
                <div className="text-gray-500 text-sm mb-3 uppercase tracking-wider font-bold">Năm phát hành</div>
                <div className="grid grid-cols-3 gap-3">
                   {years.map(y => (
                     <Link key={y} to={`/search?q=${y}`} onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-gray-300 hover:text-white">{y}</Link>
                   ))}
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
